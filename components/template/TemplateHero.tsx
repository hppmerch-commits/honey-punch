"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DemoDialog from "./DemoDialog";
import { AddLine, ArrowDownLine, ArrowRightLine } from "./icons";

// WebGL 캔버스라 서버 렌더링을 건너뛴다.
const Dither = dynamic(() => import("./Dither/Dither"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-blue-100/40" />,
});

/**
 * '허니펀치 참고' 템플릿의 home/components/Hero.tsx 를 그대로 옮긴 섹션.
 * 문구·레이아웃은 원본 유지. 변형은 이후 단계에서 진행한다.
 */
export default function TemplateHero() {
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <section
      id="hero"
      className="relative w-full bg-white overflow-hidden pt-[72px] md:pt-[86px] lg:pt-[100px] pb-8 md:pb-11"
    >
      <div className="px-6 md:px-16 lg:px-28">
        {/* TOP ROW: Scroll Down (left) + Brand title (right) */}
        <div className="flex items-end justify-between gap-6 mb-5 md:mb-6 lg:mb-7">
          {/* Scroll Down */}
          <div className="hidden md:flex items-center gap-3 pb-4">
            <span className="text-[11px] tracking-[0.3em] text-slate-600 font-mono uppercase">
              Scroll Down
            </span>
            <span className="block h-px w-12 lg:w-16 bg-slate-500/60"></span>
            <ArrowDownLine className="w-4 h-4 text-slate-600 animate-bounce" />
          </div>

          {/* Brand title */}
          <h1 className="font-serif text-[3.5rem] md:text-[5rem] lg:text-[6.25rem] xl:text-[7.25rem] font-light tracking-tight text-slate-900 leading-[0.9] select-none whitespace-nowrap text-right ml-auto">
            Nexus<span className="text-blue-600">.</span>OS
          </h1>
        </div>

        {/* MAIN CARD */}
        <div className="relative w-full h-[600px] md:h-[660px] lg:h-[720px] rounded-[36px] overflow-hidden bg-blue-100/40">
          {/* Dither animated background */}
          <div className="absolute inset-0 z-0">
            <Dither
              waveColor={[0.35, 0.55, 1.0]}
              disableAnimation={false}
              enableMouseInteraction
              mouseRadius={0.6}
              colorNum={4}
              waveAmplitude={0.32}
              waveFrequency={3.0}
              waveSpeed={0.045}
            />
          </div>

          {/* Strong white wash on the LEFT side for text readability */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/85 via-white/45 to-white/5 pointer-events-none"></div>

          {/* Notch cutouts */}
          <span className="absolute top-0 left-0 w-36 md:w-48 lg:w-56 h-16 md:h-20 lg:h-24 bg-white z-[2] rounded-br-[40px]"></span>
          <span className="absolute bottom-0 right-0 w-36 md:w-48 lg:w-56 h-16 md:h-20 lg:h-24 bg-white z-[2] rounded-tl-[40px]"></span>

          {/* TOP-LEFT notch decoration */}
          <div className="absolute top-0 left-0 w-36 md:w-48 lg:w-56 h-16 md:h-20 lg:h-24 z-[3] pointer-events-none">
            <div className="absolute top-4 md:top-5 lg:top-6 left-6 md:left-8 flex items-center gap-2.5">
              <span className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-slate-900 flex items-center justify-center">
                <span className="w-2 h-2 rounded-sm bg-white"></span>
              </span>
              <span className="flex items-end gap-[3px] h-7 md:h-8">
                <span className="w-[3px] h-3 bg-slate-900 rounded-sm"></span>
                <span className="w-[3px] h-5 bg-slate-900 rounded-sm"></span>
                <span className="w-[3px] h-2 bg-slate-900 rounded-sm"></span>
                <span className="w-[3px] h-6 md:h-7 bg-blue-600 rounded-sm"></span>
                <span className="w-[3px] h-4 bg-slate-900 rounded-sm"></span>
              </span>
              <span className="flex items-center gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              </span>
            </div>
            <span className="absolute bottom-2.5 md:bottom-3 left-6 md:left-8 text-[9px] tracking-[0.35em] text-slate-500 font-mono uppercase">
              NX · 001
            </span>
          </div>

          {/* BOTTOM-RIGHT notch decoration */}
          <div className="absolute bottom-0 right-0 w-36 md:w-48 lg:w-56 h-16 md:h-20 lg:h-24 z-[3] pointer-events-none">
            <span className="absolute top-2.5 md:top-3 right-6 md:right-8 text-[9px] tracking-[0.35em] text-slate-500 font-mono uppercase">
              REL · Q2/26
            </span>
            <div className="absolute bottom-4 md:bottom-5 lg:bottom-6 right-6 md:right-8 flex items-center gap-2.5">
              <span className="grid grid-cols-3 gap-[3px]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === 4
                        ? "bg-blue-600"
                        : i % 2 === 0
                          ? "bg-slate-900"
                          : "bg-slate-300"
                    }`}
                  ></span>
                ))}
              </span>
              <span className="flex flex-col gap-[3px]">
                <span className="block h-[3px] w-10 bg-slate-900 rounded-sm"></span>
                <span className="block h-[3px] w-6 bg-slate-400 rounded-sm"></span>
                <span className="block h-[3px] w-8 bg-slate-900 rounded-sm"></span>
                <span className="block h-[3px] w-4 bg-blue-600 rounded-sm"></span>
              </span>
              <span className="relative w-7 h-7 md:w-8 md:h-8 rounded-md bg-slate-900 flex items-center justify-center">
                <AddLine className="w-4 h-4 text-white" />
              </span>
            </div>
          </div>

          {/* Left-aligned content — vertically centered */}
          <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-14 lg:left-20 z-10 max-w-[560px]">
            {/* Small eyebrow — same system as other sections */}
            <p className="text-[11px] tracking-[0.3em] uppercase text-blue-700 font-mono mb-5 md:mb-6">
              <span className="inline-block w-6 h-px bg-blue-700/70 align-middle mr-3"></span>
              Intelligence Layer
            </p>

            {/* Slogan — unified serif (Cormorant Garamond), bold to match subpage titles */}
            <p className="font-serif text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] leading-[1.15] text-slate-950 font-bold tracking-tight">
              Your Journey to a Digital Future.
              <br />
              Our Intelligence Layer,
              <br />
              Tailored to Your Needs.
            </p>

            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="group mt-8 md:mt-10 inline-flex items-center gap-3 cursor-pointer pointer-events-auto"
            >
              <span className="w-12 h-12 rounded-full border border-slate-900 flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:scale-110">
                <ArrowRightLine className="w-5 h-5 text-slate-900 group-hover:text-white transition-colors" />
              </span>
              <span className="text-[15px] text-slate-900 tracking-wide group-hover:translate-x-1 transition-transform">
                Book a Demo
              </span>
            </button>
          </div>
        </div>
      </div>

      <DemoDialog open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
