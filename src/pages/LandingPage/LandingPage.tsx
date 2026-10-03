import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Download, Hexagon, Minus, Repeat, Zap } from 'lucide-react'
import { parseDSL } from '../../utils/parser'
import { buildLayout } from '../../utils/layout'
import { HeroPlayground } from './HeroPlayground'
import { LiveDiagram } from '../../components/LiveDiagram'
import styles from './LandingPage.module.css'

const CTA_LABEL = 'Open the editor'

const PIPELINE = [
    { verb: 'Write', desc: 'Declare components and connections in plain text.', artifact: '.varch' },
    { verb: 'Parse', desc: 'Each line becomes a node or an edge in an AST.', artifact: '{ nodes, edges }' },
    { verb: 'Lay out', desc: 'Dagre ranks the graph left to right and spaces it.', artifact: 'x, y, w, h' },
    { verb: 'Render', desc: 'The layout is drawn as crisp, scalable SVG.', artifact: '<svg>' },
]

const SYNTAX = [
    { code: 'svc api "API Gateway"', name: 'Service', desc: 'Any running process: APIs, workers, functions.' },
    { code: 'db users "Users DB"', name: 'Database', desc: 'Drawn as a cylinder so storage reads at a glance.' },
    { code: 'ui web "Web App"', name: 'Interface', desc: 'Clients, dashboards and anything a person touches.' },
    { code: 'queue jobs "Job Queue"', name: 'Queue', desc: 'Brokers, buses and streams between services.' },
    { code: 'text later "Add a cache"', name: 'Note', desc: 'A free-standing note, drawn with a dashed border.' },
    { code: 'api -> users "read/write"', name: 'Connection', desc: 'An arrow between two ids, with an optional label.' },
]

const SYSTEM_DSL = `ui web "Web App"
ui admin "Admin Console"
svc gateway "API Gateway"
svc billing "Billing"
queue events "Event Bus"
db orders "Orders DB"

web -> gateway
admin -> gateway
gateway -> billing "charge"
gateway -> events "publish"
billing -> orders
events -> orders "persist"`

export function LandingPage() {
    const systemLayout = useMemo(() => buildLayout(parseDSL(SYSTEM_DSL).ast), [])

    return (
        <div className={styles.landing}>
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <Link to="/" className={styles.logo}>
                        <Hexagon size={20} strokeWidth={2} className={styles.logoIcon} />
                        VArch
                    </Link>
                    <div className={styles.navLinks}>
                        <a href="#features" className={styles.navLink}>Features</a>
                        <a href="#dsl" className={styles.navLink}>DSL</a>
                        <Link to="/docs" className={styles.navLink}>Docs</Link>
                        <Link to="/app" className={styles.navCta}>{CTA_LABEL}</Link>
                    </div>
                </div>
            </nav>

            <header className={styles.hero}>
                <div className={styles.heroGrid}>
                    <div className={styles.heroCopy}>
                        <h1 className={styles.heroTitle}>
                            Architecture as code.
                            <span className={styles.heroTitleMuted}> Diagrams as you type.</span>
                        </h1>
                        <p className={styles.heroSub}>
                            VArch turns a few lines of plain text into a clean, auto-laid-out SVG diagram, right in your browser.
                        </p>
                        <div className={styles.heroCtas}>
                            <Link to="/app" className={styles.primaryBtn}>
                                {CTA_LABEL}
                                <ArrowRight size={18} strokeWidth={2} />
                            </Link>
                            <a href="#dsl" className={styles.ghostBtn}>Read the syntax</a>
                        </div>
                    </div>
                    <div className={styles.heroVisual}>
                        <HeroPlayground />
                    </div>
                </div>
            </header>

            <section className={`${styles.section} ${styles.reveal}`} aria-labelledby="pipeline-title">
                <div className={styles.container}>
                    <h2 id="pipeline-title" className={styles.sectionTitle}>From text to SVG in four steps.</h2>
                    <ol className={styles.pipeline}>
                        {PIPELINE.map(step => (
                            <li key={step.verb} className={styles.pipelineStep}>
                                <code className={styles.pipelineArtifact}>{step.artifact}</code>
                                <h3 className={styles.pipelineVerb}>{step.verb}</h3>
                                <p className={styles.pipelineDesc}>{step.desc}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section id="dsl" className={`${styles.section} ${styles.sectionAlt} ${styles.reveal}`} aria-labelledby="dsl-title">
                <div className={styles.container}>
                    <h2 id="dsl-title" className={styles.sectionTitle}>The whole language fits on one screen.</h2>
                    <p className={styles.sectionLead}>
                        Four component types, notes, and arrows. Plain text, no config files, no canvas to drag around.
                    </p>
                    <dl className={styles.syntaxGrid}>
                        {SYNTAX.map(item => (
                            <div key={item.name} className={styles.syntaxCell}>
                                <code className={styles.syntaxCode}>{item.code}</code>
                                <dt className={styles.syntaxName}>{item.name}</dt>
                                <dd className={styles.syntaxDesc}>{item.desc}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section id="features" className={`${styles.section} ${styles.reveal}`} aria-labelledby="features-title">
                <div className={styles.container}>
                    <h2 id="features-title" className={styles.sectionTitle}>Built for the diagram you need right now.</h2>
                    <div className={styles.bento}>
                        <article className={`${styles.cell} ${styles.cellLayout}`}>
                            <div className={styles.cellText}>
                                <h3 className={styles.cellTitle}>Automatic layout</h3>
                                <p className={styles.cellDesc}>
                                    Twelve lines in, a ranked and evenly spaced system out. You never place a box by hand.
                                </p>
                            </div>
                            <div className={styles.cellDiagram}>
                                <LiveDiagram layout={systemLayout} animate={false} />
                            </div>
                        </article>

                        <article className={`${styles.cell} ${styles.cellAccent}`}>
                            <Zap size={22} strokeWidth={2} className={styles.cellIcon} />
                            <h3 className={styles.cellTitle}>Instant preview</h3>
                            <p className={styles.cellDesc}>The diagram redraws on every keystroke. No build step, no render button.</p>
                        </article>

                        <article className={styles.cell}>
                            <Download size={22} strokeWidth={2} className={styles.cellIcon} />
                            <h3 className={styles.cellTitle}>PNG and JPG export</h3>
                            <p className={styles.cellDesc}>Download at 2x resolution for docs, slides and pull requests.</p>
                        </article>

                        <article className={`${styles.cell} ${styles.cellCode}`}>
                            <Repeat size={22} strokeWidth={2} className={styles.cellIcon} />
                            <h3 className={styles.cellTitle}>Deterministic</h3>
                            <p className={styles.cellDesc}>Same text, same diagram. Keep the source in git and diff it like code.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt} ${styles.reveal}`} aria-labelledby="scope-title">
                <div className={styles.container}>
                    <h2 id="scope-title" className={styles.sectionTitle}>What VArch is, and what it isn't.</h2>
                    <div className={styles.scope}>
                        <ul className={styles.scopeList}>
                            <li><Check size={18} strokeWidth={2} className={styles.scopeYes} /> Fast and text-first</li>
                            <li><Check size={18} strokeWidth={2} className={styles.scopeYes} /> Deterministic diagrams</li>
                            <li><Check size={18} strokeWidth={2} className={styles.scopeYes} /> Built for developers</li>
                        </ul>
                        <ul className={`${styles.scopeList} ${styles.scopeListNot}`}>
                            <li><Minus size={18} strokeWidth={2} /> A drag-and-drop tool</li>
                            <li><Minus size={18} strokeWidth={2} /> A design tool like Figma</li>
                            <li><Minus size={18} strokeWidth={2} /> Overloaded with features (yet)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className={`${styles.finalCta} ${styles.reveal}`}>
                <div className={`${styles.container} ${styles.finalCtaInner}`}>
                    <h2 className={styles.finalTitle}>
                        Stop drawing diagrams.
                        <span className={styles.heroTitleMuted}> Start writing them.</span>
                    </h2>
                    <Link to="/app" className={styles.primaryBtn}>
                        {CTA_LABEL}
                        <ArrowRight size={18} strokeWidth={2} />
                    </Link>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={`${styles.container} ${styles.footerInner}`}>
                    <span className={styles.footerLogo}>
                        <Hexagon size={16} strokeWidth={2} className={styles.logoIcon} />
                        VArch
                    </span>
                    <p className={styles.footerText}>Visual Architecture. Code to diagrams, instantly.</p>
                </div>
            </footer>
        </div>
    )
}
