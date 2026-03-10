"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Application crashed</h2>
        <button onClick={() => reset()}>Reload</button>
      </body>
    </html>
  );
}
