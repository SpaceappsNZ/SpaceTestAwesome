
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
		AddText();
	}). catch(function (e, url) {
		console.log(e);
	});
}

function DrawImage(url) {
	console.log(url);
	var canvas = document.getElementById('imageCanvas');
	canvas.style.display = '';
	canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var context = canvas.getContext('2d');
	var imageObj = new Image();
	imageObj.src = url;
	context.drawImage(imageObj, 0, 0, screen.width, screen.height );
}

function AddText() {
	var textToAdd = document.getElementById('event').value;
	var canvas = document.getElementById('imageCanvas');
	var context = canvas.getContext('2d');
	context.font = "70px HeadingFontBold";

	var x = screen.width/2 - context.measureText(textToAdd).width/2;
	var y = screen.height/2 - 75/2 - 50;
	context.fillText(textToAdd, x , y);
}



