import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieDetail from "@/components/MovieDetail";
import CriticReview from "@/components/CriticReview";

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
