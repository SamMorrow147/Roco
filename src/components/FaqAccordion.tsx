// Native <details> so every question and answer is in the HTML for
// crawlers and answer engines. No client JS, no hidden-until-click fetch.
// JSON-LD FAQPage on the parent page still mirrors this same copy.

export function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  return (
    <div className="faq-list mt-6 space-y-3">
      {items.map((faq) => (
        <details key={faq.q} className="faq-item group">
          <summary className="faq-summary">
            <h3 className="font-eurostile min-w-0 flex-1 text-left text-lg tracking-[0.04em] text-[#005828] uppercase">
              {faq.q}
            </h3>
            <span className="faq-chevron" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </summary>
          <p className="faq-answer">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
