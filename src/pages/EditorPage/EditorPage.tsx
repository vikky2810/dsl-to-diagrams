import { useState } from 'react'
import { Link } from 'react-router-dom'
import { parseDSL } from '../../utils/parser'
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'
import { EditorPanel } from '../../components/EditorPanel'
import { DiagramViewer } from '../../components/DiagramViewer'
import styles from './EditorPage.module.css'
import { Hexagon, Sun, Moon, ArrowLeft, ArrowUpRight, BookOpen } from 'lucide-react'

// Example DSL text
const EXAMPLE_DSL = `db db1 "UserDB"
svc api "Auth Service"

text db1 "Stores user credentials"
text db1 "10k users"

api -> db1 "Read/Write"`

function EditorHeader() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <Link to="/" className={styles.backLink}>
                    <ArrowLeft size={16} strokeWidth={2} />
                    Home
                </Link>
            </div>
            <div className={styles.headerCenter}>
                <span className={styles.logoIcon}><Hexagon size={18} strokeWidth={2} /></span>
                <span className={styles.logoText}>VArch Editor</span>
            </div>
            <div className={styles.headerRight}>
                <a
                    href="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.docsLink}
                    title="DSL reference (opens in a new tab)"
                >
                    <BookOpen size={15} strokeWidth={2} />
                    Docs
                    <ArrowUpRight size={13} strokeWidth={2} className={styles.docsLinkArrow} />
                </a>
                <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Sun size={16} strokeWidth={2} />
                    ) : (
                        <Moon size={16} strokeWidth={2} />
                    )}
                </button>
            </div>
        </header>
    )
}

function EditorContent() {
    const [dslText, setDslText] = useState(EXAMPLE_DSL)
    const parsed = parseDSL(dslText)

    return (
        <div className={styles.editor}>
            <EditorHeader />

            <div className={styles.editorContainer}>
                <div className={styles.editorPane}>
                    <EditorPanel value={dslText} onChange={setDslText} />
                </div>

                <div className={styles.previewPane}>
                    <DiagramViewer ast={parsed.ast} />
                </div>
            </div>
        </div>
    )
}

export function EditorPage() {
    return (
        <ThemeProvider>
            <EditorContent />
        </ThemeProvider>
    )
}
