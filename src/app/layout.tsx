import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { fontBody, fontDisplay } from "@/lib/fonts";
import { siteDescription } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Brief · Needfire",
    template: "%s · Needfire",
  },
  description: siteDescription,
  openGraph: {
    title: "Needfire",
    description: siteDescription,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}