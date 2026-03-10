"use client";

import { EmailInstance } from "@/models/Email.Model";
import { startTransition, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FiCheck, FiMail, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { formatDate } from "@/lib/formatDate";

type EmailRecord = EmailInstance & {
  _id: string;
};

export default function AdminEmail() {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const unreadCount = useMemo(
    () => emails.filter((email) => !email.isRead).length,
    [emails],
  );

  async function loadEmails() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/emails", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Failed to fetch emails");
      }

      const data: EmailRecord[] = await res.json();

      startTransition(() => {
        setEmails(data);
        setErrorMessage(null);
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch emails",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadEmails();
  }, []);

  async function markAsRead(id: string) {
    const toastId = toast.loading("Updating email...");

    try {
      const res = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: true }),
      });

      if (!res.ok) {
        throw new Error("Failed to update email");
      }

      setEmails((current) =>
        current.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );

      toast.dismiss(toastId);
      toast.success("Marked as read");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  async function deleteEmail(id: string) {
    const toastId = toast.loading("Deleting email...");

    try {
      const res = await fetch("/api/emails", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete email");
      }

      setEmails((current) => current.filter((item) => item._id !== id));
      toast.dismiss(toastId);
      toast.success("Email deleted");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  return (
    <section className="p-4 sm:p-6" aria-labelledby="admin-emails-heading">
      <ToastContainer />
      <div className="space-y-6 rounded-3xl border border-base-300/70 bg-base-100/95 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Admin inbox
            </p>
            <h1 id="admin-emails-heading" className="text-3xl font-bold">
              Emails
            </h1>
          </div>

          <button
            type="button"
            onClick={() => void loadEmails()}
            className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-4 py-2 text-sm font-semibold hover:bg-base-300"
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/65">
              Total
            </p>
            <p className="mt-2 text-3xl font-bold">{emails.length}</p>
          </div>
          <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/65">
              Unread
            </p>
            <p className="mt-2 text-3xl font-bold">{unreadCount}</p>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl border border-base-300 bg-base-200/60"
              />
            ))}
          </div>
        ) : emails.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-10 text-center">
            <p className="text-lg font-semibold text-base-content">
              No emails yet
            </p>
            <p className="mt-2 text-sm text-base-content/70">
              New submissions will appear here from the `/api/emails` endpoint.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {emails.map((email) => (
              <article
                key={email._id}
                className="rounded-2xl border border-base-300 bg-base-100 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-base-content">
                      {email.name}
                    </p>
                    <a
                      href={`mailto:${email.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {email.email}
                    </a>
                  </div>

                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        email.isRead
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      {email.isRead ? "Read" : "Unread"}
                    </span>
                    <p className="text-xs text-base-content/60">
                      {formatDate(email.createdAt)}
                    </p>
                  </div>
                </div>

                <h3 className="mt-3 text-base font-semibold text-base-content">
                  {email.subject}
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-base-content/75">
                  {email.message}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {!email.isRead ? (
                    <button
                      type="button"
                      onClick={() => void markAsRead(email._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-content"
                    >
                      <FiCheck size={14} />
                      Mark as read
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-4 py-2 text-xs font-semibold text-base-content/70"
                      disabled
                    >
                      <FiMail size={14} />
                      Read
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => void deleteEmail(email._id)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-600"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
