import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { QUOTE_HREF } from "@/lib/site";

// ---------------------------------------------------------------------------
// Companion to /spray-foam-benefits, built on the same answer-engine
// playbook (see the comment there): server-rendered plain HTML, question
// headings answered directly in the first paragraph, the core answer in the
// top third, an identity block, concrete attributed facts, and JSON-LD
// (Service + Article + FAQPage) that mirrors the visible content and shares
// the site-wide business @id.
// ---------------------------------------------------------------------------

const PHONE_DISPLAY = "320.808.8500";
const PHONE_HREF = "tel:3208088500";
const BUSINESS_ID = "https://www.rocofoam.com/#business";

export const metadata: Metadata = {
  title: "Concrete & Masonry Services in Central Minnesota | RoCo",
  description:
    "Concrete driveways, foundations, slabs, patios, and steps — plus brick, block, stone, and chimney masonry — built for Minnesota freeze-thaw. What makes concrete last here, when to pour, and what to expect.",
};

const FAQS = [
  {
    q: "How long does a concrete driveway last in Minnesota?",
    a: "A properly built concrete driveway typically lasts 25 to 30 years or more in Minnesota. The keys are a well-compacted base with good drainage, an air-entrained concrete mix designed for freeze-thaw exposure, correctly spaced control joints, proper curing, and periodic sealing.",
  },
  {
    q: "When is the best time to pour concrete in Minnesota?",
    a: "Late spring through early fall is ideal, when temperatures stay roughly between 50°F and 85°F. Concrete can be poured outside that window with cold-weather practices like heated materials and insulated curing blankets, but scheduling within the main season is simpler and more economical.",
  },
  {
    q: "How long before you can use new concrete?",
    a: "Keep foot traffic off new concrete for about 24 to 48 hours and vehicles off for about 7 days. Concrete reaches its full design strength at about 28 days. Avoid deicing salts entirely for the first winter on new exterior concrete.",
  },
  {
    q: "How often should concrete be sealed?",
    a: "Exterior concrete in Minnesota should be sealed every 2 to 5 years, depending on traffic and exposure. Sealing slows water absorption, which is what drives freeze-thaw surface damage like scaling and spalling, and it helps protect against deicer chemicals.",
  },
  {
    q: "What is tuckpointing, and when does a chimney need it?",
    a: "Tuckpointing is grinding out deteriorated mortar joints and refilling them with fresh mortar. A chimney needs attention when you see crumbling or missing mortar, gaps between bricks, white mineral staining, or loose brick — catching it early prevents water from getting in and freezing, which is what breaks masonry apart.",
  },
  {
    q: "Can new concrete be poured over an old driveway?",
    a: "Usually the old slab should be removed. Overlays over cracked or settled concrete tend to mirror the old cracks and rarely last in freeze-thaw climates. Removing the old slab lets us fix the real problem — base and drainage — so the new driveway lasts.",
  },
];

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Concrete Services",
        serviceType: "Concrete contractor",
        description:
          "Driveways, garage floors, sidewalks, slabs, footings, frost walls, foundations, patios, and steps in Central Minnesota.",
        provider: { "@id": BUSINESS_ID },
        areaServed: "Central Minnesota",
      },
      {
        "@type": "Service",
        name: "Masonry Services",
        serviceType: "Masonry contractor",
        description:
          "Brick veneer, structural block, natural and manufactured stone, chimney repair, and tuckpointing in Central Minnesota.",
        provider: { "@id": BUSINESS_ID },
        areaServed: "Central Minnesota",
      },
      {
        "@type": "Article",
        headline: "Concrete & Masonry Services in Central Minnesota",
        description:
          "What RoCo builds in concrete and masonry, what makes concrete last through Minnesota freeze-thaw, when to pour, and how masonry restoration works.",
        author: { "@id": BUSINESS_ID },
        publisher: { "@id": BUSINESS_ID },
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
  { href: "#concrete-services", label: "Concrete" },
  { href: "#masonry-services", label: "Masonry" },
  { href: "#freeze-thaw", label: "Freeze-thaw" },
  { href: "#season", label: "Season" },
  { href: "#chimney", label: "Chimney repair" },
  { href: "#faqs", label: "FAQs" },
];

export default function ConcreteMasonryPage() {
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
        {/* ---- Answer-first opening: H1, direct answer, identity block. */}
        <p className="text-center text-[0.78rem] font-semibold tracking-[0.28em] text-[#004818] uppercase">
          Poured. Floated. Laid.
        </p>
        <h1 className="font-eurostile-black mt-3 text-center text-4xl tracking-[0.04em] text-[#005828] uppercase sm:text-5xl">
          Concrete &amp; Masonry in Central Minnesota
        </h1>

        <p className="mt-8 text-lg font-medium leading-relaxed text-[#1f2d23] sm:text-[1.2rem] sm:leading-[1.7]">
          RoCo pours concrete driveways, garage floors, slabs, foundations,
          patios, and steps, and lays brick, block, and stone — including
          chimney repair and tuckpointing — across Central Minnesota. Every
          project is built for freeze-thaw: compacted base, proper drainage,
          air-entrained mixes, correct jointing, and clean finishing, so the
          work lasts for decades instead of cracking in a few winters.
        </p>

        <p className="mt-5 rounded-md border border-[#005828]/12 bg-white/70 px-5 py-4 text-base leading-relaxed text-[#3c4a3f]">
          RoCo Spray Foam Insulation is a spray foam, concrete, and masonry
          contractor serving Central Minnesota. For a concrete or masonry
          quote, call{" "}
          <a href={PHONE_HREF} className="font-semibold text-[#005828] underline underline-offset-4">
            {PHONE_DISPLAY}
          </a>{" "}
          or request a quote online.
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
        <SectionHeading id="concrete-services">What concrete services does RoCo provide?</SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          RoCo handles residential and agricultural concrete from the ground
          up: driveways and approaches, garage and shop floors, sidewalks,
          slab-on-grade work, footings and frost walls, foundations, patios,
          and steps. Flatwork is poured level, finished clean, and cut with
          control joints placed where the slab wants to crack — not wherever
          is convenient.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Driveways &amp; flatwork.
            </strong>{" "}
            Driveways, garage floors, sidewalks, and slabs built over a
            compacted, well-drained base — the single biggest factor in how
            long exterior concrete lasts.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Foundations &amp; slabs.
            </strong>{" "}
            Footings, frost walls, and slab-on-grade work that give a
            building a solid, code-compliant start below the frost line.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23] sm:col-span-2">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Patios &amp; steps.
            </strong>{" "}
            Outdoor concrete designed for Minnesota&apos;s seasons, with slopes
            and finishes that shed water instead of holding it against the
            surface through freeze-thaw cycles.
          </li>
        </ul>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="masonry-services">What masonry services does RoCo provide?</SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          RoCo lays brick veneer, structural block, and natural or
          manufactured stone for exteriors, entries, fireplaces, and outdoor
          living spaces — and restores existing masonry with chimney repair
          and tuckpointing. Walls are laid straight and clean, with the
          flashing and drainage details that keep water out of the assembly,
          because water is what kills masonry in this climate.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <p className="rounded-md border border-[#005828]/12 bg-white/80 p-5 text-[0.95rem] leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Brick &amp; block
            </strong>
            Veneer and structural walls laid straight, with flashing that
            keeps water out.
          </p>
          <p className="rounded-md border border-[#005828]/12 bg-white/80 p-5 text-[0.95rem] leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Stone
            </strong>
            Natural and manufactured stone for exteriors, entries, fireplaces,
            and outdoor living.
          </p>
          <p className="rounded-md border border-[#005828]/12 bg-white/80 p-5 text-[0.95rem] leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Restoration
            </strong>
            Chimney repair and tuckpointing before freeze-thaw turns a small
            leak into a rebuild.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="freeze-thaw">
          What makes concrete last in Minnesota&apos;s freeze-thaw climate?
        </SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          Concrete survives Minnesota winters when five things are done
          right: a compacted base with drainage, an air-entrained mix, proper
          curing, correctly spaced control joints, and periodic sealing.
          Air-entrained concrete contains billions of microscopic air
          bubbles — typically 5–7% of the mix — that give freezing water
          room to expand without breaking the surface apart, which is why
          it is the standard for exterior concrete in cold climates.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Base and drainage.
            </strong>{" "}
            Most heaved, cracked driveways failed underneath first. We
            compact the base and grade for runoff so water doesn&apos;t sit under
            the slab and freeze.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Air-entrained mix.
            </strong>{" "}
            Standard for exterior work in cold climates — it dramatically
            improves resistance to freeze-thaw scaling and deicer damage.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Curing and jointing.
            </strong>{" "}
            Concrete gains strength for weeks after the pour. Proper curing
            and control joints at the right spacing decide where — and
            whether — it cracks.
          </li>
          <li className="rounded-md border border-[#005828]/12 bg-white/80 p-5 leading-relaxed text-[#1f2d23]">
            <strong className="font-eurostile block text-[1.05rem] tracking-[0.04em] text-[#005828] uppercase">
              Sealing.
            </strong>{" "}
            A quality sealer every few years keeps water and road salt out
            of the surface.
          </li>
        </ul>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="season">
          When is concrete season in Central Minnesota?
        </SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          The main pouring season runs from late spring through early fall,
          when air temperatures hold roughly between 50°F and 85°F —
          conditions where concrete cures predictably without special
          protection. Early booking matters: the season is short and
          schedules fill, so the best time to get on the calendar for summer
          concrete is winter or early spring.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <p className="rounded-md bg-[#005828] px-5 py-5 text-center text-[#f4f1ea]">
            <span className="font-eurostile-black block text-3xl tracking-[0.04em]">
              50–85°F
            </span>
            <span className="mt-1 block text-[0.72rem] font-semibold tracking-[0.16em] uppercase">
              Ideal pour temperatures
            </span>
          </p>
          <p className="rounded-md border border-[#005828]/15 bg-white/80 px-5 py-5 text-center text-[#005828]">
            <span className="font-eurostile-black block text-3xl tracking-[0.04em]">
              Late spring–fall
            </span>
            <span className="mt-1 block text-[0.72rem] font-semibold tracking-[0.16em] uppercase">
              Main concrete season in Central Minnesota
            </span>
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        <SectionHeading id="chimney">
          How do you know when a chimney or brick wall needs repair?
        </SectionHeading>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1f2d23]">
          Look for crumbling or receding mortar joints, hairline gaps between
          brick, white mineral staining (efflorescence), spalled brick faces,
          or a chimney crown with visible cracks. Each of these lets water
          into the wall, and every winter that water freezes and pries the
          masonry further apart. Tuckpointing and crown repair done early are
          a fraction of the cost of rebuilding a chimney that has been left
          to fail.
        </p>

        {/* ---- FAQ ----------------------------------------------------- */}
        <SectionHeading id="faqs">Frequently asked questions</SectionHeading>
        <FaqAccordion items={FAQS} />

        {/* ---- Cross-link to the foam page: internal linking helps both
             engines and visitors connect the site's expertise. ---------- */}
        <p className="mt-12 leading-relaxed text-[#3c4a3f]">
          Building or finishing a space? See{" "}
          <Link
            href="/spray-foam-benefits"
            className="font-semibold text-[#005828] underline underline-offset-4"
          >
            the benefits of spray foam insulation
          </Link>{" "}
          — many RoCo projects pair a poured foundation or slab with a
          sealed, insulated envelope.
        </p>

        {/* ---- CTA ----------------------------------------------------- */}
        <div className="mt-10 rounded-md bg-[#005828] px-8 py-12 text-center">
          <h2 className="font-eurostile-black text-2xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-3xl">
            Have a concrete or masonry project in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[#e6ecdd]">
            Driveway, foundation, patio, chimney — tell us what you&apos;re
            planning and we&apos;ll help you figure out the right approach.
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
