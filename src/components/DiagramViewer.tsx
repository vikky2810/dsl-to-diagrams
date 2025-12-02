import type { AST } from '../types'
import { buildLayout, NODE_WIDTH, NODE_HEIGHT } from '../utils/layout'
import styles from './DiagramViewer.module.css'

type DiagramViewerProps = {
    ast: AST
}

// Node type colors
const NODE_COLORS: Record<string, { fill: string; stroke: string; gradient: [string, string] }> = {
    db: {
        fill: '#1e293b',
        stroke: '#3b82f6',
        gradient: ['#3b82f6', '#1d4ed8'],
    },
    svc: {
        fill: '#1e293b',
        stroke: '#8b5cf6',
        gradient: ['#8b5cf6', '#6d28d9'],
    },
    ui: {
        fill: '#1e293b',
        stroke: '#ec4899',
        gradient: ['#ec4899', '#db2777'],
    },
    queue: {
        fill: '#1e293b',
        stroke: '#f59e0b',
        gradient: ['#f59e0b', '#d97706'],
    },
    text: {
        fill: '#1e293b',
        stroke: '#6b7280',
        gradient: ['#6b7280', '#4b5563'],
    },
}

export function DiagramViewer({ ast }: DiagramViewerProps) {
    if (ast.nodes.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📊</div>
                    <h3 className={styles.emptyTitle}>No Diagram Yet</h3>
                    <p className={styles.emptyText}>
                        Start typing in the DSL editor to see your architecture diagram
                    </p>
                </div>
            </div>
        )
    }

    const layout = buildLayout(ast)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Architecture Diagram</h3>
            </div>

            <div className={styles.svgContainer}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${layout.width} ${layout.height}`}
                    className={styles.svg}
                >
                    <defs>
                        {/* Gradient definitions for each node type */}
                        {Object.entries(NODE_COLORS).map(([type, colors]) => (
                            <linearGradient
                                key={type}
                                id={`gradient-${type}`}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor={colors.gradient[0]} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={colors.gradient[1]} stopOpacity="0.6" />
                            </linearGradient>
                        ))}

                        {/* Drop shadow filter */}
                        <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="0" dy="2" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Glow filter */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Edges */}
                    <g className={styles.edges}>
                        {layout.edges.map((edge, idx) => {
                            // FIX: Resolve the actual node objects using the IDs from the edge
                            // This handles cases where edge.from is a string ID ("api") OR an object
                            const sourceId = typeof edge.from === 'string' ? edge.from : edge.from.id;
                            const targetId = typeof edge.to === 'string' ? edge.to : edge.to.id;

                            const sourceNode = layout.nodes.find(n => n.id === sourceId);
                            const targetNode = layout.nodes.find(n => n.id === targetId);

                            // If we can't find the nodes, don't render this edge
                            if (!sourceNode || !targetNode) return null;

                            const x1 = sourceNode.x + NODE_WIDTH / 2
                            const y1 = sourceNode.y + NODE_HEIGHT / 2
                            const x2 = targetNode.x + NODE_WIDTH / 2
                            const y2 = targetNode.y + NODE_HEIGHT / 2

                            // Midpoints for the label
                            const mx = (x1 + x2) / 2
                            const my = (y1 + y2) / 2

                            // Arrow calculations
                            const angle = Math.atan2(y2 - y1, x2 - x1)
                            const arrowSize = 8
                            // Offset arrow slightly from the center of the destination node
                            const arrowX = x2 - Math.cos(angle) * (NODE_WIDTH / 2 + 8)
                            const arrowY = y2 - Math.sin(angle) * (NODE_HEIGHT / 2 + 8)

                            const arrowLeftX = arrowX - arrowSize * Math.cos(angle - Math.PI / 6)
                            const arrowLeftY = arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
                            const arrowRightX = arrowX - arrowSize * Math.cos(angle + Math.PI / 6)
                            const arrowRightY = arrowY - arrowSize * Math.sin(angle + Math.PI / 6)

                            const labelX = mx
                            const labelY = my - 12

                            return (
                                <g key={`${sourceId}-${targetId}-${idx}`}>
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        // FIX: Use a solid color first to ensure visibility. 
                                        // Gradients on 1px lines can often disappear or look invisible.
                                        stroke="#94a3b8"
                                        strokeWidth={2}
                                        opacity={0.6}
                                    />
                                    <polygon
                                        points={`${arrowX + 4},${arrowY} ${arrowLeftX},${arrowLeftY} ${arrowRightX},${arrowRightY}`}
                                        fill="#94a3b8"
                                        opacity={0.8}
                                    />
                                    {edge.label && (
                                        <g>
                                            <rect
                                                x={labelX - (edge.label.length * 4)}
                                                y={labelY - 10}
                                                width={edge.label.length * 8}
                                                height={20}
                                                fill="rgba(15, 23, 42, 0.9)" // Darker background for readability
                                                stroke="rgba(148, 163, 184, 0.5)"
                                                strokeWidth={1}
                                                rx={4}
                                            />
                                            <text
                                                x={labelX}
                                                y={labelY}
                                                fill="#e2e8f0"
                                                fontSize={11}
                                                fontWeight={500}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                {edge.label}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            )
                        })}
                    </g>

                    {/* Nodes */}
                    <g className={styles.nodes}>
                        {layout.nodes.map(node => {
                            const colors = NODE_COLORS[node.type] || NODE_COLORS.text

                            return (
                                <g key={node.id} filter="url(#drop-shadow)">
                                    {/* Background glow */}
                                    <rect
                                        x={node.x - 2}
                                        y={node.y - 2}
                                        width={NODE_WIDTH + 4}
                                        height={NODE_HEIGHT + 4}
                                        rx={8}
                                        fill={`url(#gradient-${node.type})`}
                                        opacity={0.2}
                                        filter="url(#glow)"
                                    />

                                    {/* Main node */}
                                    <rect
                                        x={node.x}
                                        y={node.y}
                                        width={NODE_WIDTH}
                                        height={NODE_HEIGHT}
                                        rx={6}
                                        fill={colors.fill}
                                        stroke={colors.stroke}
                                        strokeWidth={2}
                                        className={styles.nodeRect}
                                    />

                                    {/* Node label */}
                                    <text
                                        x={node.x + NODE_WIDTH / 2}
                                        y={node.y + NODE_HEIGHT / 2 - 4}
                                        fill="#ffffff"
                                        fontSize={13}
                                        fontWeight={600}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        {node.label}
                                    </text>

                                    {/* Node type badge */}
                                    <text
                                        x={node.x + NODE_WIDTH / 2}
                                        y={node.y + NODE_HEIGHT - 12}
                                        fill={colors.stroke}
                                        fontSize={9}
                                        fontWeight={500}
                                        textAnchor="middle"
                                        opacity={0.8}
                                    >
                                        {node.type.toUpperCase()}
                                    </text>
                                </g>
                            )
                        })}
                    </g>
                </svg>
            </div>
        </div>
    )
}
