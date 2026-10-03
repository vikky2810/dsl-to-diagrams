import { useId } from 'react'
import type { Ref } from 'react'
import type { Layout, PositionedNode } from '../types'
import styles from './LiveDiagram.module.css'

type LiveDiagramProps = {
    layout: Layout
    animate?: boolean
    className?: string
    ref?: Ref<SVGSVGElement>
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

function NodeShape({ node }: { node: PositionedNode }) {
    const { width: w, height: h } = node

    switch (node.type) {
        case 'db':
            return (
                <>
                    <path
                        d={`M0,8 L0,${h - 8} A${w / 2},8 0 0 0 ${w},${h - 8} L${w},8`}
                        className={styles.nodeBody}
                    />
                    <ellipse cx={w / 2} cy={8} rx={w / 2} ry={8} className={styles.nodeBody} />
                </>
            )
        case 'queue':
            // Offset back plate reads as "a stack of messages"
            return (
                <>
                    <rect x={5} y={-5} width={w} height={h} rx={8} className={styles.nodeBack} />
                    <rect width={w} height={h} rx={8} className={styles.nodeBody} />
                </>
            )
        case 'ui':
            return (
                <>
                    <rect width={w} height={h} rx={8} className={styles.nodeBody} />
                    <line x1={0} y1={14} x2={w} y2={14} className={styles.nodeDetail} />
                </>
            )
        case 'text':
            return <rect width={w} height={h} rx={8} className={`${styles.nodeBody} ${styles.nodeNote}`} />
        default:
            return <rect width={w} height={h} rx={8} className={styles.nodeBody} />
    }
}

// Renders a dagre layout (from utils/layout) with left-to-right curved edges
export function LiveDiagram({ layout, animate = true, className, ref }: LiveDiagramProps) {
    const markerId = `arrow-${useId().replace(/:/g, '')}`

    return (
        <svg
            ref={ref}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            preserveAspectRatio="xMidYMid meet"
            className={`${styles.diagram} ${animate ? styles.animated : ''} ${className ?? ''}`}
            role="img"
            aria-label={`Diagram with ${plural(layout.nodes.length, 'component')} and ${plural(layout.edges.length, 'connection')}`}
        >
            <defs>
                <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" className={styles.arrowHead} />
                </marker>
            </defs>

            <g>
                {layout.edges.map((edge, idx) => {
                    const { from, to } = edge
                    const x1 = from.x + from.width
                    const y1 = from.y + from.height / 2
                    const x2 = to.x - 4
                    const y2 = to.y + to.height / 2
                    const dx = Math.max(40, Math.abs(x2 - x1) / 2)
                    const mx = (x1 + x2) / 2
                    const my = (y1 + y2) / 2
                    const labelWidth = (edge.label?.length ?? 0) * 6.6 + 16

                    return (
                        <g key={`${from.id}>${to.id}-${idx}`} className={styles.edge}>
                            <path
                                d={`M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`}
                                pathLength={1}
                                className={styles.edgePath}
                                markerEnd={`url(#${markerId})`}
                            />
                            {edge.label && (
                                <g className={styles.edgeLabel}>
                                    <rect x={mx - labelWidth / 2} y={my - 10} width={labelWidth} height={20} rx={4} />
                                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central">
                                        {edge.label}
                                    </text>
                                </g>
                            )}
                        </g>
                    )
                })}
            </g>

            <g>
                {layout.nodes.map(node => (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                        <g className={styles.node}>
                            <NodeShape node={node} />
                            <text
                                x={node.width / 2}
                                y={node.height / 2 + (node.type === 'db' ? 2 : -2)}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className={styles.nodeLabel}
                            >
                                {node.label}
                            </text>
                            <text
                                x={node.width / 2}
                                y={node.height - 10}
                                textAnchor="middle"
                                className={styles.nodeType}
                            >
                                {node.type}
                            </text>
                        </g>
                    </g>
                ))}
            </g>
        </svg>
    )
}
