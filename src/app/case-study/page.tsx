import type { Metadata } from "next";
import { CaseStudyScreen } from "@/components/CaseStudyScreen";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "Case study",
  description: siteDescription,
  openGraph: {
    title: "Case study · Needfire",
    description: siteDescription,
  },
};

export default function CaseStudyPage() {
  return <CaseStudyScreen />;
}