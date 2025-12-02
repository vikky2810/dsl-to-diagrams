import { useState } from 'react'
import { parseDSL } from './utils/parser'
import { ThemeProvider } from './contexts/ThemeContext'
import { Header } from './components/Header'
import { EditorPanel } from './components/EditorPanel'
// import { ASTSummary } from './components/ASTSummary'
// import { ASTDebugView } from './components/ASTDebugView'
import { DiagramViewer } from './components/DiagramViewer'
import './App.css'

// Example DSL text from plan.md
const EXAMPLE_DSL = `db db1 "UserDB"
svc api "Auth Service"

text db1 "Stores user credentials"
text db1 "10k users"

api -> db1 "Read/Write"`

function AppContent() {
  const [dslText, setDslText] = useState(EXAMPLE_DSL)
  const parsed = parseDSL(dslText)

  return (
    <div className="app">
      <Header />

      <div className="app-container">
        <div className="editor-section">
          <EditorPanel value={dslText} onChange={setDslText} />
        </div>

        <div className="preview-section">
            <DiagramViewer ast={parsed.ast} />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
