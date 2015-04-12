var size = { height : 800, width: 1280}

var urls = { getImage : 'http://localhost:8080/getimage' };

var imageUrl, imageInfo;

var startPage = true;
var loading = false;
var finalPage = false;

function GetImage() {
	var date = document.getElementById('date').value;
	if (date === "") {
		date = '2012-12-12';
	}
	document.getElementById('start').style.display = 'none'
	startPage = false;
	loading = true;
	ShowLoader();
	qwest.get(urls.getImage, {
		'date' : date
	}, {
		timeout : 10000
	}).then(function (response) {
		HideLoader();
		imageUrl = response.url;
		imageInfo = response.info;
		finalPage = true;
		DrawImage();
	}). catch(function (e, url) {
		console.log(url);
		console.log(e);
		console.log("error");
	});
}

function ShowLoader(){
	if (loading) {
		var loader = document.getElementById('loader');
		loader.style.display = '';
		loader.style.marginTop = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0)/2 - 10) + "px";
	}
}

function HideLoader() {
	if (loading) {
		var loader = document.getElementById('loader');
		loader.style.display = 'none';
		loading = false;
	}
}

function DrawImage() {
	if (finalPage) {
		var url = imageUrl
		document.getElementById('secondpage').style.display = "";
		var xScale = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / size.width;
		var yScale = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) /size.height;
		var minScale = Math.min(xScale, yScale)
		var canvas = document.getElementById('imageCanvas');
		canvas.height = size.height * minScale;
		canvas.width = size.width * minScale;
		var context = canvas.getContext('2d');
		var imageObj = new Image();
		imageObj.addEventListener('load', function () {
			context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
			AddText();
			AddInfo(context, minScale);
			SetupLinks(minScale);
		}, false)
		imageObj.src = url;
		document.getElementsByTagName('html')[0].style.background = 'black';
	}
}

function AddInfo(context, scale) {
	var x, y, width, height;
	x = 0 * scale;
	y = 650 * scale;
	width = size.width * scale;
	height = 100* scale;
	context.fillStyle = "rgba(117,117,117, 0.2)";
	context.fillRect(x, y, width, height);
	context.fillStyle = "white";
	context.font = "30px HeadingFontHairline";
	context.fillText(imageInfo, x + 20, y + height/2 + 10);
}

function SetupLinks(scale) {
	var canvas = document.getElementById('imageCanvas');
	var style = window.getComputedStyle(canvas);

	var links = document.getElementById('links');
	links.style.left = (parseFloat(style.marginLeft.replace('px', '')) + parseFloat(style.width.replace('px', '')) - 200) + 'px';
	links.style.position = 'absolute';
	links.style.top = (parseFloat(style.marginTop.replace('px', '')) + parseFloat(style.height.replace('px', '')) - (110*scale)) + 'px';
	links.style.paddingRight = '15px';
	links.style.paddingBottom = '15px';
}

function AddText() {
	var textToAdd = document.getElementById('event').value;
	var date = document.getElementById('date').value;

	if (date === "") {
		date = '2012-12-12';
	}

	if (textToAdd === "") {
		textToAdd = "Text here";
	}

	// formatting date
	var dateSplit = date.split('-');
	var formattedDate = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];

	var canvas = document.getElementById('imageCanvas');
	var context = canvas.getContext('2d');
	context.font = "70px HeadingFontBold";

	var x = canvas.width/2 - context.measureText(textToAdd).width/2;
	var y = canvas.height/2 - 70/2 - 50;
	context.fillStyle = "white";
	context.fillText(textToAdd, x , y);
	context.font = "50px HeadingFontHairline";

	x = canvas.width/2 - context.measureText(formattedDate).width/2;
	y = canvas.height/2 - 70/2 + 10;

	context.fillText(formattedDate, x, y);
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

window.addEventListener('resize', function() {
	ShowLoader();
	DrawImage();
}, true);