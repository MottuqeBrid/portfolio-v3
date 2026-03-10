import Link from "next/link";
import Logo from "../Logo/Logo";
import { BsGithub, BsLinkedin, BsWhatsapp } from "react-icons/bs";

const quickLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

const socials = [
  {
    href: "https://github.com/MottuqeBrid",
    label: "GitHub",
    Icon: BsGithub,
    className: "hover:bg-black hover:text-white",
  },
  {
    href: "https://linkedin.com/in/md-mottuqe-brid",
    label: "LinkedIn",
    Icon: BsLinkedin,
    className: "text-blue-600 hover:bg-blue-600 hover:text-white",
  },
  {
    href: "https://wa.me/8801308133343",
    label: "WhatsApp",
    Icon: BsWhatsapp,
    className: "text-green-500 hover:bg-green-500 hover:text-white",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-base-300 bg-base-100/90">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <Logo href="/" imgClass="w-20" />
          <p className="max-w-sm text-sm leading-7 text-base-content/70">
            Building modern web interfaces with a focus on performance, clean
            architecture, and polished user experience.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Quick Links
          </p>
          <ul className="space-y-2 text-sm text-base-content/75">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Connect
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ href, label, Icon, className }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`rounded-full border border-base-300 bg-base-200 p-3 text-base-content transition-colors ${className}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-base-300/70 px-4 py-4 text-center text-sm text-base-content/65">
        <p>
          {" "}
          &copy; {currentYear} <Link href="/admin">Md. Mottuqe Brid</Link>. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
