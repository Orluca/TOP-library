let myLibrary = [];

class Book {
  constructor(title, author, year, isRead) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.isRead = isRead;
  }
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

addBookToLibrary(new Book("Lord of the Rings - The Fellowship of the Ring", "JRR Tolkien", 1954, true));
addBookToLibrary(new Book("Harry Potter 1", "JK Rowling", 1997, false));

function displayBooks(libraryArray) {
  libraryArray.forEach((book) => {
    const bookContainer = document.querySelector(".book-list-container");

    bookContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="book-item-container">
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
          <input type="checkbox" name="" id="" ${book.isRead ? "checked" : ""}/>
        </div>
      </div>
    `
    );
  });
}

displayBooks(myLibrary);
