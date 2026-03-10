"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiFolder,
  FiImage,
  FiInbox,
  FiMail,
  FiRefreshCw,
} from "react-icons/fi";
import Recentprojects from "./Recentprojects";
import RecentNotes from "./RecentNotes";
import RecentEmails from "./RecentEmails";
import ResumeUpdate from "./ResumeUpdata";

type ProjectActivity = {
  _id: string;
  title: string;
  isCompleted?: boolean;
  showInUI?: boolean;
  createdAt: string;
};

type NoteActivity = {
  _id: string;
  title: string;
  category: "text" | "image" | "file" | "other";
  createdAt: string;
};

type EmailActivity = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
};

type AdminResponse = {
  stats: {
    totalProjects: number;
    completedProjects: number;
    visibleProjects: number;
    totalNotes: number;
    notesWithImages: number;
    notesWithFiles: number;
    totalEmails: number;
    unreadEmails: number;
  };
  recent: {
    projects: ProjectActivity[];
    notes: NoteActivity[];
    emails: EmailActivity[];
  };
};

const initialData: AdminResponse = {
  stats: {
    totalProjects: 0,
    completedProjects: 0,
    visibleProjects: 0,
    totalNotes: 0,
    notesWithImages: 0,
    notesWithFiles: 0,
    totalEmails: 0,
    unreadEmails: 0,
  },
  recent: {
    projects: [],
    notes: [],
    emails: [],
  },
};

export default function Page() {
  const [data, setData] = useState<AdminResponse>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const completionRate = useMemo(() => {
    if (data.stats.totalProjects === 0) {
      return 0;
    }

    return Math.round(
      (data.stats.completedProjects / data.stats.totalProjects) * 100,
    );
  }, [data.stats.completedProjects, data.stats.totalProjects]);

  async function loadDashboard() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const payload: AdminResponse = await res.json();
      setData(payload);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard stats",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const statCards = [
    {
      label: "Total projects",
      value: data.stats.totalProjects,
      helper: `${completionRate}% completed`,
      icon: <FiFolder size={18} />,
    },
    {
      label: "Notes",
      value: data.stats.totalNotes,
      helper: `${data.stats.notesWithImages} with images`,
      icon: <FiImage size={18} />,
    },
    {
      label: "Inbox",
      value: data.stats.totalEmails,
      helper: `${data.stats.unreadEmails} unread`,
      icon: <FiInbox size={18} />,
    },
    {
      label: "Visible projects",
      value: data.stats.visibleProjects,
      helper: "Shown in portfolio UI",
      icon: <FiMail size={18} />,
    },
  ];

  return (
    <section className="p-4 sm:p-6" aria-labelledby="admin-overview-heading">
      <div className="relative overflow-hidden border border-base-300/70 bg-base-100/95 p-4 shadow-xl shadow-base-300/20 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,176,198,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(33,29,29,0.1),transparent_35%)]" />

        <div className="relative space-y-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Admin overview
              </span>
              <h1
                id="admin-overview-heading"
                className="text-3xl font-bold leading-tight tracking-tight text-base-content sm:text-4xl"
              >
                Project statistics
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-base-content/70 sm:text-base">
                Track projects, notes, and inbox status from one dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-4 py-2 text-sm font-semibold hover:bg-base-300"
              >
                <FiRefreshCw size={16} />
                Refresh
              </button>
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5"
              >
                Manage projects
              </Link>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-3xl border border-error/30 bg-error/10 px-5 py-4 text-sm text-error">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-3xl border border-base-300 bg-base-200/60"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-3xl border border-base-300 bg-base-200/70 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 text-primary">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      {card.label}
                    </p>
                    <span>{card.icon}</span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-base-content">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm text-base-content/70">
                    {card.helper}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-3">
            <Recentprojects projects={data.recent.projects} />

            <RecentNotes notes={data.recent.notes} />
            <RecentEmails emails={data.recent.emails} />
            <ResumeUpdate />
          </div>
        </div>
      </div>
    </section>
  );
}
