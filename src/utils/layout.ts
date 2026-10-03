import { useMemo } from 'react'
import * as dagre from 'dagre'
import type { AST, Layout, PositionedNode } from '../types'
import { FONTS, measureText, useFontsReady } from './measureText'

const NODE_WIDTH = 120
const NODE_HEIGHT = 60
const NODE_PADDING_X = 20
const NODE_MARGIN_X = 80
const NODE_MARGIN_Y = 40
const NOTE_GAP = 10
const NOTE_LINE_HEIGHT = 16
const EDGE_LABEL_PADDING_X = 8
// The node type tag is rendered uppercase with 0.08em letter spacing
const TYPE_LETTER_SPACING = 9 * 0.08

// Space taken below a node's box by its notes
function notesHeight(notes: string[]) {
    return notes.length ? NOTE_GAP + notes.length * NOTE_LINE_HEIGHT : 0
}

export function buildLayout(ast: AST): Layout {
    if (ast.nodes.length === 0) {
        return { nodes: [], edges: [], width: 0, height: 0 }
    }

    const labelWidths = ast.edges.map(edge =>
        edge.label ? measureText(edge.label, FONTS.edgeLabel) + EDGE_LABEL_PADDING_X * 2 : 0,
    )
    // Leave room between ranks for the widest edge label plus some arrow either side
    const ranksep = Math.max(100, Math.max(0, ...labelWidths) + 60)

    // Build a Dagre graph for automatic layout
    const g = new dagre.graphlib.Graph()
        .setGraph({
            rankdir: 'LR',
            nodesep: 50, // Vertical spacing between nodes
            ranksep, // Horizontal spacing adjusted for edge labels
            marginx: NODE_MARGIN_X,
            marginy: NODE_MARGIN_Y,
        })
        .setDefaultEdgeLabel(() => ({}))

    const boxWidths = new Map<string, number>()

    ast.nodes.forEach(node => {
        const typeText = node.type.toUpperCase()
        const typeWidth = measureText(typeText, FONTS.nodeType) + typeText.length * TYPE_LETTER_SPACING
        const boxWidth = Math.max(
            NODE_WIDTH,
            measureText(node.label, FONTS.nodeLabel) + NODE_PADDING_X * 2,
            typeWidth + NODE_PADDING_X * 2,
        )
        boxWidths.set(node.id, boxWidth)

        // Notes may be wider than the box, so reserve their full footprint
        const noteWidth = Math.max(0, ...node.notes.map(note => measureText(note, FONTS.note)))

        g.setNode(node.id, {
            width: Math.max(boxWidth, noteWidth),
            height: NODE_HEIGHT + notesHeight(node.notes),
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

    let maxX = 0
    let maxY = 0

    const positionedNodes: PositionedNode[] = g.nodes().map(nodeId => {
        const gNode = g.node(nodeId) as dagre.Node & { node: typeof ast.nodes[0] }

        maxX = Math.max(maxX, gNode.x + gNode.width / 2)
        maxY = Math.max(maxY, gNode.y + gNode.height / 2)

        // dagre returns the centre of the whole footprint; the box sits at its top
        const width = boxWidths.get(nodeId)!
        const x = gNode.x - width / 2
        const y = gNode.y - gNode.height / 2

        return {
            ...gNode.node,
            x,
            y,
            width,
            height: NODE_HEIGHT,
        }
    })

    const byId = new Map<string, PositionedNode>()
    positionedNodes.forEach(n => byId.set(n.id, n))

    const positionedEdges = ast.edges
        .map((edge, idx) => {
            const from = byId.get(edge.from)
            const to = byId.get(edge.to)
            if (!from || !to) return null

            return {
                from,
                to,
                label: edge.label ?? undefined,
                labelWidth: labelWidths[idx],
            }
        })
        .filter((e): e is NonNullable<typeof e> => e !== null)

    return {
        nodes: positionedNodes,
        edges: positionedEdges,
        width: maxX + NODE_MARGIN_X,
        height: maxY + NODE_MARGIN_Y,
    }
}

// Memoised buildLayout that re-measures once the diagram fonts have loaded
export function useLayout(ast: AST): Layout {
    const fontsReady = useFontsReady()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fontsReady changes what measureText returns
    return useMemo(() => buildLayout(ast), [ast, fontsReady])
}

export { NODE_WIDTH, NODE_HEIGHT, NOTE_GAP, NOTE_LINE_HEIGHT }
