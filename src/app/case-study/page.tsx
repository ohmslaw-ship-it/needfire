import type { Metadata } from "next";
import { CaseStudyScreen } from "@/components/CaseStudyScreen";
import { siteDescription, siteOgImage, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case study",
  description: siteDescription,
  openGraph: {
    title: "Case study · Needfire",
    description: siteDescription,
    type: "website",
    url: `${siteUrl}case-study`,
    images: [{ url: siteOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    description: siteDescription,
    images: [siteOgImage],
  },
};

export default function CaseStudyPage() {
  return <CaseStudyScreen />;
}