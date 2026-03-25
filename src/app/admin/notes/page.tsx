import { Metadata } from "next";
import AdminNotesPageClient from "./AdminNotesPageClient";

export const metadata: Metadata = {
  title: "Admin Notes - Manage your notes with ease",
  description:
    "Admin interface for managing notes with text, images, and file references. Create, edit, and organize your notes efficiently.",
};

export default function Page() {
  return <AdminNotesPageClient />;
}
