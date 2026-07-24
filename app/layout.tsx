import type { Metadata } from "next";
import "./globals.css";

const repository = process.env.GITHUB_REPOSITORY ?? "";
const [owner, repositoryName] = repository.split("/");
const inferredSiteUrl =
  owner && repositoryName
    ? repositoryName === `${owner}.github.io`
      ? `https://${owner}.github.io/`
      : `https://${owner}.github.io/${repositoryName}/`
    : "http://localhost:3000/";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? inferredSiteUrl),
  title: "Prof. Dr. Vesselin Baev | Bioinformatics",
  description:
    "Academic profile, research impact and publications of Prof. Dr. Vesselin Baev, Professor of Bioinformatics at the University of Plovdiv.",
  keywords: [
    "Vesselin Baev",
    "Bioinformatics",
    "University of Plovdiv",
    "NGS",
    "metagenomics",
    "miRNA",
  ],
  openGraph: {
    title: "Prof. Dr. Vesselin Baev | Bioinformatics",
    description:
      "Research, teaching and publications at the intersection of data and biology.",
    type: "profile",
    images: [
      {
        url: "./og.png",
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
    images: ["./og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
