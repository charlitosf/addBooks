import { set, child, get, push, runTransaction } from "firebase/database";
import { logEvent } from "firebase/analytics";

export default class Books {

    // Static variable previousBook and its reference
    static previousBook = null;
    static previousBookRef = null;


    /* A static variable that is used to store the current box. 
    * It is used to know to which box the books are being added 
    * to the database.
    * The value is set to null when the box is not being added.
    */
    static currentBox = null;

    /**
     * If a book exists, increment the count. If it doesn't exist, create it
     * @param root - The root of the database.
     */
    static async searchBook(root, isbn, analytics) {
        // Book reference
        const bookRef = child(root, isbn);

        // Get book (if it exists)
        const snapshot = await get(bookRef);

        // If book exists, return the current book object
        if (snapshot.exists()) {
            return snapshot.val();
        } else { // If book doesn't exist, search for it and return it
            this.previousBook = null;
            const book = await this.getBookGoogle(isbn);
            if (book.title != null) {
                return book;
            } else {
                logEvent(analytics, "book_not_found");
                return null;
            }
        }
    }
    
    /**
     * Undoes the last book creation.
     */
    static undo() {
        set(this.previousBookRef, this.previousBook);
    }

    /**
     * It takes an ISBN number as a parameter, and returns a book object if the book is found, or null
     * if it is not found from the Google Books API.
     * @param isbn - The ISBN of the book you want to search for.
     * @returns The book object.
     */
    static async getBookGoogle(isbn) {
        try {
            const resp = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`).then(res => res.json());
            if (resp.totalItems === 0) {
                return this.extractBook(null);
            } else {
                return this.extractBook(resp.items[0]);
            }
        } catch (error) {
            return error
        }
    }

    /**
     * It takes a book object and returns a new object with only the properties that we want.
     * @param book - the book object returned from the Google Books API
     * @returns An object with the following properties:
     * title, authors, description, language, pageCount, publishedDate, publisher, googleBooksId, count
     */
    static extractBook(book) {
        if (book === null) {
            return {
                storedBoxes: {
                    [this.currentBox]: 1
                }
            };
        }
        return {
            title: book.volumeInfo.title || null,
            authors: book.volumeInfo.authors || null,
            description: book.volumeInfo.description || null,
            language: book.volumeInfo.language || null,
            pageCount: book.volumeInfo.pageCount || null,
            publishedDate: book.volumeInfo.publishedDate || null,
            publisher: book.volumeInfo.publisher || null,
            googleBooksId: book.id || null,
            storedBoxes: {
                [this.currentBox]: 1
            }
        };
    }

    static async createBook(root, book, analytics) {
        if (book.isbn == null) { // If the ISBN is empty, push the book to the database
            book.storedBoxes = {
                [this.currentBox]: 1
            }
            const ref = await push(root, book);
            this.previousBook = null;
            this.previousBookRef = ref;
            logEvent(analytics, "empty_isbn");
        } else { // If the ISBN is not empty, set the book to the database
            // Book reference
            const bookRef = child(root, book.isbn);

            runTransaction(bookRef, (currentBook) => {
                if (currentBook == null) { // If the book doesn't exist, create it
                    this.previousBook = null;
                    this.previousBookRef = bookRef;
                    book.storedBoxes = {
                        [this.currentBox]: 1
                    }
                    logEvent(analytics, "book_created");
                    return book;
                } else { // If the book exists, increment the count
                    this.previousBook = structuredClone(currentBook);
                    this.previousBookRef = bookRef;
                    if (currentBook.storedBoxes[this.currentBox] == null) {
                        currentBook.storedBoxes[this.currentBox] = 1;
                        logEvent(analytics, "book_new_box");
                    } else {
                        currentBook.storedBoxes[this.currentBox]++;
                        logEvent(analytics, "book_incremented");
                    }
                    return currentBook;
                }
            });
        }
    }
}