//Grab articles as a Json 
$( window ).on( "load", function() {
 getJ();
});

$("#scrapebtn").on( "click", function(event) {
  event.preventDefault();
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function(data) {
     alert("Scrape Complete");
     getJ();
  
 });
 
});
  
function getJ(){
    $.getJSON("/articles", function (data) {
      // res.JSON(data);
      for (var i = 0; i < data.length; i++) {

        var articleDiv = $('<div>');
        articleDiv.attr('data-id', data[i]._id);
        articleDiv.attr('class', 'card rounded card-body');

        var articleTitle = $('<p>');
        articleTitle.attr('class', 'card-text text-center text-wrap card-title');
        articleTitle.attr('data-id', data[i]._id);
        articleTitle.attr('id', data[i].title);
        articleTitle.text(data[i].title);
        articleDiv.append(articleTitle);

        var articleSummary = $('<p>');
        articleSummary.attr('class', 'card-text text-center text-wrap card-subtitle');
        articleSummary.attr('data-id', data[i]._id);
        articleSummary.attr('id', data[i].summary);
        articleSummary.text(data[i].summary);
        articleTitle.append(articleSummary);

        var articleLink = $("<a>");
        articleLink.attr('href',data[i].link);
        articleLink.attr('class','btn-danger');
        articleLink.text("Click here to read article");
        articleLink.css("font-size", "12px");
        articleLink.css("display", "block");

        $(articleSummary).append(articleLink);


        $("#articles").append(articleDiv);
      }
      $("#articleDiv").css("display", "block");
    });
  }

  // Whenever someone clicks a h4 tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

     var notesDiv = $('<div>');
      notesDiv.attr('data-id', data._id);
      notesDiv.attr('class', 'card rounded card-body');
      $(notesDiv).append("<h5>" + data.title + "</h2>");
      // An input to enter a new title
      $(notesDiv).append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $(notesDiv).append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(notesDiv).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      $("#notes").append(notesDiv);


      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


      
