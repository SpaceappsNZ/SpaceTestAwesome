var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var datetime = require('./datetime.js');
var parsedurl = [];

app.get('/', function(req, res){

  url = ['http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/earth_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/moon_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/venus_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/mars_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/mercury_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/mars_sat_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/asteroid_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/jupiter_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/jupiter_sat_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/saturn_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/saturn_sat_thumbnails.html',
          'http://nssdc.gsfc.nasa.gov/imgcat/thumbnail_pages/comet_thumbnails.html'];

  for(var i = 0; i < url.length; i++){
    request(url[i], function(error, response, html){
        if(!error && response.statusCode == 200){
            var $ = cheerio.load(html);

            var parsedResults = [];

            $('a').each(function(index){

            parsedurl.push($(this).attr('href'));

            });
        }

    });
  }
  res.send('Check your console!')
})

app.get('/getimages', function(req, res){
  for(var i = 0; i < parsedurl.length; i++){
    var jsonArray = [];
    request(parsedurl[i], function(error, response, html){
        if(!error && response.statusCode == 200){
            var $ = cheerio.load(html);
            var title, url, date;
            var json = { title : "", date : "", url : ""}


            json.url = "http://nssdc.gsfc.nasa.gov"+$('img').attr('src');
            date = $('p').text()
            var indx = date.indexOf("Date/Time (UT):");
            var ignoreCase = date.indexOf("N/A");

            json.date = date.substring(indx+16,indx+16+10);



            json.title = $('h1').text();
            jsonArray.push(json);
            //console.log(jsonArray);
        }

        fs.writeFile('output.json', JSON.stringify(jsonArray), function(err){

            //console.log('File successfully written! - Check your project directory for the output.json file');

        })

    });

  }
  res.send('Stored images and dates')
})
app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
