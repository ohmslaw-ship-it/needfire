import type { Metadata } from "next";
import { BriefScreen } from "@/components/BriefScreen";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Brief · Needfire" },
  description: siteDescription,
  openGraph: {
    title: "Brief · Needfire",
    description: siteDescription,
  },
};

export default function Home() {
  return <BriefScreen />;
}