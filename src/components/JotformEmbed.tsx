"use client";

import Script from "next/script";

declare global {
  interface Window {
    jotformEmbedHandler?: (selector: string, baseUrl: string) => void;
  }
}

const FORM_ID = "262275494051054";

export function JotformEmbed() {
  return (
    <>
      <iframe
        id={`JotFormIFrame-${FORM_ID}`}
        title="Roco Installation Request"
        allow="geolocation; microphone; camera; fullscreen; payment"
        src={`https://form.jotform.com/${FORM_ID}`}
        className="block w-full border-0"
        style={{ minWidth: "100%", maxWidth: "100%", height: 539 }}
        scrolling="no"
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
    </>
  );
}
