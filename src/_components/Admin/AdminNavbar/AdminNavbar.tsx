// "use client";
import { FaHome, FaDownload, FaUserShield } from "react-icons/fa";
import { BiNotepad } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import NavLink from "@/_components/NavLink/NavLink";
import Logo from "@/_components/Logo/Logo";
import ThemeToggle from "@/_components/ThemeToggle/ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: <FaHome /> },
  { href: "/admin/projects", label: "Projects", icon: <FaHome /> },
  { href: "/admin/notes", label: "Notes", icon: <BiNotepad /> },
  { href: "/admin/email", label: "Email", icon: <MdEmail /> },
  { href: "/admin", label: "Admin", icon: <FaUserShield /> },
];

export default function AdminNavbar() {
  return (
    <div className="bg-base-100/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-base-200">
      <div className="navbar px-2 sm:px-4 shadow-sm mx-auto max-w-7xl">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              // tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navItems.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          <Logo href="/" imgClass="w-16" />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="flex items-center gap-1">
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          <ThemeToggle />
          <button className="btn">
            <FaDownload />
            <span>Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}
