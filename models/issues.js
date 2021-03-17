const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  Email: {
    type: String,
    unique: true,
  },
  books: [
    {
      id: {
        type: String,
      },
      bookName: {
        type: String,
      },
      author: {
        type: String,
      },
      genre: {
        type: String,
      },
    },
  ],
});

// Function fired after the new user saved
// userSchema.post("save", function (doc, next) {
//   console.log("New user was created & saved");
//   next();
// });
// Fire a function before the doc is saved
userSchema.post("save", function (doc, next) {
  console.log("User about to be created", this);
  next();
});

// static method to login user

const Issue = mongoose.model("issue", userSchema);
module.exports = Issue;
