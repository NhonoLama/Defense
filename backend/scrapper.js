import puppeteer from "puppeteer";

// Helper function to generate unique IDs
const generateUniqueId = () => {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Scrape reviews for a specific movie
const scrapeReviewsForMovie = async (movieTitle) => {
  const formattedTitle = movieTitle.replace(/\s/g, "_").toLowerCase();
  const url = `https://www.rottentomatoes.com/m/${formattedTitle}/reviews?type=user`;

  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Go to the review page
    const response = await page.goto(url, { waitUntil: "networkidle2" });

    // Check if the page was loaded successfully
    if (response.status() === 404) {
      console.log(`Movie not found: ${movieTitle}`);
      return { error: "Movie not found", reviews: [] };
    }

    // Optionally, check for specific elements that only appear when the page is not found
    const isNotFound = await page.evaluate(() => {
      const errorMessage = document.querySelector(".error-page__title");
      return errorMessage && errorMessage.innerText.includes("404");
    });

    if (isNotFound) {
      console.log(`Movie not found: ${movieTitle}`);
      return { error: "Movie not found", reviews: [] };
    }

    // Function to click the "Load More" button
    async function clickLoadMore(page, clicks = 10) {
      for (let i = 0; i < clicks; i++) {
        const result = await page.evaluate(() => {
          const shadowHost = document.querySelector(
            'rt-button[data-loadmoremanager="btnLoadMore:click"]'
          );
          if (!shadowHost) return false;

          const shadowRoot = shadowHost.shadowRoot;
          if (!shadowRoot) return false;

          const loadMoreButton = shadowRoot.querySelector("button");
          if (loadMoreButton) {
            loadMoreButton.click();
            return true;
          }
          return false;
        });

        if (!result) break;

        // Replace page.waitForTimeout with setTimeout
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      }
    }

    // Function to scrape reviews
    async function scrapeReviews(page) {
      const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll(
          ".audience-review-row"
        );
        let extractedReviews = [];

        reviewElements.forEach((reviewElement) => {
          const nameElement = reviewElement.querySelector(
            ".audience-reviews__name"
          );
          const name = nameElement ? nameElement.innerText.trim() : "No name";

          const reviewElementText = reviewElement.querySelector(
            ".audience-reviews__review"
          );
          const reviewText = reviewElementText
            ? reviewElementText.innerText.trim()
            : "No review text";

          extractedReviews.push({ name, review: reviewText });
        });

        return extractedReviews;
      });

      // Add unique IDs to each review
      return reviews.map((review) => ({
        id: generateUniqueId(),
        ...review,
      }));
    }

    // Click the "Load More" button 5 times
    await clickLoadMore(page, 5);

    // Extract the reviews
    const reviews = await scrapeReviews(page);

    console.log(`Extracted ${reviews.length} reviews for movie: ${movieTitle}`);
    return { error: null, reviews };
  } catch (error) {
    console.error("Error scraping reviews:", error);
    return { error: "Error scraping reviews", reviews: [] };
  } finally {
    await browser.close();
  }
};

export default scrapeReviewsForMovie;
