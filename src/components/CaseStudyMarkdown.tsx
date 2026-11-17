import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import type { getCaseStudyShotAvailability } from "@/lib/caseStudyAssets";
import { CaseStudyFigure } from "./CaseStudyFigure";

type Availability = ReturnType<typeof getCaseStudyShotAvailability>;

function buildComponents(availability: Availability): Components {
  return {
    h1: ({ children }) => (
      <h1 className="mb-2 font-display text-[48px] font-normal leading-[1.12] tracking-[-0.02em] text-ink [font-variation-settings:'SOFT'_100,'opsz'_48]">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="nf-case-study-h2 font-display text-[26px] font-normal leading-[1.25] tracking-[-0.015em] text-ink [font-variation-settings:'SOFT'_100,'opsz'_32]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-[20px] font-normal leading-[1.3] tracking-[-0.01em] text-ink">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-5 text-[17px] leading-[1.7] text-ink-2">{children}</p>
    ),
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    ul: ({ children }) => (
      <ul className="my-5 list-disc space-y-2.5 pl-[1.15rem] text-[17px] leading-[1.7] text-ink-2 marker:text-ink-3">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-5 list-decimal space-y-2.5 pl-[1.15rem] text-[17px] leading-[1.7] text-ink-2 marker:text-ink-3">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-0.5">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="font-medium text-ink-2 underline decoration-ember decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-ink"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-10 border-0 border-t border-line" />,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-line pl-5 text-[17px] leading-[1.7] text-ink-2">
        {children}
      </blockquote>
    ),
    img: ({ src, alt }) => {
      const url = typeof src === "string" ? src : "";
      if (!url.startsWith("case-shot://")) return null;
      const file = url.replace("case-shot://", "");
      return (
        <CaseStudyFigure
          src={`/case/${file}`}
          caption={alt ?? ""}
          available={availability[file] ?? false}
        />
      );
    },
  };
}

type CaseStudyMarkdownProps = {
  source: string;
  availability: Availability;
};

export function CaseStudyMarkdown({ source, availability }: CaseStudyMarkdownProps) {
  const components = buildComponents(availability);
  const trimmed = source.trim();

  if (!trimmed) {
    return (
      <p className="text-[17px] leading-[1.7] text-ink-3">Case study content is not available yet.</p>
    );
  }

  return (
    <article className="nf-case-study pb-4">
      <ReactMarkdown
        components={components}
        urlTransform={(url) => url}
      >
        {trimmed}
      </ReactMarkdown>
    </article>
  );
}