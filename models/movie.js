const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Year: { type: Number, required: true },
  Released: Date,
  Genre: [String], 
  Director: String,
  Actors: [String], 
  Language: String,
  Country: String,
  Poster: String, 
  imdbRating: { type: Number, min: 0, max: 10 } 
});

const Movies = mongoose.model("movies", movieSchema);
module.exports = Movies;
