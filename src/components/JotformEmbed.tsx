"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    jotformEmbedHandler?: (selector: string, baseUrl: string) => void;
  }
}

const FORM_ID = "262275494051054";
const READY_FALLBACK_MS = 12000;

export function JotformEmbed() {
  const [ready, setReady] = useState(false);

  const markReady = useCallback(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const fallback = window.setTimeout(markReady, READY_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [markReady]);

  return (
    <div className="jotform-embed-frame" data-ready={ready}>
      <div className="jotform-loader" role="status" aria-live="polite" aria-hidden={ready}>
        <span className="jotform-loader-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="jotform-loader-label">Loading form</span>
      </div>
      <iframe
        id={`JotFormIFrame-${FORM_ID}`}
        title="Roco Installation Request"
        allow="geolocation; microphone; camera; fullscreen; payment"
        src={`https://form.jotform.com/${FORM_ID}`}
        className="block w-full border-0"
        style={{ minWidth: "100%", maxWidth: "100%", height: 539 }}
        scrolling="no"
        onLoad={markReady}
      />
      <Script
        src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.jotformEmbedHandler?.(
            `iframe[id='JotFormIFrame-${FORM_ID}']`,
            "https://form.jotform.com/",
          );
        }}
      />
    </div>
  );
}
