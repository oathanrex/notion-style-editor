import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notion-Style Editor | Next.js + Tiptap",
  description: "A beautiful Notion-style WYSIWYG editor built with Next.js, Tailwind CSS, and Tiptap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-notion-bg-gray min-h-screen">
        {children}
      </body>
    </html>
  );
}
