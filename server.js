const express = require("express");
const hbs = require("hbs");
const fs = require("fs");
var app = express();
var dev = false;

const port = process.env.PORT || 3000;

if (dev){
  app.use((req, res, next) => {
    res.render("mantnience.hbs");
    // next() // Not executing next() because we don't want it to contuine.
  })
}

hbs.registerPartials(__dirname + "/views/partials"); // For partials so you don't need to keep repeating head, footer, ect..
app.set("view engine", "hbs"); // Express variable
app.use(express.static(__dirname + "/public")) // middleware

app.use((req, res, next) => {
  var now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile("server.log", log + "\n", (err) => {
    if (err) console.log("Unable to append to server.log");
  });
  next(); // Allows the application to run if this is not called, no pages will load load
});


hbs.registerHelper("currentYear", () => { // Lets our hbs files access the currentYear variable, which is set by the first param, globally throughout the site.
  return new Date().getFullYear()
  // return 'test';
});

hbs.registerHelper("screamIt", (text) => {
  return text.toUpperCase();
});

app.get("/", (req, res) => {
  res.render("home.hbs", {
    welcomeMessage: "Welcome to the website",
    pageTitle: "Home",
  });
});

app.get("/about", (req, res) => {
  res.render("about.hbs", {
    pageTitle: "About Page",
  });
});

app.get("/bad", (req, res) => {
  res.send({
    error_message: "Error handling request"
  });
});

app.listen(port, () => {
  console.log(`App started on ${port}`);
});
