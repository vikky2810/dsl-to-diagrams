import type { AST } from '../types'
import styles from './ASTSummary.module.css'

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
                    <div className={styles.icon}>📝</div>
                    <div className={styles.value}>{lineCount}</div>
                    <div className={styles.label}>Lines</div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}>🔷</div>
                    <div className={styles.value}>{ast.nodes.length}</div>
                    <div className={styles.label}>Nodes</div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}>🔗</div>
                    <div className={styles.value}>{ast.edges.length}</div>
                    <div className={styles.label}>Edges</div>
                </div>
            </div>
        </div>
    )
}
