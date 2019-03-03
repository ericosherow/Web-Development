//map 


	var myLat = 0;
	var myLng = 0;
	var me = new google.maps.LatLng(myLat, myLng);
	var myOptions = {
		zoom: 13, // The larger the zoom number, the bigger the zoom
		center: me,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map;
	var marker;
	var infowindow = new google.maps.InfoWindow();

	function init() {
		console.log("init");
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		getMyLocation();
	}


	function getMyLocation() {
		if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
			navigator.geolocation.getCurrentPosition(function(position) {
				myLat = position.coords.latitude;
				myLng = position.coords.longitude;
				console.log(myLng, myLat, "aiksjd;");
				renderMap();
			});
		}
		else {
			alert("Geolocation is not supported by your web browser.  What a shame!");
		}
	}
	function renderMap() {
		me = new google.maps.LatLng(myLat, myLng);
		// Update map and go there...
		map.panTo(me);
		
		// Create a marker
		marker = new google.maps.Marker({
			position: me,
			title: "Here I Am!"
		});

		marker.setMap(map);
			
		// Open info window on click of marker
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});

		getJSON(); 



}

function getJSON() {
	var request = new XMLHttpRequest();

	request.open('POST','https://hans-moleman.herokuapp.com/rides', true);	//make request json source 

	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200){
			console.log("hit me 4");
			parsedData = JSON.parse(request.responseText); //global
			console.log(parsedData);/*------*/
			addMark(parsedData);
		}	
	};
	//SEND LAT/LONG/USERNAME 
	request.send("username=CtmjKvK9&lat=" + myLat + "&lng=" + myLng); //makes request ready 
}

//create markers from json 
function addMark(parsedData)
{
	for (i = 0; i < x.vehicles.length; i++) {
		var vehPos = new google.maps.LatLng(parsedData.vehicles[i].lat,parsedData.vehicles[i].lng);
		var name = String(parsedData.vehicles[i]._username);
		console.log(map);=
		console.log(parsedData.vehicles[i].lat,parsedData.vehicles[i].lng);	

		if (name == "")

		var marker = new google.maps.Marker({
			position: vehPos,
			title: name
		});

		marker.setMap(map);

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});
	}
}



