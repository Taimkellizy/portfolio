import { Menu, X, ArrowUpRight, ArrowUp, Mail, Languages } from "lucide-react";
import { Plate } from "@/components/plate";
import PrismaticBurst from "@/components/prismatic-burst";
import { scrollToTop } from "@/lib/motion";
import { content, type Locale, type LocaleContent } from "@/lib/i18n";
import { PLATE_PALETTES, newTabProps } from "./shared";
import type { MenuDialogState } from "./use-menu-dialog";

/* Static per-weight face (no variable axis): the cursor-weight effect is
   an LTR-glyph easter egg — Arabic titles don't ride .char spans. */
function titleWeightAttr(locale: Locale) {
  return locale === "ar" ? undefined : { "data-variable-weight": true };
}

/* ===================== chrome: menu ===================== */

export function MenuDialog({
  menu,
  locale,
}: {
  menu: MenuDialogState;
  locale: Locale;
}) {
  const { ui, person } = content[locale];
  const {
    menuOpen,
    openMenu,
    closeMenu,
    menuBtnRef,
    menuPanelRef,
    menuOverlayRef,
  } = menu;
  const other = locale === "ar" ? "en" : "ar";
  const switchLabel = other === "ar" ? "عربي" : "English";

  return (
    <>
      <button
        className="ea-menu-btn"
        ref={menuBtnRef}
        type="button"
        onClick={openMenu}
        aria-label={ui.menuOpen}
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
        aria-label={ui.menuLabel}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="ea-menu-panel__inner">
          <button
            className="ea-menu-panel__close"
            type="button"
            onClick={closeMenu}
            aria-label={ui.menuClose}
          >
            <X size={24} strokeWidth={1.5} />
          </button>
          <nav
            className="ea-menu-panel__nav"
            aria-label={ui.menuNavLabel}
            data-spectrum
          >
            {ui.menuLinks.map((link) => (
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
            {ui.getInTouch}
          </a>
          <a
            className="ea-menu-panel__lang"
            href={`/${other}`}
            hrefLang={other}
            aria-label={locale === "ar" ? "English" : "عربي"}
            onClick={closeMenu}
          >
            <Languages size={18} strokeWidth={1.5} />
            {switchLabel}
          </a>
          <div className="ea-menu-panel__foot">
            <p className="ea-menu-panel__status">{ui.availableForWork}</p>
            <a href={`mailto:${person.email}`}>{person.email}</a>
            <div className="ea-menu-panel__social">
              <a href={person.github} target="_blank" rel="noopener noreferrer">
                {ui.socialLabels.github}
              </a>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ui.socialLabels.linkedin}
              </a>
              <a
                href={person.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ui.socialLabels.instagram}
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
  locale,
}: {
  reduced: boolean;
  narrow: boolean | null;
  giantRef: React.Ref<HTMLHeadingElement>;
  locale: Locale;
}) {
  const { person, ui } = content[locale];
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
        {ui.heroBio.split(" ").map((word, i) => (
          <span className="ea-hero__word" data-hero-word key={`${word}-${i}`}>
            {word}
          </span>
        ))}
      </p>

      <h1 className="ea-giant ea-hero__giant" ref={giantRef} lang={locale === "ar" ? "ar" : undefined}>
        <span className="u-sr-only">{person.name}</span>
        <span aria-hidden="true">
          {/* Arabic keeps contextual joining: one span — the entrance and
              the magnet move the whole wordmark */}
          {locale === "en"
            ? ui.heroWord.split("").map((ch, i) => (
                <span
                  className="ea-giant__letter"
                  data-hero-letter
                  key={`${ch}-${i}`}
                >
                  {ch}
                </span>
              ))
            : (
                <span className="ea-giant__letter" data-hero-letter>
                  {ui.heroWord}
                </span>
              )}
        </span>
      </h1>

      <a className="ea-hero__scroll" href="#ea-bio" data-hero-scroll>
        {ui.scrollHint}
      </a>
    </section>
  );
}

/* ===================== bio ===================== */

export function BioSection({ locale }: { locale: Locale }) {
  const { ui } = content[locale];
  return (
    <section className="ea-bio" id="ea-bio">
      <div className="ea-bio__inner">
        <p className="ea-bio__label u-label">{ui.aboutLabel}</p>
        <p className="ea-bio__text" data-reveal>
          {ui.aboutText}
        </p>
      </div>
    </section>
  );
}

/* ===================== section header ===================== */

export function SectionHeader({
  title,
  count,
  locale,
}: {
  title: string;
  count: string;
  locale: Locale;
}) {
  return (
    <header className="ea-sec">
      <h2
        className="ea-sec__title"
        data-reveal
        data-reveal-title
        {...titleWeightAttr(locale)}
      >
        {title}
      </h2>
      <span className="ea-sec__count u-label">{count}</span>
    </header>
  );
}

/* ===================== skills ===================== */

export function SkillsSection({ locale }: { locale: Locale }) {
  const { ui, skills } = content[locale];
  return (
    <section className="ea-block" id="ea-skills">
      <SectionHeader title={ui.skillsTitle} count={ui.skillsCount} locale={locale} />
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

type Project = LocaleContent["projects"][number];
type ProjectImage = Project["images"][number];

interface CasePlateEntry {
  project: Project;
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
function buildCasePlates(projects: Project[]): CasePlateEntry[] {
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

/* joffreyspitzer.com layout: sticky label lead side, scrolling plates
   centre, sticky project names tail side (desktop only). */
export function CasesSection({ locale }: { locale: Locale }) {
  const { ui, projects } = content[locale];
  return (
    <section className="ea-cases" id="ea-work">
      <div className="ea-cases__grid">
        <div className="ea-cases__left">
          <h2
            className="ea-cases__title"
            data-reveal
            data-reveal-title
            {...titleWeightAttr(locale)}
          >
            {ui.casesTitle}
          </h2>
        </div>

        <div className="ea-cases__images">
          {buildCasePlates(projects).map((entry, index) => (
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

export function ExperienceSection({ locale }: { locale: Locale }) {
  const { ui, experience } = content[locale];
  return (
    <section className="ea-block" id="ea-experience">
      <SectionHeader title={ui.xpTitle} count={ui.xpCount} locale={locale} />
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
              {ui.githubLink}
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

export function CredentialsSection({ locale }: { locale: Locale }) {
  const { ui, credentials } = content[locale];
  return (
    <section className="ea-block" id="ea-credentials">
      <SectionHeader
        title={ui.credentialsTitle}
        count={ui.credentialsCount}
        locale={locale}
      />
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
  credential: LocaleContent["credentials"][number];
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
export function WritingSection({ locale }: { locale: Locale }) {
  const { ui, posts } = content[locale];
  return (
    <section className="ea-block" id="ea-writing">
      <SectionHeader title={ui.writingTitle} count={ui.writingCount} locale={locale} />
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

export function SiteFooter({
  reduced,
  narrow,
  menuOpen,
  locale,
}: {
  reduced: boolean;
  narrow: boolean | null;
  menuOpen: boolean;
  locale: Locale;
}) {
  const { ui } = content[locale];
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
        {ui.footerColumns.map((column) => (
          <div className="ea-foot__col" key={column.title}>
            <h3
              className="ea-foot__col-title"
              data-reveal
              data-reveal-title
              {...titleWeightAttr(locale)}
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
        {ui.heroWord}
      </p>

      <div className="ea-foot__base">
        <button className="ea-foot__top" type="button" onClick={scrollToTop}>
          {ui.backToTop}
          <ArrowUp size={16} strokeWidth={1.5} />
        </button>
        <span className="ea-foot__copy">{ui.copyright}</span>
      </div>
    </footer>
  );
}
