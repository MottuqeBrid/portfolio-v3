import Navbar from "@/_components/Navbar/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-screen ">
      <Navbar />
      <main className="max-w-7xl mx-auto px-2 sm:px-4">{children}</main>
    </div>
  );
}
