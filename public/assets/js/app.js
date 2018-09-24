//Grab articles as a Json 


  $.getJSON("/articles", function(articles){
    for (var i = 0; i < articles.length; i++) {
      // for (var i = 0; i < data.length; i++) {
      //   Display the apropos information on the page
      //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      // }

      var articleDiv = $('<div>');
      articleDiv.attr('id', 'articleInfo' + i);
      articleDiv.attr('class', 'card rounded');
      articleDiv.attr('style', 'width: 33rem;');
      articleDiv.css({
          'height': '340px',
          'margin': '10px'
      });

      var articleAnchor = $('<a>');
      articleAnchor.attr('href', articles[i].link);
      articleAnchor.attr('target', '_blank');

      var articlePic = $('<img>');
      articlePic.attr('class', 'card-img-top rounded');
      articlePic.attr('src', articles[i].pic);
      articlePic.attr('alt', 'pic of news');
      articleAnchor.append(articlePic);


      var articleTitle = $('<h3>');
      articleTitle.attr('class', 'card-text text-center text-wrap card-title');
      articleTitle.text(articles[i].title);
      articleAnchor.append(articleTitle);

      var articleSummary = $('<p>');
      articleSummary.attr('class', 'card-text text-center text-wrap card-title');
      articleSummary.text(articles[i].summary);
      articleTitle.append(articleSummary);
      

      articleDiv.append(articleAnchor);
      $('#dynamicCards').append(articleDiv);

  }
  $('#articles').css('display', 'block');
});
 


  // An empty array to save the data that we'll 