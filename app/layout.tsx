import type { Metadata } from "next";
import {
  PROFILE_IMAGE_URL,
  SITE_URL,
  SOCIAL_IMAGE_URL,
} from "@/lib/site";
import "./globals.css";

const scopusUrl =
  "https://www.scopus.com/authid/detail.uri?authorId=12789511400";
const orcidUrl = "https://orcid.org/0000-0002-5224-9145";
const universityProfileUrl =
  "https://bio.uni-plovdiv.bg/en/cv-veselin-baev/";
const researchGateUrl =
  "https://www.researchgate.net/profile/Vesselin-Baev";
const frontiersProfileUrl =
  "https://loop.frontiersin.org/people/285311/overview";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Prof. Dr. Vesselin Baev | Bioinformatics",
  description:
    "Academic profile, research impact and publications of Prof. Dr. Vesselin Baev, Professor of Bioinformatics at the University of Plovdiv.",
  keywords: [
    "Vesselin Baev",
    "Veselin Baev",
    "Веселин Баев",
    "Bioinformatics",
    "University of Plovdiv",
    "NGS",
    "metagenomics",
    "miRNA",
  ],
  authors: [{ name: "Prof. Dr. Vesselin Baev", url: SITE_URL }],
  creator: "Prof. Dr. Vesselin Baev",
  publisher: "Prof. Dr. Vesselin Baev",
  verification: {
    google: "s9kurQRjRr4wko5MR_T46vzil5lP4sFkzGqaAjXbDfg",
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      {
        url: `${SITE_URL}favicon.svg`,
        type: "image/svg+xml",
      },
    ],
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
  openGraph: {
    title: "Prof. Dr. Vesselin Baev | Bioinformatics",
    description:
      "Research, teaching and publications at the intersection of data and biology.",
    url: SITE_URL,
    siteName: "Prof. Dr. Vesselin Baev",
    type: "profile",
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Prof. Dr. Vesselin Baev - Bioinformatics, University of Plovdiv",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prof. Dr. Vesselin Baev | Bioinformatics",
    description:
      "Research, teaching and publications at the intersection of data and biology.",
    images: [SOCIAL_IMAGE_URL],
  },
};

const profileStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "Prof. Dr. Vesselin Baev",
      alternateName: ["Vesselin Baev", "Veselin Baev", "Веселин Баев"],
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}#profile-page`,
      url: SITE_URL,
      name: "Prof. Dr. Vesselin Baev | Bioinformatics",
      description:
        "Academic profile, research impact and publications of Prof. Dr. Vesselin Baev, Professor of Bioinformatics at the University of Plovdiv.",
      isPartOf: {
        "@id": `${SITE_URL}#website`,
      },
      mainEntity: {
        "@id": `${SITE_URL}#vesselin-baev`,
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}#vesselin-baev`,
      name: "Vesselin Baev",
      alternateName: ["Prof. Dr. Vesselin Baev", "Veselin Baev", "Веселин Баев"],
      honorificPrefix: "Prof. Dr.",
      url: SITE_URL,
      image: PROFILE_IMAGE_URL,
      jobTitle: "Professor of Bioinformatics and Vice Dean",
      description:
        "Professor of Bioinformatics and Vice Dean for Science and Research at the Faculty of Biology, University of Plovdiv.",
      worksFor: {
        "@type": "CollegeOrUniversity",
        name: "Paisii Hilendarski University of Plovdiv",
        url: "https://uni-plovdiv.bg/",
        department: {
          "@type": "Organization",
          name: "Faculty of Biology",
          url: "https://bio.uni-plovdiv.bg/en/welcome/",
        },
      },
      knowsAbout: [
        "Bioinformatics",
        "Next-generation sequencing",
        "Non-coding RNA",
        "Microbial genomics",
        "Metagenomics",
        "Multi-omics",
        "Artificial intelligence in bioinformatics",
      ],
      identifier: [
        {
          "@type": "PropertyValue",
          propertyID: "Scopus Author ID",
          value: "12789511400",
          url: scopusUrl,
        },
        {
          "@type": "PropertyValue",
          propertyID: "ORCID",
          value: "0000-0002-5224-9145",
          url: orcidUrl,
        },
      ],
      sameAs: [
        scopusUrl,
        orcidUrl,
        universityProfileUrl,
        researchGateUrl,
        frontiersProfileUrl,
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profileStructuredData).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        {children}
      </body>
    </html>
  );
}
