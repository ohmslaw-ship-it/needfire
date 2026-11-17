import { CASE_STUDY_SHOTS } from "./caseStudyAssets";

const PRODUCT_SECTION = /what['']s in the product/i;

const PRODUCT_SCREENSHOTS = [
  { paragraphPrefix: "**Brief.**", file: "brief.png" as const },
  { paragraphPrefix: "**Accounts.**", file: "accounts.png" as const },
  { paragraphPrefix: "**Settings.**", file: "settings.png" as const },
] as const;

function h2Title(line: string): string | null {
  const match = /^##\s+(.+?)\s*$/.exec(line);
  if (!match) return null;
  return match[1].replace(/\*\*/g, "").trim();
}

const captionByFile = Object.fromEntries(
  CASE_STUDY_SHOTS.map((shot) => [shot.file, shot.caption]),
) as Record<(typeof CASE_STUDY_SHOTS)[number]["file"], string>;

export function enrichCaseStudyMarkdown(
  source: string,
  availability: Record<string, boolean>,
): string {
  const lines = source.split(/\r?\n/);
  const out: string[] = [];
  let inProduct = false;

  for (const line of lines) {
    out.push(line);

    const title = h2Title(line);
    if (title) {
      if (PRODUCT_SECTION.test(title)) {
        inProduct = true;
      } else if (inProduct) {
        inProduct = false;
      }
      continue;
    }

    if (!inProduct) continue;

    for (const placement of PRODUCT_SCREENSHOTS) {
      if (!line.startsWith(placement.paragraphPrefix)) continue;
      if (!availability[placement.file]) break;

      const caption = captionByFile[placement.file];
      out.push(`\n![${caption}](case-shot://${placement.file})\n`);
      break;
    }
  }

  return out.join("\n");
}