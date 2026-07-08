import Link from "next/link";

const footerLinks = ["Terms of Use", "Privacy Policy", "About", "Blog", "FAQ"];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-sm text-foreground/60">
      <ul className="flex flex-wrap gap-6">
        {footerLinks.map((link) => (
          <li key={link} className="transition-colors hover:text-foreground">
            <Link href="#">{link}</Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-foreground/40">
        &copy; {new Date().getFullYear()} CineMood. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
