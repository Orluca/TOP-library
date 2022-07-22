"use strict";

// ###############################################################
// ####################### GLOBAL VARIABLES ######################
// ###############################################################
let myLibrary = [];

// ###############################################################
// #################### HTML ELEMENT SELECTORS ###################
// ###############################################################
const $btnAddBook = document.querySelector(".add-book-button");
const $containerAddBook = document.querySelector(".add-book-container");
const $containerBookList = document.querySelector(".book-items-container");

// ###############################################################
// ########################### CLASSES ###########################
// ###############################################################
class Book {
  constructor(title, author, year, isRead) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.isRead = isRead;
  }
}

// ###############################################################
// ########################## FUNCTIONS ##########################
// ###############################################################
function saveToLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function addBookToLibrary() {
  const title = document.querySelector("#title-input");
  const author = document.querySelector("#author-input");
  const year = document.querySelector("#year-input");
  const isRead = document.querySelector("#read-status-input");

  // Check if all inputs are filled out
  if (!title.value || !author.value || !year.value) {
    console.log("Please fill out everything");
    return;
  }

  // Add the book to the myLibrary array
  myLibrary.push(new Book(title.value, author.value, year.value, isRead.checked));

  // Reset inputs
  title.value = author.value = year.value = "";
  isRead.checked = false;

  // Update display to show the newly added book on the GUI
  displayBooks(myLibrary);

  // Save the current myLibrary array in localStorage
  saveToLocalStorage();
}

function displayBooks(libraryArray) {
  const bookContainer = document.querySelector(".book-items-container");
  bookContainer.innerHTML = "";

  libraryArray.forEach((book, i) => {
    bookContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="book-item-container" data-id="${i}">
        <div class="book-property-container">
          <div class="label">Title:</div>
          <div class="title-value">${book.title}</div>
        </div>
        <div class="book-property-container">
          <div class="label">Author:</div>
          <div class="author-value">${book.author}</div>
        </div>
        <div class="book-property-container">
          <div class="label">Year:</div>
          <div class="year-value">${book.year}</div>
        </div>
        <div class="book-property-container">
          <div class="label">Read:</div>
          <input type="checkbox" id="read-checkbox" ${book.isRead ? "checked" : ""}/>
        </div>
      </div>
    `
    );
  });
}

function updateReadStatus(id, status) {
  myLibrary[id].isRead = status;
  saveToLocalStorage();
}

function init() {
  const savedLibrary = JSON.parse(localStorage.getItem("myLibrary"));
  if (savedLibrary) myLibrary = savedLibrary;

  displayBooks(myLibrary);
}

// ###############################################################
// ####################### EVENT LISTENERS #######################
// ###############################################################

$btnAddBook.addEventListener("click", addBookToLibrary);

$containerAddBook.addEventListener("keypress", function (e) {
  if (e.key !== "Enter") return;
  addBookToLibrary();
});

$containerBookList.addEventListener("click", function (e) {
  if (e.target.id !== "read-checkbox") return;

  const id = e.target.closest(".book-item-container").dataset.id;
  const status = e.target.checked;

  updateReadStatus(id, status);
});

// ###############################################################
// ########################## START APP ##########################
// ###############################################################

init();
