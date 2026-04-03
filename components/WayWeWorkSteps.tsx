"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList, Users, Presentation, Handshake, HeartHandshake, UserPlus, MessageSquare, Zap, Rocket } from "lucide-react";

const employerIcons = [ClipboardList, Users, Presentation, Handshake, HeartHandshake];
const candidateIcons = [UserPlus, MessageSquare, Zap, Rocket];

interface Step {
  step: string;
  title: string;
  desc: string;
}

function EmployerStep({ s, i }: { s: Step; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const Icon = employerIcons[i] ?? ClipboardList;

  return (
    <div
      ref={ref}
      className="group flex gap-8 py-12 border-b border-black/10 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: `${i * 80}ms`,
      }}
    >
      {/* Icon block */}
      <div className="shrink-0">
        <div className="w-14 h-14 bg-black group-hover:bg-[#e8430a] transition-colors duration-300 flex items-center justify-center">
          <Icon size={22} className="text-white" />
        </div>
      </div>

      {/* Text */}
      <div className="pt-1">
        <h3 className="text-2xl font-black text-black mb-3 tracking-[-0.02em] group-hover:text-black transition-colors duration-300">
          {s.title}
        </h3>
        <p className="text-lg text-black/70 leading-relaxed max-w-2xl">{s.desc}</p>
      </div>
    </div>
  );
}

function CandidateStep({ s, i }: { s: Step; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const Icon = candidateIcons[i] ?? Zap;

  return (
    <div
      ref={ref}
      className="group bg-black hover:bg-white/5 transition-colors duration-300 p-8 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: `${i * 100}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 border border-white/30 group-hover:border-[#e8430a] group-hover:bg-[#e8430a]/15 transition-all duration-300 flex items-center justify-center">
          <Icon size={22} className="text-white group-hover:text-[#e8430a] transition-colors duration-300" />
        </div>
        <span className="text-4xl font-black text-white/40 group-hover:text-[#e8430a] transition-colors duration-300 tracking-tighter leading-none">
          {s.step}
        </span>
      </div>
      <h3 className="text-xl font-black text-white mb-3 tracking-[-0.02em]">{s.title}</h3>
      <p className="text-lg text-white/85 leading-relaxed">{s.desc}</p>
    </div>
  );
}

export function EmployerSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="border-t border-black/10">
      {steps.map((s, i) => (
        <EmployerStep key={i} s={s} i={i} />
      ))}
    </div>
  );
}

export function CandidateSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
      {steps.map((s, i) => (
        <CandidateStep key={i} s={s} i={i} />
      ))}
    </div>
  );
}
