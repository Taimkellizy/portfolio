import { Menu, X, ArrowUpRight, ArrowUp, Mail } from "lucide-react";
import { Plate } from "@/components/plate";
import PrismaticBurst from "@/components/prismatic-burst";
import { scrollToTop } from "@/lib/motion";
import {
  person,
  projects,
  credentials,
  experience,
  posts,
  skills,
} from "@/lib/content";
import {
  BIO_WORDS,
  HERO_WORD,
  MENU_LINKS,
  PLATE_PALETTES,
  newTabProps,
} from "./shared";
import type { MenuDialogState } from "./use-menu-dialog";

/* ===================== chrome: menu ===================== */

export function MenuDialog({ menu }: { menu: MenuDialogState }) {
  const {
    menuOpen,
    openMenu,
    closeMenu,
    menuBtnRef,
    menuPanelRef,
    menuOverlayRef,
  } = menu;

  return (
    <>
      <button
        className="ea-menu-btn"
        ref={menuBtnRef}
        type="button"
        onClick={openMenu}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="ea-menu-panel"
        inert={menuOpen}
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      <div
        className="ea-menu-overlay"
        ref={menuOverlayRef}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        className="ea-menu-panel"
        id="ea-menu-panel"
        ref={menuPanelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="ea-menu-panel__inner">
          <button
            className="ea-menu-panel__close"
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
          <nav
            className="ea-menu-panel__nav"
            aria-label="Site navigation"
            data-spectrum
          >
            {MENU_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="ea-menu-panel__link"
                data-spectrum-item
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="ea-menu-panel__cta"
            href={`mailto:${person.email}`}
            onClick={closeMenu}
          >
            <Mail size={16} strokeWidth={1.5} />
            Get in touch
          </a>
          <div className="ea-menu-panel__foot">
            <p className="ea-menu-panel__status">Available for work</p>
            <a href={`mailto:${person.email}`}>{person.email}</a>
            <div className="ea-menu-panel__social">
              <a href={person.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={person.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== hero ===================== */

export function HeroSection({
  reduced,
  narrow,
  giantRef,
}: {
  reduced: boolean;
  narrow: boolean | null;
  giantRef: React.Ref<HTMLHeadingElement>;
}) {
  const renderBackdrop = !reduced && narrow !== null;

  return (
    <section className="ea-hero" id="ea-top">
      {renderBackdrop ? (
        <div className="ea-hero__prism" aria-hidden="true">
          <PrismaticBurst
            intensity={3.2}
            speed={0.32}
            animationType="rotate3d"
            distort={0.45}
            mixBlendMode="lighten"
            paused={false}
            renderScale={narrow ? 0.55 : undefined}
          />
        </div>
      ) : null}

      <p className="ea-hero__bio">
        {BIO_WORDS.map((word, i) => (
          <span className="ea-hero__word" data-hero-word key={`${word}-${i}`}>
            {word}
          </span>
        ))}
      </p>

      <h1 className="ea-giant ea-hero__giant" ref={giantRef}>
        <span className="u-sr-only">{person.name}</span>
        <span aria-hidden="true">
          {HERO_WORD.split("").map((ch, i) => (
            <span
              className="ea-giant__letter"
              data-hero-letter
              key={`${ch}-${i}`}
            >
              {ch}
            </span>
          ))}
        </span>
      </h1>

      <a className="ea-hero__scroll" href="#ea-bio" data-hero-scroll>
        Scroll to explore
      </a>
    </section>
  );
}

/* ===================== bio ===================== */

export function BioSection() {
  return (
    <section className="ea-bio" id="ea-bio">
      <div className="ea-bio__inner">
        <p className="ea-bio__label u-label">About</p>
        <p className="ea-bio__text" data-reveal>
          CS and AI at MTI University — GPA 3.75. I build Shaghal, Unblock
          Syria&apos;s browser extension, with Vitest, Playwright, and CI;
          and Arabify, the Arabic-readiness analyzer that took 1st place at
          Qimma Hackathon. Off the keyboard, 140+ TED and TEDx projects
          translated and reviewed into Arabic — 350+ hours. EF SET C2.
          Proof over claims: everything below is checkable.
        </p>
      </div>
    </section>
  );
}

/* ===================== section header ===================== */

export function SectionHeader({
  title,
  count,
}: {
  title: string;
  count: string;
}) {
  return (
    <header className="ea-sec">
      <h2
        className="ea-sec__title"
        data-reveal
        data-reveal-title
        data-variable-weight
      >
        {title}
      </h2>
      <span className="ea-sec__count u-label">{count}</span>
    </header>
  );
}

/* ===================== skills ===================== */

export function SkillsSection() {
  return (
    <section className="ea-block" id="ea-skills">
      <SectionHeader title="skills" count="Stack" />
      <ul className="ea-rows">
        {skills.map((group) => (
          <li key={group.group} className="ea-skill-row" data-reveal-fade>
            <span className="ea-skill-row__group u-label">{group.group}</span>
            <div className="ea-skill-row__items">
              {group.items.map((item) => (
                <span className="ea-skill-row__item" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ===================== cases ===================== */

type ProjectImage = (typeof projects)[number]["images"][number];

interface CasePlateEntry {
  project: (typeof projects)[number];
  projectIndex: number;
  image: ProjectImage;
  isFirstImage: boolean;
}

const EMPTY_PLATE_IMAGE: ProjectImage = {
  src: "",
  ratio: "landscape",
  fit: "cover",
  alt: "",
};

/* One plate per image entry; a project without images still renders one
   empty plate so the palette slots stay aligned with the name list. Name
   sync is keyed on the project index. */
function buildCasePlates(): CasePlateEntry[] {
  return projects.flatMap((project, projectIndex) =>
    (project.images.length
      ? project.images
      : [EMPTY_PLATE_IMAGE]
    ).map((image, imageIndex) => ({
      project,
      projectIndex,
      image,
      isFirstImage: imageIndex === 0,
    })),
  );
}

/* joffreyspitzer.com layout: sticky label left, scrolling plates centre,
   sticky project names right (desktop only). */
export function CasesSection() {
  return (
    <section className="ea-cases" id="ea-work">
      <div className="ea-cases__grid">
        <div className="ea-cases__left">
          <h2
            className="ea-cases__title"
            data-reveal
            data-reveal-title
            data-variable-weight
          >
            Cases
          </h2>
        </div>

        <div className="ea-cases__images">
          {buildCasePlates().map((entry, index) => (
            <CasePlate
              key={`${entry.project.id}-${index}`}
              entry={entry}
              paletteIndex={index}
            />
          ))}
        </div>

        <div className="ea-cases__names">
          <div className="ea-cases__names-inner">
            {projects.map((project, index) => (
              <a
                key={project.id}
                className="ea-case-name"
                data-project-index={index}
                href={project.href}
                {...newTabProps(project.href)}
              >
                {project.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CasePlate({
  entry,
  paletteIndex,
}: {
  entry: CasePlateEntry;
  paletteIndex: number;
}) {
  const { project, image, isFirstImage, projectIndex } = entry;
  const palette = PLATE_PALETTES[paletteIndex % PLATE_PALETTES.length];

  return (
    <div
      className={`ea-case ea-case--${image.ratio}`}
      data-project-index={projectIndex}
    >
      {/* mobile-only project header (the sticky name list is
          desktop/slider only) */}
      {isFirstImage ? (
        <a
          className="ea-case__caption"
          href={project.href}
          {...newTabProps(project.href)}
        >
          <span className="ea-case__caption-title">{project.title}</span>
          <span className="ea-case__caption-kind u-label">{project.kind}</span>
        </a>
      ) : null}
      <div className="ea-case__plate">
        <Plate from={palette.from} to={palette.to} label={project.kind} />
        {image.src ? (
          <img
            className={`ea-case__img${
              image.fit === "contain" ? " ea-case__img--contain" : ""
            }`}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            /* intrinsic-size attrs are the aspect hint for crawlers; the
               CSS layer (width/height 100% on the absolute img) wins */
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

/* ===================== experience ===================== */

export function ExperienceSection() {
  return (
    <section className="ea-block" id="ea-experience">
      <SectionHeader title="experience" count="Roles · 01" />
      {experience.map((role) => (
        <article key={role.id} className="ea-xp" data-reveal-fade>
          <div className="ea-xp__meta">
            <p className="ea-xp__period u-label">{role.period}</p>
            <p className="ea-xp__org">{role.org}</p>
            <a
              className="ea-xp__link"
              href={role.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              github
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </a>
          </div>
          <div className="ea-xp__body">
            <h3 className="ea-xp__title" data-reveal data-reveal-title>
              {role.title}
            </h3>
            <ul className="ea-xp__list">
              {role.bullets.map((bullet) => (
                <li key={bullet} className="ea-xp__bullet">
                  {bullet}
                </li>
              ))}
            </ul>
            <p className="ea-xp__credit">{role.credit}</p>
            <p className="ea-xp__stack u-label">{role.stack.join("  ·  ")}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

/* ===================== credentials ===================== */

export function CredentialsSection() {
  return (
    <section className="ea-block" id="ea-credentials">
      <SectionHeader title="credentials" count="Verified" />
      <ul className="ea-rows">
        {credentials.map((credential) => (
          <li key={credential.id} className="ea-row" data-reveal-fade>
            <CredentialRow credential={credential} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CredentialRow({
  credential,
}: {
  credential: (typeof credentials)[number];
}) {
  const body = (
    <>
      <span className="ea-row__org u-label">{credential.org}</span>
      <span className="ea-row__title">{credential.title}</span>
      <span className="ea-row__metric">{credential.metric}</span>
      <span className="ea-row__year u-label">{credential.year}</span>
      {credential.href ? (
        <span className="ea-row__arrow" aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </span>
      ) : null}
    </>
  );
  return credential.href ? (
    <a href={credential.href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <div className="ea-row__plain">{body}</div>
  );
}

/* ===================== writing ===================== */

/* Posts keep placeholder anchors until real post pages ship. */
export function WritingSection() {
  return (
    <section className="ea-block" id="ea-writing">
      <SectionHeader title="writing" count="Journal" />
      <ul className="ea-rows">
        {posts.map((post) => (
          <li key={post.slug} className="ea-row" data-reveal-fade>
            <a href="#ea-writing">
              <span className="ea-row__org u-label">{post.tag}</span>
              <span className="ea-row__title">{post.title}</span>
              <span className="ea-row__excerpt">{post.excerpt}</span>
              <span className="ea-row__year u-label">
                {new Date(post.date).getFullYear()}
              </span>
              <span className="ea-row__arrow" aria-hidden="true">
                <ArrowUpRight size={16} strokeWidth={1.5} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ===================== footer ===================== */

const FOOTER_COLUMNS: {
  title: string;
  links: { label: string; href: string; active?: boolean }[];
}[] = [
  {
    title: "Sitemap",
    links: [
      { label: "Home", href: "#ea-top", active: true },
      { label: "Work", href: "#ea-work" },
      { label: "Experience", href: "#ea-experience" },
      { label: "Credentials", href: "#ea-credentials" },
      { label: "Writing", href: "#ea-writing" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "GitHub", href: person.github },
      { label: "LinkedIn", href: person.linkedin },
      { label: "Instagram", href: person.instagram },
    ],
  },
  {
    title: "Contact",
    links: [{ label: person.email, href: `mailto:${person.email}` }],
  },
];

export function SiteFooter({
  reduced,
  narrow,
  menuOpen,
}: {
  reduced: boolean;
  narrow: boolean | null;
  menuOpen: boolean;
}) {
  const renderBurst = !reduced && narrow !== null;

  return (
    <footer className="ea-foot" id="ea-contact" inert={menuOpen}>
      {renderBurst ? (
        <div className="ea-foot__burst" aria-hidden="true">
          <PrismaticBurst
            intensity={2.2}
            speed={0.25}
            animationType="rotate3d"
            distort={0.6}
            mixBlendMode="lighten"
            paused={false}
            renderScale={narrow ? 0.55 : undefined}
          />
        </div>
      ) : null}

      <div className="ea-foot__cols" data-reveal-fade>
        {FOOTER_COLUMNS.map((column) => (
          <div className="ea-foot__col" key={column.title}>
            <h3
              className="ea-foot__col-title"
              data-reveal
              data-reveal-title
              data-variable-weight
            >
              {column.title}
            </h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={link.active ? "is-active" : undefined}
                    {...newTabProps(link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="ea-giant ea-foot__word" aria-hidden="true">
        {HERO_WORD}
      </p>

      <div className="ea-foot__base">
        <button className="ea-foot__top" type="button" onClick={scrollToTop}>
          Back to top
          <ArrowUp size={16} strokeWidth={1.5} />
        </button>
        <span className="ea-foot__copy">© 2026 {person.name}</span>
      </div>
    </footer>
  );
}
