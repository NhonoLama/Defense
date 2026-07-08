"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    terms: false,
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Registration failed. Please try again.");
        return;
      }

      setSuccess(true);
      setMessage("Registration successful!");
      setFormData({ username: "", email: "", password: "", terms: false });
    } catch {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-8">
      <h2 className="font-display text-xl font-bold">Create account</h2>
      <p className="mt-1 text-sm text-foreground/50">
        Join CineMood to track your watchlist
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/70">
            Username
          </label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="yourname"
            className="rounded-lg border border-white/10 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/70">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="rounded-lg border border-white/10 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground/70">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="rounded-lg border border-white/10 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-foreground/70">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            required
            className="mt-0.5 accent-accent"
          />
          I agree to the terms &amp; conditions
        </label>

        {message && (
          <p
            className={`rounded-lg px-4 py-2.5 text-sm ${
              success ? "bg-ramro/10 text-ramro" : "bg-naramro/10 text-naramro"
            }`}
          >
            {message}
          </p>
        )}

        {success ? (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-2 rounded-full bg-ramro py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Go to Sign in
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-accent py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-foreground/50">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
