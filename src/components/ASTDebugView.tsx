import { useState } from 'react'
import type { AST } from '../types'
import styles from './ASTDebugView.module.css'

type ASTDebugViewProps = {
    ast: AST
}

export function ASTDebugView({ ast }: ASTDebugViewProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(ast, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>AST Debug View</h3>
                <div className={styles.actions}>
                    <button
                        className={styles.copyButton}
                        onClick={handleCopy}
                        title="Copy to clipboard"
                    >
                        {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button
                        className={styles.toggleButton}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '▼ Collapse' : '▶ Expand'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <pre className={styles.content}>
                    {JSON.stringify(ast, null, 2)}
                </pre>
            )}
        </div>
    )
}
