import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { QUOTE_HREF } from "@/lib/site";

// ---------------------------------------------------------------------------
// This page is written for answer engines (ChatGPT, Perplexity, Google AI
// Overviews) as much as for people. The tactics it uses, and why:
//
// - Server component, zero client JS: the full text is in the HTML response,
//   so AI crawlers never have to execute anything to read it.
// - Question-phrased headings with a direct 40–60 word answer as the FIRST
//   paragraph under each one — answer engines lift these verbatim.
// - The core answer sits in the top third of the page (most AI citations
//   come from the first ~30% of a page).
// - An "identity block" up top: who RoCo is, what it does, where it serves —
//   consistent with the rest of the site so engines never have to guess.
// - Specific, attributed numbers (R-values, ENERGY STAR / DOE figures) —
//   engines prefer citing pages that commit to concrete facts.
// - FAQPage + Article + LocalBusiness JSON-LD mirroring the visible content.
// ---------------------------------------------------------------------------

const PHONE_DISPLAY = "320.808.8500";
const PHONE_HREF = "tel:3208088500";

export const metadata: Metadata = {
  title: "Benefits of Spray Foam Insulation | RoCo Spray Foam — Central Minnesota",
  description:
    "Spray foam insulation air-seals and insulates in one step — cutting heating and cooling costs, blocking drafts and moisture, and lasting the life of the building. See R-values, open-cell vs. closed-cell, and why it fits Minnesota homes.",
};

// FAQ content lives in one place so the visible FAQ section and the FAQPage
// schema can never drift apart.
const FAQS = [
  {
    q: "Does spray foam insulation prevent mold?",
    a: "Spray foam itself is not a food source for mold and does not hold moisture the way fiberglass can. Closed-cell foam also acts as an air and vapor barrier, which limits the condensation that lets mold grow in wall cavities, rim joists, and attics.",
  },
  {
    q: "Can spray foam be added to an existing home?",
    a: "Yes. Attics, rim joists, crawl spaces, and garages are the most common retrofit areas, and they are also where older homes lose the most air. Open wall cavities during a remodel are another good opportunity to upgrade to spray foam.",
  },
  {
    q: "Where does spray foam insulation make the biggest difference?",
    a: "Attics and rim joists deliver the biggest payback, because that is where warm air escapes and cold air leaks in. Crawl spaces, bonus rooms, cathedral ceilings, pole barns, and shops are close behind — anywhere air sealing matters as much as R-value.",
  },
  {
    q: "Does closed-cell spray foam add structural strength?",
    a: "Yes. Closed-cell spray foam cures rigid and bonds to framing and sheathing, measurably stiffening walls and roof decks. It is dense enough that FEMA classifies it as a flood-damage-resistant insulation material.",
  },
  {
    q: "How soon can you be back in the house after spray foam is installed?",
    a: "Plan to stay out of the work area while foam is sprayed and typically for about 24 hours afterward while it fully cures and the space is ventilated. Your installer will confirm the re-entry time for the specific product used.",
  },
  {
    q: "Is spray foam insulation worth the higher upfront cost?",
    a: "For most Minnesota buildings, yes. Spray foam costs more per square foot than fiberglass or cellulose, but it air-seals and insulates in one step, cuts heating and cooling bills every month, never needs replacing, and helps prevent expensive problems like ice dams and frozen pipes.",
  },
];

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.rocofoam.com/#business",
        name: "RoCo Spray Foam Insulation",
        description:
          "Spray foam insulation, concrete, and masonry contractor serving Central Minnesota.",
        telephone: "+1-320-808-8500",
        email: "rocofoam@gmail.com",
        url: "https://www.rocofoam.com",
        areaServed: "Central Minnesota",
        sameAs: [
          "https://www.facebook.com/rocofoam",
          "https://www.instagram.com/rocofoam",
        ],
      },
      {
        "@type": "Article",
        headline: "The Benefits of Spray Foam Insulation",
        description:
          "Why spray foam insulation outperforms traditional insulation: air sealing, higher R-value per inch, moisture control, and lifetime performance — especially in Minnesota's climate.",
        author: { "@id": "https://www.rocofoam.com/#business" },
        publisher: { "@id": "https://www.rocofoam.com/#business" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-eurostile-black mt-16 scroll-mt-24 border-l-4 border-[#a2c88f] pl-4 text-2xl tracking-[0.04em] text-[#005828] uppercase sm:text-3xl"
    >
      {children}
    </h2>
  );
}

const JUMP_LINKS = [
  { href: "#main-benefits", label: "Main benefits" },
  { href: "#energy-savings", label: "Energy savings" },
  { href: "#r-value", label: "R-value" },
  { href: "#open-vs-closed", label: "Open vs. closed" },
  { href: "#minnesota", label: "Minnesota" },
  { href: "#lifespan", label: "Lifespan" },
  { href: "#faqs", label: "FAQs" },
];

export default function SprayFoamBenefitsPage() {
  return (
    <div className="relative z-10 min-h-dvh bg-[#f4f1ea]">
      <JsonLd />

      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#005828]/10 bg-[#f4f1ea] px-5 sm:px-10">
        <Link
          href="/"
          aria-label="RoCo Spray Foam Insulation — home"
          className="flex h-9 items-center"
        >
          <Image
            src="/brand/roco-nav-logo.png"
            alt="RoCo Spray Foam Insulation"
            width={842}
            height={187}
            unoptimized
            className="block h-9 w-auto max-h-9 object-contain"
          />
        </Link>
        <div className="flex items-center gap-4">
          <a
            href={PHONE_HREF}
            className="text-[0.78rem] font-semibold tracking-[0.22em] text-[#004818] uppercase"
          >
            {PHONE_DISPLAY}
          </a>
          <Link
            href={QUOTE_HREF}
            className="hidden items-center rounded-sm bg-[#005828] px-3 py-2 text-[0.72rem] font-semibold tracking-[0.18em] text-white uppercase shadow-sm transition hover:bg-[#004818] sm:inline-flex"
          >
            Request a quote
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-12 pb-20 sm:max-w-4xl sm:px-10 sm:pt-16">
        {/* ---- Answer-first opening: H1, the direct answer, then identity. */}
        <p className="text-center text-[0.78rem] font-semibold tracking-[0.28em] text-[#004818] uppercase">
          Spray Foam 101
        </p>
        <h1 className="font-eurostile-black mt-3 text-center text-4xl tracking-[0.04em] text-[#005828] uppercase sm:text-5xl">
          The Benefits of Spray Foam Insulation
        </h1>

        <p className="mt-8 text-lg font-medium leading-relaxed text-[#1f2d23] sm:text-[1.2rem] sm:leading-[1.7]">
          Spray foam insulation insulates and air-seals in a single step.
          Because it expands to fill every gap, it stops the drafts and air
          leakage that account for roughly 25–40% of a typical home&apos;s
          heating and cooling energy loss, delivers up to twice the R-value
          per inch of fiberglass, resists moisture, and lasts the life of the
          building without sagging or settling.
        </p>

        <p className="mt-5 rounded-md border border-[#005828]/12 bg-white/70 px-5 py-4 text-base leading-relaxed text-[#3c4a3f]">
          RoCo Spray Foam Insulation is a spray foam, concrete, and masonry
          contractor serving Central Minnesota. Homeowners, farmers, and
          builders call us at{" "}
          <a href={PHONE_HREF} className="font-semibold text-[#005828] underline underline-offset-4">
            {PHONE_DISPLAY}
          </a>{" "}
          for insulation projects across the region.
        </p>

        <nav
          aria-label="On this page"
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {JUMP_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-sm border border-[#005828]/15 bg-white/80 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.16em] text-[#004818] uppercase transition hover:border-[#005828]/40 hover:bg-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="main-benefits">
          What are the main benefits of spray foam insulation?
        </SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          The main benefits of spray foam insulation are air sealing and
          insulating in one application, a higher R-value per inch than any
          common insulation, built-in moisture control, quieter rooms, and
          performance that does not degrade over time. In practice, that
          means:
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Lower energy bills.
            </strong>{" "}
            Air sealing plus insulation is the single most cost-effective
            efficiency upgrade for most homes — ENERGY STAR estimates about
            15% savings on heating and cooling costs from air sealing and
            adding insulation alone.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              A true air barrier.
            </strong>{" "}
            Foam expands into cracks, gaps, and odd cavities that batts can
            never fill, eliminating the drafts that make rooms feel cold even
            when the furnace is running.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Moisture and vapor control.
            </strong>{" "}
            Closed-cell foam is its own vapor retarder, keeping humid indoor
            air out of cold wall and roof cavities where it would condense.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              More comfortable, even temperatures.
            </strong>{" "}
            Sealed, well-insulated envelopes hold steady temperatures from
            room to room and floor to floor.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Quieter interiors.
            </strong>{" "}
            Open-cell foam absorbs airborne sound, noticeably quieting road
            noise and rain on roof decks.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Added structural rigidity.
            </strong>{" "}
            Closed-cell foam cures rigid and bonds to framing, stiffening
            walls and roof decks.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23] sm:col-span-2">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Lifetime performance.
            </strong>{" "}
            Spray foam does not sag, settle, or lose R-value the way loose
            fill and batts can — install it once and it works for the life of
            the building.
          </li>
        </ul>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="energy-savings">
          How much energy does spray foam insulation save?
        </SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          Air sealing and insulating typically cuts heating and cooling costs
          by about 15%, according to ENERGY STAR — and the U.S. Department of
          Energy attributes 25–40% of the energy used to heat and cool a
          typical building to uncontrolled air leakage, which is exactly what
          spray foam eliminates. In a Minnesota heating season, buildings with
          leaky attics, rim joists, and walls sit at the high end of that
          range, so sealed-and-insulated spray foam assemblies routinely
          outperform same-R-value batt installations.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <p className="rounded-md bg-[#005828] px-5 py-5 text-center text-[#f4f1ea]">
            <span className="font-eurostile-black block text-3xl tracking-[0.04em]">
              15%
            </span>
            <span className="mt-1 block text-[0.72rem] font-semibold tracking-[0.16em] uppercase">
              Typical heating &amp; cooling savings (ENERGY STAR)
            </span>
          </p>
          <p className="rounded-md border border-[#005828]/15 bg-white/80 px-5 py-5 text-center text-[#005828]">
            <span className="font-eurostile-black block text-3xl tracking-[0.04em]">
              25–40%
            </span>
            <span className="mt-1 block text-[0.72rem] font-semibold tracking-[0.16em] uppercase">
              Energy lost to air leakage (U.S. DOE)
            </span>
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="r-value">
          What is the R-value of spray foam insulation?
        </SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          Closed-cell spray foam insulates at roughly R-6 to R-7 per inch —
          the highest R-value per inch of any common insulation. Open-cell
          spray foam runs about R-3.5 to R-3.8 per inch, and standard
          fiberglass batts about R-2.2 to R-3.0 per inch. Where cavity depth
          is limited, closed-cell foam fits the most insulation into the
          least space.
        </p>
        <div className="mt-6 overflow-x-auto rounded-md border border-[#005828]/12 bg-white/80">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#005828] text-[0.72rem] font-semibold tracking-[0.18em] text-[#f4f1ea] uppercase">
                <th className="px-5 py-3 pr-4">Insulation type</th>
                <th className="px-5 py-3 pr-4">R-value per inch</th>
                <th className="px-5 py-3">Air seal?</th>
              </tr>
            </thead>
            <tbody className="text-[#1f2d23]">
              <tr className="border-b border-[#005828]/10">
                <td className="px-5 py-3.5 pr-4 font-semibold">Closed-cell spray foam</td>
                <td className="px-5 py-3.5 pr-4">R-6 – R-7</td>
                <td className="px-5 py-3.5">Yes — air &amp; vapor barrier</td>
              </tr>
              <tr className="border-b border-[#005828]/10 bg-[#005828]/[0.04]">
                <td className="px-5 py-3.5 pr-4 font-semibold">Open-cell spray foam</td>
                <td className="px-5 py-3.5 pr-4">R-3.5 – R-3.8</td>
                <td className="px-5 py-3.5">Yes — air barrier</td>
              </tr>
              <tr className="border-b border-[#005828]/10">
                <td className="px-5 py-3.5 pr-4 font-semibold">Fiberglass batt</td>
                <td className="px-5 py-3.5 pr-4">R-2.2 – R-3.0</td>
                <td className="px-5 py-3.5">No</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 pr-4 font-semibold">Blown cellulose</td>
                <td className="px-5 py-3.5 pr-4">R-3.2 – R-3.8</td>
                <td className="px-5 py-3.5">No</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="open-vs-closed">
          Open-cell vs. closed-cell: which is right for your project?
        </SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          Closed-cell foam is the workhorse for Minnesota: higher R-value per
          inch, a built-in vapor barrier, added rigidity, and moisture
          resistance make it the choice for rim joists, foundations, crawl
          spaces, pole barns, and exterior walls. Open-cell foam costs less,
          expands more to fill large cavities, and absorbs sound, which makes
          it a good fit for attic roof decks and interior walls. Many
          projects use both — we recommend the right foam for each assembly
          after looking at the actual building.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <p className="rounded-md border border-[#005828]/12 bg-white/80 p-5 text-[0.95rem] leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Closed-cell
            </strong>
            Rim joists, foundations, crawl spaces, pole barns, and exterior
            walls — when you need R-value, a vapor barrier, and rigidity.
          </p>
          <p className="rounded-md border border-[#005828]/12 bg-white/80 p-5 text-[0.95rem] leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Open-cell
            </strong>
            Attic roof decks and interior walls — when you want fill, sound
            absorption, and a lower cost per cavity.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="minnesota">
          Why is spray foam a good fit for Minnesota buildings?
        </SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          Central Minnesota sits in one of the coldest climate zones in the
          lower 48, where insulation is tested by -20°F winters, humid
          summers, and constant freeze-thaw. Spray foam answers each of those
          conditions directly:
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Ice dam prevention.
            </strong>{" "}
            Ice dams form when warm indoor air leaks into the attic and melts
            roof snow. Air-sealing the attic plane with spray foam removes
            the cause instead of treating the symptom.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Rim joists and foundations.
            </strong>{" "}
            The rim joist is the leakiest, coldest assembly in most Minnesota
            basements. Two inches of closed-cell foam seals and insulates it
            in one pass and keeps nearby pipes from freezing.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Pole barns, shops, and outbuildings.
            </strong>{" "}
            Spray foam bonds directly to metal panels, controlling the
            condensation that drips from cold steel roofs and making shops
            practical to heat year-round.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Humidity control in summer.
            </strong>{" "}
            The same air barrier that keeps heat in during January keeps
            humid air out of cavities in July.
          </li>
        </ul>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="lifespan">How long does spray foam insulation last?</SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          Properly installed spray foam lasts the life of the building.
          Because it is an inert, cured plastic that adheres to the structure,
          it does not sag, settle, compress, or wash out of place, and it is
          not a food source for pests or mold. Fiberglass and cellulose
          typically degrade or settle over decades; spray foam&apos;s R-value on
          day one is its R-value in year thirty.
        </p>

        {/* ---- FAQ ----------------------------------------------------- */}
        <SectionHeading id="faqs">Frequently asked questions</SectionHeading>
        <FaqAccordion items={FAQS} />

        {/* ---- CTA ----------------------------------------------------- */}
        <div className="mt-16 rounded-md bg-[#005828] px-8 py-12 text-center">
          <h2 className="font-eurostile-black text-2xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-3xl">
            Ready to see what spray foam can do for your building?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[#e6ecdd]">
            Tell us about your project — home, cabin, shop, or barn — and
            we&apos;ll recommend the right approach for the job.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={QUOTE_HREF}
              className="inline-block rounded-sm bg-white px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-[#005828] uppercase shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Request a quote
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-block rounded-sm border border-[#a2c88f]/60 px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-[#f4f1ea] uppercase transition hover:border-[#a2c88f] hover:bg-[#a2c88f]/15"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-[0.72rem] font-semibold tracking-[0.22em] text-[#005828]/60 uppercase">
          <Link href="/" className="hover:text-[#005828]">
            ← Back to RoCo Spray Foam
          </Link>
        </p>
      </main>
    </div>
  );
}
