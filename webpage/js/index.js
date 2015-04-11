var urls = { getImage : 'http://localhost:8080/getimage' };

function GetImage() {
	var event = document.getElementById('event').value;
	var date = document.getElementById('date').value;

	document.getElementById('start').style.display = 'none'
	var loader = document.getElementById('loader');
	loader.style.display = '';
	loader.style.marginTop = (screen.height/2 - 100) + "px";

	qwest.get(urls.getImage, {
		'date' : date
	}).then(function (response) {
		document.getElementById('loader').style.display = 'none'
		var imageDiv = document.getElementById('image');
		var img = new Image();
		img.src = response;
		imageDiv.appendChild(img);
	}). catch(function (e, url) {
		console.log(e);
	});
}


