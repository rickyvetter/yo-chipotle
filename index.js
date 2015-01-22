var http = require("http");
var url = require("url");
var GooglePlaces = require("google-places");
var Yo = require("yo-api");

var places = new GooglePlaces(process.env.GOOGLE_API_KEY);
var yo = new Yo(process.env.YO_API_KEY);



http.createServer(function (request, response) {
  var urlParts = url.parse(request.url, true);
  var params = urlParts.query;

  var location = params.location.split(";");
  var search = {
    name: "Chipotle",
    keywords: "Chipotle Mexican Grill",
    types: ["restaurant", "food"],
    location: location,
    rankby: "distance",
    radius: null // when ranking by distance you can't also have a radius
  };

  places.search(search, function(err, response) {
    var location = response.results[0].geometry.location;
    yo.yo_location(params.username, location.lat, location.lng, function(err, response, body){
      console.log(err, body);
    });
  });

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Success");
}).listen(1337, "127.0.0.1");
console.log("Server running at http://127.0.0.1:1337/");
