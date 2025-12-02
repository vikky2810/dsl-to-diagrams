import type { Node, NodeType, ParseResult } from '../types'

// Basic parser: turns DSL into an AST (nodes + edges)
export function parseDSL(text: string): ParseResult {
    const lines = text.split('\n').filter(line => line.trim() !== '')

    const nodeMap = new Map<string, Node>()
    const edges: { from: string; to: string; label?: string }[] = []

    lines.forEach(line => {
        const trimmed = line.trim()

        // Node definitions: db|svc|ui|queue id "label"
        const nodeMatch = trimmed.match(/^(db|svc|ui|queue)\s+(\w+)(?:\s+"([^"]*)")?/)
        if (nodeMatch) {
            const [, type, id, label] = nodeMatch as [string, NodeType, string, string | undefined]
            const existing = nodeMap.get(id)
            const nodeLabel = label ?? existing?.label ?? id
            nodeMap.set(id, {
                id,
                type,
                label: nodeLabel,
            })
            return
        }

        // Text/notes: text targetId "note"
        const textMatch = trimmed.match(/^text\s+(\w+)\s+"([^"]*)"/)
        if (textMatch) {
            const [, targetId, noteLabel] = textMatch
            const existing = nodeMap.get(targetId)
            if (!existing) {
                nodeMap.set(targetId, {
                    id: targetId,
                    type: 'text',
                    label: noteLabel,
                })
            }
            return
        }

        // Edges: id1 -> id2 "optional label" OR connect id1 -> id2 "optional label"
        const edgeMatch = trimmed.match(/^(?:connect\s+)?(\w+)\s*->\s*(\w+)(?:\s+"([^"]*)")?/)
        if (edgeMatch) {
            const [, from, to, label] = edgeMatch
            edges.push({
                from,
                to,
                label: label || undefined,
            })
        }
    })

    return {
        ast: {
            nodes: Array.from(nodeMap.values()),
            edges,
        },
        lineCount: lines.length,
    }
}
