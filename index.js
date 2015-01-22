var GooglePlaces = require("google-places");
var Yo = require("yo-api");
var url = require("url");
var http = require('http');

var places = new GooglePlaces(process.env.GOOGLE_API_KEY);
var yo = new Yo(process.env.YO_API_KEY);



http.createServer(function (request, response) {
  var url_parts = url.parse(request.url, true);
  var params = url_parts.query;
  var username = params.username;
  var userLocation = params.location.split(";");
  var GooglePlacesOptions = {
    keyword: "Chipotle Mexican Grill",
    name: "Chipotle",
    types: ["food", "restaurant"],
    location: [userLocation[0],userLocation[1]],
    rankby: "distance",
    radius: null
  };

  places.search(GooglePlacesOptions, function(err, response) {
    var chipotle = response.results[0];
    var chipotleLocation = chipotle.geometry.location;
    console.log(userLocation, chipotleLocation);
    yo.yo_location(username, chipotleLocation.lat, chipotleLocation.lng, function(err, res, body) {
      console.log(err, body);
    });
  });
}).listen(process.env.PORT || 5000);
console.log('Server running at http://127.0.0.1:1337/');
