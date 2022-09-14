'use strict';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, child } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Auth from './auth.js';
import Books from './books.js';
import Forms from './forms.js';
import Cookies from "./cookies.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.GOOGLE_API_KEY,
  authDomain: "books-db-7448f.firebaseapp.com",
  databaseURL: "https://books-db-7448f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "books-db-7448f",
  storageBucket: "books-db-7448f.appspot.com",
  messagingSenderId: "795489812854",
  appId: "1:795489812854:web:f011a86f5efdc7ac373a57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const root = ref(db, "/");

// Elements
const b_undo = document.getElementById("b_undo");
const b_register = document.getElementById("b_register");
const b_login = document.getElementById("b_login");
const b_logout = document.getElementById("b_logout");
const b_deselect = document.getElementById("b_deselect");

const f_credentials = document.getElementById("f_credentials");
const f_searchBook = document.getElementById("f_searchBook");
const f_createBook = document.getElementById("f_createBook");
const f_box = document.getElementById("f_box");

const d_auth = document.getElementById("d_auth");
const d_box = document.getElementById("d_box");
const n_main = document.getElementById("n_main");
const d_createBook = document.getElementById("d_createBook");

const i_isbn = document.getElementById("isbn");
const i_tag = document.getElementById("tag");

// User
onAuthStateChanged(auth, (u) => {
  if (u) { 
    d_auth.hidden = true;
    n_main.hidden = false;
    Books.currentBox = Cookies.getCookie("currentBox");
    d_box.hidden = Books.currentBox != null;
    d_createBook.hidden = Books.currentBox == null;
  } else {
    d_auth.hidden = false;
    n_main.hidden = d_box.hidden = d_createBook.hidden = true;
  }
});

async function onSearchBook(event) {
  event.preventDefault();
  i_isbn.value = i_isbn.value.replace(/[-\s]/g, "");
  const book = await Books.searchBook(child(root, "books"), i_isbn.value, analytics);
  if (book != null) {
    Forms.showBook(book);
  } else {
    alert("Libro no encontrado");
  }
}
function onCreateBook(event) {
  event.preventDefault();
  Forms.createBook(child(root, "books"), analytics);
  i_isbn.focus();
}
function onUndo() {
  if (Books.previousBookRef != null) {
    Books.undo();
    b_undo.hidden = true;
  }
}

function onCreateUser() {
  Auth.createUser(auth);
}
function onLogin(event) {
  event.preventDefault();
  Auth.signIn(auth);
}
function onLogout() {
  Auth.logout(auth);
}
function onBoxSelected(event) {
  event.preventDefault();
  i_tag.value = i_tag.value.toUpperCase();
  Forms.selectBox();
}
function onBoxDeselected() {
  Forms.deselectBox();
}

b_undo.addEventListener("click", onUndo);
b_register.addEventListener("click", onCreateUser);
b_login.addEventListener("click", onLogin);
b_logout.addEventListener("click", onLogout);
b_deselect.addEventListener("click", onBoxDeselected);

f_credentials.addEventListener("submit", onLogin);
f_searchBook.addEventListener("submit", onSearchBook);
f_createBook.addEventListener("submit", onCreateBook);
f_box.addEventListener("submit", onBoxSelected);
