//map 

// function init()
// {
/* -----------------------------------------------------------------
		load map 
-----------------------------------------------------------------*/
// 	//add curlocation 
// 	var curLocation = getLocation();

// 	var 
// 	// Faneuil Hall

// 	var landmark = new google.maps.LatLng(42.3599611, -71.0567528);
// 	// Set up map
// 	var myOptions = {
// 		zoom: 13, // The larger the zoom number, the bigger the zoom
// 		center: landmark,
// 		mapTypeId: google.maps.MapTypeId.ROADMAP
// 	};	
// 	// Create the map in the "map_canvas" <div>
// 	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
// 	// Create a marker			for all markers	
// 	var marker = new google.maps.Marker({
// 		position: landmark,
// 		title: "Faneuil Hall, Boston, MA"
// 	});
	
// 	marker.setMap(map);
// 	// This is a global info window...
// 	var infowindow = new google.maps.InfoWindow();
	
// 	// Open info window on click of marker
// 	google.maps.event.addListener(marker, 'click', function() {
// 		infowindow.setContent(marker.title);
// 		infowindow.open(map, marker);
// 	});
// /* -----------------------------------------------------------------
// 		Json Data 
// -----------------------------------------------------------------*/
// 	var request = new XMLHttpRequest();//retrieve data without having to load entire page 
// 	var link =  'https://hans-moleman.herokuapp.com/rides';

// 	request.open('POST',link, true);	//make request json source 

// 	request.onreadystatechange = function () {
// 		map = document.getElementById('map_canvas');
// 		if (request.readyState == 4 && request.status == 200){
// 			parsedData = JSON.parse(request.responseText); //global
// 			console.log(parsedData);
// 			map.innerHTML = "";
// 			for 
// 		}
// 		else if (req) 		
//   	};

//   	var location = getLocation(); 

//   	//SEND LAT/LONG/USERNAME 
//   	request.send("username=CtmjKvK9&lat=" + "YOUR_LATITUDE&lng=" + "" + ); //makes request ready 

//   -----------------------------------------------------------------
// 		process data 
// -----------------------------------------------------------------

//   	// var position = new google.maps.LatLng(42.3599611, -71.0567528);


//   	// {"_id":"589bd3258451126182dfbc64","username":"WEINERMOBILE",
//   	// "lat":42.4075,"lng":-71.1190,"created_at":"2019-02-09T02:25:41.166Z"}

  	

// 	// getLocation(); 
// }


// function (argument) {
// 	// body...
// }

// function getLocation()
// {
// 	var lat = -99999;
// 	var lng = -99999;
// 	console.log("Hit me 1");
// 	function getLocation() {
// 		console.log("Hit me 2");
// 		navigator.geolocation.getCurrentPosition(function(somePos) {
// 			console.log("Hit me 3");
// 			lat = somePos.coords.latitude;
// 			lng = somePos.coords.longitude;
// 			printLocation();
// 		});
// 		console.log("Hit me 4");
// 	}
// 	function printLocation() {
// 		console.log("Hit me 5");
// 		elem = document.getElementById("location");
// 		elem.innerHTML = '<p class="fun">' + lat + ", " + lng + "</p>";
// 	}

// }


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

	var request = new XMLHttpRequest();


	request.open('POST','https://hans-moleman.herokuapp.com/rides', true);	//make request json source 

	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function () {
		map = document.getElementById('map_canvas');
		if (request.readyState == 4 && request.status == 200){
			parsedData = JSON.parse(request.responseText); //global
			console.log(parsedData);/*------*/
			map.innerHTML = "";
			// mark(parsedData);
		}	
	};

	//SEND LAT/LONG/USERNAME 
	request.send("username=CtmjKvK9&lat=" + myLat + "&lng=" + myLng); //makes request ready 


}

//create markers from json 
function mark(x)
{
	console.log(parsedData);

	for (i = 0; i < x.length; i++)
	{
		var vehPos = new google.maps.LatLng(parsedData.vehicles[i].lat,parsedData.vehicles[i].lng);	
		var name = parsedData.vehicles[i]._id; 

		marker = new google.maps.Marker({
			position: vehPos,
			title: name
		});

		marker.setMap(map);
	}
}



