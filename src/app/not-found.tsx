import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-(--bg-primary) px-6 py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-4 inline-flex items-center rounded-full border border-(--border-color) bg-(--bg-secondary) px-4 py-1 text-sm font-semibold text-(--text-secondary)">
          Error 404
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-(--text-primary) md:text-6xl">
          Page not found
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-(--text-secondary) md:text-lg">
          The page you are looking for does not exist or may have been moved.
          Let&apos;s get you back to a place that does.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary min-w-36">
            Go home
          </Link>
          <Link href="/#projects" className="btn btn-outline min-w-36">
            View projects
          </Link>
        </div>
      </div>
    </main>
  );
}
