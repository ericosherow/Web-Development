const express = require('express');
const path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');
var app = express(); 
var vehicles = ["JANET","NgfcWZmS", "tNEh59TC", "suFKyeZg", 
                    "VMerzMH8", "6tWDkKh6", "ajNnfhJj", "bCxY6mCw", 
                    "Cq4NX9eE", "mXfkjrFw", "EMYaM9D8", "nZXB8ZHz", 
                    "Tkwu74WC", "TnA763WN", "TaR8XyMe", "5KWpnAJN", "uf5ZrXYw"];
// var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js


app.use(cors());
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true })); // Required if we need to use HTTP post parameters

// Mongo initialization and connect to database
// process.env.MONGODB_URI is the default environment variable on Heroku for the MongoLab add-on
// If environment variables not found, fall back to mongodb://localhost/nodemongoexample
// nodemongoexample is the name of the local database
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/node-js-getting-started';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

// Serve static content in folder named "public"
app.use(express.static(path.join(__dirname, 'public')));

app.post('/rides', function(request, response) {
  var username = request.body.username;
  var lat = request.body.lat; 
  var lng = request.body.lng; 

  if (username == undefined || lat == undefined || lng == undefined) 
    response.send("{'error:Whoops, something is wrong with your data!'}");  

  var insertTime = new Date(new Date().getTime()); 
	//foodItem = foodItem.replace(/[^\w\s]/gi, ''); // remove all special characters.  Can you explain why this is important?
	var toInsert = {
    "username" : username, 
    "lat" : Number(lat), 
    "lng" : Number(lng),
    "created_at" : insertTime 
  };

///////////////VALIDATE///////////////////
if (typeof toInsert.username !== 'string' || typeof toInsert.lat !== 'number' || 
    typeof toInsert.lng !== 'number') 
        response.send("{'error:Whoops, something is wrong with your data!'}");  
///////////////VALIDATE///////////////////

  var found = vehicles.includes(username); 
  var threeMinAgo = new Date(new Date().getTime() - 1000 * 60 * 3);

  if (found === true) {
    db.collection('vehicles', function(error, coll){
      coll.insert(toInsert, function(error,ssved) {
          if (error)
            response.send({"error":"Whoops, something is wrong with your data!"});
          else {
              db.collection('passengers', function(error,col){
                  col.find({"created_at": {$gte: threeMinAgo}}).toArray(function(error, results) {
                    var json = {};
                    json["passengers"] = results;
                    response.send(json);
              }); 
            });     
         }
      });
    });
  }
  else {
    db.collection('passengers', function(error, coll){
      coll.insert(toInsert, function(error,ssved) {
          if (error)
            response.send({"error":"Whoops, something is wrong with your data!"});
          else {
              db.collection('vehicles', function(error,col){
                  col.find({"created_at": {$gte: threeMinAgo}}).toArray(function(error, results) {
                  var json = {};
                  json["vehicles"] = results;
                  response.send(json);

              }); 
            });     
         }
      });
    });   
    
  }
}); 

app.get('/passenger.json', function(request, response) {
	// response.set('Content-Type', 'text/html');
  var username = request.query.username;
  if (typeof username !== 'string') {
    response.send('[]');  
    // return;    
  } 
  else {
  db.collection('passengers', function(error, collection) {
    collection.find().toArray(function(error, results) {    
      JSON.stringify(results);
      if (error) {
        response.send({"error":"Whoops, something is wrong with your data!"});
      
        }
      else {
        // for (var i = 0; i < results.length; i++) {
        var r = results.find(function(element) {
          return element.username == username;
        });

  
        if (r){
          response.send(r); 
        }
        else {
          response.send('[]');
          
          } 
        // }
      }
		});	
  });
}//else 
});

app.get('/', function(request, response) {
  db.collection('vehicles', function(error, collection) {
    collection.find().toArray(function(error, results) {    
      JSON.stringify(results);
      var r; 
      for (var i = results.length-1; i > 0; i--) {
        r += (results[i].username += " was looking for passengers at " + 
              results[i].lat + "," + results[i].lng + " on " + results[i].created_at + "." + '<br>');
      }
      response.send('<!DOCTYPE HTML><html><head><title>Vehicles</title> <style> body{ background-color: black;} h1{ color: red;} </style></head><body><h1>' + r + '</h1></body></html>'); 
		});	
  });
});

app.listen(process.env.PORT || 3000);

// ----------------------------------------------------------------------------------------------------
