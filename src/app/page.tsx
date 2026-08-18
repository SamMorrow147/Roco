import { FoamExperience } from "@/components/FoamExperience";

// Invisible structured data: tells Google and AI answer engines exactly who
// this business is, what it does, and where it serves. The @id is shared
// with the schema on /spray-foam-benefits so engines treat both pages as
// describing the same entity.
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://www.rocofoam.com/#business",
  name: "RoCo Spray Foam Insulation",
  description:
    "Spray foam insulation, concrete, and masonry contractor serving Central Minnesota.",
  url: "https://www.rocofoam.com",
  telephone: "+1-320-808-8500",
  email: "rocofoam@gmail.com",
  image: "https://www.rocofoam.com/brand/roco-logo.webp",
  logo: "https://www.rocofoam.com/brand/roco-logo.webp",
  areaServed: {
    "@type": "State",
    name: "Minnesota",
    description: "Central Minnesota",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "MN",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.facebook.com/rocofoam",
    "https://www.instagram.com/rocofoam",
  ],
  knowsAbout: [
    "Spray foam insulation",
    "Open-cell spray foam",
    "Closed-cell spray foam",
    "Concrete flatwork",
    "Foundations",
    "Masonry",
    "Brick and block",
    "Stonework",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <FoamExperience />
    </>
  );
}
