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
	var nearestVeh = 0; 
	var nearestWeiner = 0; 
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
			icon: "images/flower.png",
			position: me,
			title: "This is me!<br>" 
		});
		markers.push(marker);

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
			parsedData = JSON.parse(request.responseText); //global
			console.log(parsedData);/*------*/
			filterPopulate(parsedData);
		}	
	};
	//SEND LAT/LONG/USERNAME 
	request.send("username=CtmjKvK9&lat=" + myLat + "&lng=" + myLng); //makes request ready 
}

//deterine whether to populate passengers, vehicles, or both 
function filterPopulate(parsedData)
{
	if (parsedData.vehicles !== 'undefined')
		vehPopulate(parsedData);

	else if (parsedData.passengers !== 'undefined')
		passPopulate(parsedData); 

}


function passPopulate()
{
	for (i = 0; i < parsedData.passengers.length; i++) {
		var passPos = new google.maps.LatLng(parsedData.passengers[i].lat,parsedData.passengers[i].lng);
		var name = parsedData.passengers[i].username;
		//convert to miles
		var distance = ((google.maps.geometry.spherical.computeDistanceBetween(passPos, me)) 
		 * 0.000621371192);

		if (name == "WEINERMOBILE") {
			markWeiner(passPos, name, distance);
			updateMe(name, distance);
		}
		else {
			markPassenger(passPos,name);
			updateMe(name,distance);
		}		
	}
}

function markPassenger(passPos, name)
{
	var marker = new google.maps.Marker({
		position: passPos,
		title: "passenger:" + " " + name + " " + "distance: " + distance,
		icon: "images/passenger.png"
	});

	markers.push(marker);

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}

//create markers from json 
function vehPopulate(parsedData)
{
	for (i = 0; i < parsedData.vehicles.length; i++) {
		var vehPos = new google.maps.LatLng(parsedData.vehicles[i].lat,parsedData.vehicles[i].lng);
		var name = parsedData.vehicles[i].username;
		//convert to miles
		var distance = ((google.maps.geometry.spherical.computeDistanceBetween(vehPos, me)) 
		 * 0.000621371192);

		if (name == "WEINERMOBILE") {
			markWeiner(vehPos, name, distance);
			updateMe(name, distance);
		}
		else {
			markVeh(vehPos, name, distance);
			updateMe(name,distance);
		}		
	}
}
//updates Me location (if new vehicle is closest to you)
function updateMe(name, distance)
{
	console.log("vehicle distance::", distance);

	if (name == "WEINERMOBILE") {
		if (nearestWeiner == 0){
			nearestWeiner = distance;
			markers[0].setTitle(markers[0].title + "Distance to nearest WEINERMOBILE:" + distance + "<br>"); 
			return;
		}

		if (distance < nearestWeiner){
			nearestWeiner = distance;
			markers[0].setTitle(markers[0].title + "Distance to nearest WEINERMOBILE:" + distance + "<br>"); 
		}
	}

	else {
		if (nearestVeh == 0){
			nearestVeh = distance; 
			markers[0].setTitle(markers[0].title + " " + "Distance to nearest vehicle:" + distance + "<br>"); 
			return; 
		}

		console.log(nearestVeh,"= nearestVeh;", distance, "=distance;" );

		if (distance < nearestVeh){
			console.log("SECOND IF");
			nearestVeh = distance; 
			markers[0].setTitle(markers[0].title + " " + "Distance to nearest vehicle:" + distance + "<br>"); 
		}
	}
}

function markWeiner(vehPos, name, distance)
{
	var marker = new google.maps.Marker({
		position: vehPos,
		title: "Driver:" + name + " " + "distance(miles): " + distance,
		icon: "images/weinermobile.png"
	});
	markers.push(marker);

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(this.title);
		infowindow.open(map, this);
	});

}

function markVeh(vehPos, name, distance)
{
	var marker = new google.maps.Marker({
		position: vehPos,
		title: name + " " + "distance: " + distance,
		icon: "images/vehicle.png"
	});
	markers.push(marker);

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}



