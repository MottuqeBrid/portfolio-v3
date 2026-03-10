import imgbbImageUpload from "@/lib/imgbbImageUpload";
import { ProjectInstance } from "@/models/Projects.Models";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FiLoader, FiPlus, FiSave, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type ProjectFormValues = {
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  techStack: string;
  keyFeatures: string;
  images: string[];
  live: string;
  source: string;
  githubClient: string;
  githubServer: string;
  isCompleted: boolean;
  showInUI: boolean;
};

const initialFormValues: ProjectFormValues = {
  title: "",
  description: "",
  longDescription: "",
  thumbnail: "",
  techStack: "",
  keyFeatures: "",
  images: [],
  live: "",
  source: "",
  githubClient: "",
  githubServer: "",
  isCompleted: false,
  showInUI: false,
};

function parseList(value: string, separator: RegExp) {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toFormValues(project?: ProjectInstance | null): ProjectFormValues {
  if (!project) {
    return initialFormValues;
  }

  return {
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    thumbnail: project.thumbnail,
    techStack: project.techStack.join(", "),
    keyFeatures: project.keyFeatures.join("\n"),
    images: project.images,
    // images: project.images.join("\n"),
    live: project.links?.live ?? "",
    source: project.links?.source ?? "",
    githubClient: project.links?.githubClient ?? "",
    githubServer: project.links?.githubServer ?? "",
    isCompleted: project.isCompleted,
    showInUI: Boolean(project.showInUI),
  };
}

export default function ProjectModal({
  closeModal,
  onSaved,
  project,
}: {
  closeModal: () => void;
  onSaved: (project: ProjectInstance) => void;
  project: ProjectInstance | null;
}) {
  const [formValues, setFormValues] = useState<ProjectFormValues>(
    toFormValues(project),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // const [imageUploading, setImageUploading] = useState({
  //   thumbnail: false,
  //   images: false,
  // });

  useEffect(() => {
    setFormValues(toFormValues(project));
    setSubmitError(null);
  }, [project]);

  const isEditing = Boolean(project?._id);

  async function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = event.target;

    if (type === "file" && name === "thumbnail") {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const toastId = toast.loading("Uploading image...");

      try {
        // setImageUploading((current) => ({ ...current, thumbnail: true }));

        const url = await imgbbImageUpload(file);

        setFormValues((current) => ({
          ...current,
          thumbnail: url,
        }));

        toast.update(toastId, {
          render: "Thumbnail uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        Swal.fire({
          title: "Thumbnail uploaded",
          imageUrl: url,
          confirmButtonText: "Close",
        });
      } catch (error) {
        toast.update(toastId, {
          render:
            error instanceof Error ? error.message : "Thumbnail upload failed!",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      } finally {
        // setImageUploading((current) => ({ ...current, thumbnail: false }));
      }

      return;
    }
    if (type === "file" && name == "images") {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const toastId = toast.loading("Uploading image...");

      try {
        // setImageUploading((current) => ({ ...current, images: true }));
        const url = await imgbbImageUpload(file as File);
        Swal.fire({
          title: "Image uploaded",
          imageUrl: url,
          confirmButtonText: "Close",
        });
        setFormValues((current) => ({
          ...current,
          images: [url, ...current.images],
        }));
        toast.update(toastId, {
          render: "Image uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        toast.update(toastId, {
          render:
            error instanceof Error ? error.message : "Image upload failed!",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      } finally {
        // setImageUploading((current) => ({ ...current, images: false }));
      }
      return;
    }

    setFormValues((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const payload: Omit<ProjectInstance, "_id" | "createdAt" | "updatedAt"> = {
      id: project?._id ?? undefined,
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      longDescription: formValues.longDescription.trim(),
      thumbnail: formValues.thumbnail.trim(),
      techStack: parseList(formValues.techStack, /,/),
      keyFeatures: parseList(formValues.keyFeatures, /\n|,/),
      images: formValues.images,
      links: {
        live: formValues.live.trim(),
        source: formValues.source.trim(),
        githubClient: formValues.githubClient.trim(),
        githubServer: formValues.githubServer.trim(),
      },
      isCompleted: formValues.isCompleted,
      showInUI: formValues.showInUI,
    };

    try {
      const response = await fetch("/api/projects", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to save project");
      }

      onSaved(data.project ?? payload);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save project",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteImages = (newImageUrl: string) => {
    setFormValues((current) => ({
      ...current,
      images: [...current.images.filter((url) => url !== newImageUrl)],
    }));
    toast("Image removed successfully!", { type: "success" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={closeModal}
        aria-label="Close modal backdrop"
        className="absolute inset-0"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-4xl border border-base-300 bg-base-100 p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,176,198,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(33,29,29,0.08),transparent_35%)]" />

        <button
          type="button"
          onClick={closeModal}
          aria-label="Close add project modal"
          className="absolute right-4 top-4 inline-flex rounded-full border border-base-300 bg-base-200 p-3 cursor-pointer z-60 text-red-500/70 transition-colors hover:bg-base-300"
        >
          <FiX size={24} />
        </button>

        <div className="relative grid gap-8 xl:grid-cols-[0.95fr_1.45fr]">
          <aside className="rounded-4xl border border-base-300 bg-base-200/65 p-4">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {isEditing ? "Edit project" : "Add project"}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-base-content">
              {isEditing
                ? "Refine the project record and publish the latest changes."
                : "Create a project entry with complete portfolio metadata."}
            </h2>
            {/* <p className="mt-4 text-base leading-8 text-base-content/75">
              Keep titles, links, features, and visibility settings aligned so
              the admin view and public portfolio present the same source of
              truth.
            </p> */}

            <div className="mt-6 space-y-4 rounded-3xl border border-base-300 bg-base-100/80 p-5 text-sm text-base-content/70">
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-primary">
                  Input format
                </p>
                <p className="mt-2 leading-6">
                  Use commas for tech stack items. Use commas or line breaks for
                  features and image URLs.
                </p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-primary">
                  Publishing control
                </p>
                <p className="mt-2 leading-6">
                  &quot;Show in UI&quot; controls public visibility. Completion
                  status is tracked separately.
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {submitError ? (
              <div className="rounded-3xl border border-error/30 bg-error/10 px-5 py-4 text-sm text-error">
                {submitError}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-base-content/75 md:col-span-2">
                  <span className="font-medium text-base-content">Title</span>
                  <input
                    type="text"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    required
                    placeholder="Project title"
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75 md:col-span-2">
                  <span className="font-medium text-base-content">
                    Description
                  </span>
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Short card description"
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75 md:col-span-2">
                  <span className="font-medium text-base-content">
                    Long description
                  </span>
                  <textarea
                    name="longDescription"
                    value={formValues.longDescription}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Detailed project write-up"
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75 md:col-span-2">
                  <span className="font-medium text-base-content">
                    Thumbnail URL
                  </span>
                  <input
                    type="file"
                    name="thumbnail"
                    // value={formValues.thumbnail}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {formValues.thumbnail && (
                    <div className="w-full py-4 ">
                      <p className="text-xs text-base-content/70">
                        Preview of the thumbnail image
                      </p>
                      <Image
                        src={formValues?.thumbnail}
                        width={400}
                        height={400}
                        alt={formValues.title || "Thumbnail preview"}
                        className="rounded-2xl mt-2 border border-base-300 bg-base-100/80 object-cover shadow-lg shadow-base-300/20"
                      />
                    </div>
                  )}
                </label>
                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">
                    Tech stack
                  </span>
                  <textarea
                    name="techStack"
                    value={formValues.techStack}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Next.js, TypeScript, Tailwind CSS"
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">
                    Key features
                  </span>
                  <textarea
                    name="keyFeatures"
                    value={formValues.keyFeatures}
                    onChange={handleChange}
                    rows={4}
                    placeholder={"Feature one\nFeature two\nFeature three"}
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75 md:col-span-2">
                  <span className="font-medium text-base-content">
                    Image URLs
                  </span>
                  {/* <textarea
                    name="images"
                    value={formValues.images}
                    onChange={handleChange}
                    rows={4}
                    placeholder={"https://...\nhttps://..."}
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  /> */}
                  <input
                    type="file"
                    name="images"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {formValues?.images?.length > 0 && (
                    <div className="w-full">
                      <p className="text-xs text-base-content/70">
                        Preview of the images
                      </p>
                      <small>
                        {JSON.stringify(formValues?.images, null, 2) ||
                          formValues?.images}
                      </small>
                      <div className="w-full grid grid-col-2s md:grid-cols-3 gap-4 mt-2">
                        {formValues?.images?.map((imgUrl, index) => (
                          <div key={index} className=" w-full relative group">
                            <Image
                              width={400}
                              height={400}
                              alt={`${formValues.title} image ${index + 1}`}
                              src={imgUrl}
                              className="rounded-2xl mt-2 border border-base-300 bg-base-100/80 object-cover shadow-lg shadow-base-300/20"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteImages(imgUrl)}
                              className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </label>

                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">
                    Live link
                  </span>
                  <input
                    type="url"
                    name="live"
                    value={formValues.live}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">
                    Source link
                  </span>
                  <input
                    type="url"
                    name="source"
                    value={formValues.source}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">
                    GitHub client
                  </span>
                  <input
                    type="url"
                    name="githubClient"
                    value={formValues.githubClient}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">
                    GitHub server
                  </span>
                  <input
                    type="url"
                    name="githubServer"
                    value={formValues.githubServer}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/70 px-4 py-4 text-sm text-base-content/75">
                  <input
                    type="checkbox"
                    name="isCompleted"
                    checked={formValues.isCompleted}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-base-300 text-primary focus:ring-primary"
                  />
                  <span>Mark this project as completed</span>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/70 px-4 py-4 text-sm text-base-content/75">
                  <input
                    type="checkbox"
                    name="showInUI"
                    checked={formValues.showInUI}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-base-300 text-primary focus:ring-primary"
                  />
                  <span>Show this project on UI</span>
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-base-300 bg-base-200/80 px-5 py-3 text-sm font-semibold text-base-content transition-colors hover:bg-base-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <FiLoader className="animate-spin" size={18} />
                  ) : isEditing ? (
                    <FiSave size={18} />
                  ) : (
                    <FiPlus size={18} />
                  )}
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                      ? "Update project"
                      : "Save project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
