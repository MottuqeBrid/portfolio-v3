"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiGithub, FiLink2, FiX } from "react-icons/fi";

type ProjectLinks = {
  live?: string;
  source?: string;
  githubClient?: string;
  githubServer?: string;
};

type ProjectItem = {
  title: string;
  description: string;
  longDescription: string;
  thumbnail?: string;
  techStack: string[];
  keyFeatures: string[];
  createdAt: string;
  updatedAt: string;
  images: string[];
  links: ProjectLinks;
  isCompleted: boolean;
};

const surfaceAccents = [
  "from-primary/20 via-primary/5 to-transparent",
  "from-sky-500/20 via-sky-500/5 to-transparent",
  "from-emerald-500/20 via-emerald-500/5 to-transparent",
];

export default function Projects({ id }: { id: string }) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects?showInUI=true");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      // console.error("Error fetching projects:", error);
    }
  };
  useEffect(() => {
    const runFetch = async () => {
      await fetchProjects();
    };
    runFetch();
  }, []);
  return (
    <section id={id} className="mt-12" aria-labelledby="projects-heading">
      <div className="relative overflow-hidden rounded-2xl border border-base-300/70 bg-base-100/90 p-6 shadow-xl shadow-base-300/20 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,176,198,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(115,115,115,0.14),transparent_30%)]" />

        <div className="relative space-y-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Projects
            </span>
            <h2
              id="projects-heading"
              className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl lg:text-5xl"
            >
              Project cards backed by schema-shaped demo data.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-base-content/75 sm:text-lg">
              This section follows your project schema directly, so each card is
              a compact preview and the modal exposes the full record including
              long description, features, links, timestamps, and asset fields.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <article
                  key={project.title}
                  className="flex h-full flex-col rounded-3xl border border-base-300 bg-base-100/80 shadow-sm"
                >
                  <div
                    className={`mb-5 rounded-2xl border rounded-b-none border-base-300 bg-linear-to-br ${surfaceAccents[index % surfaceAccents.length]} p-5 pt-6`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-full relative">
                        <span
                          className={`rounded-full px-3 py-1 text-xs absolute top-2 right-2 font-semibold uppercase tracking-[0.18em] ${
                            project.isCompleted
                              ? "bg-emerald-500 text-emerald-800"
                              : "bg-amber-500 text-amber-800"
                          }`}
                        >
                          {project.isCompleted ? "Completed" : "In progress"}
                        </span>
                        <Image
                          src={
                            project.thumbnail ||
                            "https://via.placeholder.com/400x300?text=No+Thumbnail"
                          }
                          height={300}
                          width={400}
                          alt={`${project.title} thumbnail`}
                          className="rounded-lg border-2 border-base-300 bg-base-200/80 w-full h-auto object-cover"
                        />
                        <h3 className="mt-3 text-xl md:text-2xl font-semibold text-base-content">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-base-content/75">
                      {project.description}
                    </p>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2 text-sm px-4">
                    {project.techStack.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-base-300 bg-base-200/80 px-3 py-2 text-base-content/75"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3 px-4">
                    {project.keyFeatures.slice(0, 2).map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl border border-base-300 bg-base-200/60 px-4 py-3 text-sm leading-6 text-base-content/70"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto py-5 px-4">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5"
                    >
                      View full details
                      <FiArrowUpRight size={16} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-base-300 bg-base-100/80 p-6 text-center text-sm text-base-content/75">
                No projects to display. Please add some projects to see them
                here.
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 inline-flex rounded-full border border-base-300 bg-base-200 p-2 text-base-content/70 transition-colors hover:bg-base-300"
              aria-label="Close project details"
            >
              <FiX size={18} />
            </button>

            <div className="space-y-8">
              <div className="space-y-4 pr-10">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-semibold uppercase tracking-[0.22em] text-primary">
                    {selectedProject.title}
                  </span>
                  <span
                    className={`rounded-full px-4 py-2 font-semibold uppercase tracking-[0.18em] ${
                      selectedProject.isCompleted
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-amber-500/15 text-amber-600"
                    }`}
                  >
                    {selectedProject.isCompleted ? "Completed" : "In progress"}
                  </span>
                </div>

                <h3 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                  {selectedProject.description}
                </h3>
                <p className="max-w-3xl text-base leading-8 text-base-content/75">
                  {selectedProject.longDescription}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-base-300 bg-base-200/60 p-5">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Tech stack
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {selectedProject.techStack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-base-300 bg-base-100 px-3 py-2 text-base-content/75"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-base-300 bg-base-200/60 p-5">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Key features
                    </p>
                    <div className="space-y-3">
                      {selectedProject.keyFeatures.map((feature) => (
                        <div
                          key={feature}
                          className="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm leading-7 text-base-content/75"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-base-300 bg-base-200/60 p-5">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Images
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedProject.images.length > 0 ? (
                        <>
                          <Image
                            src={selectedProject?.thumbnail || ""}
                            height={400}
                            width={400}
                            alt={`${selectedProject?.title} thumbnail`}
                            className="rounded-2xl border border-base-300 bg-base-100 px-4 py-4 text-sm text-base-content/70"
                          />

                          {selectedProject.images.map((image, index) => (
                            <Image
                              src={image}
                              height={400}
                              width={400}
                              alt={`${selectedProject.title} preview ${index + 1}`}
                              key={`${selectedProject.title}-${index}-${image}`}
                              className="rounded-2xl border border-base-300 bg-base-100 px-4 py-4 text-sm text-base-content/70"
                            />
                          ))}
                        </>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-4 py-4 text-sm text-base-content/60">
                          No additional images provided.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <aside className="space-y-6">
                  {/* <div className="rounded-3xl border border-base-300 bg-base-200/60 p-5">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Thumbnail
                    </p>
                    <div className="space-y-3 text-sm text-base-content/75">
                      <Image
                        src={selectedProject?.thumbnail || ""}
                        height={400}
                        width={400}
                        alt={`${selectedProject?.title} thumbnail`}
                        className="rounded-lg border border-base-300 bg-base-200/80 w-full"
                      />
                    </div>
                  </div> */}

                  <div className="rounded-3xl border border-base-300 bg-base-200/60 p-5">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Links
                    </p>
                    <div className="space-y-3 text-sm">
                      {Object.entries(selectedProject?.links || {}).length >
                      0 ? (
                        Object.entries(selectedProject.links).map(
                          ([label, value]) =>
                            value ? (
                              <a
                                key={label}
                                href={value}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-base-content/75 transition-colors hover:bg-base-200"
                              >
                                <span className="inline-flex items-center gap-2 font-medium text-base-content">
                                  {label.includes("github") ? (
                                    <FiGithub size={16} />
                                  ) : (
                                    <FiLink2 size={16} />
                                  )}
                                  {label}
                                </span>
                                <FiArrowUpRight size={16} />
                              </a>
                            ) : null,
                        )
                      ) : (
                        <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-4 py-4 text-base-content/60">
                          No links added yet.
                        </div>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close modal backdrop"
            onClick={() => setSelectedProject(null)}
            className="absolute inset-0 -z-10"
          />
        </div>
      ) : null}
    </section>
  );
}
