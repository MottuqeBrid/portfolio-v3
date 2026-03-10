import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
type EmailActivity = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
};
export default function RecentEmails({ emails }: { emails: EmailActivity[] }) {
  return (
    <article className="rounded-3xl border border-base-300 bg-base-100/85 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-base-content">
          Recent emails
        </h2>
        <Link
          href="/admin/email"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {emails.length === 0 ? (
          <p className="text-sm text-base-content/65">No email activity.</p>
        ) : (
          emails?.map((email) => (
            <div
              key={email._id}
              className="rounded-2xl border border-base-300 bg-base-200/50 px-4 py-3"
            >
              <p className="line-clamp-1 font-semibold text-base-content">
                {email.subject}
              </p>
              <p className="mt-1 text-xs text-base-content/70">
                {email.name} ({email.email})
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-base-content/60">
                {email.isRead ? "read" : "unread"} •{" "}
                {formatDate(email.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
