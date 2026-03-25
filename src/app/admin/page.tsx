import { Metadata } from "next";
import AdminDashboardPageClient from "./AdminDashboardPageClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Overview of projects, notes, and inbox for admin management.",
};

export default function Page() {
  return <AdminDashboardPageClient />;
}
