"use client";

import { useEffect, useState } from "react";

interface Review {
  review: string;
  sentiment?: "positive" | "negative";
  score?: number;
}

export default function CriticReview({ title }: { title: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [positiveReviews, setPositiveReviews] = useState<Review[]>([]);
  const [negativeReviews, setNegativeReviews] = useState<Review[]>([]);
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
  const [visiblePositive, setVisiblePositive] = useState(5);
  const [visibleNegative, setVisibleNegative] = useState(5);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/movies/${encodeURIComponent(title)}`,
        );
        if (!res.ok) throw new Error("Critic reviews not found");
        const data = await res.json();
        setReviews(data.comments || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [title]);

  const runSentimentAnalysis = async () => {
    setAnalyzing(true);
    try {
      const validReviews = reviews.filter((r) => r.review.trim() !== "");

      const analyzed = await Promise.all(
        validReviews.map(async (r) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/predict`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ comment: r.review }),
            },
          );
          if (!res.ok) throw new Error("Error analyzing sentiment");
          const data = await res.json();
          return { ...r, sentiment: data.sentiment, score: data.score };
        }),
      );

      const positives = analyzed
        .filter((r) => r.sentiment === "positive")
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      const negatives = analyzed
        .filter((r) => r.sentiment === "negative")
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

      const total = analyzed.length || 1;
      setPositivePercentage(
        Number(((positives.length / total) * 100).toFixed(1)),
      );
      setNegativePercentage(
        Number(((negatives.length / total) * 100).toFixed(1)),
      );
      setPositiveReviews(positives);
      setNegativeReviews(negatives);
      setAnalysisComplete(true);
    } catch (err) {
      setError("Error running sentiment analysis");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-foreground/50">Loading reviews...</p>
      </div>
    );
  }

  if (error && !analysisComplete) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-naramro">{error}</p>
      </div>
    );
  }

  const isGoodMood = positivePercentage > 60;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="font-display text-2xl font-bold">Critic Reviews</h2>

      {/* --- Sentiment gauge: the signature element --- */}
      <div className="mt-6">
        {!analysisComplete ? (
          <button
            onClick={runSentimentAnalysis}
            disabled={analyzing || reviews.length === 0}
            className="rounded-full bg-accent px-5 py-2 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {analyzing
              ? "Analyzing..."
              : reviews.length === 0
                ? "No reviews to analyze"
                : "Run Sentiment Analysis"}
          </button>
        ) : (
          <div className="max-w-md">
            <div className="mb-2 flex items-baseline justify-between">
              <span
                className={`font-display text-lg font-bold ${
                  isGoodMood ? "text-ramro" : "text-naramro"
                }`}
              >
                {isGoodMood ? "Ramro Mood" : "Naramro Mood"}
              </span>
              <span className="text-sm text-foreground/50">
                {positivePercentage}% positive
              </span>
            </div>

            {/* The gauge: a single bar split at the positive/negative ratio */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface">
              <div
                className="h-full bg-ramro transition-all duration-700"
                style={{ width: `${positivePercentage}%` }}
              />
              <div
                className="h-full bg-naramro transition-all duration-700"
                style={{ width: `${negativePercentage}%` }}
              />
            </div>

            <div className="mt-1.5 flex justify-between text-xs text-foreground/40">
              <span>{positivePercentage}% Positive</span>
              <span>{negativePercentage}% Negative</span>
            </div>
          </div>
        )}
      </div>

      {/* --- Comment columns --- */}
      {analysisComplete && (
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ramro">
              Positive ({positivePercentage}%)
            </h3>
            <div className="flex flex-col gap-3">
              {positiveReviews.slice(0, visiblePositive).map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-ramro/20 bg-surface p-4 text-sm text-foreground/80"
                >
                  {r.review}
                </div>
              ))}
            </div>
            {visiblePositive < positiveReviews.length && (
              <button
                onClick={() => setVisiblePositive((v) => v + 5)}
                className="mt-3 text-sm text-accent hover:underline"
              >
                Show more
              </button>
            )}
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-naramro">
              Negative ({negativePercentage}%)
            </h3>
            <div className="flex flex-col gap-3">
              {negativeReviews.slice(0, visibleNegative).map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-naramro/20 bg-surface p-4 text-sm text-foreground/80"
                >
                  {r.review}
                </div>
              ))}
            </div>
            {visibleNegative < negativeReviews.length && (
              <button
                onClick={() => setVisibleNegative((v) => v + 5)}
                className="mt-3 text-sm text-accent hover:underline"
              >
                Show more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
