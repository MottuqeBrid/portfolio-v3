import imgbbImageUpload from "@/lib/imgbbImageUpload";
import { fileUpload } from "@/lib/supabaseFileUpload";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

type NoteCategory = "text" | "image" | "file" | "other";
type NoteRecord = {
  _id: string;
  title: string;
  details: string;
  images: string[];
  category: NoteCategory;
  file?: {
    url?: string;
    filename?: string;
  };
  createdAt: string;
  updatedAt: string;
};

type NoteFormValues = {
  title: string;
  details: string;
  category: NoteCategory;
  images: string[];
  fileUrl: string;
  fileName: string;
};

const initialFormValues: NoteFormValues = {
  title: "",
  details: "",
  category: "text",
  images: [],
  fileUrl: "",
  fileName: "",
};

function toFormValues(note?: NoteRecord | null): NoteFormValues {
  if (!note) {
    return initialFormValues;
  }

  return {
    title: note.title,
    details: note.details,
    category: note.category,
    images: [...note.images],
    fileUrl: note.file?.url ?? "",
    fileName: note.file?.filename ?? "",
  };
}

export default function NoteModal({
  note,
  onSaved,
  closeModal,
}: {
  note: NoteRecord | null;
  onSaved: (note: NoteRecord) => void;
  closeModal: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<NoteFormValues>(
    toFormValues(note),
  );

  const isEditing = useMemo(() => Boolean(note?._id), [note]);

  useEffect(() => {
    setFormValues(toFormValues(note));
  }, [note]);

  async function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = event.target;
    if (name === "images" && type === "file") {
      const toastId = toast.loading("Uploading image...");
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = await imgbbImageUpload(file);

        setFormValues((current) => ({
          ...current,
          images: [...current.images, url],
        }));
      }
      toast.dismiss(toastId);
    } else if (name === "fileUrl" && type === "file") {
      const file = (event.target as HTMLInputElement).files?.[0];
      const toastId = toast.loading("Uploading file...");
      if (file) {
        const url = await fileUpload(file);
        setFormValues((current) => ({
          ...current,
          fileUrl: url ?? "",
          fileName: file.name,
        }));
      }
      toast.dismiss(toastId);
    } else {
      setFormValues((current) => ({
        ...current,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      id: note?._id,
      title: formValues.title.trim(),
      details: formValues.details.trim(),
      category: formValues.category,
      images: formValues.images,
      file: {
        url: formValues.fileUrl.trim(),
        filename: formValues.fileName.trim(),
      },
    };

    const toastId = toast.loading(
      isEditing ? "Updating note..." : "Saving note...",
    );
    try {
      const res = await fetch("/api/notes", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? "Failed to save note");
      }

      onSaved(data.note);
      toast.dismiss(toastId);
      toast.success(
        isEditing ? "Note updated successfully" : "Note created successfully",
      );
      closeModal();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        error instanceof Error ? error.message : "Failed to save note",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleImageRemove = (img: string) => {
    setFormValues((current) => ({
      ...current,
      images: current.images.filter((i) => i !== img),
    }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <button
        type="button"
        onClick={closeModal}
        aria-label="Close modal backdrop"
        className="absolute inset-0"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-base-300/80 bg-base-100/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-base-100/40 sm:p-8">
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close add note modal"
          className="absolute right-4 top-4 inline-flex rounded-full border border-base-300 bg-base-200 p-2 text-base-content/70 transition-colors hover:border-base-content/30 hover:bg-base-300 hover:text-base-content"
        >
          <FiX size={18} />
        </button>

        <h2 className="text-3xl font-bold tracking-tight text-base-content">
          {isEditing ? "Edit note" : "Add note"}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-base-content/70">
          {isEditing
            ? "Update existing note fields and save changes."
            : "Create a note with `title`, `details`, `category`, optional `images`, and optional `file` fields."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="space-y-2 text-sm text-base-content/75">
            <span className="font-medium text-base-content">Title</span>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
              placeholder="Note title"
              className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content shadow-sm placeholder:text-base-content/40 transition focus:border-primary focus:bg-base-100 focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2 text-sm text-base-content/75">
            <span className="font-medium text-base-content">Details</span>
            <textarea
              name="details"
              value={formValues.details}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Write the note details"
              className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content shadow-sm placeholder:text-base-content/40 transition focus:border-primary focus:bg-base-100 focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="space-y-2 text-sm text-base-content/75">
            <span className="font-medium text-base-content">Category</span>
            <select
              name="category"
              value={formValues.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-base-300 bg-base-200/70 px-4 py-3 text-base-content shadow-sm transition focus:border-primary focus:bg-base-100 focus:ring-2 focus:ring-primary/20"
            >
              <option value="text">text</option>
              <option value="image">image</option>
              <option value="file">file</option>
              <option value="other">other</option>
            </select>
          </label>
          {formValues.category === "other" ? (
            <div className="mt-2 w-full space-y-4 rounded-2xl border border-base-300/80 bg-base-200/40 p-4">
              <div className="w-full">
                <span className="font-medium text-base-content">Image</span>
                <input
                  type="file"
                  name="images"
                  className="mt-2 w-full cursor-pointer rounded-xl border border-dashed border-base-300 bg-base-100 px-3 py-3 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary hover:border-primary/35"
                  onChange={handleChange}
                />
                <div className="grid gap-4 pt-4 grid-cols-2 sm:grid-cols-3">
                  {/* {JSON.stringify(formValues.images)} */}
                  {formValues?.images?.map((img, index) => (
                    <div key={index} className="w-full relative">
                      <Image
                        src={img.trim()}
                        width={200}
                        height={200}
                        alt={`Note image ${index + 1}`}
                        className="mt-2 max-h-48 rounded-lg object-cover w-full border border-base-300 h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(img)}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">File</span>
                  <input
                    type="file"
                    name="fileUrl"
                    onChange={handleChange}
                    className="w-full cursor-pointer rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-base-content shadow-sm transition file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-base-content/75">
                  <span className="font-medium text-base-content">
                    Filename
                  </span>
                  <input
                    type="text"
                    name="fileName"
                    value={formValues.fileName}
                    onChange={handleChange}
                    placeholder="example.pdf"
                    className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-base-content shadow-sm placeholder:text-base-content/40 transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>
            </div>
          ) : null}
          {formValues.category === "image" ? (
            <div className="mt-2 w-full rounded-2xl border border-base-300/80 bg-base-200/40 p-4">
              <span className="font-medium text-base-content">
                Upload Images
              </span>
              <input
                type="file"
                name="images"
                className="mt-2 w-full cursor-pointer rounded-xl border border-dashed border-base-300 bg-base-100 px-3 py-3 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary hover:border-primary/35"
                onChange={handleChange}
              />
              <div className="grid gap-4 pt-4 grid-cols-2 sm:grid-cols-3">
                {/* {JSON.stringify(formValues.images)} */}
                {formValues?.images?.map((img, index) => (
                  <div key={index} className="w-full relative">
                    <Image
                      src={img.trim()}
                      width={200}
                      height={200}
                      alt={`Note image ${index + 1}`}
                      className="mt-2 max-h-48 rounded-lg object-cover w-full border border-base-300 h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(img)}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {formValues.category === "file" && (
            <div className="mt-2 grid gap-4 rounded-2xl border border-base-300/80 bg-base-200/40 p-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-base-content/75">
                <span className="font-medium text-base-content">File</span>
                <input
                  type="file"
                  name="fileUrl"
                  onChange={handleChange}
                  className="w-full cursor-pointer rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-base-content shadow-sm transition file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="space-y-2 text-sm text-base-content/75">
                <span className="font-medium text-base-content">Filename</span>
                <input
                  type="text"
                  name="fileName"
                  value={formValues.fileName}
                  onChange={handleChange}
                  placeholder="example.pdf"
                  className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-base-content shadow-sm placeholder:text-base-content/40 transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-base-300/80 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-content shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiSave size={16} />
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                  ? "Update note"
                  : "Save note"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close add note modal"
              className="inline-flex items-center justify-center gap-1 rounded-full border border-base-300 bg-base-200 px-4 py-2 font-semibold text-base-content transition-transform hover:-translate-y-0.5 hover:border-base-content/30 hover:bg-base-300"
            >
              <FiX size={18} /> <span>Close</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
