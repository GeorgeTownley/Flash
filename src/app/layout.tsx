import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flash! - Flashcard Quiz Maker",
  description: "Create and share flashcard quizzes with AI-powered scoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
