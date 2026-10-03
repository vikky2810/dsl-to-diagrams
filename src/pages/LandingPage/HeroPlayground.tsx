import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { parseDSL } from '../../utils/parser'
import { buildLayout, useLayout } from '../../utils/layout'
import type { Layout } from '../../types'
import { LiveDiagram } from '../../components/LiveDiagram'
import styles from './HeroPlayground.module.css'

const EXAMPLE_DSL = `ui web "Web App"
svc api "API Gateway"
queue jobs "Job Queue"
db users "Users DB"

web -> api
api -> users "read/write"
api -> jobs "enqueue"`

const EXAMPLE_AST = parseDSL(EXAMPLE_DSL).ast

const KEYWORD = /^(\s*)(db|svc|ui|queue|text|connect)\b/
const TOKENS = /("[^"]*"?|->)/

function highlightLine(line: string, lineIdx: number): ReactNode[] {
    const out: ReactNode[] = []
    let rest = line
    const kw = rest.match(KEYWORD)
    if (kw) {
        out.push(kw[1], <span key="kw" className={styles.tokKeyword}>{kw[2]}</span>)
        rest = rest.slice(kw[0].length)
    }
    rest.split(TOKENS).forEach((part, i) => {
        if (!part) return
        if (part === '->') out.push(<span key={`${lineIdx}-${i}`} className={styles.tokArrow}>{part}</span>)
        else if (part.startsWith('"')) out.push(<span key={`${lineIdx}-${i}`} className={styles.tokString}>{part}</span>)
        else out.push(part)
    })
    return out
}

function usePrefersReducedMotion() {
    const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return reduce
}

// While auto-typing, show the final layout filtered to what has been typed,
// so nodes appear in place instead of reshuffling on every line.
function filterLayout(full: Layout, text: string): Layout {
    const { ast } = parseDSL(text)
    const nodeIds = new Set(ast.nodes.map(n => n.id))
    const edgeKeys = new Set(ast.edges.map(e => `${e.from}>${e.to}`))
    return {
        ...full,
        nodes: full.nodes.filter(n => nodeIds.has(n.id)),
        edges: full.edges.filter(e => edgeKeys.has(`${e.from.id}>${e.to.id}`)),
    }
}

export function HeroPlayground() {
    const reduceMotion = usePrefersReducedMotion()
    const [text, setText] = useState(reduceMotion ? EXAMPLE_DSL : '')
    const [typing, setTyping] = useState(!reduceMotion)
    const highlightRef = useRef<HTMLPreElement>(null)
    const gutterRef = useRef<HTMLDivElement>(null)

    const exampleLayout = useLayout(EXAMPLE_AST)

    useEffect(() => {
        if (!typing) return
        let i = 0
        let timer = window.setTimeout(function tick() {
            i += 1
            setText(EXAMPLE_DSL.slice(0, i))
            if (i >= EXAMPLE_DSL.length) {
                setTyping(false)
                return
            }
            // Pause at line ends so each line reads as a deliberate step
            timer = window.setTimeout(tick, EXAMPLE_DSL[i - 1] === '\n' ? 260 : 26)
        }, 900)
        return () => window.clearTimeout(timer)
    }, [typing])

    const layout = useMemo(() => {
        if (typing) {
            // Only commit completed lines to the diagram
            return filterLayout(exampleLayout, text.slice(0, text.lastIndexOf('\n') + 1))
        }
        if (text === EXAMPLE_DSL) return exampleLayout
        return buildLayout(parseDSL(text).ast)
    }, [typing, text, exampleLayout])

    const lines = text.split('\n')
    const edited = !typing && text !== EXAMPLE_DSL

    const finishTyping = () => {
        if (!typing) return
        setTyping(false)
        setText(EXAMPLE_DSL)
    }

    const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        const { scrollTop, scrollLeft } = e.currentTarget
        if (highlightRef.current) {
            highlightRef.current.scrollTop = scrollTop
            highlightRef.current.scrollLeft = scrollLeft
        }
        if (gutterRef.current) gutterRef.current.scrollTop = scrollTop
    }

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <span className={styles.filename}>architecture.varch</span>
                {edited ? (
                    <button type="button" className={styles.resetBtn} onClick={() => setText(EXAMPLE_DSL)}>
                        <RotateCcw size={13} strokeWidth={2} />
                        Reset
                    </button>
                ) : (
                    <span className={styles.liveTag}>
                        <span className={styles.liveDot} aria-hidden="true" />
                        Live
                    </span>
                )}
            </div>

            <div className={styles.code}>
                <div ref={gutterRef} className={styles.gutter} aria-hidden="true">
                    {lines.map((_, i) => (
                        <span key={i}>{i + 1}</span>
                    ))}
                </div>
                <div className={styles.editorWrap}>
                    <pre ref={highlightRef} className={styles.highlight} aria-hidden="true">
                        {lines.map((line, i) => (
                            <span key={i}>
                                {highlightLine(line, i)}
                                {typing && i === lines.length - 1 && <span className={styles.caret} />}
                                {i < lines.length - 1 && '\n'}
                            </span>
                        ))}
                        {'\n'}
                    </pre>
                    <textarea
                        className={styles.input}
                        value={text}
                        onChange={e => {
                            setTyping(false)
                            setText(e.target.value)
                        }}
                        onFocus={finishTyping}
                        onScroll={syncScroll}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        aria-label="VArch DSL. Edit to update the diagram."
                    />
                </div>
            </div>

            <div className={styles.canvas}>
                {layout.nodes.length > 0 ? (
                    <LiveDiagram layout={layout} />
                ) : (
                    !typing && (
                        <p className={styles.empty}>
                            Add a line like <code>svc api "API"</code> to start drawing.
                        </p>
                    )
                )}
            </div>
        </div>
    )
}
