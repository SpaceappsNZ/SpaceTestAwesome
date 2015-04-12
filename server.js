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
  var url = "https://api.data.gov/nasa/planetary/apod?api_key=YLYsT4JXu135uli6a3SofErIksubsEMT2WmMCBTS&date=";
  var date = req.query.date;
  url += date;

  var func = function (err, response, body){

		var dataGram = JSON.parse(body);

		if (dataGram.error){
			date = datetime.change_date(date);
			url = "https://api.data.gov/nasa/planetary/apod?api_key=YLYsT4JXu135uli6a3SofErIksubsEMT2WmMCBTS&date="+date;
			request(url, func);
		} else {
			var url = dataGram.url;
			var filename = url.substring(url.lastIndexOf('/')+1);
			var result = {
                  'url' : "http://localhost:8080/" + "downloads/" + filename ,
                  'info' : dataGram.title
                }

			request(url).pipe(fs.createWriteStream("webpage/downloads/" + filename)).on('close', function () {
			 res.send(result);
			});
		}
	}
	request(url, func);
});

app.listen('8080');

console.log('server started on port 8080');
