import type { Metadata } from "next";
import { SettingsScreen } from "@/components/SettingsScreen";
import { siteDescription, siteOgImage, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Settings",
  description: siteDescription,
  openGraph: {
    title: "Settings · Needfire",
    description: siteDescription,
    type: "website",
    url: `${siteUrl}settings`,
    images: [{ url: siteOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    description: siteDescription,
    images: [siteOgImage],
  },
};

export default function SettingsPage() {
  return <SettingsScreen />;
}