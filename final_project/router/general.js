const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username = null, password = null } = req.body;

  if (userExist(username))
    return res
      .status(404)
      .json({ message: "User with that username already exist" });

  if (username && password) {
    users.push({ username, password });
    return res.status(200).json({ message: "User Registered Successfully" });
  }

  return res.status(404).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = parseInt(req.params.isbn);

  if (isbn) {
    const book = books[isbn];

    if (book) return res.status(200).json(book);
    else
      return res
        .status(404)
        .json({ message: "A book with this ISBN doesn't exist" });
  }

  return res.status(404).json({ message: "Error retrieving book information" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  if (author) {
    const authorBooks = Object.values(books).filter(
      (book) => book.author === author
    );

    if (authorBooks.length > 0) return res.status(200).json(authorBooks);
    else return res.status(404).json("There are no books for this author");
  }

  return res.status(404).json({ message: "Error retrieving book information" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  if (title) {
    const matchedBooks = Object.values(books).filter(
      (book) => book.title === title
    );

    if (matchedBooks.length > 0) return res.status(200).json(matchedBooks);
    else return res.status(404).json("There is no book with this title");
  }

  return res.status(404).json({ message: "Error retrieving book information" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (isbn) {
    const book = books[isbn];
    if (book) return res.status(200).json(book.reviews);
  }

  return res.status(404).json({ message: "Error retrieving book reviews" });
});

function userExist(username) {
  return users.filter((user) => user.username === username).length > 0;
}

module.exports.general = public_users;
