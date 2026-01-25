import type { AST } from '../types'
import styles from './ASTSummary.module.css'
import { FileText, Box, Link as LinkIcon } from 'lucide-react'

type ASTSummaryProps = {
    ast: AST
    lineCount: number
}

export function ASTSummary({ ast, lineCount }: ASTSummaryProps) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>AST Summary</h3>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.icon}><FileText size={24} /></div>
                    <div className={styles.value}>{lineCount}</div>
                    <div className={styles.label}>Lines</div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}><Box size={24} /></div>
                    <div className={styles.value}>{ast.nodes.length}</div>
                    <div className={styles.label}>Nodes</div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}><LinkIcon size={24} /></div>
                    <div className={styles.value}>{ast.edges.length}</div>
                    <div className={styles.label}>Edges</div>
                </div>
            </div>
        </div>
    )
}
