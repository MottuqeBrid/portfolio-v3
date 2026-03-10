"use client";

import { fileUpload } from "@/lib/supabaseFileUpload";
import { ChangeEvent, useEffect, useState } from "react";
import {
  FiExternalLink,
  FiFileText,
  FiRefreshCw,
  FiSave,
  FiUpload,
} from "react-icons/fi";

type ResumeRecord = {
  _id: string;
  key: string;
  url: string;
  filename: string;
  createdAt: string;
  updatedAt: string;
};

type ResumeApiResponse = {
  resume: ResumeRecord | null;
};

export default function ResumeUpdate() {
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const loadResume = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/resume", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Failed to load resume data");
      }

      const data: ResumeApiResponse = await res.json();
      setResume(data.resume);
      setResumeUrl(data.resume?.url ?? "");
      setResumeFileName(data.resume?.filename ?? "");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load resume data",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadResume();
  }, []);

  const handleFilePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      setSuccessMessage("");
      const url = await fileUpload(file);

      if (!url) {
        throw new Error("Failed to upload resume file");
      }

      setResumeUrl(url);
      setResumeFileName(file.name);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload resume file",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const saveResume = async () => {
    if (!resumeUrl.trim()) {
      setErrorMessage("Upload a resume first");
      return;
    }

    if (!resumeFileName.trim()) {
      setErrorMessage("Resume filename is required");
      return;
    }

    try {
      setIsSaving(true);
      setSuccessMessage("");
      const res = await fetch("/api/admin/resume", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: resumeUrl.trim(),
          filename: resumeFileName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? "Failed to save resume");
      }

      setResume(data.resume);
      setSuccessMessage("Resume updated successfully");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save resume",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="rounded-3xl border border-base-300 bg-base-100/85 p-5 shadow-sm xl:col-span-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-base-content">Resume</h2>
        <button
          type="button"
          onClick={() => void loadResume()}
          className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-4 py-2 text-sm font-semibold hover:bg-base-300"
        >
          <FiRefreshCw size={14} />
          Reload
        </button>
      </div>

      <p className="mt-2 text-sm text-base-content/70">
        Upload and publish the latest resume file used across your portfolio.
      </p>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-4 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
        <label className="space-y-2 text-sm text-base-content/75">
          <span className="font-medium text-base-content">Resume file</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFilePick}
            disabled={isUploading || isSaving}
            className="w-full cursor-pointer rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-base-content shadow-sm transition file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <button
          type="button"
          onClick={saveResume}
          disabled={isLoading || isUploading || isSaving}
          className="inline-flex h-fit items-center justify-center gap-2 self-end rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-content transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploading ? <FiUpload size={16} /> : <FiSave size={16} />}
          {isUploading
            ? "Uploading..."
            : isSaving
              ? "Saving..."
              : "Save resume"}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/50 p-4">
        {isLoading ? (
          <p className="text-sm text-base-content/65">
            Loading current resume...
          </p>
        ) : resumeUrl ? (
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-base-content">
              <FiFileText size={16} />
              {resumeFileName || "Resume file"}
            </p>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <FiExternalLink size={14} />
              Open current resume
            </a>
            <p className="text-xs text-base-content/60">
              Last updated:{" "}
              {resume?.updatedAt
                ? new Date(resume.updatedAt).toLocaleString()
                : "-"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-base-content/65">
            No resume saved yet. Upload a file and click Save resume.
          </p>
        )}
      </div>
    </article>
  );
}
