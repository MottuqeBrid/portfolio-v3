"use client";

import { ProjectInstance } from "@/models/Projects.Models";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  FiEdit,
  FiEye,
  FiFolderPlus,
  FiGithub,
  FiGlobe,
  FiLayers,
  FiPlus,
} from "react-icons/fi";
import ProjectModal from "./ProjectModal";
import { MdDelete } from "react-icons/md";
import { formatDate } from "@/lib/formatDate";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin projects",
  description:
    "Manage portfolio projects, including details, tech stack, and public visibility.",
};

type ProjectRecord = ProjectInstance & {
  _id?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const completedCount = useMemo(
    () => projects.filter((project) => project.isCompleted).length,
    [projects],
  );
  const showInUICount = useMemo(
    () => projects.filter((project) => Boolean(project.showInUI)).length,
    [projects],
  );

  useEffect(() => {
    let isActive = true;

    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data: ProjectRecord[] = await res.json();

        if (!isActive) {
          return;
        }

        startTransition(() => {
          setProjects(data);
          setErrorMessage(null);
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Failed to fetch projects",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      isActive = false;
    };
  }, []);

  function openCreateModal() {
    setSelectedProject(null);
    setIsModalOpen(true);
  }

  function openEditModal(project: ProjectRecord) {
    setSelectedProject(project);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedProject(null);
  }
  const handleDeleteProject = async (id: string) => {
    const toastId = toast.loading("Deleting project...");
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone. The project will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await fetch("/api/projects", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          });
          if (!res.ok) {
            throw new Error("Failed to delete project");
          }
          toast.dismiss(toastId);
          toast.success("Project deleted successfully");
          setProjects((current) =>
            current.filter((project) => project._id !== id),
          );
        } else {
          toast.dismiss(toastId);
          toast.info("Project deletion cancelled");
        }
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project",
      );
    }
  };
  function handleProjectSaved(project: ProjectRecord) {
    setProjects((current) => {
      const existingIndex = current.findIndex((item) => {
        if (project._id && item._id) {
          return item._id === project._id;
        }

        return (
          item.title === project.title && item.createdAt === project.createdAt
        );
      });

      if (existingIndex === -1) {
        return [project, ...current];
      }

      const nextProjects = [...current];
      nextProjects[existingIndex] = project;
      return nextProjects;
    });

    closeModal();
  }

  const statCards = [
    {
      label: "Total projects",
      value: projects.length,
      helper: "All records in the collection",
    },
    {
      label: "Completed",
      value: completedCount,
      helper: "Shipped or production-ready work",
    },
    {
      label: "Show in UI",
      value: showInUICount,
      helper: "Visible on the public portfolio",
    },
  ];

  return (
    <section className="" aria-labelledby="admin-projects-heading">
      <ToastContainer />
      <div className="relative overflow-hidden border border-base-300/70 bg-base-100/95 p-4 shadow-xl shadow-base-300/20 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,176,198,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(33,29,29,0.1),transparent_35%)]" />

        <div className="relative space-y-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Admin projects
              </span>
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <h1
                id="admin-projects-heading"
                className="text-3xl font-bold leading-tight tracking-tight text-base-content sm:text-4xl"
              >
                Portfolio projects
              </h1>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5"
              >
                <FiPlus size={18} />
                <span>Add project</span>
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-3xl border border-base-300 bg-base-200/70 p-5 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-base-content">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-base-content/65">
                  {card.helper}
                </p>
              </div>
            ))}
          </div>

          {errorMessage ? (
            <div className="rounded-3xl border border-error/30 bg-error/10 px-5 py-4 text-sm text-error">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-3xl border border-base-300 bg-base-200/60"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-base-300 bg-base-200/40 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FiFolderPlus size={24} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-base-content">
                No project records yet
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-base-content/70 sm:text-base">
                Start with a complete portfolio entry so the public projects
                section and admin collection stay in sync.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5"
              >
                <FiPlus size={18} />
                Create first project
              </button>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project._id ?? `${project.title}-${project.createdAt}`}
                  className="rounded-4xl border border-base-300 bg-base-100/85 p-4 shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold uppercase tracking-[0.18em] text-primary">
                        {project.title}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 font-semibold uppercase tracking-[0.18em] ${
                          project.isCompleted
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-amber-500/15 text-amber-600"
                        }`}
                      >
                        {project.isCompleted ? "Completed" : "In progress"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 font-semibold uppercase tracking-[0.18em] ${
                          project.showInUI
                            ? "bg-sky-500/15 text-sky-600"
                            : "bg-base-300 text-base-content/60"
                        }`}
                      >
                        {project.showInUI ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <div className="w-full">
                      <Image
                        src={project.thumbnail || "/placeholder.png"}
                        alt={project.title}
                        width={800}
                        height={500}
                        className="aspect-video w-full rounded-2xl object-cover shadow-2xl shadow-base-300/20"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mt-6">Description</h3>
                    <p className="w-full text-sm text-justify leading-7 text-base-content/75 sm:text-base">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4">
                      <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                        <FiLayers size={16} />
                        Tech stack
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {project.techStack.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-base-300 bg-base-100 px-3 py-2 text-base-content/75"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4">
                      <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                        <FiFolderPlus size={16} />
                        Key features
                      </p>
                      <div className="space-y-2">
                        {project.keyFeatures.slice(0, 3).map((feature) => (
                          <div
                            key={feature}
                            className="rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm text-base-content/75"
                          >
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-base-content/70">
                    {project.links?.live ? (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/80 px-4 py-2 transition-colors hover:bg-base-300"
                      >
                        <FiGlobe size={16} />
                        Live
                      </a>
                    ) : null}
                    {project.links?.githubClient ? (
                      <a
                        href={project.links.githubClient}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/80 px-4 py-2 transition-colors hover:bg-base-300"
                      >
                        <FiGithub size={16} />
                        Client repo
                      </a>
                    ) : null}
                    {project.showInUI ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sky-700">
                        <FiEye size={16} />
                        Public listing enabled
                      </span>
                    ) : null}
                  </div>

                  <div className="flex w-full flex-col sm:flex-row justify-between items-center mt-5">
                    <div className="rounded-2xl border border-base-300 bg-base-200/80 px-4 py-3 text-sm text-base-content/70">
                      <p>Updated {formatDate(project.updatedAt)}</p>
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="inline-flex items-center gap-2 rounded-full border border-primary bg-red-400 px-4 py-2 text-sm font-semibold text-base-content transition-colors hover:bg-primary/85"
                      >
                        <MdDelete size={16} />
                        <span>Delete Project</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(project)}
                        className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-colors hover:bg-primary/85"
                      >
                        <FiEdit size={16} />
                        Edit project
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen ? (
        <ProjectModal
          closeModal={closeModal}
          onSaved={handleProjectSaved}
          project={selectedProject}
        />
      ) : null}
    </section>
  );
}
