import Navbar from "@/_components/Navbar/Navbar";
import Footer from "@/_components/Footer/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-screen ">
      <Navbar />
      <main className="max-w-7xl mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
