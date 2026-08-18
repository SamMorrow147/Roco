import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JotformEmbed } from "@/components/JotformEmbed";

export const metadata: Metadata = {
  title: "Request a Quote | RoCo Spray Foam Insulation",
  description:
    "Tell us about your spray foam, concrete, or masonry project in Central Minnesota.",
};

export default function ContactPage() {
  return (
    <>
      {/* Covers the homepage OSB wall (body::before) for the whole
          viewport, including iOS overscroll past the form. */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#f4f1ea]" aria-hidden />
      <div className="relative z-10 min-h-dvh bg-[#f4f1ea]">
        <header className="flex h-14 items-center justify-between px-5 sm:px-10">
          <Link href="/" aria-label="RoCo Spray Foam Insulation — home" className="flex h-9 items-center">
            <Image
              src="/brand/roco-logo-mark.png"
              alt="RoCo Spray Foam Insulation"
              width={1424}
              height={560}
              unoptimized
              className="block h-9 w-auto max-h-9 object-contain"
            />
          </Link>
          <a
            href="tel:3208088500"
            className="text-[0.78rem] font-semibold tracking-[0.22em] text-[#004818] uppercase"
          >
            320.808.8500
          </a>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-12 text-center sm:px-10 sm:py-16">
          <p className="text-[0.78rem] font-semibold tracking-[0.28em] text-[#004818] uppercase">
            Serving Central Minnesota
          </p>
          <h1 className="font-eurostile-black mt-3 text-4xl tracking-[0.04em] text-[#005828] uppercase sm:text-5xl">
            Request a Quote
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#004818]">
            Tell us about your project and we&apos;ll help you figure out the right solution.
          </p>

          <div className="jotform-embed mx-auto mt-10 w-full overflow-hidden">
            <JotformEmbed />
          </div>
        </main>
      </div>
    </>
  );
}
