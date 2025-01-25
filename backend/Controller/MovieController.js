import Movie from "../Models/Movie.js";
import scrapeReviewsForMovie from "../scrapper.js";

// Helper function to format the title correctly for the URL
const formatTitleForURL = (title) => {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/&/g, "and") // Replace '&' with 'and'
    .replace(/[^a-z0-9_]/g, ""); // Remove special characters, keeping underscores
};

// Helper function to get possible title variations
const getPossibleTitleVariations = (title, releaseYear) => {
  const formattedTitle = formatTitleForURL(title);
  const variations = [];

  // First attempt: formatted title
  variations.push(formattedTitle);

  // Second attempt: formatted title with release year if provided
  if (releaseYear) {
    variations.push(`${formattedTitle}_${releaseYear}`);
  }

  return variations;
};

// Function to update reviews for movies with empty comments
const updateAllMovieReviews = async () => {
  try {
    // Find all movies with an empty comments field
    const movies = await Movie.find({ comments: { $exists: true, $size: 0 } });

    if (movies.length === 0) {
      console.log("No movies with empty comments found.");
      return;
    }

    // Process each movie
    for (const movie of movies) {
      const movieTitle = movie.title;
      const releaseYear = movie.release_date
        ? movie.release_date.split("-")[0]
        : null;
      console.log(`Updating reviews for movie: ${movieTitle}`);

      // Get possible title variations
      const titleVariations = getPossibleTitleVariations(
        movieTitle,
        releaseYear
      );

      let scrapedReviews = [];
      let scrapeSuccess = false;

      // Try scraping with each title variation
      for (let i = 0; i < titleVariations.length; i++) {
        const titleVariant = titleVariations[i];
        const scrapedData = await scrapeReviewsForMovie(titleVariant);

        if (scrapedData.error) {
          console.log(
            `Error scraping reviews for movie: ${titleVariant} - ${scrapedData.error}`
          );
        } else {
          scrapedReviews = scrapedData.reviews;
          if (scrapedReviews.length > 0) {
            scrapeSuccess = true;
            console.log(
              `Successfully scraped reviews for movie: ${titleVariant}`
            );
            break; // Exit the loop if successful
          }

          if (i === 1 && releaseYear) {
            console.log(
              `Initial attempts failed. Trying with release year: ${releaseYear}`
            );
          }
        }
      }

      if (scrapeSuccess && scrapedReviews.length > 0) {
        // Update the movie document by title
        await Movie.updateOne(
          { title: movieTitle },
          { $set: { comments: scrapedReviews } }
        );
        console.log(`Updated reviews for movie: ${movieTitle}`);
      } else {
        console.log(`No reviews found for movie: ${movieTitle}`);
      }
    }
  } catch (error) {
    console.error("Error updating reviews for all movies:", error);
  }
};

// Function to update reviews for a single movie by title
const updateMovieReviewsByTitle = async (movieTitle) => {
  try {
    // Find the movie by title
    const movie = await Movie.findOne({ title: movieTitle });

    if (!movie) {
      console.log(`No movie found with title: ${movieTitle}`);
      return;
    }

    if (movie.comments && movie.comments.length > 0) {
      console.log(`Movie "${movieTitle}" already has comments.`);
      return;
    }

    const releaseYear = movie.release_date
      ? movie.release_date.split("-")[0]
      : null;

    console.log(`Updating reviews for movie: ${movieTitle}`);

    // Get possible title variations
    const titleVariations = getPossibleTitleVariations(movieTitle, releaseYear);

    let scrapedReviews = [];
    let scrapeSuccess = false;

    // Try scraping with each title variation
    for (let i = 0; i < titleVariations.length; i++) {
      const titleVariant = titleVariations[i];
      const scrapedData = await scrapeReviewsForMovie(titleVariant);

      if (scrapedData.error) {
        console.log(
          `Error scraping reviews for movie: ${titleVariant} - ${scrapedData.error}`
        );
      } else {
        scrapedReviews = scrapedData.reviews;
        if (scrapedReviews.length > 0) {
          scrapeSuccess = true;
          console.log(
            `Successfully scraped reviews for movie: ${titleVariant}`
          );
          break; // Exit the loop if successful
        }
      }
    }

    if (scrapeSuccess && scrapedReviews.length > 0) {
      // Update the movie document
      await Movie.updateOne(
        { title: movieTitle },
        { $set: { comments: scrapedReviews } }
      );
      console.log(`Updated reviews for movie: ${movieTitle}`);
    } else {
      console.log(`No reviews found for movie: ${movieTitle}`);
    }
  } catch (error) {
    console.error(`Error updating reviews for movie "${movieTitle}":`, error);
  }
};

export default { updateAllMovieReviews, updateMovieReviewsByTitle };
