import { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to access the admin dashboard.",
};

export default function Page() {
  return <LoginPageClient />;
}
