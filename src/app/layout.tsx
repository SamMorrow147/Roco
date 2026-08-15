import type { Metadata } from "next";
import { Montserrat, Oswald } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

// Brand display font for titles/headings.
const eurostile = localFont({
  src: [
    { path: "../fonts/Eurostile.ttf", weight: "400", style: "normal" },
    { path: "../fonts/EurostileBold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Eurostile-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-eurostile",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoCo Spray Foam Insulation",
  description:
    "Spray foam insulation, concrete, and masonry serving Central Minnesota.",
  icons: {
    icon: "/brand/favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${oswald.variable} ${eurostile.variable} h-full antialiased`}
    >
      {/* No background on body: the wall photo is a fixed body::before layer
          (see globals.css), and any body background paints on top of it.
          The tan fallback color lives on <html> instead. */}
      <body className="min-h-full font-sans text-[#005828]">
        {/* React hoists these into <head>: start fetching the wall texture
            immediately instead of waiting for CSS to be parsed. */}
        <link
          rel="preload"
          href="/brand/wall-bg.webp"
          as="image"
          media="(orientation: landscape)"
        />
        <link
          rel="preload"
          href="/brand/wall-bg-mobile.webp"
          as="image"
          media="(orientation: portrait)"
        />
        {/* Below-the-fold parallax photos: fetch early at low priority so
            they're already decoded when their sections scroll into view,
            without competing with the hero assets. */}
        <link
          rel="preload"
          href="/Images/foam-bg.webp"
          as="image"
          fetchPriority="low"
        />
        <link
          rel="preload"
          href="/Images/concrete-bg.webp"
          as="image"
          fetchPriority="low"
        />
        {children}
      </body>
    </html>
  );
}
