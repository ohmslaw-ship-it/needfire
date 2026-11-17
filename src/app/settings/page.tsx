import type { Metadata } from "next";
import { SettingsScreen } from "@/components/SettingsScreen";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "Settings",
  description: siteDescription,
  openGraph: {
    title: "Settings · Needfire",
    description: siteDescription,
  },
};

export default function SettingsPage() {
  return <SettingsScreen />;
}