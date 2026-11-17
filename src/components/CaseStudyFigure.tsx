import Image from "next/image";

type CaseStudyFigureProps = {
  src: string;
  caption: string;
  available: boolean;
};

export function CaseStudyFigure({ src, caption, available }: CaseStudyFigureProps) {
  if (!available) return null;

  return (
    <figure className="nf-case-study-figure mb-10">
      <div className="overflow-hidden rounded-[12px] border border-line bg-card shadow-[0_1px_2px_rgba(22,24,29,0.04),0_12px_32px_-12px_rgba(22,24,29,0.10)]">
        <Image
          src={src}
          alt={caption}
          width={1360}
          height={860}
          className="h-auto w-full"
          sizes="(max-width: 680px) 100vw, 680px"
        />
      </div>
      <figcaption className="mt-2.5 font-sans text-[14px] leading-[1.5] text-ink-3">
        {caption}
      </figcaption>
    </figure>
  );
}