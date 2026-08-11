const cols = [
  {
    items: [
      { label: "Home", href: "#hero", active: true },
      { label: "About", href: "#about" },
      { label: "Book a Service", href: "#book" },
      { label: "Blog", href: "#insights" },
    ],
  },
  {
    items: [
      { label: "Terms & Conditions", href: "#terms" },
      { label: "Refund Policy", href: "#refund" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Accessibility Statement", href: "#a11y" },
    ],
  },
  {
    items: [
      { label: "Facebook", href: "#fb" },
      { label: "LinkedIn", href: "#li" },
      { label: "X", href: "#x" },
    ],
  },
];

/**
 * '허니펀치 참고' 템플릿의 home/components/Footer.tsx 를 그대로 옮긴 섹션.
 * 원본 배경 이미지(readdy.ai)가 302로 응답해 로컬 SVG로 대체한 것 외에는 원본 유지.
 */
export default function TemplateBrandFooter() {
  return (
    <section className="relative w-full bg-blue-50/40 pt-20 md:pt-28 pb-12 overflow-hidden">
      <div className="px-6 md:px-16 lg:px-28">
        {/* Brand Card */}
        <div className="relative w-full rounded-[28px] overflow-hidden mb-16 md:mb-20">
          <div className="relative w-full aspect-[16/7] md:aspect-[16/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/template-brand-banner.svg"
              alt="Be.Guardit brand banner"
              title="Be.Guardit — calm intelligence layer"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            {/* Soft blue wash for cohesion */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-white/10 to-sky-200/40"></div>

            {/* Brand title bottom-left */}
            <h2 className="font-serif absolute bottom-6 md:bottom-10 left-6 md:left-12 text-[2.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] font-light text-slate-900 tracking-tight select-none">
              Be<span className="text-blue-600">.</span>Guardit
            </h2>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8 text-[14px] text-slate-700">
          {cols.map((col, i) => (
            <ul key={i} className="flex flex-col gap-3">
              {col.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    className={`cursor-pointer transition-colors hover:text-blue-700 whitespace-nowrap ${
                      "active" in it && it.active ? "text-blue-700 font-medium" : ""
                    }`}
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          ))}

          {/* Address */}
          <div className="flex flex-col gap-2 text-slate-700">
            <p className="leading-[1.7] text-[14px]">
              500 Terry Francine St.
              <br />
              San Francisco, CA
              <br />
              94158
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 text-slate-700">
            <a
              href="mailto:info@beguardit.com"
              className="text-[14px] hover:text-blue-700 cursor-pointer whitespace-nowrap transition-colors"
            >
              info@beguardit.com
            </a>
            <a
              href="tel:+11234567890"
              className="text-[14px] hover:text-blue-700 cursor-pointer whitespace-nowrap transition-colors"
            >
              123-456-7890
            </a>
            <p className="text-[11px] tracking-[0.05em] text-slate-500 mt-4 leading-[1.7]">
              © 2035 by Be.Guardit.
              <br />
              Calm intelligence, by design.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
