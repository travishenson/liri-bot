// ** Requires for the App to Work **
// Read and set environmental variables with dotenv package
require("dotenv").config();

// Require keys.js
var keys = require("./keys.js");

// Require axios
var axios = require("axios");

// Require moment
var moment = require("moment");

// Require Node Spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Require file-system
var fs = require("file-system");

// **********************************************************

// ** Main Program Functionality **
// Determine which command the user has selected
var selectedCommand = process.argv[2];

// User's input for command argument
var userArgument = process.argv.splice(3).join(" ");

// Switch statement to run proper function, per user input
switch (selectedCommand) {
	case "concert-this":
		concertThis();
		break;
	case "spotify-this-song":
		spotifyThis();
		break;
	case "movie-this":
		movieThis();
		break;
	case "do-what-it-says":
		doWhat();
}

// **********************************************************

// ** Function to convert strings to title case **
function titleCase(string) {
	return string.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

// ** Base Functions for the LIRI Program **
// Concert-This Function
function concertThis(artist) {
	var artist = userArgument.replace(/\s/g, "");
	var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
	axios.get(queryURL).then(function(response) {
		for (var i = 0; i < response.data.length; i++) {
			// If region is applicable, format it for readability and correctness
			var region = "";
			if (response.data[i].venue.region) {
				region = response.data[i].venue.region + ", ";
			}
			var concertOutput = `
          Artist: ${titleCase(userArgument)}
          Venue: ${response.data[i].venue.name}
          Location: ${response.data[i].venue.city}, ${region}${
				  response.data[i].venue.country}
          Event Date: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}
        `;
      console.log(concertOutput);
		}
	});
}

// Spotify-This-Song Function
function spotifyThis(userSong) {
	if (userArgument) {
		userSong = userArgument;
	}

	if (!userSong) {
		userSong = "The Sign";
  }
  
	spotify.search({ type: "track", query: userSong }, function(err, data) {
		if (err) {
      var errorMessage = "Error occurred: " + err;
      console.log(errorMessage);
		}

		if (userSong === "The Sign") {
			var defaultSpotifyOutput = `
        Artist: ${data.tracks.items[8].album.artists[0].name}
        Song: ${data.tracks.items[8].name}
        Spotify Preview Link: ${data.tracks.items[8].external_urls.spotify}
        Album: ${data.tracks.items[8].album.name}
        `
        console.log(defaultSpotifyOutput);
		} else {
			for (var i = 0; i <= data.tracks.items.length - 1; i++) {
				var spotifyOutput = `
          Artist: ${data.tracks.items[i].album.artists[0].name}
          Song: ${data.tracks.items[i].name}
          Spotify Preview Link: ${data.tracks.items[i].external_urls.spotify}
          Album: ${data.tracks.items[i].album.name}
          `
          console.log(spotifyOutput);
			}
		}
	});
}

// Movie-This Function
function movieThis(movieTitle) {
	if (userArgument) {
		movieTitle = userArgument;
	}

	if (userArgument) {
		movieTitle = userArgument;
	}

	if (!movieTitle) {
		movieTitle = "Mr Nobody";
  }
  
	var movieQuery = movieTitle.replace(/\s+/g, "+");
	var movieURL = `http://www.omdbapi.com/?t=${movieQuery}&y=&plot=short&apikey=trilogy`;

	axios.get(movieURL).then(function(response) {
		var movieData = response.data;
		var movieOutput = `
        Title: ${movieData.Title}
        Release Year: ${movieData.Year}
        IMDB Rating: ${movieData.Ratings[0].Value}
        Rotten Tomatoes Rating: ${movieData.Ratings[1].Value}
        Produced in ${movieData.Country.replace(/,(?=[^,]*$)/, ", and")}
        Language: ${movieData.Language}
        Plot: ${movieData.Plot}
        Cast: ${movieData.Actors}
        `;
    console.log(movieOutput);
	});
}

// Do-What-It-Says Function
function doWhat() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}

		var dataArr = data.split(",");
		var txtCommand = dataArr[0];
		var txtArg = dataArr[1];

		switch (txtCommand) {
			case "concert-this":
				concertThis(txtArg);
				break;
			case "spotify-this-song":
				spotifyThis(txtArg);
				break;
			case "movie-this":
				movieThis(txtArg);
		}
	});
}

