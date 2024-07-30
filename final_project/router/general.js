const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
 
//Register new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) {
        users.push({ username: username, password: password });
        return res
          .status(200)
          .json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(404).json({ message: "User already exists!" });
      }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

//TASK10
function retrieveBooks() {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //TASK1 return res.status(200).json(books)
    retrieveBooks().then(
        (books) => res.status(200).send(JSON.stringify(books, null, 4)),
        (error) =>
          res
            .status(404)
            .send("An error has occured trying to retrieve all the books")
      );
});


//Task 11
function retrieveBookFromISBN(isbn) {
    let book = books[isbn];
    return new Promise((resolve, reject) => {
      if (book) {
        resolve(book);
      } else {
        reject(new Error("The provided book does not exist"));
      }
    });
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //2 const isbn = req.params.isbn;
    // const book = books[isbn];
  
    // if (book) {
    //   res.json(book);
    // } else {
    //   res.status(404).json({ message: 'Book not found' });
    // }
    const isbn = req.params.isbn;
    retrieveBookFromISBN(isbn).then(
        (book) => res.status(200).send(JSON.stringify(book, null, 4)),
        (err) => res.status(404).send(err.message)
      );
 });
  
//Task 12
function retrieveBookFromAuthor(author) {
    let validBooks = [];
    return new Promise((resolve, reject) => {
      for (let bookISBN in books) {
        const bookAuthor = books[bookISBN].author;
        if (bookAuthor === author) {
          validBooks.push(books[bookISBN]);
        }
      }
      if (validBooks.length > 0) {
        resolve(validBooks);
      } else {
        reject(new Error("The provided author does not exist"));
      }
    });
  }

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //3 const author = req.params.author;
    // const bookKeys = Object.keys(books);
    // const booksByAuthor = [];
  
    // bookKeys.forEach((key) => {
    //   if (books[key].author === author) {
    //     booksByAuthor.push(books[key]);
    //   }
    // });
  
    // if (booksByAuthor.length > 0) {
    //   res.json(booksByAuthor);
    // } else {
    //   res.status(404).json({ message: 'Books by this author not found' });
    // }
    const author = req.params.author;
    retrieveBookFromAuthor(author).then(
    (books) => res.status(200).send(JSON.stringify(books, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});

//Task 13
function retrieveBookFromTitle(title) {
    let validBooks = [];
    return new Promise((resolve, reject) => {
      for (let bookISBN in books) {
        const bookTitle = books[bookISBN].title;
        if (bookTitle === title) {
          validBooks.push(books[bookISBN]);
        }
      }
      if (validBooks.length > 0) {
        resolve(validBooks);
      } else {
        reject(new Error("The provided book title does not exist"));
      }
    });
  }

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
//4     const title = req.params.title;
//     const bookKeys = Object.keys(books);
//     const booksByTitle = [];
  
//     bookKeys.forEach((key) => {
//       if (books[key].title.toLowerCase() === title.toLowerCase()) {
//         booksByTitle.push(books[key]);
//       }
//     });
  
//     if (booksByTitle.length > 0) {
//       res.json(booksByTitle);
//     } else {
//       res.status(404).json({ message: 'Books with this title not found' });
//     }
//   });

// //  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//     const isbn = req.params.isbn;
//     const book = books[isbn];
  
//     if (book) {
//       if (Object.keys(book.reviews).length > 0) {
//         res.json(book.reviews);
//       } else {
//         res.status(404).json({ message: 'No reviews found for this book' });
//       }
//     } else {
//       res.status(404).json({ message: 'Book not found' });
//     }

const title = req.params.title;
  retrieveBookFromTitle(title).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});

module.exports.general = public_users;
