import type { Metadata } from "next";
import { BriefScreen } from "@/components/BriefScreen";
import { siteDescription, siteOgImage, siteUrl } from "@/lib/site";

const homeTitle = "Needfire · A Monday brief for SaaS founders";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: siteDescription,
  openGraph: {
    title: homeTitle,
    description: siteDescription,
    type: "website",
    url: siteUrl,
    images: [{ url: siteOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: siteDescription,
    images: [siteOgImage],
  },
};

export default function Home() {
  return <BriefScreen />;
}