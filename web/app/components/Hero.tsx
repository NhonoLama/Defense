import Search from "./Search";

export default function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">
        Find Your Mood
      </h1>
      <p className="max-w-md text-foreground/60">
        AI-driven sentiment analysis on critic reviews. Know the vibe before you
        watch.
      </p>
      <div className="w-full max-w-xl">
        <Search />
      </div>
    </section>
  );
}
