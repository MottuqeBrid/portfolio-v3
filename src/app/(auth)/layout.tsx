export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-screen ">
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
