"use client";

import { useState, useEffect } from "react";

interface Props {
  candidateLabel: string;
  employerLabel: string;
  candidate: React.ReactNode;
  employer: React.ReactNode;
}

export default function RegisterTabs({
  candidateLabel,
  employerLabel,
  candidate,
  employer,
}: Props) {
  const [tab, setTab] = useState<"candidate" | "employer">("candidate");

  // Open the employer tab directly when linked with #opdrachtgever
  // (e.g. from the "Voor Opdrachtgevers" button in the header).
  useEffect(() => {
    if (window.location.hash === "#opdrachtgever") setTab("employer");
  }, []);

  const tabBtn = (active: boolean) =>
    `flex-1 py-3 px-2 sm:px-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.06em] sm:tracking-[0.12em] leading-tight transition-colors duration-200 ${
      active ? "bg-[#e8430a] text-white" : "bg-transparent text-black/55 hover:text-black"
    }`;

  return (
    <div>
      {/* Toggle */}
      <div className="mb-10 flex w-full max-w-md border border-black/15 bg-black/[0.02] p-1">
        <button type="button" onClick={() => setTab("candidate")} className={tabBtn(tab === "candidate")}>
          {candidateLabel}
        </button>
        <button type="button" onClick={() => setTab("employer")} className={tabBtn(tab === "employer")}>
          {employerLabel}
        </button>
      </div>

      <div className={tab === "candidate" ? "block" : "hidden"}>{candidate}</div>
      <div className={tab === "employer" ? "block" : "hidden"}>{employer}</div>
    </div>
  );
}
