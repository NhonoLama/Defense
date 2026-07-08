"use client";

import { useState } from "react";

export default function CommentForm({ title }: { title: string }) {
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  const handleSubmit = async () => {
    const text = comment.trim();
    if (!text) return;

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

  return (
    <div className="mt-10 border-t border-white/10 pt-8">
      <h2 className="font-display text-xl font-semibold">Leave a Comment</h2>
      <div className="mt-4 flex flex-col gap-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="min-h-24 rounded-lg border border-white/10 bg-surface px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          onClick={handleSubmit}
          disabled={status === "submitting"}
          className="self-start rounded-full bg-foreground px-5 py-2 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting..." : "Submit Comment"}
        </button>
        {status === "done" && (
          <p className="text-sm text-ramro">Comment added!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-naramro">Failed to submit comment.</p>
        )}
      </div>
    </div>
  );
}
