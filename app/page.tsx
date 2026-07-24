"use client";

import { useEffect, useMemo, useState } from "react";

type Publication = {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi?: string;
  citations?: number;
  type?: string;
};

type ScopusData = {
  authorId: string;
  updatedAt: string;
  source: string;
  metrics: {
    hIndex: number;
    citations: number;
    documents: number;
  };
  publications: Publication[];
};

const researchAreas = [
  {
    number: "01",
    title: "NGS & Bioinformatics",
    copy: "High-throughput sequencing analysis, reproducible workflows and bioinformatics tool development.",
  },
  {
    number: "02",
    title: "Small & Non-coding RNAs",
    copy: "miRNAs, isomiRs and regulatory RNA landscapes across plants, human health and disease.",
  },
  {
    number: "03",
    title: "Microbial Genomics",
    copy: "Metagenomics, bacterial genomics and microbial community profiling in diverse environments.",
  },
  {
    number: "04",
    title: "Multi-omics",
    copy: "Integrated transcriptomic and extracellular-vesicle research with biological and translational impact.",
  },
  {
    number: "05",
    title: "Tool and Workflow Development",
    copy: "Reproducible pipelines and specialized tools that make complex biological analyses transparent and reusable.",
  },
  {
    number: "06",
    title: "AI Models in Bioinformatics",
    copy: "AI-assisted methods for interpreting biological data, accelerating discovery and supporting research decisions.",
  },
];

const teaching = [
  "Basic Bioinformatics",
  "Bioinformatics Analysis",
  "Programming in Bioinformatics",
  "Small RNAs & NGS Data Analysis",
  "Tool development",
  "Illumina/ONT analysis",
  "AI bioinformatics solutions",
];

const languages = [
  { name: "English", level: 5 },
  { name: "French", level: 4 },
  { name: "Russian", level: 1 },
  { name: "Japanese", level: 1 },
];

function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function publicationLink(publication: Publication) {
  if (publication.doi) {
    return `https://doi.org/${publication.doi}`;
  }
  return "https://www.scopus.com/authid/detail.uri?authorId=12789511400";
}

export default function Home() {
  const [data, setData] = useState<ScopusData | null>(null);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [visible, setVisible] = useState(8);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("./data/scopus.json")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load Scopus data");
        return response.json();
      })
      .then((payload: ScopusData) => setData(payload))
      .catch(() => setData(null));
  }, []);

  const years = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.publications.map((item) => item.year))].sort(
      (a, b) => b - a,
    );
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const normalized = query.trim().toLowerCase();
    return data.publications.filter((publication) => {
      const matchesYear = year === "all" || publication.year === Number(year);
      const haystack =
        `${publication.title} ${publication.authors} ${publication.journal}`.toLowerCase();
      return matchesYear && (!normalized || haystack.includes(normalized));
    });
  }, [data, query, year]);

  const closeMenu = () => setMenuOpen(false);
  const updatedLabel = data
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(data.updatedAt))
    : "Jan 2026";

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Prof. Dr. Vesselin Baev home">
          <span className="brand-mark">VB</span>
          <span>
            <strong>Prof. Dr. Vesselin Baev</strong>
            <small>Bioinformatics · University of Plovdiv</small>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#research" onClick={closeMenu}>Research</a>
          <a href="#publications" onClick={closeMenu}>Publications</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Professor of Bioinformatics</p>
          <h1>
            Science at the
            <span>intersection of data</span>
            and biology.
          </h1>
          <p className="hero-intro">
            I lead research and education in bioinformatics, NGS and multi-omics
            at the Faculty of Biology, University of Plovdiv.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#publications">
              Explore publications <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Academic profile overview">
          <div className="hero-monogram">VB</div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-role">
            <span>Vice Dean</span>
            <strong>Science & Research</strong>
            <small>Faculty of Biology</small>
          </div>
          <div className="hero-location">
            <span>42.1354° N</span>
            <span>24.7453° E</span>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Scopus metrics">
        <div className="metric-intro">
          <p className="eyebrow">Research impact</p>
          <p>Scopus profile · updated {updatedLabel}</p>
        </div>
        <a
          className="metric"
          href="https://www.scopus.com/authid/detail.uri?authorId=12789511400"
          target="_blank"
          rel="noreferrer"
        >
          <strong>{data ? data.metrics.hIndex : 15}</strong>
          <span>h-index</span>
        </a>
        <a
          className="metric"
          href="https://www.scopus.com/authid/detail.uri?authorId=12789511400"
          target="_blank"
          rel="noreferrer"
        >
          <strong>{compactNumber(data ? data.metrics.citations : 1193)}</strong>
          <span>citations</span>
        </a>
        <a
          className="metric"
          href="#publications"
        >
          <strong>{data ? data.metrics.documents : 56}</strong>
          <span>documents</span>
        </a>
      </section>

      <section className="about-me section-grid" id="about">
        <div className="section-label section-label-plain">
          <p>About me</p>
        </div>
        <div className="section-content about-layout">
          <div className="about-copy">
            <p className="statement">
              Building bridges between <em>molecular biology</em>, computation
              and the next generation of scientists.
            </p>
            <div className="about-columns">
              <p>
                Prof. Dr. Vesselin Baev is Professor of Bioinformatics and Vice
                Dean for Science and Research at the Faculty of Biology, Paisii
                Hilendarski University of Plovdiv, Bulgaria.
              </p>
              <p>
                His work spans NGS data analysis, regulatory RNAs, microbial
                genomics, metagenomics and multi-omics, with a focus on turning
                complex biological data into practical scientific insight.
              </p>
            </div>
          </div>

          <aside className="languages-card" aria-labelledby="languages-title">
            <p className="eyebrow">Languages</p>
            <h2 id="languages-title">Communication across research communities.</h2>
            <div className="language-list">
              {languages.map((language) => (
                <div className="language-row" key={language.name}>
                  <span>{language.name}</span>
                  <span
                    className="language-scale"
                    aria-label={`${language.level} out of 5`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        className={index < language.level ? "is-active" : ""}
                        aria-hidden="true"
                        key={index}
                      />
                    ))}
                  </span>
                  <strong>{language.level}/5</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="research section-grid" id="research">
        <div className="section-label">
          <span>01</span>
          <p>Research focus</p>
        </div>
        <div className="section-content research-content">
          <div className="research-heading">
            <p className="eyebrow">Scientific scope</p>
            <h2>From sequencing data to reproducible biological insight.</h2>
          </div>
          <div className="research-grid">
            {researchAreas.map((area) => (
              <article className="research-card" key={area.number}>
                <span>{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="career section-grid">
        <div className="section-label">
          <span>02</span>
          <p>Academic career</p>
        </div>
        <div className="section-content career-layout">
          <div className="timeline">
            <article>
              <time>2022 — present</time>
              <h3>Professor of Bioinformatics</h3>
              <p>Department of Molecular Biology, University of Plovdiv</p>
            </article>
            <article>
              <time>2014 — 2022</time>
              <h3>Associate Professor</h3>
              <p>Department of Molecular Biology, University of Plovdiv</p>
            </article>
            <article>
              <time>2008 — 2013</time>
              <h3>Assistant Professor</h3>
              <p>Department of Molecular Biology, University of Plovdiv</p>
            </article>
            <article>
              <time>March 2008</time>
              <h3>PhD</h3>
              <p>Molecular Biology & Bioinformatics</p>
            </article>
          </div>

          <aside className="teaching-card">
            <p className="eyebrow">Teaching</p>
            <h3>Training biologists to think computationally.</h3>
            <ul>
              {teaching.map((course) => <li key={course}>{course}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="publications" id="publications">
        <div className="publications-heading">
          <div>
            <p className="eyebrow">Selected output</p>
            <h2>Publications</h2>
          </div>
          <p>
            Automatically refreshed from Scopus each day. Search by title,
            author or journal.
          </p>
        </div>

        <div className="publication-tools">
          <label className="search-field">
            <span className="sr-only">Search publications</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(8);
              }}
              placeholder="Search publications"
            />
          </label>
          <label className="year-field">
            <span className="sr-only">Filter by year</span>
            <select
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
                setVisible(8);
              }}
            >
              <option value="all">All years</option>
              {years.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="publication-list" aria-live="polite">
          {!data && <p className="loading-note">Loading publication data…</p>}
          {data && filtered.length === 0 && (
            <p className="loading-note">No publications match your search.</p>
          )}
          {filtered.slice(0, visible).map((publication, index) => (
            <a
              className="publication-item"
              href={publicationLink(publication)}
              target="_blank"
              rel="noreferrer"
              key={`${publication.title}-${publication.year}`}
            >
              <span className="publication-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="publication-main">
                <span className="publication-meta">
                  {publication.year} · {publication.journal}
                  {publication.type ? ` · ${publication.type}` : ""}
                </span>
                <strong>{publication.title}</strong>
                <small>{publication.authors}</small>
              </span>
              <span className="publication-citations">
                {typeof publication.citations === "number" && (
                  <small>{publication.citations} citations</small>
                )}
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>

        {visible < filtered.length && (
          <button
            className="button button-more"
            type="button"
            onClick={() => setVisible((count) => count + 8)}
          >
            Show more publications
          </button>
        )}
      </section>

      <section className="affiliations section-grid">
        <div className="section-label">
          <span>03</span>
          <p>Memberships</p>
        </div>
        <div className="section-content">
          <div className="affiliation-row">
            <span>EU COST</span>
            <p>
              AI-Governance, Use, and Impact for a Dynamic European R&amp;I
              Ecosystem (AI-GUIDE) · CA25157
            </p>
          </div>
          <div className="affiliation-row">
            <span>EU COST</span>
            <p>Next Generation Sequencing Data Analysis Network · BM1006</p>
          </div>
          <div className="affiliation-row">
            <span>EU COST</span>
            <p>NGS for plant viral disease research and diagnosis · FA1407</p>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="eyebrow">Let’s connect</p>
        <h2>Open to research collaboration and scientific exchange.</h2>
        <div className="contact-links">
          <a href="mailto:baev@uni-plovdiv.bg">
            baev@uni-plovdiv.bg <span aria-hidden="true">↗</span>
          </a>
          <a href="https://bio.uni-plovdiv.bg/" target="_blank" rel="noreferrer">
            Faculty of Biology <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://www.scopus.com/authid/detail.uri?authorId=12789511400"
            target="_blank"
            rel="noreferrer"
          >
            Scopus profile <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">VB</span>
          <p>
            Prof. Dr. Vesselin Baev
            <small>University of Plovdiv · Faculty of Biology</small>
          </p>
        </div>
        <p>© {new Date().getFullYear()} · Built for science, designed for clarity.</p>
      </footer>
    </main>
  );
}
