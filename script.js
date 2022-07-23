"use strict";

// ###############################################################
// ####################### GLOBAL VARIABLES ######################
// ###############################################################
let myLibrary = [];
let currentlySortedBy;

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
  myLibrary.push(new Book(title.value, author.value, Number(year.value), isRead.checked));

  // Reset inputs
  title.value = author.value = year.value = "";
  isRead.checked = false;

  // Update display to show the newly added book on the GUI
  displayBooks();

  // Save the current myLibrary array in localStorage
  saveToLocalStorage();
}

function displayBooks() {
  const bookContainer = document.querySelector(".book-items-container");
  bookContainer.innerHTML = "";

  myLibrary.forEach((book, i) => {
    bookContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="book-item-container" data-id="${i}">
      <div class="title-value">${book.title}</div>
      <div class="author-value">${book.author}</div>
      <div class="year-value">${book.year}</div>
      <label class="toggler-wrapper">
        <input type="checkbox" id="read-checkbox" ${book.isRead ? "checked" : ""}>
        <div class="toggler-slider">
          <div class="toggler-knob"></div>
        </div>
      </label>
      <button id="edit-btn">Edit</button>
      <button id="delete-btn">Delete</button>
    </div>
    `
    );
  });
}

function updateReadStatus(id, status) {
  myLibrary[id].isRead = status;
  saveToLocalStorage();
}

function deleteEntry(id) {
  if (!confirm("Are you sure you want to delete this book from the list?")) return;
  myLibrary.splice(id, 1);
  saveToLocalStorage();
  displayBooks();
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
  const id = e.target.closest(".book-item-container").dataset.id;

  // Listen for clicks on the "read" checkboxes
  if (e.target.id === "read-checkbox") {
    const status = e.target.checked;
    updateReadStatus(id, status);
  }

  // Listen for "Delete" button presses
  if (e.target.id === "delete-btn") deleteEntry(id);
});

// ###############################################################
// ########################## START APP ##########################
// ###############################################################

init();

// TEMP

const $titleHeader = document.querySelector(".title-header");
const $authorHeader = document.querySelector(".author-header");
const $yearHeader = document.querySelector(".year-header");
const $readStatusHeader = document.querySelector(".read-status-header");

$titleHeader.addEventListener("click", function () {
  if (currentlySortedBy !== "title-asc") {
    myLibrary.sort((a, b) => a.title.localeCompare(b.title));
    currentlySortedBy = "title-asc";
  } else if (currentlySortedBy === "title-asc") {
    myLibrary.sort((a, b) => b.title.localeCompare(a.title));
    currentlySortedBy = "title-desc";
  }
  displayBooks();
});

$authorHeader.addEventListener("click", function () {
  if (currentlySortedBy !== "author-asc") {
    myLibrary.sort((a, b) => {
      // a.author.localeCompare(b.author);

      if (a.author > b.author) {
        return 1;
      } else if (a.author < b.author) {
        return -1;
      }

      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      } else {
        return 0;
      }
    });
    currentlySortedBy = "author-asc";
  } else if (currentlySortedBy === "author-asc") {
    myLibrary.sort((a, b) => b.author.localeCompare(a.author));
    currentlySortedBy = "author-desc";
  }
  displayBooks();
});

$yearHeader.addEventListener("click", function () {
  if (currentlySortedBy !== "year-asc") {
    myLibrary.sort((a, b) => a.year - b.year);
    currentlySortedBy = "year-asc";
  } else if (currentlySortedBy === "year-asc") {
    myLibrary.sort((a, b) => b.year - a.year);
    currentlySortedBy = "year-desc";
  }
  displayBooks();
});

$readStatusHeader.addEventListener("click", function () {
  if (currentlySortedBy !== "read-status-asc") {
    myLibrary.sort((a, b) => {
      // First, sort by the read status
      if (a.isRead > b.isRead) {
        return 1;
      } else if (a.isRead < b.isRead) {
        return -1;
      }

      // Then sort by author name
      if (a.author < b.author) {
        return -1;
      } else if (a.author > b.author) {
        return 1;
      }

      // Finally sort by title
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      } else {
        return 0;
      }
    });
    currentlySortedBy = "read-status-asc";
  } else if (currentlySortedBy === "read-status-asc") {
    myLibrary.sort((a, b) => b.isRead - a.isRead);
    currentlySortedBy = "read-status-desc";
  }
  displayBooks();
});
