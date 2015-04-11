// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var request    = require('request');


app.use(express.static(__dirname + '/webpage'));

app.get('/', function(req,res){
  res.sendFile('index.html');
});

app.get('/getimage', function(req, res){
  var url = "https://api.data.gov/nasa/planetary/apod?api_key=ONlcOyy6fWLG3B84tPKAFYMxYnFMyemDzD5udkTt&date="+req.query.date;
  request(url, function(err, response, body){
    var dataGram = JSON.parse(body);
    console.log(dataGram);
    console.log(err);

    res.send(dataGram.url);
  });
});

app.listen('8080');

console.log('server started on port 8080');
