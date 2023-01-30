# Add Books

Simple web utility to manually add books to a Firebase Database.

The project follows the [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) architectural pattern.

## Prerequisites

- NodeJS ^18.12.1
- Git ^2.39.1
- Firebase-CLI ^11.20.0 (optional)
- An existing Firebase project with Realtime Database, Auth, and (optionally) Hosting set up

## Setup

Clone the repository and `cd` into it

```bash
git clone https://github.com/charlitosf/addBooks
cd addBooks
```

```bash
# Install dependencies
npm ci
```

Update the `.firebaserc` file with your own Firebase project name.

```bash
# Start server for development
npm run serve
```

### Production

```bash
# Build for production
npm run build
```

```bash
# Build and deploy to Firebase hosting (optional)
npm run deploy
```

## Project structure

All code files are inside the [src/](https://github.com/charlitosf/addBooks/tree/master/src) folder.

- [index.html](https://github.com/charlitosf/addBooks/blob/master/src/index.html): File in which all HTML resides.
- [main.js](https://github.com/charlitosf/addBooks/blob/master/src/main.js): Entry-point of the JavaScript of the project and where all handlers are defined.
- [auth.js](https://github.com/charlitosf/addBooks/blob/master/src/auth.js): Connection with the Firebase Auth service.
- [books.js](https://github.com/charlitosf/addBooks/blob/master/src/books.js): Connection with the Firebase Realtime Database.
- [cookies.js](https://github.com/charlitosf/addBooks/blob/master/src/cookies.js): Cookie management utilities.
- [forms.js](https://github.com/charlitosf/addBooks/blob/master/src/forms.js): ViewModel - Connection between the form data and the database.