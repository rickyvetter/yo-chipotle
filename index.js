var GooglePlaces = require("google-places");
var Yo = require("yo-api");
var url = require("url");
var http = require("http");
var Analytics = require("analytics-node");

var places = new GooglePlaces(process.env.GOOGLE_API_KEY);
var yo = new Yo(process.env.YO_API_KEY);
var analytics = new Analytics(process.env.SEGMENT_API_KEY);

var _port = process.env.PORT || 1337;

http.createServer(function (request, response) {
  var url_parts = url.parse(request.url, true);
  var params = url_parts.query;

  if(params.username && params.location) {
    var username = params.username;
    var userLocationArray = params.location.split(";");
    var userLocation = {
      lat: userLocationArray[0],
      lng: userLocationArray[1]
    }
    var GooglePlacesOptions = {
      keyword: "Chipotle Mexican Grill",
      name: "Chipotle",
      types: ["food", "restaurant"],
      location: [userLocation.lat, userLocation.lng],
      rankby: "distance",
      radius: null
    };

    places.search(GooglePlacesOptions, function(err, response) {
      var chipotle = response.results[0];
      var chipotleLocation = chipotle.geometry.location;

      console.log(userLocation, chipotleLocation);
      analytics.track({
        userId: username,
        event: "Yo Chipotle",
        properties: {
          userLocation: userLocation,
          chipotleLocation: chipotleLocation,
          ip: params.user_ip
        }
      });

      yo.yo_location(username, chipotleLocation.lat, chipotleLocation.lng, function(err, res, body) {
        console.log(err, body);
      });
    });
  }

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Yo");

}).listen(_port);
console.log("Server running at http://127.0.0.1:"+_port+"/");
