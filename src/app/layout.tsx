import type { Metadata } from "next";
import { Montserrat, Oswald } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
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
  // Base for resolving every relative URL below (canonicals, OG images).
  metadataBase: new URL("https://www.rocofoam.com"),
  title: "RoCo Spray Foam Insulation",
  description:
    "Spray foam insulation, concrete, and masonry serving Central Minnesota.",
  icons: {
    icon: "/brand/favicon.png",
  },
  // "./" resolves to each page's own path — every route gets a correct
  // self-referencing canonical without per-page boilerplate.
  alternates: {
    canonical: "./",
  },
  openGraph: {
    siteName: "RoCo Spray Foam Insulation",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/brand/roco-logo.webp",
        width: 1500,
        height: 725,
        alt: "RoCo Spray Foam Insulation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
        <link
          rel="preload"
          href="/Images/masonry-bg.webp"
          as="image"
          fetchPriority="low"
        />
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-50SLH1VT6T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-50SLH1VT6T');
          `}
        </Script>
      </body>
    </html>
  );
}
