export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            CineMood
          </h1>
          <p className="mt-1 text-sm text-foreground/50">
            AI-driven sentiment in movie reviews
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
