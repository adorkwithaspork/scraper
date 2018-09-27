//require and request cheerio. This makes it possible to scrape
var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var path = require("path");

//Initialize express server
var app = express();

// REQUIRE ALL MODELS
var db = require("./models");
// Configure middleware
var PORT = process.env.PORT || 3000;

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
mongoose.connect("mongodb://heroku_86k0vlt6:dpukep8jnddetf7np0hq9uuqkv@ds115753.mlab.com:15753/heroku_86k0vlt6", { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: true
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


//ROUTES

// app.get('/', function(req, res){
//   res.sendFile(path.join(__dirname, "./public/index.html"));
// });

//make a get route to scrape from the NYtimes website
app.get("/scrape", function (req, res) {
 //grab the body of the html with the requst $. = axios
axios.get("http://www.nytimes.com").then(function (response) {
// Load the HTML into cheerio and save it to a variable
// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//need to use cherrios built in response.data 
var $ = cheerio.load(response.data);
//grab every article with theis tag, and do the following...
  $("article.css-180b3ld").each(function (i, element) {
        // Add the text and href of every link, and save them as properties of the result object
        var link = "https://www.nytimes.com" + $(element).find("a").attr("href");
        var summary = $(element).children().text();
        var title = $(element).find("p").text();
        var img = $(element).find("img").attr('src');
        //create a new article based on the scrape "result" created above
        db.Article.create({
            title: title,
            link: link,
            summary: summary,
            imgageURL: img
          })
          .then(function (dbArticle) {
            //view the result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            return res.json(err);
          });
      //if we can scrape and save an article to the db, confrim scrape complete
      res.send("Scrape Complete");
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        console.log(dbArticle);
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
});

app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
  



app.listen(PORT, function () {
  console.log("App running on port" + PORT);
});
