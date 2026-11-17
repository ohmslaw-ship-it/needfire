import type { Metadata } from "next";
import { AccountsScreen } from "@/components/AccountsScreen";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accounts",
  description: siteDescription,
  openGraph: {
    title: "Accounts · Needfire",
    description: siteDescription,
  },
};

export default function AccountsPage() {
  return <AccountsScreen />;
}