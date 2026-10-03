import { useMemo, useRef } from 'react'
import type { AST } from '../types'
import { buildLayout } from '../utils/layout'
import { LiveDiagram } from './LiveDiagram'
import { ExportMenu } from './ExportMenu'
import styles from './DiagramViewer.module.css'
import { Workflow } from 'lucide-react'

type DiagramViewerProps = {
    ast: AST
}

export function DiagramViewer({ ast }: DiagramViewerProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const layout = useMemo(() => buildLayout(ast), [ast])

    if (ast.nodes.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <Workflow size={36} strokeWidth={1.5} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No diagram yet</h3>
                    <p className={styles.emptyText}>
                        Add a component like <code>svc api "API"</code> in the editor to start drawing.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <span className={styles.title}>Preview</span>
                <span className={styles.meta}>
                    {layout.nodes.length} {layout.nodes.length === 1 ? 'component' : 'components'}, {layout.edges.length} {layout.edges.length === 1 ? 'connection' : 'connections'}
                </span>
                <ExportMenu svgRef={svgRef} width={layout.width} height={layout.height} />
            </div>
            <div className={styles.svgContainer}>
                <LiveDiagram ref={svgRef} layout={layout} />
            </div>
        </div>
    )
}
