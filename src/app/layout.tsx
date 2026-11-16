import type { Metadata } from "next";
import { fontBody, fontDisplay } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Needfire · Monday brief",
  description: "See who's going quiet, why, and what to send them, before standup.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
      Background photo: “Rocky ride.” by Simon Berger (simon from Austria), CC0 1.0,
      via Wikimedia Commons / Flickr:
      https://commons.wikimedia.org/wiki/File:Rocky_ride._-_Flickr_-_simon_berger.jpg
    */
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} h-full tabular-nums`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}