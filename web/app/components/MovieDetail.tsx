import Image from "next/image";
import WatchlistButton from "./WatchlistButton";
import CommentForm from "./CommentForm";

interface Movie {
  _id: string;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

async function getMovie(title: string): Promise<Movie> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movies/${encodeURIComponent(title)}`,
  );
  if (!res.ok) {
    throw new Error("Movie not found");
  }
  return res.json();
}

export default async function MovieDetail({ title }: { title: string }) {
  const movie = await getMovie(title);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-8 sm:flex-row">
        <Image
          src={movie.poster_path}
          alt={movie.title}
          width={300}
          height={450}
          className="rounded-xl shadow-lg"
        />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold">
            {movie.title}{" "}
            <span className="text-foreground/50">
              ({movie.release_date.split("-")[0]})
            </span>
          </h1>
          <p className="mt-4 text-foreground/80">{movie.overview}</p>
          <WatchlistButton movieId={movie._id} />
        </div>
      </div>

      <CommentForm title={title} />
    </div>
  );
}
