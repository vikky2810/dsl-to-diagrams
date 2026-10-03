import type { Edge, Node, NodeType, ParseError, ParseResult } from '../types'

// Each pattern must match the whole line, so trailing junk is reported instead of ignored
const COMPONENT = /^(db|svc|ui|queue)\s+(\w+)(?:\s+"([^"]*)")?\s*$/
const NOTE = /^text\s+(\w+)\s+"([^"]*)"\s*$/
const EDGE = /^(?:connect\s+)?(\w+)\s*->\s*(\w+)(?:\s+"([^"]*)")?\s*$/

// Explains what a line that matched nothing should have looked like
function describeSyntaxError(line: string): string {
    const keyword = line.split(/\s+/)[0]
    if (/^(db|svc|ui|queue)$/.test(keyword)) return `Expected ${keyword} id "Label"`
    if (keyword === 'text') return 'Expected text id "Note"'
    if (line.includes('->')) return 'Expected from -> to "Label"'
    return `Unknown command \`${keyword}\``
}

// Turns DSL into an AST (nodes + edges). Notes and connections may refer to
// components declared further down, so they are resolved after every line is read.
export function parseDSL(text: string): ParseResult {
    const nodeMap = new Map<string, Node>()
    const notes: { id: string; text: string }[] = []
    const edges: (Edge & { line: number })[] = []
    const errors: ParseError[] = []
    let lineCount = 0

    text.split('\n').forEach((raw, idx) => {
        const line = raw.trim()
        if (!line) return
        lineCount++
        if (line.startsWith('#')) return

        const component = line.match(COMPONENT)
        if (component) {
            const [, type, id, label] = component as [string, NodeType, string, string | undefined]
            const existing = nodeMap.get(id)
            nodeMap.set(id, {
                id,
                type,
                label: label ?? existing?.label ?? id,
                notes: existing?.notes ?? [],
            })
            return
        }

        const note = line.match(NOTE)
        if (note) {
            notes.push({ id: note[1], text: note[2] })
            return
        }

        const edge = line.match(EDGE)
        if (edge) {
            const [, from, to, label] = edge
            edges.push({ from, to, label: label || undefined, line: idx + 1 })
            return
        }

        errors.push({ line: idx + 1, message: describeSyntaxError(line) })
    })

    // A note on a component is attached to it; on an unknown id it becomes a
    // free-standing note, and any further notes on that id stack beneath it
    notes.forEach(({ id, text }) => {
        const existing = nodeMap.get(id)
        if (existing) existing.notes.push(text)
        else nodeMap.set(id, { id, type: 'text', label: text, notes: [] })
    })

    const validEdges: Edge[] = []
    edges.forEach(({ line, ...edge }) => {
        const missing = [...new Set([edge.from, edge.to])].filter(id => !nodeMap.has(id))
        if (missing.length === 0) {
            validEdges.push(edge)
            return
        }
        const names = missing.map(id => `\`${id}\``).join(' and ')
        errors.push({ line, message: `Unknown ${missing.length > 1 ? 'nodes' : 'node'} ${names}` })
    })

    errors.sort((a, b) => a.line - b.line)

    return {
        ast: {
            nodes: Array.from(nodeMap.values()),
            edges: validEdges,
        },
        errors,
        lineCount,
    }
}
