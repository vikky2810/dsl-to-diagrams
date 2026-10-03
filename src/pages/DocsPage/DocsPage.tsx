import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Hexagon, Moon, Sun } from 'lucide-react'
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'
import { parseDSL } from '../../utils/parser'
import { useLayout } from '../../utils/layout'
import { LiveDiagram } from '../../components/LiveDiagram'
import styles from './DocsPage.module.css'

const SECTIONS = [
    { id: 'quick-start', title: 'Quick start' },
    { id: 'components', title: 'Components' },
    { id: 'connections', title: 'Connections' },
    { id: 'notes', title: 'Notes' },
    { id: 'comments', title: 'Comments and blank lines' },
    { id: 'rules', title: 'Rules' },
    { id: 'example', title: 'Full example' },
    { id: 'export', title: 'Exporting' },
]

const COMPONENTS = [
    { keyword: 'svc', name: 'Service', code: 'svc api "API Gateway"', desc: 'Any running process: APIs, workers, functions.' },
    { keyword: 'db', name: 'Database', code: 'db users "Users DB"', desc: 'Drawn as a cylinder so storage reads at a glance.' },
    { keyword: 'ui', name: 'Interface', code: 'ui web "Web App"', desc: 'Clients, dashboards and anything a person touches.' },
    { keyword: 'queue', name: 'Queue', code: 'queue jobs "Job Queue"', desc: 'Brokers, buses and streams between services.' },
]

const QUICK_START = `ui web "Web App"
svc api "API"
db users "Users DB"

web -> api
api -> users "read/write"`

const CONNECTIONS = `svc api "API"
db users "Users DB"
queue events "Event Bus"

api -> users "query"
connect api -> events "publish"`

const NOTES = `svc api "API"
db users "Users DB"
text users "Stores credentials"
text users "10k rows"
text todo "Add a cache here"

api -> users`

const FULL_EXAMPLE = `# Clients
ui web "Web App"
ui admin "Admin Console"

# Backend
svc gateway "API Gateway"
svc auth "Auth Service"
svc billing "Billing"
queue events "Event Bus"
db users "Users DB"
db orders "Orders DB"

web -> gateway "HTTPS"
admin -> gateway
gateway -> auth "verify"
auth -> users
gateway -> billing "charge"
billing -> orders
billing -> events "publish"
events -> orders "persist"`

const KEYWORDS = /^(db|svc|ui|queue|text|connect)\b/

// Tiny highlighter for DSL samples: keywords, strings, arrows and # comments
function highlight(line: string): ReactNode[] {
    if (line.trim().startsWith('#')) return [<span key="c" className={styles.tokComment}>{line}</span>]

    const out: ReactNode[] = []
    let rest = line
    let i = 0
    const keyword = rest.match(KEYWORDS)
    if (keyword) {
        out.push(<span key={i++} className={styles.tokKeyword}>{keyword[0]}</span>)
        rest = rest.slice(keyword[0].length)
    }
    for (const part of rest.split(/("[^"]*"|->)/)) {
        if (!part) continue
        if (part === '->') out.push(<span key={i++} className={styles.tokArrow}>{part}</span>)
        else if (part.startsWith('"')) out.push(<span key={i++} className={styles.tokString}>{part}</span>)
        else out.push(part)
    }
    return out
}

function Code({ children }: { children: string }) {
    return (
        <pre className={styles.code}>
            <code>
                {children.split('\n').map((line, idx) => (
                    <div key={idx} className={styles.codeLine}>{line ? highlight(line) : ' '}</div>
                ))}
            </code>
        </pre>
    )
}

// A DSL sample with the diagram it produces underneath
function Example({ dsl }: { dsl: string }) {
    const ast = useMemo(() => parseDSL(dsl).ast, [dsl])
    const layout = useLayout(ast)

    return (
        <figure className={styles.example}>
            <Code>{dsl}</Code>
            <div className={styles.preview}>
                <div
                    className={styles.previewCanvas}
                    style={{ maxWidth: layout.width, aspectRatio: `${layout.width} / ${layout.height}` }}
                >
                    <LiveDiagram layout={layout} animate={false} />
                </div>
            </div>
        </figure>
    )
}

function InlineCode({ children }: { children: ReactNode }) {
    return <code className={styles.inlineCode}>{children}</code>
}

// Highlights the sidebar entry for the section currently in view
function useActiveSection() {
    const [active, setActive] = useState(SECTIONS[0].id)

    useEffect(() => {
        const update = () => {
            // At the bottom of the page the last sections can't scroll up to the header
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
            if (atBottom) {
                setActive(SECTIONS[SECTIONS.length - 1].id)
                return
            }
            let current = SECTIONS[0].id
            for (const s of SECTIONS) {
                const el = document.getElementById(s.id)
                if (el && el.getBoundingClientRect().top <= 120) current = s.id
            }
            setActive(current)
        }
        update()
        window.addEventListener('scroll', update, { passive: true })
        return () => window.removeEventListener('scroll', update)
    }, [])

    return active
}

function DocsContent() {
    const { theme, toggleTheme } = useTheme()
    const active = useActiveSection()

    useEffect(() => {
        document.title = 'Docs · VArch'
    }, [])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link to="/" className={styles.brand}>
                    <Hexagon size={18} strokeWidth={2} className={styles.brandIcon} />
                    VArch
                    <span className={styles.brandSub}>Docs</span>
                </Link>
                <div className={styles.headerRight}>
                    <Link to="/app" className={styles.editorLink}>
                        Open editor <ArrowRight size={14} strokeWidth={2} />
                    </Link>
                    <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
                    </button>
                </div>
            </header>

            <div className={styles.layout}>
                <nav className={styles.sidebar} aria-label="On this page">
                    <span className={styles.sidebarHeading}>On this page</span>
                    <ul>
                        {SECTIONS.map(s => (
                            <li key={s.id}>
                                <a
                                    href={`#${s.id}`}
                                    className={styles.sidebarLink}
                                    aria-current={active === s.id ? 'location' : undefined}
                                >
                                    {s.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className={styles.content}>
                    <div className={styles.intro}>
                        <p className={styles.eyebrow}>DSL reference</p>
                        <h1>Write diagrams as text</h1>
                        <p className={styles.lead}>
                            VArch turns a few lines of plain text into an architecture diagram. Each line declares a
                            component or connects two of them, and the layout is worked out for you.
                        </p>
                    </div>

                    <section id="quick-start" className={styles.section}>
                        <h2>Quick start</h2>
                        <p>Declare your components, then draw arrows between their ids.</p>
                        <Example dsl={QUICK_START} />
                    </section>

                    <section id="components" className={styles.section}>
                        <h2>Components</h2>
                        <p>
                            A component is a keyword, an id, and an optional label in double quotes:{' '}
                            <InlineCode>keyword id "Label"</InlineCode>. The id is how you refer to it in connections;
                            the label is what appears in the diagram.
                        </p>
                        <div className={styles.table}>
                            {COMPONENTS.map(c => (
                                <div key={c.keyword} className={styles.row}>
                                    <span className={styles.rowKeyword}>{c.keyword}</span>
                                    <div>
                                        <div className={styles.rowName}>{c.name}</div>
                                        <div className={styles.rowDesc}>{c.desc}</div>
                                    </div>
                                    <code className={styles.rowCode}>{highlight(c.code)}</code>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="connections" className={styles.section}>
                        <h2>Connections</h2>
                        <p>
                            Connect two components with <InlineCode>from -&gt; to</InlineCode>, optionally followed by a
                            label. The <InlineCode>connect</InlineCode> keyword in front is optional and does the same thing.
                        </p>
                        <Example dsl={CONNECTIONS} />
                    </section>

                    <section id="notes" className={styles.section}>
                        <h2>Notes</h2>
                        <p>
                            <InlineCode>text id "Note"</InlineCode> attaches a note to a component, shown beneath it.
                            Add as many as you like. If the id isn't a component, the line creates a free-standing
                            note instead, drawn with a dashed border.
                        </p>
                        <Example dsl={NOTES} />
                    </section>

                    <section id="comments" className={styles.section}>
                        <h2>Comments and blank lines</h2>
                        <p>
                            Lines starting with <InlineCode>#</InlineCode> are comments. Blank lines are ignored, so use
                            both freely to group related parts of a diagram.
                        </p>
                    </section>

                    <section id="rules" className={styles.section}>
                        <h2>Rules</h2>
                        <ul className={styles.list}>
                            <li>Ids use letters, numbers and underscores, e.g. <InlineCode>auth_v2</InlineCode>.</li>
                            <li>Labels are optional. Without one, the id is shown instead.</li>
                            <li>Both ends of a connection must be declared as components, anywhere in the file.</li>
                            <li>Declaring the same id twice updates it: the later line sets the type, and the label if one is given.</li>
                            <li>Lines that don't match any syntax, or connect an id that was never declared, are listed under the editor with their line number. The rest of the diagram still renders.</li>
                            <li>Diagrams flow left to right and redraw as you type.</li>
                        </ul>
                    </section>

                    <section id="example" className={styles.section}>
                        <h2>Full example</h2>
                        <p>A small web system with clients, services, a queue and two databases.</p>
                        <Example dsl={FULL_EXAMPLE} />
                    </section>

                    <section id="export" className={styles.section}>
                        <h2>Exporting</h2>
                        <p>
                            Use <strong>Export</strong> above the preview in the editor. Pick a format, a background,
                            then download.
                        </p>
                        <ul className={styles.list}>
                            <li><strong>PNG</strong> and <strong>JPG</strong> are rendered at 2x for sharp slides and docs.</li>
                            <li><strong>SVG</strong> stays crisp at any size and can be edited in design tools.</li>
                            <li><strong>Transparent</strong> keeps your current theme's colours; JPG can't be transparent.</li>
                            <li><strong>Coloured</strong> fills the background, and the diagram switches to light or dark ink to stay readable on it.</li>
                        </ul>
                    </section>

                    <footer className={styles.footer}>
                        <span>Ready to draw?</span>
                        <Link to="/app" className={styles.footerCta}>
                            Open the editor <ArrowRight size={14} strokeWidth={2} />
                        </Link>
                    </footer>
                </main>
            </div>
        </div>
    )
}

export function DocsPage() {
    return (
        <ThemeProvider>
            <DocsContent />
        </ThemeProvider>
    )
}
