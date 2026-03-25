import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MBS | Coading",
    template: "%s | MBS | Coading",
  },
  description:
    "MBS | Coading is a platform dedicated to providing high-quality coding resources, tutorials, and projects for developers of all skill levels. Whether you're a beginner looking to learn the basics or an experienced coder seeking advanced techniques, MBS | Coading has something for everyone. Our mission is to empower individuals to enhance their coding skills and achieve their programming goals through comprehensive and accessible content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={` ${raleway.variable} antialiased`}>{children}</body>
    </html>
  );
}
