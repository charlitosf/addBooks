import Books from "./books.js";
import Cookies from "./cookies.js";

export default class Forms {

    static d_location = document.getElementById("d_location");
    static d_box = document.getElementById("d_box");
    static d_createBook = document.getElementById("d_createBook");

    static i_tag = document.getElementById("tag");

    static b_undo = document.getElementById("b_undo");

    static t_current_box = document.getElementById("t_current_box");

    static selectBox() {
        Forms.d_box.hidden = true;
        Forms.d_createBook.hidden = false;
        Forms.t_current_box.innerText = Books.currentBox = Forms.i_tag.value;
        Cookies.setCookie(process.env.CURRENT_BOX_TAG_COOKIE_NAME, Forms.i_tag.value, process.env.CURRENT_BOX_TAG_COOKIE_EXPIRE_DAYS);
        Forms.i_tag.value = "";
    }

    static deselectBox() {
        Forms.d_box.hidden = false;
        Forms.d_createBook.hidden = true;
        Books.currentBox = null;
        Cookies.eraseCookie(process.env.CURRENT_BOX_TAG_COOKIE_NAME);
    }

    static showBook(book) {
        const i_title = document.getElementById("title");
        const i_author = document.getElementById("author");
        const i_price = document.getElementById("price");
        const i_publisher = document.getElementById("publisher");
        const i_year = document.getElementById("year");
        const i_pages = document.getElementById("pages");
        const i_language = document.getElementById("language");
        const i_description = document.getElementById("description");
        const i_tags = document.getElementById("tags");

        i_title.value = book.title;
        i_author.value = "";
        this._showListInInput(i_author, book.authors);

        i_price.value = book.price || "";
        i_publisher.value = book.publisher || "";
        i_year.value = book.publishedDate || "";
        i_pages.value = book.pageCount || "";
        i_language.value = book.language || "";
        i_description.value = book.description || "";
        i_tags.value = "";
        this._showListInInput(i_tags, book.tags);
    }

    static async createBook(root, analytics) {
        const i_title = document.getElementById("title");
        const i_author = document.getElementById("author");
        const i_price = document.getElementById("price");
        const i_publisher = document.getElementById("publisher");
        const i_year = document.getElementById("year");
        const i_pages = document.getElementById("pages");
        const i_language = document.getElementById("language");
        const i_description = document.getElementById("description");
        const i_tags = document.getElementById("tags");
        const i_isbn = document.getElementById("isbn");

        const book = {
            title: i_title.value || null,
            authors: i_author.value === "" ? null : i_author.value.split(", ").filter(tag => tag.length !== 0),
            price: parseFloat(i_price.value) || null,
            publisher: i_publisher.value || null,
            publishedDate: i_year.value || null,
            pageCount: i_pages.value || null,
            language: i_language.value || null,
            description: i_description.value || null,
            tags: i_tags.value === "" ? null : i_tags.value.split(", ").filter(tag => tag.length > 0).map(tag => tag.toLowerCase()),
            isbn: i_isbn.value || null,
        };

        try {
            await Books.createBook(root, book, analytics);
            // Clear the form
            i_title.value = "";
            i_author.value = "";
            i_price.value = "";
            i_publisher.value = "";
            i_year.value = "";
            i_pages.value = "";
            i_language.value = "";
            i_description.value = "";
            i_tags.value = "";
            i_isbn.value = "";
            this.b_undo.hidden = false;
        } catch (error) {
            alert(error);
        }
    }

    static _showListInInput(input, list) {
        input.value = "";
        for (let item of list) {
            input.value += item + ", ";
        }
        // Remove the trailing comma and space
        input.value = input.value.slice(0, -2);
    }
}