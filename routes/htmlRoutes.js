// // Requiring path to so we can use relative routes to our HTML files
var path = require("path");

module.exports = function(app){
    app.get("/", function(req, res){
        res.sendFile(path.join(__dirname, "/views/home.html"));

    });

    // app.get("/saved", function(req, res){
    // });
};