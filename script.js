"use strict";

// A list of default books, so that a first-time user can gain a better understanding of how the app works, without having to add a bunch of books themselves first
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

// ADD NEW BOOK SECTION
const $btnAddBook = document.querySelector(".add-book-button");
const $addBookContainer = document.querySelector(".add-book-container");

// BOOK TABLE
const $bookTableContainer = document.querySelector(".table-container");
const $btnSortByTitle = document.querySelector("#sort-btn-title");
const $btnSortByAuthor = document.querySelector("#sort-btn-author");
const $btnSortByYear = document.querySelector("#sort-btn-year");
const $btnSortByReadStatus = document.querySelector("#sort-btn-read-status");

// EDIT MODAL
const $editBackground = document.querySelector(".edit-modal-background");
const $editWindow = document.querySelector(".edit-modal-window");
const $editBtnConfirm = document.querySelector(".modal-confirm-btn");
const $editBtnCancel = document.querySelector(".modal-cancel-btn");
const $editInputTitle = document.querySelector("#modal-input-title");
const $editInputAuthor = document.querySelector("#modal-input-author");
const $editInputYear = document.querySelector("#modal-input-year");
const $editInputReadStatus = document.querySelector("#modal-input-read-status");

// SETTINGS MODAL
const $settingsWindow = document.querySelector(".settings-modal");
const $settingsBtn = document.querySelector(".settings-button");
const $btnDarkMode = document.querySelector(".dark-mode-btn");
const $btnDeleteAll = document.querySelector(".delete-all-btn");

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

  // Check if all inputs are filled in
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
  const $tableBody = document.querySelector(".table-body");

  $tableBody.innerHTML = "";

  myLibrary.forEach((book, i) => {
    $tableBody.insertAdjacentHTML(
      "beforeend",
      `
    <tr class="book-item-container" data-id="${i}">
      <td class="title-cell">${book.title}</td>
      <td class="author-cell">${book.author}</td>
      <td class="year-cell">${book.year}</td>
      <td class="read-cell">
        <label class="toggler-wrapper">
          <input type="checkbox" class="read-status-value" id="read-checkbox" ${book.isRead ? "checked" : ""}>
          <div class="toggler-slider">
            <div class="toggler-knob"></div>
          </div>
        </label>
      </td>
      <td class="edit-cell"><i id="edit-btn" class="fa-solid fa-pen-to-square"></i></td>
      <td class="delete-cell"><i id="delete-btn" class="fa-solid fa-trash-can"></i></td>
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
  const titleElement = itemContainer.querySelector(".title-cell");
  const authorElement = itemContainer.querySelector(".author-cell");
  const yearElement = itemContainer.querySelector(".year-cell");
  const readStatusElement = itemContainer.querySelector(".read-status-value");

  $editBackground.classList.remove("hidden");
  $appContainer.classList.add("blurry");

  $editWindow.dataset.id = id;

  $editInputTitle.value = titleElement.textContent;
  $editInputAuthor.value = authorElement.textContent;
  $editInputYear.value = yearElement.textContent;
  $editInputReadStatus.checked = readStatusElement.checked;
}

function closeModal() {
  $editBackground.classList.add("hidden");
  $appContainer.classList.remove("blurry");
}

function getNumberOfReadBooks() {
  return myLibrary.reduce((acc, book) => (acc += book.isRead ? 1 : 0), 0);
}

function closeSettingsModal() {
  $settingsWindow.classList.add("hidden");
}

function deleteAllBooks() {
  if (!confirm("This will delete ALL books from your library. Are you sure you want to continue?")) return;
  myLibrary = [];
  saveToLocalStorage();
  closeSettingsModal();
}

function listenForButtonPressesInTable(e) {
  if (!e.target.closest(".book-item-container")) return;
  const id = e.target.closest(".book-item-container").dataset.id;

  // Listen for clicks on the "read" checkboxes
  if (e.target.id === "read-checkbox") {
    const status = e.target.checked;
    updateReadStatus(id, status);
  }

  // Listen for "Delete" button presses
  if (e.target.id === "delete-btn") deleteEntry(id);

  // Listen for "Edit" button presses
  if (e.target.id === "edit-btn") editEntry(id, e.target);
}

// SORTING FUNCTIONS
function sortByTitle() {
  if (currentlySortedBy !== "title-asc") {
    myLibrary.sort((a, b) => a.title.localeCompare(b.title));
    currentlySortedBy = "title-asc";
  } else if (currentlySortedBy === "title-asc") {
    myLibrary.sort((a, b) => b.title.localeCompare(a.title));
    currentlySortedBy = "title-desc";
  }
  displayBooks();
  saveToLocalStorage();
}

function sortByAuthor() {
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
}

function sortByYear() {
  if (currentlySortedBy !== "year-asc") {
    myLibrary.sort((a, b) => a.year - b.year);
    currentlySortedBy = "year-asc";
  } else if (currentlySortedBy === "year-asc") {
    myLibrary.sort((a, b) => b.year - a.year);
    currentlySortedBy = "year-desc";
  }
  displayBooks();
  saveToLocalStorage();
}

function sortByReadStatus() {
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
}

function updateBookData() {
  const id = $editWindow.dataset.id;
  myLibrary[id].title = $editInputTitle.value;
  myLibrary[id].author = $editInputAuthor.value;
  myLibrary[id].year = $editInputYear.value;
  myLibrary[id].isRead = $editInputReadStatus.checked;

  saveToLocalStorage();
  displayBooks();
  closeModal();
}

function openAndUpdateSettingsModal() {
  const $readBooksAmount = document.querySelector(".read-books-amount");
  const $totalBooksAmount = document.querySelector(".total-books-amount");

  $readBooksAmount.textContent = getNumberOfReadBooks();
  $totalBooksAmount.textContent = myLibrary.length;

  $settingsWindow.classList.toggle("hidden");
}

function switchDarkLightMode() {
  document.body.classList.toggle("dark-mode");
  darkModeIsActive = darkModeIsActive ? false : true;
  saveToLocalStorage();
  closeSettingsModal();
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

  displayBooks();
}

// ###############################################################
// ####################### EVENT LISTENERS #######################
// ###############################################################

$btnAddBook.addEventListener("click", addBookToLibrary);
$addBookContainer.addEventListener("keypress", function (e) {
  if (e.key !== "Enter") return;
  addBookToLibrary();
});
$bookTableContainer.addEventListener("click", listenForButtonPressesInTable);
$btnSortByTitle.addEventListener("click", sortByTitle);
$btnSortByAuthor.addEventListener("click", sortByAuthor);
$btnSortByYear.addEventListener("click", sortByYear);
$btnSortByReadStatus.addEventListener("click", sortByReadStatus);
$editBackground.addEventListener("mousedown", function (e) {
  if (e.target !== this) return;
  closeModal();
});
$editBtnCancel.addEventListener("click", closeModal);
$editBtnConfirm.addEventListener("click", updateBookData);
$settingsBtn.addEventListener("click", openAndUpdateSettingsModal);
window.addEventListener("click", function (e) {
  if (e.target.closest(".settings-modal")) return;
  if (e.target.closest(".settings-button")) return;
  $settingsWindow.classList.add("hidden");
});
$btnDarkMode.addEventListener("click", switchDarkLightMode);
$btnDeleteAll.addEventListener("click", function () {
  deleteAllBooks();
  displayBooks();
});

init();
