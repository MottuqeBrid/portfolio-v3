import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
type NoteActivity = {
  _id: string;
  title: string;
  category: "text" | "image" | "file" | "other";
  createdAt: string;
};
export default function RecentNotes({ notes }: { notes: NoteActivity[] }) {
  return (
    <article className="rounded-3xl border border-base-300 bg-base-100/85 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-base-content">
          Recent notes
        </h2>
        <Link
          href="/admin/notes"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-base-content/65">No note activity.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="rounded-2xl border border-base-300 bg-base-200/50 px-4 py-3"
            >
              <p className="font-semibold text-base-content">{note.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-base-content/60">
                {note.category} • {formatDate(note.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
