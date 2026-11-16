import type { Metadata } from "next";
import { fontBody, fontDisplay } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Needfire · Monday brief",
  description: "See who's going quiet, why, and what to send them, before standup.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body>{children}</body>
    </html>
  );
}