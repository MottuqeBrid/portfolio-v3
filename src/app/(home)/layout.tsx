import Navbar from "@/_components/Navbar/Navbar";
import Footer from "@/_components/Footer/Footer";
import ScrollToTop from "@/_components/ScrollToTop/ScrollToTop";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-screen ">
      <Navbar />
      <main className="max-w-7xl mx-auto">{children}</main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
