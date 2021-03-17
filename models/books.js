const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  bookName: {
    type: String,
    unique: true,
  },
  author: {
    type: String,
  },
  Genre: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

// Function fired after the new user saved
// userSchema.post("save", function (doc, next) {
//   console.log("New user was created & saved");
//   next();
// });
// Fire a function before the doc is saved
userSchema.pre("save", function (next) {
  console.log("User about to be created", this);
  next();
});

// static method to login user

const Book = mongoose.model("book", userSchema);
module.exports = Book;
