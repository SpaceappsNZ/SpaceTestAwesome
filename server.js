// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var request    = require('request');
var datetime   = require('./datetime.js');
var fs         = require('fs');

app.use(express.static(__dirname + '/webpage'));

app.get('/', function(req,res){
  res.sendFile('index.html');
});

app.get('/getimage', function(req, res){
  var date = '';
  if (datetime.validate_date(req.query.date)){
  	date = datetime.format_date(req.query.date);
  }

  var url = "https://api.data.gov/nasa/planetary/apod?api_key=ONlcOyy6fWLG3B84tPKAFYMxYnFMyemDzD5udkTt&date="+date;

  request(url, function(err, response, body){
    var dataGram = JSON.parse(body);

    var url = dataGram.url;
    var filename = url.substring(url.lastIndexOf('/')+1);

    request.head(url, function(err, res, body){
      request(url).pipe(fs.createWriteStream("downloads/" + filename)).on('close', function () {});
    });
    res.send("http://localhost:8080/" + "downloads/" + filename);
  });
});

app.listen('8080');

console.log('server started on port 8080');
