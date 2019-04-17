// Read and set environmental variables with dotenv package
require("dotenv").config();

// Require keys.js
var keys = require("./keys.js");

// Require axios
var axios = require("axios");

// Require moment
var moment = require('moment');

// Determine which command the user has selected
var selectedCommand = process.argv[2];

// User's input for command argument
var userArgument = process.argv.splice(3).join(" ");

// Title Case Function
function titleCase(string) {
  return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Switch statement to run proper function, per user input
switch (selectedCommand) {
  case "concert-this":
    var artist = userArgument.replace(/\s/g, '');
    var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    axios.get(queryURL).then(
      function (response) {
        for (var i = 0; i < response.data.length; i++) {
          // If region is applicable, format it for readability and correctness
          var region = '';
          if (response.data[i].venue.region) {
            region = response.data[i].venue.region + ", ";
          };
          console.log(`
            Artist: ${titleCase(userArgument)}
            Venue: ${response.data[i].venue.name}
            Location: ${response.data[i].venue.city}, ${region}${response.data[i].venue.country}
            Event Date: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}
          `)
        }
      }
    )
    break;
  case "spotify-this-song":
    break;
  case "movie-this":
    break;
  case "do-what-it-says":
};