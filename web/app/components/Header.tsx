import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import UserProfile from "./UserProfile";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-background/80 px-6 py-4 backdrop-blur-md">
      <Link href="/" className="flex items-center">
        <Image
          src="/logoooo.png"
          alt="CineMood"
          width={36}
          height={36}
          className="rounded-md"
        />
        <span className="ml-2 font-display text-lg font-bold tracking-tight text-foreground">
          CineMood
        </span>
      </Link>

      <nav className="flex items-center gap-5">
        <button
          aria-label="Search"
          className="text-foreground/70 transition-colors hover:text-accent"
        >
          <Search size={20} />
        </button>
        <UserProfile />
      </nav>
    </header>
  );
};

export default Header;
