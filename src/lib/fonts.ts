import { Fraunces, Figtree } from "next/font/google";

export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "variable",
  axes: ["opsz", "SOFT"],
});

export const fontBody = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});