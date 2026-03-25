"use client";

import { formatDate } from "@/lib/formatDate";
import { useState } from "react";
import Image from "next/image";
import {
  FiCheck,
  FiCopy,
  FiExternalLink,
  FiFileText,
  FiImage,
  FiX,
} from "react-icons/fi";
import Linkify from "react-linkify";

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

export default function ShowNoteModal({
  note,
  closeModal,
}: {
  note: NoteRecord;
  closeModal: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(note.details || "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <button
        type="button"
        onClick={closeModal}
        aria-label="Close note preview"
        className="absolute inset-0"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-base-300/80 bg-base-100/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-base-100/40 sm:p-8">
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close note preview"
          className="absolute right-4 top-4 inline-flex rounded-full border border-base-300 bg-base-200 p-2 text-base-content/70 transition-colors hover:border-base-content/30 hover:bg-base-300 hover:text-base-content"
        >
          <FiX size={18} />
        </button>
        <Linkify>
          <div className="space-y-4 linkify">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                {note.category}
              </span>

              {note.images.length > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-3 py-1 text-sky-600">
                  <FiImage size={12} />
                  {note.images.length} image{note.images.length > 1 ? "s" : ""}
                </span>
              ) : null}
              {note.file?.url ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-amber-600">
                  <FiFileText size={12} />
                  file
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy note details"
                className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200/70 px-3 py-1 text-base-content/75 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-base-content">
              {note.title}
            </h2>

            <p className="text-sm leading-7 text-base-content/80 whitespace-pre-wrap">
              {note.details}
            </p>

            {note.images.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-base-content/70">
                  Images
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {note.images.map((img, index) => (
                    <a
                      key={img}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-xl border border-base-300 bg-base-200/60"
                    >
                      <Image
                        src={img}
                        alt={`${note.title} image ${index + 1}`}
                        width={220}
                        height={220}
                        className="h-28 w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {note.file?.url ? (
              <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                <a
                  href={note.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <FiExternalLink size={14} />
                  {note.file.filename || "Open attached file"}
                </a>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between border-t border-base-300/80 pt-4 text-xs text-base-content/60">
              <span>Created: {formatDate(note.createdAt)}</span>
              <span>
                Updated: {formatDate(note.updatedAt || note.createdAt)}
              </span>
            </div>
          </div>
        </Linkify>
      </div>
    </div>
  );
}
