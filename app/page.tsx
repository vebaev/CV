"use client";

import Image from "next/image";
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

type SiteLanguage = "en" | "bg";

const siteCopy = {
  en: {
    pageTitle: "Prof. Dr. Vesselin Baev | Bioinformatics",
    name: "Prof. Dr. Vesselin Baev",
    brandSubtitle: "Bioinformatics · University of Plovdiv",
    homeLabel: "Prof. Dr. Vesselin Baev home",
    menuLabel: "Toggle navigation",
    navigationLabel: "Main navigation",
    languageLabel: "Choose language",
    nav: {
      about: "About",
      research: "Research",
      publications: "Publications",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Professor of Bioinformatics",
      lineOne: "Science at the",
      emphasis: "intersection of data",
      lineThree: "and biology.",
      intro:
        "I lead research and education in bioinformatics, NGS and multi-omics at the Faculty of Biology, University of Plovdiv.",
      button: "Explore publications",
      portraitAlt: "Prof. Dr. Vesselin Baev in Tokyo",
      viceDean: "Vice Dean",
      role: "Science & Research",
      faculty: "Faculty of Biology",
    },
    metrics: {
      label: "Scopus metrics",
      impact: "Research impact",
      profile: "Scopus profile · updated",
      hIndex: "h-index",
      citations: "citations",
      documents: "documents",
    },
    about: {
      label: "About me",
      statementBefore: "Building bridges between",
      statementEmphasis: "molecular biology",
      statementAfter:
        ", computation and the next generation of scientists.",
      bioOne:
        "Prof. Dr. Vesselin Baev is Professor of Bioinformatics and Vice Dean for Science and Research at the Faculty of Biology, Paisii Hilendarski University of Plovdiv, Bulgaria.",
      bioTwo:
        "His work spans NGS data analysis, regulatory RNAs, microbial genomics, metagenomics and multi-omics, with a focus on turning complex biological data into practical scientific insight.",
      languages: "Languages",
      languageHeading: "Communication across research communities.",
      level: "out of 5",
    },
    languages: [
      { name: "English", level: 5 },
      { name: "French", level: 4 },
      { name: "Russian", level: 1 },
      { name: "Japanese", level: 1 },
    ],
    research: {
      label: "Research focus",
      eyebrow: "Scientific scope",
      heading: "From sequencing data to reproducible biological insight.",
      areas: [
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
      ],
    },
    career: {
      label: "Academic career",
      timeline: [
        {
          time: "2022 — present",
          title: "Professor of Bioinformatics",
          place: "Department of Molecular Biology, University of Plovdiv",
        },
        {
          time: "2014 — 2022",
          title: "Associate Professor",
          place: "Department of Molecular Biology, University of Plovdiv",
        },
        {
          time: "2008 — 2013",
          title: "Assistant Professor",
          place: "Department of Molecular Biology, University of Plovdiv",
        },
        {
          time: "March 2008",
          title: "PhD",
          place: "Molecular Biology & Bioinformatics",
        },
      ],
      teaching: "Teaching",
      teachingHeading: "Training biologists to think computationally.",
      courses: [
        "Basic Bioinformatics",
        "Bioinformatics Analysis",
        "Programming in Bioinformatics",
        "Small RNAs & NGS Data Analysis",
        "Tool development",
        "Illumina/ONT analysis",
        "AI bioinformatics solutions",
      ],
    },
    publications: {
      eyebrow: "Selected output",
      title: "Publications",
      description:
        "Automatically refreshed from Scopus each day. Search by title, author or journal.",
      searchLabel: "Search publications",
      searchPlaceholder: "Search publications",
      yearLabel: "Filter by year",
      allYears: "All years",
      loading: "Loading publication data…",
      empty: "No publications match your search.",
      citationLabel: "citations",
      more: "Show more publications",
    },
    memberships: "Memberships",
    contact: {
      eyebrow: "Let’s connect",
      heading: "Open to research collaboration and scientific exchange.",
      university: "Paisii Hilendarski University of Plovdiv",
      faculty: "Faculty of Biology",
      street: "2 Todor Samodumov Street",
      city: "4000 Plovdiv, Bulgaria",
      scopus: "Scopus profile",
    },
    footerInstitution: "University of Plovdiv · Faculty of Biology",
    footerLine: "Built for science, designed for clarity.",
  },
  bg: {
    pageTitle: "проф. д-р Веселин Баев | Биоинформатика",
    name: "проф. д-р Веселин Баев",
    brandSubtitle: "Биоинформатика · Пловдивски университет",
    homeLabel: "Начална страница на проф. д-р Веселин Баев",
    menuLabel: "Отваряне на навигацията",
    navigationLabel: "Основна навигация",
    languageLabel: "Избор на език",
    nav: {
      about: "За мен",
      research: "Научни интереси",
      publications: "Публикации",
      contact: "Контакти",
    },
    hero: {
      eyebrow: "Професор по биоинформатика",
      lineOne: "Наука на",
      emphasis: "пресечната точка между",
      lineThree: "данните и биологията.",
      intro:
        "Ръководя научни изследвания и обучение по биоинформатика, NGS и мултиомика в Биологическия факултет на Пловдивския университет.",
      button: "Разгледайте публикациите",
      portraitAlt: "проф. д-р Веселин Баев в Токио",
      viceDean: "Заместник-декан",
      role: "Наука и научни изследвания",
      faculty: "Биологически факултет",
    },
    metrics: {
      label: "Scopus показатели",
      impact: "Научно въздействие",
      profile: "Scopus профил · обновен на",
      hIndex: "h-индекс",
      citations: "цитирания",
      documents: "документи",
    },
    about: {
      label: "За мен",
      statementBefore: "Изграждам мостове между",
      statementEmphasis: "молекулярната биология",
      statementAfter:
        ", изчислителните подходи и следващото поколение учени.",
      bioOne:
        "Проф. д-р Веселин Баев е професор по биоинформатика и заместник-декан по научноизследователската дейност в Биологическия факултет на Пловдивския университет „Паисий Хилендарски“.",
      bioTwo:
        "Научната му работа обхваща анализ на NGS данни, регулаторни РНК, микробна геномика, метагеномика и мултиомика, с фокус върху превръщането на сложните биологични данни в практически научни изводи.",
      languages: "Езици",
      languageHeading: "Комуникация между научни общности.",
      level: "от 5",
    },
    languages: [
      { name: "Английски", level: 5 },
      { name: "Френски", level: 4 },
      { name: "Руски", level: 1 },
      { name: "Японски", level: 1 },
    ],
    research: {
      label: "Научни интереси",
      eyebrow: "Научен обхват",
      heading: "От секвенционни данни до възпроизводими биологични изводи.",
      areas: [
        {
          number: "01",
          title: "NGS и биоинформатика",
          copy: "Анализ на високопроизводително секвениране, възпроизводими работни процеси и разработване на биоинформатични инструменти.",
        },
        {
          number: "02",
          title: "Малки и некодиращи РНК",
          copy: "miRNA, isomiR и регулаторни РНК профили при растенията, човешкото здраве и заболяванията.",
        },
        {
          number: "03",
          title: "Микробна геномика",
          copy: "Метагеномика, бактериална геномика и профилиране на микробни общности в разнообразни среди.",
        },
        {
          number: "04",
          title: "Мултиомика",
          copy: "Интегрирани транскриптомни изследвания и анализ на извънклетъчни везикули с биологично и приложно значение.",
        },
        {
          number: "05",
          title: "Инструменти и работни процеси",
          copy: "Възпроизводими анализи, специализирани инструменти и прозрачни работни процеси за сложни биологични данни.",
        },
        {
          number: "06",
          title: "AI модели в биоинформатиката",
          copy: "AI-базирани методи за интерпретация на биологични данни, ускоряване на откритията и подпомагане на научните решения.",
        },
      ],
    },
    career: {
      label: "Академична кариера",
      timeline: [
        {
          time: "2022 — понастоящем",
          title: "Професор по биоинформатика",
          place: "Катедра „Молекулярна биология“, Пловдивски университет",
        },
        {
          time: "2014 — 2022",
          title: "Доцент",
          place: "Катедра „Молекулярна биология“, Пловдивски университет",
        },
        {
          time: "2008 — 2013",
          title: "Асистент",
          place: "Катедра „Молекулярна биология“, Пловдивски университет",
        },
        {
          time: "март 2008",
          title: "Доктор",
          place: "Молекулярна биология и биоинформатика",
        },
      ],
      teaching: "Преподаване",
      teachingHeading: "Обучение на биолози да прилагат изчислителен подход.",
      courses: [
        "Основи на биоинформатиката",
        "Биоинформатичен анализ",
        "Програмиране в биоинформатиката",
        "Малки РНК и анализ на NGS данни",
        "Разработване на инструменти",
        "Illumina/ONT анализ",
        "AI решения в биоинформатиката",
      ],
    },
    publications: {
      eyebrow: "Подбрани резултати",
      title: "Публикации",
      description:
        "Обновяват се автоматично от Scopus всеки ден. Търсете по заглавие, автор или списание.",
      searchLabel: "Търсене в публикациите",
      searchPlaceholder: "Търсене в публикациите",
      yearLabel: "Филтриране по година",
      allYears: "Всички години",
      loading: "Зареждане на публикациите…",
      empty: "Няма публикации, които отговарят на търсенето.",
      citationLabel: "citations",
      more: "Покажи още публикации",
    },
    memberships: "Членства",
    contact: {
      eyebrow: "За връзка",
      heading: "Отворен съм за научно сътрудничество и академичен обмен.",
      university: "Пловдивски университет „Паисий Хилендарски“",
      faculty: "Биологически факултет",
      street: "ул. „Тодор Самодумов“ №2",
      city: "4000 Пловдив, България",
      scopus: "Scopus профил",
    },
    footerInstitution: "Пловдивски университет · Биологически факултет",
    footerLine: "Създаден за науката, проектиран за яснота.",
  },
} satisfies Record<SiteLanguage, Record<string, unknown>>;

function compactNumber(value: number, language: SiteLanguage) {
  return new Intl.NumberFormat(language === "bg" ? "bg-BG" : "en-US").format(
    value,
  );
}

function publicationLink(publication: Publication) {
  if (publication.doi) {
    return `https://doi.org/${publication.doi}`;
  }
  return "https://www.scopus.com/authid/detail.uri?authorId=12789511400";
}

export default function Home() {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  const [data, setData] = useState<ScopusData | null>(null);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [visible, setVisible] = useState(5);
  const [menuOpen, setMenuOpen] = useState(false);
  const copy = siteCopy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy.pageTitle;
  }, [copy.pageTitle, language]);

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
    ? new Intl.DateTimeFormat(language === "bg" ? "bg-BG" : "en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(data.updatedAt))
    : language === "bg"
      ? "ян. 2026 г."
      : "Jan 2026";

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={copy.homeLabel}>
          <span className="brand-mark">VB</span>
          <span>
            <strong>{copy.name}</strong>
            <small>{copy.brandSubtitle}</small>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={copy.menuLabel}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav className={menuOpen ? "nav-open" : ""} aria-label={copy.navigationLabel}>
          <div
            className="language-switcher"
            role="group"
            aria-label={copy.languageLabel}
          >
            <button
              className={language === "en" ? "language-toggle is-active" : "language-toggle"}
              type="button"
              aria-label="English"
              aria-pressed={language === "en"}
              onClick={() => {
                setLanguage("en");
                closeMenu();
              }}
            >
              <span aria-hidden="true">🇬🇧</span>
            </button>
            <button
              className={language === "bg" ? "language-toggle is-active" : "language-toggle"}
              type="button"
              aria-label="Български"
              aria-pressed={language === "bg"}
              onClick={() => {
                setLanguage("bg");
                closeMenu();
              }}
            >
              <span aria-hidden="true">🇧🇬</span>
            </button>
          </div>
          <a href="#about" onClick={closeMenu}>{copy.nav.about}</a>
          <a href="#research" onClick={closeMenu}>{copy.nav.research}</a>
          <a href="#publications" onClick={closeMenu}>{copy.nav.publications}</a>
          <a href="#contact" onClick={closeMenu}>{copy.nav.contact}</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1>
            {copy.hero.lineOne}
            <span>{copy.hero.emphasis}</span>
            {copy.hero.lineThree}
          </h1>
          <p className="hero-intro">{copy.hero.intro}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#publications">
              {copy.hero.button} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Portrait and academic profile">
          <Image
            className="hero-photo"
            src="./Vesselin-Baev-Tokyo-2026.jpg"
            alt={copy.hero.portraitAlt}
            fill
            priority
            sizes="(max-width: 640px) 360px, 400px"
          />
          <div className="hero-role">
            <span>{copy.hero.viceDean}</span>
            <strong>{copy.hero.role}</strong>
            <small>{copy.hero.faculty}</small>
          </div>
          <div className="hero-location">
            <span>35.6762° N</span>
            <span>139.6503° E</span>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label={copy.metrics.label}>
        <div className="metric-intro">
          <p className="eyebrow">{copy.metrics.impact}</p>
          <p>{copy.metrics.profile} {updatedLabel}</p>
        </div>
        <a
          className="metric"
          href="https://www.scopus.com/authid/detail.uri?authorId=12789511400"
          target="_blank"
          rel="noreferrer"
        >
          <strong>{data ? data.metrics.hIndex : 15}</strong>
          <span>{copy.metrics.hIndex}</span>
        </a>
        <a
          className="metric"
          href="https://www.scopus.com/authid/detail.uri?authorId=12789511400"
          target="_blank"
          rel="noreferrer"
        >
          <strong>{compactNumber(data ? data.metrics.citations : 1193, language)}</strong>
          <span>{copy.metrics.citations}</span>
        </a>
        <a
          className="metric"
          href="#publications"
        >
          <strong>{data ? data.metrics.documents : 56}</strong>
          <span>{copy.metrics.documents}</span>
        </a>
      </section>

      <section className="about-me section-grid" id="about">
        <div className="section-label section-label-plain">
          <p>{copy.about.label}</p>
        </div>
        <div className="section-content about-layout">
          <div className="about-copy">
            <p className="statement">
              {copy.about.statementBefore}{" "}
              <em>{copy.about.statementEmphasis}</em>
              {copy.about.statementAfter}
            </p>
            <div className="about-columns">
              <p>{copy.about.bioOne}</p>
              <p>{copy.about.bioTwo}</p>
            </div>
          </div>

          <aside className="languages-card" aria-labelledby="languages-title">
            <p className="eyebrow">{copy.about.languages}</p>
            <h2 id="languages-title">{copy.about.languageHeading}</h2>
            <div className="language-list">
              {copy.languages.map((spokenLanguage) => (
                <div className="language-row" key={spokenLanguage.name}>
                  <span>{spokenLanguage.name}</span>
                  <span
                    className="language-scale"
                    aria-label={`${spokenLanguage.level} ${copy.about.level}`}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        className={index < spokenLanguage.level ? "is-active" : ""}
                        aria-hidden="true"
                        key={index}
                      />
                    ))}
                  </span>
                  <strong>{spokenLanguage.level}/5</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="research section-grid" id="research">
        <div className="section-label">
          <span>01</span>
          <p>{copy.research.label}</p>
        </div>
        <div className="section-content research-content">
          <div className="research-heading">
            <p className="eyebrow">{copy.research.eyebrow}</p>
            <h2>{copy.research.heading}</h2>
          </div>
          <div className="research-grid">
            {copy.research.areas.map((area) => (
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
          <p>{copy.career.label}</p>
        </div>
        <div className="section-content career-layout">
          <div className="timeline">
            {copy.career.timeline.map((item) => (
              <article key={`${item.time}-${item.title}`}>
                <time>{item.time}</time>
                <h3>{item.title}</h3>
                <p>{item.place}</p>
              </article>
            ))}
          </div>

          <aside className="teaching-card">
            <p className="eyebrow">{copy.career.teaching}</p>
            <h3>{copy.career.teachingHeading}</h3>
            <ul>
              {copy.career.courses.map((course) => <li key={course}>{course}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="publications" id="publications">
        <div className="publications-heading">
          <div>
            <p className="eyebrow">{copy.publications.eyebrow}</p>
            <h2>{copy.publications.title}</h2>
          </div>
          <p>{copy.publications.description}</p>
        </div>

        <div className="publication-tools">
          <label className="search-field">
            <span className="sr-only">{copy.publications.searchLabel}</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(5);
              }}
              placeholder={copy.publications.searchPlaceholder}
            />
          </label>
          <label className="year-field">
            <span className="sr-only">{copy.publications.yearLabel}</span>
            <select
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
                setVisible(5);
              }}
            >
              <option value="all">{copy.publications.allYears}</option>
              {years.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="publication-list" aria-live="polite">
          {!data && <p className="loading-note">{copy.publications.loading}</p>}
          {data && filtered.length === 0 && (
            <p className="loading-note">{copy.publications.empty}</p>
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
                  <small>
                    {publication.citations} {copy.publications.citationLabel}
                  </small>
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
            onClick={() => setVisible((count) => count + 5)}
          >
            {copy.publications.more}
          </button>
        )}
      </section>

      <section className="affiliations section-grid">
        <div className="section-label">
          <span>03</span>
          <p>{copy.memberships}</p>
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
        <p className="eyebrow">{copy.contact.eyebrow}</p>
        <h2>{copy.contact.heading}</h2>
        <address className="contact-address">
          <strong>{copy.contact.university}</strong>
          <span>{copy.contact.faculty}</span>
          <span>{copy.contact.street}</span>
          <span>{copy.contact.city}</span>
        </address>
        <div className="contact-links">
          <a href="mailto:baev@uni-plovdiv.bg">
            baev@uni-plovdiv.bg <span aria-hidden="true">↗</span>
          </a>
          <a href="tel:+35932261560">
            +359 32 261 560 <span aria-hidden="true">↗</span>
          </a>
          <a href="imessage://vebaev@gmail.com">
            iMessage <span aria-hidden="true">↗</span>
          </a>
          <a href="https://bio.uni-plovdiv.bg/" target="_blank" rel="noreferrer">
            {copy.contact.faculty} <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://www.scopus.com/authid/detail.uri?authorId=12789511400"
            target="_blank"
            rel="noreferrer"
          >
            {copy.contact.scopus} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">VB</span>
          <p>
            {copy.name}
            <small>{copy.footerInstitution}</small>
          </p>
        </div>
        <p>© {new Date().getFullYear()} · {copy.footerLine}</p>
      </footer>
    </main>
  );
}
