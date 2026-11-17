import fs from "node:fs";
import path from "node:path";

export const CASE_STUDY_SHOTS = [
  { slug: "brief", file: "brief.png", caption: "The Monday brief" },
  {
    slug: "accounts",
    file: "accounts.png",
    caption: "Accounts with the drawer open",
  },
  {
    slug: "settings",
    file: "settings.png",
    caption: "Settings: scoring rules that drive the scores",
  },
] as const;

export function getCaseStudyShotAvailability(): Record<string, boolean> {
  const dir = path.join(process.cwd(), "public", "case");
  const out: Record<string, boolean> = {};
  for (const shot of CASE_STUDY_SHOTS) {
    try {
      fs.accessSync(path.join(dir, shot.file), fs.constants.R_OK);
      out[shot.file] = true;
    } catch {
      out[shot.file] = false;
    }
  }
  return out;
}

export function readCaseStudyMarkdown(): string {
  const file = path.join(process.cwd(), "content", "case-study.md");
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}