var urls = { getImage : 'http://localhost:8080/getimage' };

function GetImage() {
	var event = document.getElementById('event').value;
	var date = document.getElementById('date').value;

	qwest.get(urls.getImage, {
		'date' : date
	}).then(function (response) {
		document.getElementById('start').style.display = 'none'
		var imageDiv = document.getElementById('image');
		var img = new Image();
		img.src = response;
		imageDiv.appendChild(img);
	}). catch(function (e, url) {
		console.log(e);
	});
}