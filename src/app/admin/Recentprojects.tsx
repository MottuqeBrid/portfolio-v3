import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
type ProjectActivity = {
  _id: string;
  title: string;
  isCompleted?: boolean;
  showInUI?: boolean;
  createdAt: string;
};

export default function Recentprojects({
  projects,
}: {
  projects: ProjectActivity[];
}) {
  return (
    <article className="rounded-3xl border border-base-300 bg-base-100/85 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-base-content">
          Recent projects
        </h2>
        <Link
          href="/admin/projects"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-base-content/65">No project activity.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="rounded-2xl border border-base-300 bg-base-200/50 px-4 py-3"
            >
              <p className="font-semibold text-base-content">{project.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-base-content/60">
                {project.isCompleted ? "completed" : "in progress"} •{" "}
                {formatDate(project.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
