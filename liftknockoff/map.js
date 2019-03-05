//map 


	var myLat = 0;
	var myLng = 0;
	var me = new google.maps.LatLng(myLat, myLng);
	var myOptions = {
		zoom: 13, 
		center: me,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map;
	var marker;
	var nearestVeh = 0; 
	var nearestWeiner = 0;
	var nearestPass = 0;  
	var infowindow = new google.maps.InfoWindow();
	var markers = []; 

	function init() {
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		getMyLocation();
	}

//gets my location 
function getMyLocation() {
	if (navigator.geolocation) { 
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

//render google map with programmer pin
function renderMap() {
	me = new google.maps.LatLng(myLat, myLng);

	map.panTo(me);
	
	marker = new google.maps.Marker({
		icon: "images/flower.png",
		position: me,
		title: "This is me!<br>",
		label: " "
	});
	markers.push(marker);

	marker.setMap(map);
		
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

	getJSON(); 

}
//function: perform xml request 
function getJSON() {
	var request = new XMLHttpRequest();

	request.open('POST','https://hans-moleman.herokuapp.com/rides', true);

	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200){		
			parsedData = JSON.parse(request.responseText); 
			filterPopulate(parsedData);
		}	
	};
	request.send("username=CtmjKvK9&lat=" + myLat + "&lng=" + myLng);
}

//Function: deterine whether to populate passengers, vehicles, or both 
//parameter: JsonData object
function filterPopulate(parsedData)
{
	var key = parsedData.vehicles; 	//determine value for populate 

	if (key == undefined)
		key = 'x';

	if (key == 'x')
		passPopulate(parsedData, key); 	
	

	else 
		vehPopulate(parsedData, key);
}


function passPopulate(parsedData, key)
{
	for (i = 0; i < parsedData.passengers.length; i++) {
		
		var passPos = new google.maps.LatLng(parsedData.passengers[i].lat,parsedData.passengers[i].lng);
		var name = parsedData.passengers[i].username;
		var distance = ((google.maps.geometry.spherical.computeDistanceBetween(passPos, me)) 
		 * 0.000621371192);

		if (name == "WEINERMOBILE") {		
			markWeiner(passPos, name, distance);
			updateMe(name, distance, key);
		}
		else {
			markPassenger(passPos,name, distance);
			updateMe(name,distance, key);
		}		
	}
}

function markPassenger(passPos, name, distance)
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
function vehPopulate(parsedData, key)
{
	for (i = 0; i < parsedData.vehicles.length; i++) {
		var vehPos = new google.maps.LatLng(parsedData.vehicles[i].lat,parsedData.vehicles[i].lng);
		var name = parsedData.vehicles[i].username;
	
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
function updateMe(name, distance, key)
{
	if (name == "WEINERMOBILE") {
		if (nearestWeiner == 0){
			nearestWeiner = distance;
			markers[0].setTitle("Username:Eosher01" + "<br>" + "Distance to nearest WEINERMOBILE:" + distance 
				+ "<br>" + "Distance to nearest vehicle:" + nearestVeh); 
			return;
		}

		if (distance < nearestWeiner){
			nearestWeiner = distance;
			markers[0].setTitle("Username:Eosher01" + "<br> " + "Distance to nearest WEINERMOBILE:" + distance 
				+ "<br>" + "Distance to nearest vehicle:" + nearestVeh);  
		}
	}

	else {
		
		if (key == 'x') {
			if (nearestPass == 0){
				nearestPass = distance; 
				markers[0].setTitle("Username:Eosher01" + "<br>" +  "Distance to nearest WEINERMOBILE:" + nearestWeiner 
					+ "<br> " + "Distance to nearest passenger:" + distance + "<br>"); 
			return; 
			}

			if (distance < nearestPass){
				nearestPass = distance; 
				markers[0].setTitle("Username:Eosher01" + "<br>" + "Distance to nearest WEINERMOBILE:" + nearestWeiner 
					+ "<br> " + "Distance to nearest passenger:" + distance + "<br>"); 
			}
		}
		else {
			if (nearestVeh == 0){
				nearestVeh = distance; 
				markers[0].setTitle("Username:Eosher01" + "<br>" +  "Distance to nearest WEINERMOBILE:" + nearestWeiner 
					+ "<br> " + "Distance to nearest vehicle:" + distance + "<br>"); 
			return; 
			}

			if (distance < nearestVeh){
				nearestVeh = distance; 
				markers[0].setTitle("Username:Eosher01" + "<br>" + "Distance to nearest WEINERMOBILE:" + nearestWeiner 
					+ "<br> " + "Distance to nearest vehicle:" + distance + "<br>"); 
			}	
		}
	}
}


//creates and adds weinermobile markers to map 
function markWeiner(vehPos, name, distance)
{
	var marker = new google.maps.Marker({
		position: vehPos,
		title: name + " " + "distance(miles): " + distance,
		icon: "images/weinermobile.png"
	});
	markers.push(marker);

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(this.title);
		infowindow.open(map, this);
	});

}
//creates and adds car markers to map
function markVeh(vehPos, name, distance)
{
	var marker = new google.maps.Marker({
		position: vehPos,
		title: name + " " + "distance: " + distance,
		icon: "images/car.png"
	});
	markers.push(marker);

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}



