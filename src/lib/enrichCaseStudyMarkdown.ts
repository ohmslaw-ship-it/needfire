import { CASE_STUDY_SHOTS } from "./caseStudyAssets";

export function enrichCaseStudyMarkdown(
  source: string,
  availability: Record<string, boolean>,
): string {
  const lines = source.split(/\r?\n/);
  const out: string[] = [];
  let inProduct = false;
  const queue = [...CASE_STUDY_SHOTS];

  for (const line of lines) {
    out.push(line);
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    if (!h2) continue;

    const title = h2[1];
    if (/what['']s in the product/i.test(title)) {
      inProduct = true;
      continue;
    }

    if (!inProduct || queue.length === 0) continue;

    const shot =
      CASE_STUDY_SHOTS.find((s) => title.toLowerCase().includes(s.slug)) ?? queue.shift();
    if (!shot || !availability[shot.file]) continue;

    const idx = queue.findIndex((s) => s.slug === shot.slug);
    if (idx >= 0) queue.splice(idx, 1);

    out.push(`\n![${shot.caption}](case-shot://${shot.file})\n`);
  }

  return out.join("\n");
}