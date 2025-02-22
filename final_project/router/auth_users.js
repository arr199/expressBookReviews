const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const config = require("../config/config.js");

const regd_users = express.Router();

let users = [];

const isValidUser = (username) => {
  return users.any((user) => user.username === username);
};

const isUserRegistered = (username, password) => {
  console.log(users);
  const user = users.filter(
    (user) => user.username === username && user.password === password
  );

  return user.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Invalid username or password" });
  }

  if (isUserRegistered(username, password)) {
    const accessToken = jwt.sign({ username }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params?.isbn);
  const review = req.body.review;

  if (isbn && review) {
    const username = req.session.authorization.username;
    books[isbn].reviews[username] = review;
    const myReview = books[isbn].reviews[username];

    return res
      .status(200)
      .json({ message: "Review added successfully", review: myReview });
  }

  //Write your code here
  return res.status(404).json({ message: "Error adding review" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params?.isbn);

  if (isbn) {
    const username = req.session.authorization.username;
    delete books[isbn].reviews[username];
    const bookReviews = books[isbn].reviews;

    return res
      .status(200)
      .json({ message: "Review deleted successfully", reviews: bookReviews });
  }

  //Write your code here
  return res.status(404).json({ message: "Error deleting review" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValidUser;
module.exports.users = users;
