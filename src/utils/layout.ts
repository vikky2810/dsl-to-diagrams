import * as dagre from 'dagre'
import type { AST, Layout, PositionedNode } from '../types'

const NODE_WIDTH = 120
const NODE_HEIGHT = 60
const NODE_MARGIN_X = 80
const NODE_MARGIN_Y = 40

export function buildLayout(ast: AST): Layout {
    if (ast.nodes.length === 0) {
        return { nodes: [], edges: [], width: 0, height: 0 }
    }

    // Calculate the maximum edge label length to adjust ranksep dynamically
    const maxEdgeLabelLength = ast.edges.reduce((max, edge) => Math.max(max, (edge.label || '').length), 0)
    // Base separation of 60px + approx 9px per character of the longest edge label
    // Ensure a minimum separation of 100px
    const dynamicRankSep = Math.max(100, 60 + maxEdgeLabelLength * 9)

    // Build a Dagre graph for automatic layout
    const g = new dagre.graphlib.Graph()
        .setGraph({
            rankdir: 'LR',
            nodesep: 50, // Vertical spacing between nodes
            ranksep: dynamicRankSep, // Horizontal spacing adjusted for edge labels
            marginx: NODE_MARGIN_X,
            marginy: NODE_MARGIN_Y,
        })
        .setDefaultEdgeLabel(() => ({}))

    ast.nodes.forEach(node => {
        // Calculate dynamic width based on label length
        // Base width 120px, approx 11px per character for font size 13 (increased from 9 for safety)
        // Add padding (approx 40px)
        const calculatedWidth = Math.max(NODE_WIDTH, node.label.length * 11 + 40)

        g.setNode(node.id, {
            width: calculatedWidth,
            height: NODE_HEIGHT,
            // keep a reference to the original node data
            node,
        })
    })

    ast.edges.forEach(edge => {
        g.setEdge(edge.from, edge.to, {
            label: edge.label ?? undefined,
        })
    })

    dagre.layout(g)

    const positionedNodes: PositionedNode[] = g.nodes().map(nodeId => {
        const gNode = g.node(nodeId) as dagre.Node & { node: typeof ast.nodes[0] }

        // dagre returns center coordinates, we need top-left
        const width = gNode.width
        const height = gNode.height
        const x = gNode.x - width / 2
        const y = gNode.y - height / 2

        return {
            ...gNode.node,
            x,
            y,
            width,
            height,
        }
    })

    const byId = new Map<string, PositionedNode>()
    positionedNodes.forEach(n => byId.set(n.id, n))

    const positionedEdges = ast.edges
        .map(edge => {
            const from = byId.get(edge.from)
            const to = byId.get(edge.to)
            if (!from || !to) return null

            return {
                from,
                to,
                label: edge.label ?? undefined,
            }
        })
        .filter((e): e is NonNullable<typeof e> => e !== null)

    // Compute overall diagram bounds from positioned nodes
    const maxX = Math.max(...positionedNodes.map(n => n.x + n.width)) + NODE_MARGIN_X
    const maxY = Math.max(...positionedNodes.map(n => n.y + n.height)) + NODE_MARGIN_Y

    return {
        nodes: positionedNodes,
        edges: positionedEdges,
        width: maxX,
        height: maxY,
    }
}

export { NODE_WIDTH, NODE_HEIGHT }
