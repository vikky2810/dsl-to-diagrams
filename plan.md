# VArch Development Plan

A step-by-step guide to building VArch — a minimal DSL for architecture diagrams.

---

## Project Overview

**Goal**: Build a web application that parses a simple DSL and renders architecture diagrams in real-time.

**Tech Stack Recommendations**:
- **Frontend Framework**: Vue.js + Vite
- **Parser**: Custom parser 
- **Layout Engine**: Dagre.js (for automatic graph layout)
- **Rendering**: SVG (via D3.js, React, or native SVG)
- **Build Tool**: Vite (fast, simple)
- **Styling**: Tailwind for UI

---

## Phase 1: Project Setup & Foundation (Week 1)

### 1.1 Initialize Project Structure
- [X] Choose framework (Vue.js + Vite)
- [X] Set up project with Vite: `npm create vite@latest . -- --template vue`
- [X] Install core dependencies:
  - `dagre` for graph layout
  - `d3` for SVG rendering
  - Vue's built-in reactivity for state management (no external library needed)
- [X] Set up folder structure:
  ```
  src/
    components/     # UI components
    parser/         # DSL parser
    renderer/       # Diagram renderer
    utils/          # Helper functions
    styles/         # CSS/styling
  ```

### 1.2 Basic UI Shell
- [ ] Create main layout with:
  - Split pane: Editor (left) + Preview (right)
  - Textarea for DSL input
  - Canvas/div for diagram output
- [ ] Add basic styling (responsive layout)
- [ ] Set up state management for editor content

---

## Phase 2: DSL Parser (Week 1-2)

### 2.1 Define Grammar
- [ ] Document the grammar formally:
  - Node declarations: `db|svc|ui|queue <id> "<label>"`
  - Text annotations: `text <id> "<description>"`
  - Connections: `connect <id1> -> <id2> ["<label>"]` or `<id1> -> <id2> ["<label>"]`

### 2.2 Build Parser
- [ ] Option A: Write a simple recursive descent parser
- [ ] Option B: Use PEG.js to generate parser from grammar
- [ ] Parse commands into tokens/statements
- [ ] Handle edge cases:
  - Empty lines
  - Comments (optional: `# comment`)
  - Invalid syntax (graceful error handling)

### 2.3 Build AST (Abstract Syntax Tree)
- [ ] Define AST node types:
  - `NodeDeclaration` (type, id, label)
  - `TextAnnotation` (nodeId, text)
  - `Connection` (from, to, label?)
- [ ] Transform parsed tokens into AST
- [ ] Validate AST (check node references exist)

### 2.4 Test Parser
- [ ] Create test cases for:
  - Valid DSL examples
  - Invalid syntax
  - Edge cases (empty input, missing quotes, etc.)
- [ ] Write unit tests (Jest/Vitest)

---

## Phase 3: Graph Model Builder (Week 2)

### 3.1 Build Graph Data Structure
- [ ] Create graph model:
  - Nodes: `{ id, type, label, texts: [] }`
  - Edges: `{ from, to, label? }`
- [ ] Build graph from AST:
  - Collect all node declarations
  - Attach text annotations to nodes
  - Build edge list from connections

### 3.2 Validate Graph
- [ ] Check for:
  - Duplicate node IDs
  - References to non-existent nodes
  - Circular dependencies (optional, for warnings)

---

## Phase 4: Layout Engine Integration (Week 2-3)

### 4.1 Integrate Dagre
- [ ] Install `dagre` and `dagre-d3` (or use standalone)
- [ ] Configure Dagre:
  - Set node dimensions (width, height)
  - Configure spacing (ranksep, nodesep)
  - Choose layout direction (TB, LR, etc.)

### 4.2 Calculate Layout
- [ ] Convert graph model to Dagre format
- [ ] Run layout algorithm
- [ ] Extract positions for nodes and edges
- [ ] Store layout result in state

---

## Phase 5: SVG Renderer (Week 3-4)

### 5.1 Basic Node Rendering
- [ ] Create SVG group for each node
- [ ] Draw node shapes based on type:
  - `db`: Cylinder or rounded rectangle
  - `svc`: Rectangle with service icon/style
  - `ui`: Rounded rectangle or browser-like shape
  - `queue`: Horizontal bar or cloud shape
- [ ] Add labels inside/under nodes
- [ ] Style nodes (colors, borders)

### 5.2 Edge Rendering
- [ ] Draw edges using Dagre positions
- [ ] Use SVG paths (curved or straight)
- [ ] Add arrowheads at target
- [ ] Render edge labels (if present)
- [ ] Style edges (colors, stroke width)

### 5.3 Text Annotations
- [ ] Render text annotations near nodes
  - Option: Tooltip on hover
  - Option: Small text boxes below nodes
  - Option: Expandable notes
- [ ] Position annotations relative to nodes

### 5.4 Styling & Polish
- [ ] Add hover effects
- [ ] Add node selection (optional)
- [ ] Ensure readable fonts and spacing
- [ ] Make diagram responsive

---

## Phase 6: Real-Time Preview (Week 4)

### 6.1 Live Updates
- [ ] Debounce editor input (200-300ms)
- [ ] Re-parse on change
- [ ] Re-render diagram when AST changes
- [ ] Handle errors gracefully (show in UI)

### 6.2 Error Display
- [ ] Show parse errors in UI
- [ ] Highlight invalid lines (optional)
- [ ] Display friendly error messages

---

## Phase 7: UI Enhancements (Week 5)

### 7.1 Theme Support
- [ ] Implement dark/light theme toggle
- [ ] Create theme variables (CSS variables)
- [ ] Apply theme to:
  - Editor (syntax highlighting optional)
  - Diagram (node colors, backgrounds)
  - UI controls

### 7.2 Export Functionality
- [ ] Copy as SVG:
  - Get SVG element
  - Copy to clipboard
- [ ] Export as PNG:
  - Convert SVG to canvas
  - Use `html2canvas` or similar
  - Download as PNG
- [ ] Export as `.varch` file:
  - Download current DSL as text file

### 7.3 Import Functionality
- [ ] File upload for `.varch` files
- [ ] Load content into editor
- [ ] Validate on import

---

## Phase 8: Advanced Features (Week 6)

### 8.1 Snippets/Templates
- [ ] Create common patterns:
  - API → Service → DB
  - Microservices pattern
  - Event-driven architecture
- [ ] Add snippet picker UI
- [ ] Insert snippet into editor

### 8.2 Auto-Layout Improvements
- [ ] Allow layout direction toggle (top-down, left-right)
- [ ] Adjust spacing controls
- [ ] Handle large graphs (clustering, pagination?)

### 8.3 Sharing (Optional)
- [ ] Encode diagram in URL (base64 or compressed)
- [ ] Shareable links
- [ ] Or: Save to localStorage for persistence

---

## Phase 9: Testing & Polish (Week 7)

### 9.1 Testing
- [ ] Unit tests for parser
- [ ] Integration tests for renderer
- [ ] E2E tests for main flows (optional)
- [ ] Test with various diagram sizes

### 9.2 Performance
- [ ] Optimize re-renders (React.memo, useMemo)
- [ ] Handle large diagrams (virtualization if needed)
- [ ] Debounce/throttle expensive operations

### 9.3 Documentation
- [ ] Add inline code comments
- [ ] Update README with setup instructions
- [ ] Create example diagrams
- [ ] Add keyboard shortcuts (optional)

### 9.4 Deployment
- [ ] Build for production
- [ ] Deploy to:
  - GitHub Pages
  - Vercel
  - Netlify
  - Or any static host

---

## Implementation Tips

### Parser Approach
**Simple Recursive Descent Parser** (Recommended for MVP):
```javascript
function parseDSL(input) {
  const lines = input.split('\n').filter(l => l.trim());
  const ast = { nodes: [], edges: [], texts: [] };
  
  for (const line of lines) {
    if (line.match(/^(db|svc|ui|queue)\s+\w+\s+".+"/)) {
      // Parse node declaration
    } else if (line.match(/^text\s+\w+\s+".+"/)) {
      // Parse text annotation
    } else if (line.match(/\w+\s*->\s*\w+/)) {
      // Parse connection
    }
  }
  
  return ast;
}
```

### Rendering Approach
**Option 1: React + SVG** (Component-based):
- Each node is a React component
- Edges are SVG paths
- Easy to manage state and updates

**Option 2: D3.js** (Data-driven):
- More control over animations
- Better for complex interactions
- Steeper learning curve

**Option 3: React Flow** (Pre-built):
- Fastest to implement
- Less customization

### State Management
- **Simple**: React useState/useReducer
- **Medium**: Context API
- **Complex**: Zustand or Redux (probably overkill)

---

## Quick Start Checklist

1. ✅ Read this plan
2. ✅ Set up project (Phase 1)
3. ✅ Build parser (Phase 2)
4. ✅ Test with simple example
5. ✅ Integrate layout (Phase 4)
6. ✅ Render basic diagram (Phase 5)
7. ✅ Add real-time updates (Phase 6)
8. ✅ Polish and deploy (Phase 7-9)

---

## Example Development Flow

1. **Start with the simplest case**:
   ```
   db db1 "Test DB"
   svc api "Test API"
   api -> db1
   ```

2. **Get it rendering** before adding complexity

3. **Iterate**: Add one feature at a time

4. **Test frequently** with real examples

---

## Estimated Timeline

- **MVP (Phases 1-6)**: 3-4 weeks (part-time)
- **Full Features (Phases 1-9)**: 6-7 weeks (part-time)
- **With polish & testing**: 8-10 weeks (part-time)

**Full-time development**: 2-3 weeks for MVP, 4-5 weeks for full version.

---

## Next Steps

1. Choose your tech stack
2. Set up the project (Phase 1)
3. Start with the parser (Phase 2) — this is the foundation
4. Build incrementally, test as you go
5. Get a basic diagram rendering before adding features

Good luck! 🚀

