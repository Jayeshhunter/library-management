const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport");
const mongoose = require("mongoose");
const Book = require("./models/books");
const Issue = require("./models/issues");
app.use(cors());
const path = require("path");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public/css/")));
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "tuto-session",
    keys: ["key1", "key2"],
  })
);
mongoose.connect(
  "mongodb+srv://heDB:hacker@cluster0.lev68.mongodb.net/libDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);
mongoose.set("useFindAndModify", false);
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/oauth");
  }
};

app.use(passport.initialize());
app.use(passport.session());

app.get("/", isLoggedIn, (req, res) => {
  Book.find({}, (err, data) => {
    res.render("home", {
      name: req.user.displayName,
      arr: data,
    });
  });
});
app.post("/", isLoggedIn, async (req, res) => {
  console.log(req.body);
  const obje = {
    Name: req.body.Name,
    Email: req.body.Email,
  };
  let arri = req.body.books;
  console.log("arri logging");
  console.log(obje);
  // Issue.create(obje, (err, data) => {
  //   if (err) {
  //     Issue.findOneAndUpdate(
  //       { Email: req.body.Email },
  //       { $push: { books: { $each: req.body.books } } },
  //       function (error, result) {
  //         if (error) {
  //           console.log(error);
  //         } else {
  //           console.log(result);
  //         }
  //       }
  //     );
  //     console.log(err);
  //   } else {
  //     console.log("Show my data bro", data);
  //   }
  // });
  Issue.create(obje)
    .then((resp) => {
      Issue.findOneAndUpdate(
        { Email: req.body.Email },
        { $push: { books: { $each: arri } } },
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("Here is the data after updating", result);
          }
        }
      );
    })
    .catch((err) => {
      Issue.findOneAndUpdate(
        { Email: req.body.Email },
        { $push: { books: { $each: arri } } },
        function (error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        }
      );
    });

  req.body.books.map((x) => {
    console.log(x.bookName);
    Book.findOneAndUpdate(
      { bookName: x.bookName },
      { $inc: { quantity: -1 } },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );
  });
});

app.get("/addBooks", isLoggedIn, (req, res) => {
  res.render("addBooks", {
    name: req.user.displayName,
  });
});
app.get("/allIssues", isLoggedIn, (req, res) => {
  Issue.find({}, (err, result) => {
    res.render("allIssues", {
      name: req.user.displayName,
      arr: result,
    });
  });
});
// book need to returned back to books
app.post("/allIssues", (req, res) => {
  let valu = req.body.index;
  let email = req.body.Name;
  var ar2 = [];
  var name = "";
  Issue.find({ Email: email }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Here is the problembro");
      console.log(valu);
      console.log(email);

      data[0].books.map((x, index) => {
        if (index !== +valu) {
          ar2.push(x);
        }
        if (index === +valu) {
          name = x.bookName;
        }
      });
      console.log(ar2);
      Issue.findOneAndUpdate(
        { Email: email },
        { $pull: { books: { bookName: name } } },
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        }
      );
      Book.findOneAndUpdate(
        { bookName: name },
        { $inc: { quantity: 1 } },
        function (err, result) {
          if (err) {
            console.log(err);
          }
        }
      );
      name = "";
    }
  });
});

app.post("/addBooks", isLoggedIn, (req, res) => {
  Book.create(req.body, function (err, data) {
    if (err) {
      Book.findOneAndUpdate(
        { bookName: req.body.bookName },
        { $inc: { quantity: 1 } },
        function (err, result) {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });

  //   console.log(book);
  res.redirect("/");
});
app.get("/failed", (req, res) => res.send("You Failed to log in!"));

app.get(
  "/oauth",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/oauth/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

app.listen(3000, () => console.log(`App listening on port ${3000}!`));
