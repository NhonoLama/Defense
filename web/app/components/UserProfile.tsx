"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface User {
  username: string;
  profileImageUrl?: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user-profile`,
          { credentials: "include" },
        );
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch {
        // silently fail — user is not logged in
      }
    };
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
    router.refresh();
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-foreground/70 transition-colors hover:border-accent hover:text-accent"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2"
      >
        <Image
          src={user.profileImageUrl || "/user.png"}
          alt={user.username}
          width={32}
          height={32}
          className="rounded-full object-cover ring-2 ring-white/10"
        />
        <span className="text-sm text-foreground/80">{user.username}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-surface shadow-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-xs text-foreground/50">Signed in as</p>
            <p className="truncate text-sm font-medium">{user.username}</p>
          </div>
          <Link
            href="/watchlist"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
          >
            Watchlist
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-left text-sm text-naramro transition-colors hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
