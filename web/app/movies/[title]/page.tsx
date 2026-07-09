import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import MovieDetail from "@/app/components/MovieDetail";
import CriticReview from "@/app/components/CriticReview";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;

  return (
    <>
      <Header />
      <MovieDetail title={title} />
      <CriticReview title={title} />
      <Footer />
    </>
  );
}
