import { useState } from 'react'
import * as dagre from 'dagre'
import './App.css'

// Example DSL text from plan.md
const EXAMPLE_DSL = `db db1 "UserDB"
svc api "Auth Service"

text db1 "Stores user credentials"
text db1 "10k users"

api -> db1 "Read/Write"`

type NodeType = 'db' | 'svc' | 'ui' | 'queue' | 'text'

type Node = {
  id: string
  type: NodeType
  label: string
}

type Edge = {
  from: string
  to: string
  label?: string
}

type AST = {
  nodes: Node[]
  edges: Edge[]
}

type ParseResult = {
  ast: AST
  lineCount: number
}

const NODE_WIDTH = 120
const NODE_HEIGHT = 60
const NODE_MARGIN_X = 80
const NODE_MARGIN_Y = 40

// Basic parser: turns DSL into an AST (nodes + edges)
function parseDSL(text: string): ParseResult {
  const lines = text.split('\n').filter(line => line.trim() !== '')

  const nodeMap = new Map<string, Node>()
  const edges: Edge[] = []

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
    lineCount: lines.length ,
  }
}

type PositionedNode = Node & { x: number; y: number }

function buildLayout(ast: AST): {
  nodes: PositionedNode[]
  edges: { from: PositionedNode; to: PositionedNode; label?: string }[]
  width: number
  height: number
} {
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
      height: NODE_HEIGHT+20,
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
    const baseNode = (gNode as unknown as { node: Node }).node

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

  const positionedEdges: { from: PositionedNode; to: PositionedNode; label?: string }[] = []

  ast.edges.forEach(edge => {
    const from = byId.get(edge.from)
    const to = byId.get(edge.to)
    if (!from || !to) return

    positionedEdges.push({
      from,
      to,
      label: edge.label ?? undefined,
    })
  })

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

function SvgDiagram({ ast }: { ast: AST }) {
  if (ast.nodes.length === 0) {
    return (
      <div className="info-box" style={{ marginTop: '16px' }}>
        <h3>Diagram</h3>
        <p>No nodes to display yet.</p>
      </div>
    )
  }

  const layout = buildLayout(ast)

  return (
    <div className="info-box" style={{ marginTop: '16px' }}>
      <h3>Diagram (minimal layout)</h3>
      <svg
        width="100%"
        height="320"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{ background: '#111', borderRadius: 4 }}
      >
        {/* Edges */}
        {layout.edges.map((edge, idx) => {
          const x1 = edge.from.x + NODE_WIDTH / 2
          const y1 = edge.from.y + NODE_HEIGHT / 2
          const x2 = edge.to.x + NODE_WIDTH / 2
          const y2 = edge.to.y + NODE_HEIGHT / 2
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2
          const angle = Math.atan2(y2 - y1, x2 - x1)
          const arrowSize = 6
          const arrowX = x2 - Math.cos(angle) * (NODE_WIDTH / 2 + 4)
          const arrowY = y2 - Math.sin(angle) * (NODE_HEIGHT / 2 + 4)
          const arrowLeftX = arrowX - arrowSize * Math.cos(angle - Math.PI / 6)
          const arrowLeftY = arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
          const arrowRightX = arrowX - arrowSize * Math.cos(angle + Math.PI / 6)
          const arrowRightY = arrowY - arrowSize * Math.sin(angle + Math.PI / 6)

          // Calculate label position - center it on the arrow line between nodes
          const labelX = mx 
          const labelY = my - 12

          return (
            <g key={idx}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#888"
                strokeWidth={1.5}
              />
              <polygon
                points={`${arrowX+6},${arrowY} ${arrowLeftX},${arrowLeftY} ${arrowRightX},${arrowRightY}`}
                fill="#888"
              />
              {edge.label && (
                <g>
                  {/* Background rectangle for text */}
                  <rect
                    x={labelX - (edge.label.length * 3.5)}
                    y={labelY - 8}
                    width={edge.label.length * 7}
                    height={16}
                    fill="#111"
                    stroke="#333"
                    strokeWidth={0.5}
                    rx={2}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    fill="#ccc"
                    fontSize={10}
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

        {/* Nodes */}
        {layout.nodes.map(node => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={6}
              ry={6}
              fill="#222"
              stroke="#646cff"
              strokeWidth={1.5}
            />
            <text
              x={node.x + NODE_WIDTH / 2}
              y={node.y + NODE_HEIGHT / 2}
              fill="#fff"
              fontSize={12}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {node.label}
            </text>
            <text
              x={node.x + NODE_WIDTH / 2}
              y={node.y + NODE_HEIGHT - 8}
              fill="#999"
              fontSize={10}
              textAnchor="middle"
            >
              {node.type}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function App() {
  const [dslText, setDslText] = useState(EXAMPLE_DSL)
  const parsed = parseDSL(dslText)

  return (
    <div className="app-container">
      <div className="editor-panel">
        <h2>DSL Editor</h2>
        <textarea
          className="dsl-editor"
          value={dslText}
          onChange={(e) => setDslText(e.target.value)}
          placeholder="Enter your DSL here..."
        />
      </div>

      <div className="preview-panel">
        <h2>Preview</h2>
        <div className="preview-content">
          <div className="info-box">
            <h3>AST Summary</h3>
            <p>
              <strong>Lines:</strong> {parsed.lineCount}
            </p>
            <p>
              <strong>Nodes:</strong> {parsed.ast.nodes.length}
            </p>
            <p>
              <strong>Edges:</strong> {parsed.ast.edges.length}
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '16px' }}>
            <h3>AST (debug view)</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(parsed.ast, null, 2)}
            </pre>
          </div>

          <SvgDiagram ast={parsed.ast} />
        </div>
      </div>
    </div>
  )
}

export default App
