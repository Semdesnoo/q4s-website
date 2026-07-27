"use client";

import { useEffect, useRef } from "react";

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Zonder site key renderen we geen widget en blijven de formulieren bruikbaar. */
export const TURNSTILE_ENABLED = TURNSTILE_SITE_KEY.length > 0;

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const CALLBACK_NAME = "__q4sTurnstileReady";
const SCRIPT_SRC = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${CALLBACK_NAME}`;

let readyPromise: Promise<void> | null = null;

/** Laadt het Cloudflare-script één keer per pagina, ook als er meerdere widgets zijn. */
function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (readyPromise) return readyPromise;

  readyPromise = new Promise<void>((resolve, reject) => {
    (window as unknown as Record<string, () => void>)[CALLBACK_NAME] = resolve;

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      readyPromise = null;
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });

  return readyPromise;
}

interface Props {
  /** Krijgt het token zodra de bezoeker de check heeft gehaald. */
  onVerify: (token: string) => void;
  /** Token verlopen of widget in fout — het oude token is dan niet meer geldig. */
  onExpire?: () => void;
  locale?: string;
  className?: string;
}

export default function Turnstile({ onVerify, onExpire, locale, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Callbacks via een ref, zodat een nieuwe render de widget niet opnieuw opbouwt.
  const callbacks = useRef({ onVerify, onExpire });
  callbacks.current = { onVerify, onExpire };

  useEffect(() => {
    if (!TURNSTILE_ENABLED) return;

    const container = containerRef.current;
    if (!container) return;

    let widgetId: string | null = null;
    let cancelled = false;

    function render() {
      loadTurnstileScript()
        .then(() => {
          if (cancelled || !window.turnstile || !container) return;
          widgetId = window.turnstile.render(container, {
            sitekey: TURNSTILE_SITE_KEY,
            language: locale ?? "auto",
            theme: "light",
            size: "flexible",
            callback: (token: string) => callbacks.current.onVerify(token),
            "expired-callback": () => callbacks.current.onExpire?.(),
            "timeout-callback": () => callbacks.current.onExpire?.(),
            "error-callback": () => callbacks.current.onExpire?.(),
          });
        })
        .catch((err) => {
          console.error(err);
          callbacks.current.onExpire?.();
        });
    }

    // Turnstile heeft een zichtbare widget nodig. Op /upload-cv staan beide
    // formulieren gemount en is de inactieve tab display:none — daar mag de
    // widget pas opgebouwd worden zodra de bezoeker die tab opent.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        render();
      }
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [locale]);

  if (!TURNSTILE_ENABLED) return null;

  // min-h houdt de ruimte vrij (geen layout shift) en geeft de
  // IntersectionObserver een element met oppervlak om op te meten.
  return <div ref={containerRef} className={`min-h-[65px] ${className ?? ""}`} />;
}
