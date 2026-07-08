import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Improved email regex
  },
  password: { type: String, required: true },
  terms: { type: Boolean, required: true },
  profileImage: { type: String, default: null }, // New field for profile image
  watchlist: [
    {
      movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" }, // Reference to Movie
      addedAt: { type: Date, default: Date.now }, // Optional: to track when the movie was added
    },
  ], // Add this field for watchlist
});

const User = mongoose.model("User", userSchema);

export default User;
