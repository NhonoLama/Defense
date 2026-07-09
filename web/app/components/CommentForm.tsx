"use client";

import { useState, useEffect } from "react";

export default function CommentForm({ title }: { title: string }) {
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  // Fetch username on mount so we can include it in the comment body
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-profile`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.username) setUsername(data.username);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    const text = comment.trim();
    if (!text || !username) return;

    setStatus("submitting");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/${encodeURIComponent(title)}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: Date.now(),
            name: username, // ← the missing field, now included
            review: text,
          }),
        },
      );
      if (!res.ok) throw new Error();
      setComment("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  // If user isn't logged in, don't render the form at all
  if (!username) return null;

  return (
    <div className="mt-10 border-t border-white/10 pt-8">
      <h2 className="font-display text-xl font-semibold">Leave a Comment</h2>
      <p className="mt-1 text-sm text-foreground/50">
        Commenting as{" "}
        <span className="font-medium text-foreground">{username}</span>
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="min-h-24 rounded-lg border border-white/10 bg-surface px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          onClick={handleSubmit}
          disabled={status === "submitting" || !comment.trim()}
          className="self-start rounded-full bg-foreground px-5 py-2 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting..." : "Submit Comment"}
        </button>
        {status === "done" && (
          <p className="text-sm text-ramro">Comment added!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-naramro">Failed to submit. Try again.</p>
        )}
      </div>
    </div>
  );
}
