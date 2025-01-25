import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CriticReview.css";

const CriticReview = () => {
  const { title } = useParams();
  const [reviews, setReviews] = useState([]);
  const [positiveReviews, setPositiveReviews] = useState([]);
  const [negativeReviews, setNegativeReviews] = useState([]);
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
  const [visiblePositiveComments, setVisiblePositiveComments] = useState(5);
  const [visibleNegativeComments, setVisibleNegativeComments] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Determine the class for the score color based on positive percentage
  const scoreClass = positivePercentage > 60 ? "green" : "red";
  // Update the label based on positive percentage
  const moodLabel = positivePercentage > 60 ? "Ramro Mood" : "Naramro Mood";

  useEffect(() => {
    const fetchCriticReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/movies/${title}`);
        if (!response.ok) {
          throw new Error("Critic reviews not found");
        }
        const data = await response.json();
        setReviews(data.comments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCriticReviews();
  }, [title]);

  const runSentimentAnalysis = async () => {
    try {
      const validReviews = reviews.filter(
        (review) => review.review.trim() !== ""
      );

      const analysisResults = await Promise.all(
        validReviews.map(async (review) => {
          const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment: review.review }),
          });

          if (!response.ok) {
            throw new Error("Error analyzing sentiment");
          }

          const data = await response.json();
          return { ...review, sentiment: data.sentiment, score: data.score };
        })
      );

      const positives = analysisResults
        .filter((r) => r.sentiment === "positive")
        .sort((a, b) => b.score - a.score);
      const negatives = analysisResults
        .filter((r) => r.sentiment === "negative")
        .sort((a, b) => b.score - a.score);

      const total = analysisResults.length;
      const positivePercent = ((positives.length / total) * 100).toFixed(2);
      const negativePercent = ((negatives.length / total) * 100).toFixed(2);

      setPositivePercentage(positivePercent);
      setNegativePercentage(negativePercent);
      setPositiveReviews(positives);
      setNegativeReviews(negatives);
      setAnalysisComplete(true);
    } catch (err) {
      setError("Error running sentiment analysis");
      console.error(err);
    }
  };

  const handleShowMorePositive = () => {
    setVisiblePositiveComments((prev) => prev + 5);
  };

  const handleShowMoreNegative = () => {
    setVisibleNegativeComments((prev) => prev + 5);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="critic-reviews">
      <h2>Critic Reviews for {title}</h2>

      <div className="meta-score">
        <span className={`score ${scoreClass}`}>
          <strong>{moodLabel}:</strong> {positivePercentage}
        </span>
        {analysisComplete && (
          <div className="score-bar">
            <span className="positive">{positivePercentage}% Positive</span>
            <span className="negative">{negativePercentage}% Negative</span>
          </div>
        )}
      </div>

      {!analysisComplete && (
        <button onClick={runSentimentAnalysis} className="analyze-btn">
          Run Sentiment Analysis
        </button>
      )}

      {analysisComplete && (
        <div className="analysis-results">
          <div className="comments-container">
            <div className="positive-box">
              <h3>Positive Comments ({positivePercentage}%)</h3>
              {positiveReviews
                .slice(0, visiblePositiveComments)
                .map((review, index) => (
                  <div key={index} className="review-card positive-review">
                    <p>{review.review}</p>
                  </div>
                ))}
              {visiblePositiveComments < positiveReviews.length && (
                <button
                  onClick={handleShowMorePositive}
                  className="show-more-btn"
                >
                  Show More Positive Comments
                </button>
              )}
            </div>

            <div className="negative-box">
              <h3>Negative Comments ({negativePercentage}%)</h3>
              {negativeReviews
                .slice(0, visibleNegativeComments)
                .map((review, index) => (
                  <div key={index} className="review-card negative-review">
                    <p>{review.review}</p>
                  </div>
                ))}
              {visibleNegativeComments < negativeReviews.length && (
                <button
                  onClick={handleShowMoreNegative}
                  className="show-more-btn"
                >
                  Show More Negative Comments
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriticReview;
