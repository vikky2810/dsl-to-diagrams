import { useRef, useEffect } from 'react'
import { CircleAlert } from 'lucide-react'
import type { ParseError } from '../types'
import styles from './EditorPanel.module.css'

type EditorPanelProps = {
    value: string
    onChange: (value: string) => void
    errors?: ParseError[]
}

export function EditorPanel({ value, onChange, errors = [] }: EditorPanelProps) {
    const lineCount = value.split('\n').length
    const charCount = value.length
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const highlightLayerRef = useRef<HTMLDivElement>(null)
    const errorLines = new Set(errors.map(e => e.line))

    useEffect(() => {
        const textarea = textareaRef.current
        const highlightLayer = highlightLayerRef.current
        if (!textarea || !highlightLayer) return

        const handleScroll = () => {
            highlightLayer.scrollTop = textarea.scrollTop
            highlightLayer.scrollLeft = textarea.scrollLeft
        }

        textarea.addEventListener('scroll', handleScroll)
        return () => textarea.removeEventListener('scroll', handleScroll)
    }, [])

    const highlightedContent = value
        .split('\n')
        .map((line, idx) => {
            const lineClass = errorLines.has(idx + 1) ? 'line error' : 'line'
            if (!line.trim()) {
                return `<div class="${lineClass}"><span class="line-number">${idx + 1}</span> </div>`
            }

            let result = ''
            let i = 0
            let inString = false

            const isWordChar = (char: string) => /[a-zA-Z0-9_]/.test(char)
            const keywords = ['db', 'svc', 'ui', 'queue', 'text', 'connect']

            while (i < line.length) {
                // Handle string quotes
                if (line[i] === '"' && (i === 0 || line[i - 1] !== '\\')) {
                    if (!inString) {
                        inString = true
                        result += `<span class="string">"`
                        i++
                        continue
                    } else {
                        inString = false
                        result += `"</span>`
                        i++
                        continue
                    }
                }

                // Inside string — just escape characters
                if (inString) {
                    const char = line[i]
                    if (char === '&') result += '&amp;'
                    else if (char === '<') result += '&lt;'
                    else if (char === '>') result += '&gt;'
                    else result += char

                    i++
                    continue
                }

                // Arrow (->)
                if (i < line.length - 1 && line[i] === '-' && line[i + 1] === '>') {
                    result += '<span class="arrow">-&gt;</span>'
                    i += 2
                    continue
                }

                // Keywords
                let keywordMatched = false
                for (const keyword of keywords) {
                    if (i + keyword.length <= line.length) {
                        const substr = line.substring(i, i + keyword.length)
                        if (substr === keyword) {
                            const before = i === 0 ? true : !isWordChar(line[i - 1])
                            const after = i + keyword.length >= line.length ? true : !isWordChar(line[i + keyword.length])

                            if (before && after) {
                                result += `<span class="keyword">${keyword}</span>`
                                i += keyword.length
                                keywordMatched = true
                                break
                            }
                        }
                    }
                }
                if (keywordMatched) continue

                // Regular char
                const char = line[i]
                if (char === '&') result += '&amp;'
                else if (char === '<') result += '&lt;'
                else if (char === '>') result += '&gt;'
                else result += char

                i++
            }

            return `<div class="${lineClass}"><span class="line-number">${idx + 1}</span>${result}</div>`
        })
        .join('')

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.title}>architecture.varch</h2>
                <span className={styles.stats}>
                    {lineCount} {lineCount === 1 ? 'line' : 'lines'}, {charCount} chars
                    {errors.length > 0 && (
                        <span className={styles.errorCount}>
                            , {errors.length} {errors.length === 1 ? 'problem' : 'problems'}
                        </span>
                    )}
                </span>
            </div>

            <div className={styles.editorContainer}>
                <div
                    ref={highlightLayerRef}
                    className={styles.highlightLayer}
                    dangerouslySetInnerHTML={{ __html: highlightedContent }}
                />
                <textarea
                    ref={textareaRef}
                    className={styles.editor}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={'svc api "API Gateway"'}
                    aria-label="VArch DSL editor"
                    spellCheck={false}
                />
            </div>

            {errors.length > 0 && (
                <ul className={styles.problems} aria-label="Problems" aria-live="polite">
                    {errors.map((error, i) => (
                        <li key={i} className={styles.problem}>
                            <CircleAlert size={13} strokeWidth={2} className={styles.problemIcon} />
                            <span className={styles.problemLine}>Line {error.line}</span>
                            <span>{error.message}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
