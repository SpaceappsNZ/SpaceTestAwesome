// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var request    = require('request');
var datetime   = require('./datetime.js');
var fs         = require('fs');
var lwip       = require('lwip');

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
                  'url' : "http://localhost:8080/" + "images/processed/" + filename ,
                  'info' : dataGram.title
                }

			request(url).pipe(fs.createWriteStream("webpage/downloads/" + filename)).on('close', function () {
        processImg(filename, function(){
          res.send(result);
          console.log('Done');
        });
			});
		}
	}
	request(url, func);
});

function resizeBatch (image) {
  //resize image
  var maxWidth = 1280;
  var maxHeight = 800;

  var result = image.batch();

  //rotate portrait
  if (image.width() < image.height()){
    result = result.rotate(90);
  }

  //crop or scale -> blur
  //resize does not retain aspect
  return result.cover(maxWidth, maxHeight);
}

function beautifyBatch (image)
{
  //saturation
  return image.batch().saturate(-1);
}

function processImg (filename, cb) {
  lwip.open("webpage/downloads/" + filename, function(err, image){
    // define a batch of manipulations and save to disk as JPEG:
    var resizeTask = resizeBatch(image);
    var beautifyTask = beautifyBatch(image);

    //executes then save to disk
    resizeTask.exec(function (err, image) {
      beautifyTask.exec(function (err, image) {
        image.writeFile("webpage/images/processed/" + filename, function(err){
          // check err...
          if (err) console.log(err.message);
          // done.

          cb();
        });
      });
    });
  });
}

app.listen('8080');

console.log('server started on port 8080');
