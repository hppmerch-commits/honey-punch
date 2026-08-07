import type { LegalDoc } from "@/lib/legal";

export default function LegalDocView({ doc }: { doc: LegalDoc }) {
  return (
    <article className="space-y-7">
      {doc.sections.map((s) => (
        <section key={s.heading}>
          <h3 className="text-[13px] font-medium">{s.heading}</h3>
          <div className="mt-2 space-y-1.5">
            {s.body.map((line, i) => (
              <p
                key={i}
                className="text-[13px] leading-relaxed text-neutral-500"
              >
                {line}
              </p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
