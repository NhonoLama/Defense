import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    review: { type: String, required: true },
  },
  { _id: false }
); // Disable the _id field for comments

// Define the movie schema
const movieSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  poster_path: String,
  release_date: String,
  overview: String,
  comments: [commentSchema], // Use the commentSchema for comments
});

const Movie = mongoose.model("Movie", movieSchema, "movies");

export default Movie;
