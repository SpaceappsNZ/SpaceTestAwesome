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


var blurLevel  = 7;
var sasturationLevel = 0.4;

// var apiKey     = "YLYsT4JXu135uli6a3SofErIksubsEMT2WmMCBTS";
var apiKey     = "ONlcOyy6fWLG3B84tPKAFYMxYnFMyemDzD5udkTt";

app.use(express.static(__dirname + '/webpage'));

app.get('/', function(req,res){
	res.sendFile('index.html');
});

app.get('/getimage', function(req, res){
	var url = "https://api.data.gov/nasa/planetary/apod?api_key=" + apiKey + "&date=";
	var date = req.query.date;
	url += date;

	console.log('----------------------------------------');
	console.log('Recieved Request for date: ' + date);

	var func = function (err, response, body){
		var dataGram = JSON.parse(body);

		if (dataGram.error){
			date = datetime.change_date(date);
			url = "https://api.data.gov/nasa/planetary/apod?api_key=" + apiKey + "&date="+date;
			request(url, func);
			console.log('Could not find image, trying date: ' + date);
		} else {
			console.log('Found image');
			var url = dataGram.url;
			var filename = url.substring(url.lastIndexOf('/')+1);
			var result = {
									'url' : "http://localhost:8080/" + "images/processed/" + filename ,
									'info' : dataGram.title
								}
			console.log('Downloading image')
			console.time('Downloading time:');
			request(url).pipe(fs.createWriteStream("webpage/downloads/" + filename)).on('close', function () {
				console.timeEnd('Downloading time:');
				console.time('Processing time:');
				processImg(filename, function(){
					res.send(result);
					console.timeEnd('Processing time:');
					console.log('----------------------------------------');
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

  var scale = Math.min(image.width()/maxWidth, image.height()/maxHeight);
  if (scale<1) {    //check if enlarged
    //if too stretched, blur it
    if(scale < 0.75) {
      return result.cover(maxWidth, maxHeight, "cubic").blur(blurLevel);
    }
    else {
      return result.cover(maxWidth, maxHeight, "cubic").blur(0.5);
    }
  } else{
    //reduce
    return result.cover(maxWidth, maxHeight, "nearest-neighbor");
  };
}

function beautifyBatch (image)
{
  	// if(err) return image.batch().saturate(sasturationLevel);
   //  else
    //saturation
  	return image.batch().saturate(sasturationLevel);//.paste(0,0,overlay);
}

function processImg (filename, cb) {
	lwip.open("webpage/downloads/" + filename, function(err, image){
		// define a batch of manipulations and save to disk as JPEG:
		var resizeTask = resizeBatch(image);
		var beautifyTask = beautifyBatch(image);

		//executes then save to disk
		resizeTask.exec(function (err, image) {
			beautifyTask.exec(function (err, image) {
        lwip.open("webpage/images/overlay.png", function(err, overlay){
          image.paste(0,0,overlay, function(err){
            image.writeFile("webpage/images/processed/" + filename, function(err){
              // check err...
              if (err) console.log(err.message);
              // done.

              cb();
            });
          });
        });
			});
		});
	});
}

app.listen('8080');

console.log('server started on port 8080');
