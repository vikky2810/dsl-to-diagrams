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

    // Build a Dagre graph for automatic layout
    const g = new dagre.graphlib.Graph()
        .setGraph({
            rankdir: 'LR',
            nodesep: NODE_MARGIN_X,
            ranksep: NODE_MARGIN_Y,
            marginx: NODE_MARGIN_X,
            marginy: NODE_MARGIN_Y,
        })
        .setDefaultEdgeLabel(() => ({}))

    ast.nodes.forEach(node => {
        g.setNode(node.id, {
            width: NODE_WIDTH + 70,
            height: NODE_HEIGHT + 20,
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
        const gNode = g.node(nodeId) as dagre.Node
        const baseNode = (gNode as unknown as { node: typeof ast.nodes[0] }).node

        const x = gNode.x - NODE_WIDTH / 2
        const y = gNode.y - NODE_HEIGHT / 2

        return {
            ...baseNode,
            x,
            y,
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
    const xs = positionedNodes.map(n => n.x)
    const ys = positionedNodes.map(n => n.y)
    const maxX = Math.max(...xs) + NODE_WIDTH + NODE_MARGIN_X
    const maxY = Math.max(...ys) + NODE_HEIGHT + NODE_MARGIN_Y

    return {
        nodes: positionedNodes,
        edges: positionedEdges,
        width: maxX,
        height: maxY,
    }
}

export { NODE_WIDTH, NODE_HEIGHT }
