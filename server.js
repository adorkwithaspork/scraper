//require and request cheerio. This makes it possible to scrape
var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");

//Initialize express server
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

//Routes
app.get("/articles", function (req, res) {
  axios.get("http://www.nytimes.com", function (error, response, html) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);
    // An empty array to save the data that we'll scrape
    var result = [];
    $("article.css-180b3ld").each(function (i, element) {

      var link = $(element).find("a").attr("href");
      var title = $(element).children().text();
      var summary = $(element).find("p").text();
      var pic = $(element).find("img");

      // Save these results in an object that we'll push into the results array we defined earlier
      result.push({
        title: title,
        link: link,
        summary: summary,
        pic: pic
      });

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          return res.json(err);
        });

      res.send("Scrape Complete");
    });
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(article);
  });
});





app.listen(3000, function() {
    console.log("App running on port 3000!");
  });
    
