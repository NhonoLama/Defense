"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <p className="text-naramro">{error.message || "Something went wrong."}</p>
      <button
        onClick={reset}
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-background"
      >
        Try again
      </button>
    </div>
  );
}
