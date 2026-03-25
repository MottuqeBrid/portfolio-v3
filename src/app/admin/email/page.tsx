import AdminEmail from "@/_components/Admin/Email/Email";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin email",
  description:
    "Manage email settings, templates, and notifications for the portfolio website.",
};

export default function Page() {
  return <AdminEmail />;
}
