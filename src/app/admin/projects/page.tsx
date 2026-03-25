import { Metadata } from "next";
import AdminProjectsPageClient from "./AdminProjectsPageClient";

export const metadata: Metadata = {
  title: "Admin projects",
  description:
    "Manage portfolio projects, including details, tech stack, and public visibility.",
};

export default function ProjectsPage() {
  return <AdminProjectsPageClient />;
}
