import Link from 'next/link'
import { DICT, LINKS, STACK_MARQUEE, WORK, type Locale } from '../../lib/home/content'
import CopyEmail from './CopyEmail'
import CountUp from './CountUp'
import HomeHeader from './HomeHeader'
import Reveal from './Reveal'
import Strings from './Strings'
import WorkCard from './WorkCard'

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-xs uppercase tracking-[0.22em] ${light ? 'text-white/50' : 'text-secondary'}`}>
      <span className={`h-px w-8 ${light ? 'bg-white/30' : 'bg-black/25'}`} />
      {children}
    </p>
  )
}

export default function HomePage({ locale }: { locale: Locale }) {
  const t = DICT[locale]
  const zh = locale === 'zh'
  const marquee = [...STACK_MARQUEE, ...STACK_MARQUEE]

  return (
    <div lang={zh ? 'zh-Hans' : 'en'} className={`home min-h-screen bg-white text-primary ${zh ? 'home-zh' : ''}`}>
      <HomeHeader locale={locale} />

      <main>
        {/* ───────── Hero ───────── */}
        <section className="relative overflow-hidden">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8">
            <div className="hero-fade" style={{ animationDelay: '80ms' }}>
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
            </div>

            <h1 className="hero-title mt-8 font-semibold tracking-[-0.035em]">
              {t.hero.lines.map((line, i) => (
                <span key={line} className="hero-line">
                  <span className="hero-line-inner" style={{ animationDelay: `${180 + i * 110}ms` }}>
                    {line}
                    {i === t.hero.avatarAfterLine ? (
                      <span className="hero-avatar" aria-hidden>
                        <img src="/images/rugee-portrait.jpg" alt="" width={277} height={302} />
                      </span>
                    ) : null}
                  </span>
                </span>
              ))}
            </h1>

            <div className="mt-10 grid gap-10 lg:grid-cols-12">
              <p className="hero-fade max-w-2xl text-lg leading-8 text-secondary lg:col-span-7" style={{ animationDelay: '620ms' }}>
                {t.hero.intro}
              </p>
              <div className="hero-fade lg:col-span-5 lg:justify-self-end" style={{ animationDelay: '740ms' }}>
                <p className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {t.hero.status}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href="#work" className="btn-primary">
                    {t.hero.ctaWork}
                    <span aria-hidden>↓</span>
                  </a>
                  <a href={LINKS.resume} target="_blank" rel="noreferrer" className="btn-ghost">
                    {t.hero.ctaResume}
                  </a>
                </div>
                <p className="mt-5 text-sm text-secondary">
                  {t.hero.studioLead}{' '}
                  <Link href={LINKS.studio} className="link-underline font-medium text-primary">
                    {t.hero.studioLink} →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Stack marquee ───────── */}
        <section className="border-y border-black/[0.07] py-5" aria-label="Tech stack">
          <div className="marquee">
            <div className="marquee-track">
              {marquee.map((tech, i) => (
                <span key={`${tech}-${i}`} className="marquee-item">
                  {tech}
                  <span className="marquee-dot" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Numbers ───────── */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {t.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                <p className="text-5xl font-semibold tracking-tight sm:text-6xl">
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="mt-3 max-w-[16rem] text-sm leading-6 text-secondary">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───────── Work ───────── */}
        <section id="work" className="scroll-mt-24 bg-section-bg">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
            <Reveal>
              <Eyebrow>{t.work.eyebrow}</Eyebrow>
              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <h2 className="section-title lg:col-span-7">{t.work.title}</h2>
                <p className="max-w-md self-end text-base leading-7 text-secondary lg:col-span-5 lg:justify-self-end">{t.work.note}</p>
              </div>
            </Reveal>

            <div className="mt-20 space-y-24 sm:space-y-32">
              {WORK.map((item, i) => (
                <Reveal key={item.id}>
                  <WorkCard
                    item={item}
                    locale={locale}
                    visitLabel={t.work.visit}
                    viewLabel={t.work.view}
                    teamLabel={t.work.team}
                    flip={i % 2 === 1}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── About ───────── */}
        <section id="about" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
            <Reveal>
              <Eyebrow>{t.about.eyebrow}</Eyebrow>
              <h2 className="section-title mt-6 max-w-4xl">{t.about.title}</h2>
            </Reveal>

            <div className="mt-14 grid gap-14 lg:grid-cols-12">
              <div className="space-y-6 text-lg leading-8 text-secondary lg:col-span-6">
                {t.about.paragraphs.map((paragraph, i) => (
                  <Reveal key={paragraph} delay={i * 80}>
                    <p>{paragraph}</p>
                  </Reveal>
                ))}
              </div>

              <div className="lg:col-span-5 lg:col-start-8">
                <Reveal>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">{t.about.principlesTitle}</p>
                </Reveal>
                <ol className="mt-6">
                  {t.about.principles.map((principle, i) => (
                    <Reveal as="li" key={principle.title} delay={i * 90} className="group border-t border-black/10 py-6 last:border-b">
                      <div className="flex items-baseline gap-5">
                        <span className="text-sm tabular-nums text-secondary">0{i + 1}</span>
                        <div>
                          <p className="text-xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1.5">{principle.title}</p>
                          <p className="mt-2 text-[15px] leading-7 text-secondary">{principle.body}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Off-screen ───────── */}
        <section className="border-t border-black/[0.07] bg-section-bg">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <Eyebrow>{t.offscreen.eyebrow}</Eyebrow>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{t.offscreen.title}</h2>
                <p className="mt-5 text-base leading-7 text-secondary">{t.offscreen.body}</p>
              </Reveal>
              <Reveal className="lg:col-span-7" delay={120}>
                <Strings hint={t.offscreen.hint} soundOn={t.offscreen.soundOn} soundOff={t.offscreen.soundOff} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────── Path ───────── */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <Eyebrow>{t.path.eyebrow}</Eyebrow>
            <h2 className="section-title mt-6">{t.path.title}</h2>
          </Reveal>
          <ol className="mt-14">
            {t.path.items.map((item, i) => (
              <Reveal as="li" key={item.what} delay={i * 70} className="group grid gap-2 border-t border-black/10 py-7 last:border-b sm:grid-cols-12 sm:items-baseline sm:gap-6">
                <span className="text-sm tabular-nums text-secondary sm:col-span-2">{item.when}</span>
                <span className="text-xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-1.5 sm:col-span-7 sm:text-2xl">{item.what}</span>
                <span className="text-sm text-secondary sm:col-span-3 sm:text-right">{item.where}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ───────── Contact ───────── */}
        <section id="contact" className="scroll-mt-24 bg-primary text-white">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
            <Reveal>
              <Eyebrow light>{t.contact.eyebrow}</Eyebrow>
              <h2 className="contact-title mt-8 font-semibold tracking-[-0.04em]">{t.contact.title}</h2>
              <a href={`mailto:${LINKS.email}`} className="contact-email link-underline link-underline-light mt-8 inline-block break-all font-medium tracking-tight">
                {LINKS.email}
              </a>
              <div className="mt-6">
                <CopyEmail email={LINKS.email} copyLabel={t.contact.copy} copiedLabel={t.contact.copied} />
              </div>
            </Reveal>

            <div className="mt-20 grid gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 sm:grid-cols-2">
              <Reveal className="bg-primary p-8 sm:p-10">
                <p className="text-2xl font-semibold tracking-tight">{t.contact.hiringTitle}</p>
                <p className="mt-3 max-w-sm text-[15px] leading-7 text-white/60">{t.contact.hiringBody}</p>
                <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm">
                  <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="link-underline link-underline-light">LinkedIn ↗</a>
                  <a href={LINKS.github} target="_blank" rel="noreferrer" className="link-underline link-underline-light">GitHub ↗</a>
                  <a href={LINKS.resume} target="_blank" rel="noreferrer" className="link-underline link-underline-light">{t.nav.resume} ↓</a>
                </div>
              </Reveal>
              <Reveal className="bg-primary p-8 sm:p-10" delay={100}>
                <p className="text-2xl font-semibold tracking-tight">{t.contact.projectTitle}</p>
                <p className="mt-3 max-w-sm text-[15px] leading-7 text-white/60">{t.contact.projectBody}</p>
                <Link href={LINKS.studio} className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-white/85">
                  {t.contact.projectCta} <span aria-hidden>→</span>
                </Link>
              </Reveal>
            </div>

            <footer className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Ruijie (Rugee) Fan · {t.footer.line}</p>
              <a href="#top" className="link-underline link-underline-light self-start sm:self-auto">{t.footer.top} ↑</a>
            </footer>
          </div>
        </section>
      </main>
      <span id="top" className="absolute top-0" aria-hidden />
    </div>
  )
}
