"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FiLock, FiLogIn, FiMail } from "react-icons/fi";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json();

        if (!active) {
          return;
        }

        if (data?.authenticated) {
          router.replace("/admin");
          return;
        }
      } catch {
        if (active) {
          setErrorMessage("Unable to verify session. Please try again.");
        }
      } finally {
        if (active) {
          setIsCheckingSession(false);
        }
      }
    };

    void checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,153,79,0.26),transparent_34%),radial-gradient(circle_at_84%_78%,rgba(49,181,186,0.22),transparent_32%),linear-gradient(155deg,rgba(255,248,234,0.96),rgba(242,248,255,0.94))]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-4xl border border-base-300/70 bg-base-100/90 shadow-[0_28px_80px_rgba(0,0,0,0.18)] backdrop-blur xl:grid-cols-[1.1fr_1fr]">
          <div className="hidden flex-col justify-between bg-[linear-gradient(160deg,rgba(0,0,0,0.82),rgba(14,36,42,0.88)),radial-gradient(circle_at_22%_14%,rgba(255,163,102,0.3),transparent_35%)] p-10 text-white xl:flex">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/70">
                Admin access
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
                Portfolio control center
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                Sign in to manage projects, notes, inbox messages, and resume
                updates from your private dashboard.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Authorized users only
            </p>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Login
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-base-content/65">
                  Enter your admin credentials to continue.
                </p>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                  {errorMessage}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">Email</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <FiMail size={16} className="text-base-content/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      required
                      placeholder="admin@example.com"
                      className="w-full bg-transparent text-base-content outline-none placeholder:text-base-content/40"
                    />
                  </div>
                </label>

                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">
                    Password
                  </span>
                  <div className="flex items-center gap-2 rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <FiLock size={16} className="text-base-content/60" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-base-content outline-none placeholder:text-base-content/40"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || isCheckingSession}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FiLogIn size={16} />
                  {isCheckingSession
                    ? "Checking session..."
                    : isSubmitting
                      ? "Signing in..."
                      : "Sign in"}
                </button>
              </form>

              <p className="text-center text-sm text-base-content/65">
                Back to website{" "}
                <Link
                  href="/"
                  className="font-semibold text-primary hover:underline"
                >
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
