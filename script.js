"use strict";

// A list of default books, to gain a better understanding of how the app works, without having to add a bunch of books yourself
const defaultBooks = [
  { title: "A Clockwork Orange", author: "Burgess, Anthony", year: 1962, isRead: false },
  { title: "The Fellowship of the Ring", author: "Tolkien, J.R.R.", year: 1954, isRead: true },
  { title: "The Two Towers", author: "Tolkien, J.R.R.", year: 1954, isRead: true },
  { title: "The Return of the King", author: "Tolkien, J.R.R.", year: 1955, isRead: true },
  { title: "The Great Gatsby", author: "Fitzgerald, F. Scott", year: 1925, isRead: false },
  { title: "Moby Dick", author: "Melville, Herman", year: 1851, isRead: false },
  { title: "Typee", author: "Melville, Herman", year: 1846, isRead: false },
  { title: "Billy Budd", author: "Melville, Herman", year: 1924, isRead: false },
  { title: "The Stand", author: "King, Stephen", year: 1978, isRead: true },
  { title: "Firestarter", author: "King, Stephen", year: 1980, isRead: false },
  { title: "Pet Sematary", author: "King, Stephen", year: 1983, isRead: true },
  { title: "Doctor Sleep", author: "King, Stephen", year: 2013, isRead: true },
  { title: "Steelheart", author: "Sanderson, Brandon", year: 2013, isRead: true },
  { title: "The Way of Kings", author: "Sanderson, Brandon", year: 2010, isRead: true },
];

// ###############################################################
// ####################### GLOBAL VARIABLES ######################
// ###############################################################
let myLibrary = [];
let darkModeIsActive = false;
let currentlySortedBy;

// ###############################################################
// #################### HTML ELEMENT SELECTORS ###################
// ###############################################################
const $appContainer = document.querySelector(".app-container");
const $btnAddBook = document.querySelector(".add-book-button");
const $containerAddBook = document.querySelector(".add-book-container");
const $containerBookList = document.querySelector(".book-items-container");

const $modalWindow = document.querySelector(".edit-modal-window");
const $modalTitle = document.querySelector("#modal-input-title");
const $modalAuthor = document.querySelector("#modal-input-author");
const $modalYear = document.querySelector("#modal-input-year");
const $modalReadStatus = document.querySelector("#modal-input-read-status");

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
  localStorage.setItem("darkModeIsActive", JSON.stringify(darkModeIsActive));
}

function addBookToLibrary() {
  const title = document.querySelector("#title-input");
  const author = document.querySelector("#author-input");
  const year = document.querySelector("#year-input");
  const isRead = document.querySelector("#read-status-input");
  const errorMsg = document.querySelector(".add-book-error");

  // Check if all inputs are filled out
  if (!title.value || !author.value || !year.value) {
    errorMsg.classList.remove("hidden");
    return;
  }

  // Add the book to the myLibrary array
  myLibrary.push(new Book(title.value, author.value, Number(year.value), isRead.checked));

  // Reset inputs
  title.value = author.value = year.value = "";
  isRead.checked = false;

  // Hide the error message if it is currently shown
  errorMsg.classList.add("hidden");

  // Update display to show the newly added book on the GUI
  displayBooks();

  // Save the current myLibrary array in localStorage
  saveToLocalStorage();
}

function displayBooks() {
  const bookContainer = document.querySelector(".book-items-container");
  const bookTable = document.querySelector(".book-list-table");
  // bookContainer.innerHTML = "";

  bookTable.innerHTML = `
    <tr>
      <th>
        <div class="title-container">
          <h3 class="title-header">Title</h3>
          <button><i class="fa-solid fa-sort sort-btn-icon" id="sort-btn-title"></i></button>
        </div>
      </th>
      <th>
        <div class="title-container">
          <h3 class="author-header">Author</h3>
          <button><i class="fa-solid fa-sort sort-btn-icon" id="sort-btn-author"></i></button>
        </div>
      </th>
      <th>
        <div class="title-container">
          <h3 class="year-header">Year</h3>
          <button><i class="fa-solid fa-sort sort-btn-icon" id="sort-btn-year"></i></button>
        </div>
      </th>
      <th>
        <div class="title-container">
          <h3 class="read-status-header">Read</h3>
          <button><i class="fa-solid fa-sort sort-btn-icon" id="sort-btn-read-status"></i></button>
        </div>
      </th>
      <th></th>
      <th></th>
    </tr>
`;

  myLibrary.forEach((book, i) => {
    bookTable.insertAdjacentHTML(
      "beforeend",
      `
    <tr class="book-item-container" data-id="${i}">
      <td class="title-value">${book.title}</td>
      <td class="author-value">${book.author}</td>
      <td class="year-value">${book.year}</td>
      <td>
        <label class="toggler-wrapper">
          <input type="checkbox" class="read-status-value" id="read-checkbox" ${book.isRead ? "checked" : ""}>
          <div class="toggler-slider">
            <div class="toggler-knob"></div>
          </div>
        </label>
      </td>
      <td><i id="edit-btn" class="fa-solid fa-pen-to-square"></i></td>
      <td><i id="delete-btn" class="fa-solid fa-trash-can"></i></td>
    </tr>
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

function editEntry(id, element) {
  const itemContainer = element.closest(".book-item-container");
  const titleElement = itemContainer.querySelector(".title-value");
  const authorElement = itemContainer.querySelector(".author-value");
  const yearElement = itemContainer.querySelector(".year-value");
  const readStatusElement = itemContainer.querySelector(".read-status-value");

  $modalBackground.classList.remove("hidden");
  $appContainer.classList.add("blurry");

  $modalWindow.dataset.id = id;

  $modalTitle.value = titleElement.textContent;
  $modalAuthor.value = authorElement.textContent;
  $modalYear.value = yearElement.textContent;
  $modalReadStatus.checked = readStatusElement.checked;
}

function init() {
  const savedLibrary = JSON.parse(localStorage.getItem("myLibrary"));
  darkModeIsActive = JSON.parse(localStorage.getItem("darkModeIsActive"));

  if (darkModeIsActive) document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");

  if (savedLibrary?.length === 0 || !savedLibrary) {
    myLibrary = defaultBooks;
  } else {
    myLibrary = savedLibrary;
  }

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

  // Listen for "Delete" button presses
  if (e.target.id === "edit-btn") editEntry(id, e.target);
});

// ###############################################################
// ########################## START APP ##########################
// ###############################################################

init();

// SORTING STUFF

const $btnSortByTitle = document.querySelector("#sort-btn-title");
const $btnSortByAuthor = document.querySelector("#sort-btn-author");
const $btnSortByYear = document.querySelector("#sort-btn-year");
const $btnSortByReadStatus = document.querySelector("#sort-btn-read-status");

$btnSortByTitle.addEventListener("click", function () {
  if (currentlySortedBy !== "title-asc") {
    myLibrary.sort((a, b) => a.title.localeCompare(b.title));
    currentlySortedBy = "title-asc";
  } else if (currentlySortedBy === "title-asc") {
    myLibrary.sort((a, b) => b.title.localeCompare(a.title));
    currentlySortedBy = "title-desc";
  }
  displayBooks();
  saveToLocalStorage();
});

$btnSortByAuthor.addEventListener("click", function () {
  if (currentlySortedBy !== "author-asc") {
    myLibrary.sort((a, b) => {
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
  saveToLocalStorage();
});

$btnSortByYear.addEventListener("click", function () {
  if (currentlySortedBy !== "year-asc") {
    myLibrary.sort((a, b) => a.year - b.year);
    currentlySortedBy = "year-asc";
  } else if (currentlySortedBy === "year-asc") {
    myLibrary.sort((a, b) => b.year - a.year);
    currentlySortedBy = "year-desc";
  }
  displayBooks();
  saveToLocalStorage();
});

$btnSortByReadStatus.addEventListener("click", function () {
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
  saveToLocalStorage();
});

// EDIT BUTTON
const $modalBackground = document.querySelector(".edit-modal-background");

function closeModal() {
  $modalBackground.classList.add("hidden");
  $appContainer.classList.remove("blurry");
}

$modalBackground.addEventListener("click", function (e) {
  if (e.target !== this) return;
  closeModal();
});

const $modalConfirmBtn = document.querySelector(".modal-confirm-btn");
const $modalCancelBtn = document.querySelector(".modal-cancel-btn");

$modalCancelBtn.addEventListener("click", closeModal);

$modalConfirmBtn.addEventListener("click", function (e) {
  const id = $modalWindow.dataset.id;
  myLibrary[id].title = $modalTitle.value;
  myLibrary[id].author = $modalAuthor.value;
  myLibrary[id].year = $modalYear.value;
  myLibrary[id].isRead = $modalReadStatus.checked;

  saveToLocalStorage();
  displayBooks();
  closeModal();
});

function getNumberOfReadBooks() {
  return myLibrary.reduce((acc, book) => (acc += book.isRead ? 1 : 0), 0);
}

function closeSettingsModal() {
  $settingsModal.classList.add("hidden");
}

function deleteAllBooks() {
  if (!confirm("This will delete ALL books from your library. Are you sure you want to continue?")) return;
  myLibrary = [];
  saveToLocalStorage();
  closeSettingsModal();
}

const $settingsModal = document.querySelector(".settings-modal");
const $btnSettings = document.querySelector(".settings-button");

$btnSettings.addEventListener("click", function () {
  const $readBooksAmount = document.querySelector(".read-books-amount");
  const $totalBooksAmount = document.querySelector(".total-books-amount");

  $readBooksAmount.textContent = getNumberOfReadBooks();
  $totalBooksAmount.textContent = myLibrary.length;

  $settingsModal.classList.toggle("hidden");
});

window.addEventListener("click", function (e) {
  if (e.target.closest(".settings-modal")) return;
  if (e.target.closest(".settings-button")) return;
  $settingsModal.classList.add("hidden");
});

const $btnDarkMode = document.querySelector(".dark-mode-btn");
const $btnDeleteAll = document.querySelector(".delete-all-btn");

$btnDarkMode.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  darkModeIsActive = darkModeIsActive ? false : true;
  saveToLocalStorage();
});

$btnDeleteAll.addEventListener("click", function () {
  deleteAllBooks();
  displayBooks();
});
