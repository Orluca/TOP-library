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

function displayBooks() {}

addBookToLibrary(new Book("Lord of the Rings - The Fellowship of the Ring", "JRR Tolkien", 1954, true));
addBookToLibrary(new Book("Harry Potter 1", "JK Rowling", 1997, true));
