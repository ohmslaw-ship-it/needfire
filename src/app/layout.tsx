import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { fontBody, fontDisplay } from "@/lib/fonts";
import { siteDescription, siteOgImage, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Needfire · A Monday brief for SaaS founders",
    template: "%s · Needfire",
  },
  description: siteDescription,
  openGraph: {
    title: "Needfire",
    description: siteDescription,
    type: "website",
    url: siteUrl,
    images: [{ url: siteOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    description: siteDescription,
    images: [siteOgImage],
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