import type { Metadata } from "next";
import { AccountsScreen } from "@/components/AccountsScreen";
import { siteDescription, siteOgImage, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accounts",
  description: siteDescription,
  openGraph: {
    title: "Accounts · Needfire",
    description: siteDescription,
    type: "website",
    url: `${siteUrl}accounts`,
    images: [{ url: siteOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    description: siteDescription,
    images: [siteOgImage],
  },
};

export default function AccountsPage() {
  return <AccountsScreen />;
}