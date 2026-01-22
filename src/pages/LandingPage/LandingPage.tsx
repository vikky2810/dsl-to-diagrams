import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'

// Icons as simple SVG components
const CodeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
    </svg>
)

const LayoutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
)

const ImageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
    </svg>
)

const ZapIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
    </svg>
)

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20,6 9,17 4,12" />
    </svg>
)

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12,5 19,12 12,19" />
    </svg>
)

export function LandingPage() {
    return (
        <div className={styles.landing}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>⬡</span>
                        <span className={styles.logoText}>VArch</span>
                    </div>
                    <div className={styles.navLinks}>
                        <a href="#features" className={styles.navLink}>Features</a>
                        <a href="#dsl" className={styles.navLink}>DSL</a>
                        <Link to="/app" className={styles.navCta}>Try Editor</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>
                            Write Architecture as Code.
                            <span className={styles.heroTitleAccent}> See It Instantly.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            VArch turns a simple text-based DSL into clean software architecture
                            diagrams — live, in your browser.
                        </p>
                        <div className={styles.heroCtas}>
                            <Link to="/app" className={styles.primaryBtn}>
                                Try the Editor
                                <ArrowRightIcon />
                            </Link>
                            <a href="#dsl" className={styles.secondaryLink}>
                                View Example DSL
                            </a>
                        </div>
                    </div>
                    <div className={styles.heroVisual}>
                        <div className={styles.codePreview}>
                            <div className={styles.codeHeader}>
                                <span className={styles.codeDot} />
                                <span className={styles.codeDot} />
                                <span className={styles.codeDot} />
                                <span className={styles.codeFilename}>architecture.varch</span>
                            </div>
                            <pre className={styles.codeContent}>
                                {`db users "User Database"
svc auth "Auth Service"
ui web "Frontend App"

auth -> users "Read/Write"
web -> auth`}
                            </pre>
                        </div>
                        <div className={styles.arrowConnector}>→</div>
                        <div className={styles.diagramPreview}>
                            <svg viewBox="0 0 200 150" className={styles.diagramSvg}>
                                {/* Frontend App */}
                                <rect x="70" y="10" width="60" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <text x="100" y="29" textAnchor="middle" fontSize="8" fill="currentColor">Frontend App</text>

                                {/* Auth Service */}
                                <rect x="70" y="60" width="60" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <text x="100" y="79" textAnchor="middle" fontSize="8" fill="currentColor">Auth Service</text>

                                {/* User Database (Cylinder) */}
                                <ellipse cx="100" cy="115" rx="30" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M70 115 L70 135 Q70 143 100 143 Q130 143 130 135 L130 115" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <text x="100" y="130" textAnchor="middle" fontSize="7" fill="currentColor">User Database</text>

                                {/* Arrows */}
                                <line x1="100" y1="40" x2="100" y2="60" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" />
                                <line x1="100" y1="90" x2="100" y2="107" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" />

                                <defs>
                                    <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                                        <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
                                    </marker>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <h3 className={styles.stepTitle}>Write DSL</h3>
                            <p className={styles.stepDesc}>Define nodes and connections in plain text</p>
                        </div>
                        <div className={styles.stepConnector} />
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <h3 className={styles.stepTitle}>Parse to AST</h3>
                            <p className={styles.stepDesc}>Text is converted to a structured graph</p>
                        </div>
                        <div className={styles.stepConnector} />
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <h3 className={styles.stepTitle}>Auto Layout</h3>
                            <p className={styles.stepDesc}>Dagre calculates optimal positions</p>
                        </div>
                        <div className={styles.stepConnector} />
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>4</div>
                            <h3 className={styles.stepTitle}>Render SVG</h3>
                            <p className={styles.stepDesc}>Clean diagram appears instantly</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DSL Example */}
            <section id="dsl" className={styles.dslSection}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>Supported DSL (MVP)</h2>
                    <div className={styles.dslShowcase}>
                        <div className={styles.dslCode}>
                            <div className={styles.codeHeader}>
                                <span className={styles.codeDot} />
                                <span className={styles.codeDot} />
                                <span className={styles.codeDot} />
                                <span className={styles.codeFilename}>example.varch</span>
                            </div>
                            <pre className={styles.codeContent}>
                                {`db users "User Database"
svc auth "Auth Service"
ui web "Frontend App"

auth -> users "Read/Write"
web -> auth`}
                            </pre>
                        </div>
                        <p className={styles.dslCaption}>
                            Plain text. No configs. No UI friction.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className={styles.features}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>Core MVP Features</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><CodeIcon /></div>
                            <h3 className={styles.featureTitle}>DSL Parser</h3>
                            <p className={styles.featureDesc}>Converts text into structured architecture representation</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><LayoutIcon /></div>
                            <h3 className={styles.featureTitle}>Auto Layout</h3>
                            <p className={styles.featureDesc}>Uses graph layout engine for clean, readable diagrams</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><ImageIcon /></div>
                            <h3 className={styles.featureTitle}>SVG Rendering</h3>
                            <p className={styles.featureDesc}>Crisp, scalable vector graphics at any zoom level</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><ZapIcon /></div>
                            <h3 className={styles.featureTitle}>Real-time Preview</h3>
                            <p className={styles.featureDesc}>Instant updates as you type — zero delay feedback</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What VArch Is */}
            <section className={styles.comparison}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>What VArch Is (and Isn't)</h2>
                    <div className={styles.comparisonGrid}>
                        <div className={styles.comparisonColumn}>
                            <h3 className={styles.comparisonHeader}>
                                <span className={styles.checkBadge}><CheckIcon /></span>
                                VArch IS
                            </h3>
                            <ul className={styles.comparisonList}>
                                <li><CheckIcon /> Fast</li>
                                <li><CheckIcon /> Text-first</li>
                                <li><CheckIcon /> Deterministic diagrams</li>
                                <li><CheckIcon /> Built for developers</li>
                            </ul>
                        </div>
                        <div className={styles.comparisonColumn}>
                            <h3 className={styles.comparisonHeader}>
                                <span className={styles.xBadge}><XIcon /></span>
                                VArch is NOT
                            </h3>
                            <ul className={styles.comparisonListNot}>
                                <li><XIcon /> A drag-and-drop tool</li>
                                <li><XIcon /> A design tool like Figma</li>
                                <li><XIcon /> Overloaded with features (yet)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className={styles.finalCta}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.ctaTitle}>
                        Stop Drawing Diagrams.<br />
                        <span className={styles.ctaAccent}>Start Writing Them.</span>
                    </h2>
                    <Link to="/app" className={styles.ctaButton}>
                        Launch Editor
                        <ArrowRightIcon />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLogo}>
                        <span className={styles.logoIcon}>⬡</span>
                        <span>VArch</span>
                    </div>
                    <p className={styles.footerText}>
                        Visual Architecture — Code to diagrams, instantly.
                    </p>
                </div>
            </footer>
        </div>
    )
}
