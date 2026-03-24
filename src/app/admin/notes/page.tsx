"use client";

import { formatDate } from "@/lib/formatDate";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiEye,
  FiFileText,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import NoteModal from "./noteModal";
import Image from "next/image";
import ShowNoteModal from "./ShowNoteModal";

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

export default function Page() {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteRecord | null>(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [showNote, setShowNote] = useState<NoteRecord | null>(null);

  const totalNotes = notes.length;
  const withImagesCount = useMemo(
    () => notes.filter((note) => note.images.length > 0).length,
    [notes],
  );
  const withFilesCount = useMemo(
    () => notes.filter((note) => Boolean(note.file?.url)).length,
    [notes],
  );

  async function loadNotes() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notes", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data: NoteRecord[] = await res.json();

      startTransition(() => {
        setNotes(data);
        setErrorMessage(null);
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch notes",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadNotes();
  }, []);

  function openCreateModal() {
    setSelectedNote(null);
    setIsModalOpen(true);
  }

  function openEditModal(note: NoteRecord) {
    setSelectedNote(note);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedNote(null);
  }

  function openShowModal(note: NoteRecord) {
    setShowNote(note);
    setIsShowModalOpen(true);
  }

  function closeShowModal() {
    setShowNote(null);
    setIsShowModalOpen(false);
  }

  function handleSaved(savedNote: NoteRecord) {
    setNotes((current) => {
      const existingIndex = current.findIndex(
        (item) => item._id === savedNote._id,
      );

      if (existingIndex === -1) {
        return [savedNote, ...current];
      }

      const next = [...current];
      next[existingIndex] = savedNote;
      return next;
    });

    closeModal();
  }

  async function handleDelete(id: string) {
    const isConfirmed = window.confirm(
      "Delete this note permanently? This action cannot be undone.",
    );

    if (!isConfirmed) {
      return;
    }

    const toastId = toast.loading("Deleting note...");

    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? "Failed to delete note");
      }

      setNotes((current) => current.filter((item) => item._id !== id));
      toast.dismiss(toastId);
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete note",
      );
    }
  }

  return (
    <section className="p-4 sm:p-6" aria-labelledby="admin-notes-heading">
      <ToastContainer />
      <div className="relative overflow-hidden border border-base-300/70 bg-base-100/95 p-4 shadow-xl shadow-base-300/20 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,176,198,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(33,29,29,0.1),transparent_35%)]" />

        <div className="relative space-y-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Admin notes
              </span>
              <h1
                id="admin-notes-heading"
                className="text-3xl font-bold leading-tight tracking-tight text-base-content sm:text-4xl"
              >
                Notes board
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-base-content/70 sm:text-base">
                Manage text, images, and file reference notes with quick add and
                edit workflows.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void loadNotes()}
                className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-4 py-2 text-sm font-semibold hover:bg-base-300"
              >
                <FiRefreshCw size={16} />
                Refresh
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5"
              >
                <FiPlus size={16} />
                Add note
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-base-300 bg-base-200/70 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Total notes
              </p>
              <p className="mt-3 text-3xl font-bold text-base-content">
                {totalNotes}
              </p>
            </div>
            <div className="rounded-3xl border border-base-300 bg-base-200/70 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                With images
              </p>
              <p className="mt-3 text-3xl font-bold text-base-content">
                {withImagesCount}
              </p>
            </div>
            <div className="rounded-3xl border border-base-300 bg-base-200/70 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                With files
              </p>
              <p className="mt-3 text-3xl font-bold text-base-content">
                {withFilesCount}
              </p>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-3xl border border-error/30 bg-error/10 px-5 py-4 text-sm text-error">
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
          ) : notes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-base-300 bg-base-200/40 px-6 py-10 text-center">
              <p className="text-lg font-semibold text-base-content">
                No notes yet
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                Create your first note using the Add note button.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {notes.map((note) => (
                <article
                  key={note._id}
                  className="rounded-3xl border border-base-300 bg-base-100/85 p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                      {note.category}
                    </span>
                    {note.images.length > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-3 py-1 text-sky-600">
                        <FiImage size={12} />
                        {note.images.length} image
                        {note.images.length > 1 ? "s" : ""}
                      </span>
                    ) : null}
                    {note.file?.url ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-amber-600">
                        <FiFileText size={12} />
                        file
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-base-content">
                    {note.title}
                  </h2>
                  <p
                    style={{ whiteSpace: "pre-wrap" }}
                    className="mt-3 text-sm leading-7 text-base-content/75 sm:text-base"
                  >
                    {note.details?.slice(0, 200)}
                  </p>

                  {note.images.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {note.images?.map((image) => (
                        <a
                          key={image}
                          href={image}
                          target="_blank"
                          download={image}
                          rel="noopener noreferrer"
                          className="truncate rounded-xl border border-base-300 bg-base-200/70 px-3 py-2"
                        >
                          <Image
                            width={60}
                            height={60}
                            src={image}
                            alt={note.title}
                            className="h-12 w-12 rounded object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {note.file?.url ? (
                    <a
                      href={note.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-xs font-semibold text-base-content/75 hover:text-primary"
                    >
                      <FiFileText size={12} />
                      {note.file.filename || "Attached file"}
                    </a>
                  ) : null}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-base-content/60">
                      Updated {formatDate(note.updatedAt || note.createdAt)}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openShowModal(note)}
                        className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-xs font-semibold text-base-content/80 hover:border-primary/40 hover:text-primary"
                      >
                        <FiEye size={12} />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(note)}
                        className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-xs font-semibold text-base-content/80 hover:border-primary/40 hover:text-primary"
                      >
                        <FiEdit2 size={12} />
                        Edit note
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(note._id)}
                        className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600"
                      >
                        <FiTrash2 size={12} />
                        Delete
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
        <NoteModal
          closeModal={closeModal}
          note={selectedNote}
          onSaved={handleSaved}
        />
      ) : null}

      {isShowModalOpen && showNote ? (
        <ShowNoteModal note={showNote} closeModal={closeShowModal} />
      ) : null}
    </section>
  );
}
