
var urls = { getImage : 'http://localhost:8080/getimage' };

function GetImage() {
	var date = document.getElementById('date').value;

	document.getElementById('start').style.display = 'none'
	var loader = document.getElementById('loader');
	loader.style.display = '';
	loader.style.marginTop = (screen.height/2 - 100) + "px";

	qwest.get(urls.getImage, {
		'date' : date
	}).then(function (response) {
		document.getElementById('loader').style.display = 'none'
		DrawImage(response);
	}). catch(function (e, url) {
		console.log("error");
	});
}

function DrawImage(url) {
	console.log(url);
	document.getElementById('secondpage').style.display = "";
	var canvas = document.getElementById('imageCanvas');
	canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var context = canvas.getContext('2d');
	var imageObj = new Image();
	imageObj.addEventListener('load', function () {
		context.drawImage(imageObj, 0, 0, screen.width, screen.height );
		AddText();
	}, false)
	imageObj.src = url;
}

function AddText() {
	var textToAdd = document.getElementById('event').value;
	var date = document.getElementById('date').value;
	var canvas = document.getElementById('imageCanvas');
	var context = canvas.getContext('2d');
	context.font = "70px HeadingFontBold";

	var x = screen.width/2 - context.measureText(textToAdd).width/2;
	var y = screen.height/2 - 70/2 - 50;
	context.fillStyle = "white";
	context.fillText(textToAdd, x , y);
	context.font = "50px HeadingFontHairline";

	x = screen.width/2 - context.measureText(date).width/2;
	y = screen.height/2 - 70/2 + 10;

	context.fillText(date, x, y);
}

function DownloadFile() {

}

function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}

/**
 * The event handler for the link's onclick event. We give THIS as a
 * parameter (=the link element), ID of the canvas and a filename.
*/
document.getElementById('download').addEventListener('click', function() {
	console.log('click');
    downloadCanvas(this, 'imageCanvas', 'image.png');
}, false);



