import { useState } from 'react'
import './App.css'

// Example DSL text from plan.md
const EXAMPLE_DSL = `db db1 "UserDB"
svc api "Auth Service"

text db1 "Stores user credentials"
text db1 "10k users"

api -> db1 "Read/Write"`

// Simple parser that just detects patterns (very basic for first step)
function parseDSL(text: string) {
  const lines = text.split('\n').filter(line => line.trim() !== '')
  
  const nodes: string[] = []
  const edges: string[] = []
  
  lines.forEach(line => {
    const trimmed = line.trim()
    
    // Detect node definitions: db, svc, ui, queue
    if (/^(db|svc|ui|queue)\s+\w+/.test(trimmed)) {
      const match = trimmed.match(/(db|svc|ui|queue)\s+(\w+)/)
      if (match) {
        nodes.push(match[2])
      }
    }
    
    // Detect edges: id1 -> id2
    if (/->/.test(trimmed)) {
      const match = trimmed.match(/(\w+)\s*->\s*(\w+)/)
      if (match) {
        edges.push(`${match[1]} -> ${match[2]}`)
      }
    }
  })
  
  return {
    lines: lines.length,
    nodes: Array.from(new Set(nodes)), // Remove duplicates
    edges: edges
  }
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
            <h3>Parsed Info</h3>
            <p><strong>Lines:</strong> {parsed.lines}</p>
            <p><strong>Nodes found:</strong> {parsed.nodes.length}</p>
            {parsed.nodes.length > 0 && (
              <ul>
                {parsed.nodes.map((node, i) => (
                  <li key={i}>{node}</li>
                ))}
              </ul>
            )}
            <p><strong>Edges found:</strong> {parsed.edges.length}</p>
            {parsed.edges.length > 0 && (
              <ul>
                {parsed.edges.map((edge, i) => (
                  <li key={i}>{edge}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
