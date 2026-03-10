"use client";
import { useEffect, useState } from "react";

export default function ResumeBtn({ children ,className}: { children: React.ReactNode,className?:string }) {
  const [url, setUrl] = useState();

  const loadResumeUrl = async () => {
    const res = await fetch("/api/admin/resume", { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to load resume data");
    }
    const data = await res.json();
    setUrl(data.resume?.url ?? "");
  };

  useEffect(() => {
    const fun = () => loadResumeUrl();
    fun();
  }, []);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
