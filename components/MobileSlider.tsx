"use client";

import { Children, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  /** Tailwind grid-klassen vanaf sm: (mobiel is altijd een swipe-slider). */
  gridClassName: string;
  /** Breedte van een slide op mobiel (peek van de volgende). */
  slideBasis?: string;
}

/**
 * Toont de kinderen op mobiel als een horizontale swipe-slider met
 * paginatie-bolletjes, en vanaf sm: als een normaal grid.
 */
export default function MobileSlider({
  children,
  gridClassName,
  slideBasis = "basis-[85%]",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const slides = Children.toArray(children);
  const n = slides.length;

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setActive(max > 4 && n > 1 ? Math.round((el.scrollLeft / max) * (n - 1)) : 0);
  }

  function goTo(i: number) {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: n > 1 ? (max * i) / (n - 1) : 0, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:gap-0 sm:overflow-x-visible ${gridClassName}`}
      >
        {slides.map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${slideBasis} sm:basis-auto sm:shrink`}>
            {child}
          </div>
        ))}
      </div>

      {n > 1 && (
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ga naar item ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === i ? "w-6 bg-[#e8430a]" : "w-2 bg-black/20 hover:bg-black/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
