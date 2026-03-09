import AdminNavbar from "@/_components/Admin/AdminNavbar/AdminNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-screen ">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
