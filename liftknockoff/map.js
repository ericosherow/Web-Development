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
	var nearestPassenger = 0.0; 
	var nearestWeiner = 0.0; 
	var infowindow = new google.maps.InfoWindow();
	var markers = []; 

	function init() {
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		getMyLocation();
	}


	function getMyLocation() {
		if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
			navigator.geolocation.getCurrentPosition(function(position) {
				myLat = position.coords.latitude;
				myLng = position.coords.longitude;
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
		
		marker = new google.maps.Marker({
			icon: "flower.png",
			position: me,
			title: "Here I Am!"
		});
		markers.push(marker);

		marker.setMap(map);
			
		// Open info window on click of marker
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});

		getJSON(); 
		console.log(markers[0], "ME"); 

}

function getJSON() {
	var request = new XMLHttpRequest();

	request.open('POST','https://hans-moleman.herokuapp.com/rides', true);	//make request json source 

	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200){		
			parsedData = JSON.parse(request.responseText); //global
			console.log(parsedData);/*------*/
			populate(parsedData);
		}	
	};
	//SEND LAT/LONG/USERNAME 
	request.send("username=CtmjKvK9&lat=" + myLat + "&lng=" + myLng); //makes request ready 
}

//create markers from json 
function populate(parsedData)
{
	console.log(parsedData.vehicles.length, "LENGTH");
	for (i = 0; i < parsedData.vehicles.length; i++) {
		var vehPos = new google.maps.LatLng(parsedData.vehicles[i].lat,parsedData.vehicles[i].lng);
		var name = parsedData.vehicles[i].username;
		//convert to miles
		var distance = ((google.maps.geometry.spherical.computeDistanceBetween(vehPos, me)) 
		 * 0.000621371192);

		console.log(parsedData.vehicles[i].lat,parsedData.vehicles[i].lng);	

		console.log(name); 

		if (name == "WEINERMOBILE") {
			markWeiner(vehPos, name, distance);
			updateMe(name, distance);
		}
		else {
			markPassenger(vehPos,name);
			updateMe(name,distance);
		}		
	}
}
//updates Me location (if a new vehicle is closest to you)
function updateMe(name, distance)
{

	if (name == "WEINERMOBILE") {
		if (nearestWeiner == 0)
			nearestWeiner = distance;

		if (distance <= nearestWeiner)
			markers[0].setTitle("This is me!" + " " + "Distance to nearest WEINERMOBILE:" + distance); 
	}
	else {
		if (nearestPassenger == 0)
			nearestPassenger = distance; 

		if (distance <= nearestPassenger)
			marker[0].setTitle("This is me!" + " " + "Distance to nearest passenger:" + distance); 
	}
}

function markWeiner(vehPos, name, distance)
{
	var marker = new google.maps.Marker({
		position: vehPos,
		title: name + " " + "distance(miles): " + distance,
		icon: "weinermobile.png"
	});
	markers.push(marker);

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

}

function markPassenger(vehPos, name, distance)
{
	console.log(vehPos);

	var marker = new google.maps.Marker({
		position: vehPos,
		title: name + " " + "distance: " + distance,
		icon: "passenger.png"
	});
	markers.push(marker);

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}



