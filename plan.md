## 1. Lock the Scope (MVP)

Keep the first version tight. Your MVP should support:

* Parsing basic DSL (nodes, text, connects)
* Rendering nodes + edges in SVG
* Auto layout using Dagre/ELK
* Real-time preview (editor → render)

That’s it. Don’t touch themes, exporting, or sharing yet.

## 2. Break the App Into Clear Modules

### A) **DSL Parser**

Goal: Convert plain text into a structured AST.

Implement these commands first:

* `db id "label"`
* `svc id "label"`
* `ui id "label"`
* `queue id "label"`
* `text id "note"`
* `id1 -> id2 "optional label"`
* `connect id1 -> id2 "optional label"`

Parser steps:

1. Tokenize each line.
2. Match patterns using regex.
3. Produce an AST like:

   ```js
   {
     nodes: [{ id, type, label, notes: [] }],
     edges: [{ from, to, label }]
   }
   ```

### B) **Graph Builder**

Takes the AST → builds an internal graph model ready for layout.

* Add nodes with default sizes.
* Attach notes.
* Add edges with direction and optional labels.

### C) **Layout Engine**

Use Dagre first (simple + stable).

Flow:

```
AST → Graph Model → Dagre Layout → Coordinates
```

Each node will get:

```js
{ x, y, width, height }
```

Same for edges (list of points).

### D) **Renderer (SVG)**

Render a clean diagram:

* Rectangles for services/UI
* Cylinder shape for DB
* Rounded box for queues
* Edge arrows + labels
* Notes under nodes with smaller text

Keep everything minimal and monochrome for MVP.

### E) **Web App UI**

Your Vue setup:

* **Editor.vue** — code input with v-model (Monaco recommended later)
* **DiagramRender.vue** — reads parsed DSL and draws SVG
* Debounce 200ms for live updates

That's the full first version.

---

## 3. Version 2 — Fast Quality Improvements

### Add Features:

* Light/Dark theme toggle
* Export SVG/PNG
* Auto-save to localStorage
* Error messages inline (e.g., undefined node)
* Snippets (API → Service → DB)

### UI Enhancements:

* Vertical split: editor left, preview right
* Zoom & Pan inside SVG
* Node highlighting on hover

---

## 4. Version 3 — Power User Mode

Now you fix convenience:

* `.varch` file import/export
* Shareable encoded URLs
* Custom node types (cache, load balancer, auth, etc.)
* Color tokens (optional)
* Diagram presets (microservices map, pipeline diagram)

---

## 5. Stretch Ideas (When it grows)

* AI-powered DSL generation for architecture written in plain English
* Drag nodes → auto-generate DSL back
* Save diagrams on cloud (Supabase / Firestore)
* Plugin system for custom node shapes
* "Pro mode" with keyboard shortcuts and templates

---

## 6. Suggested Timeline

### **Week 1**

* Build DSL parser
* Build AST + basic model

### **Week 2**

* Dagre layout integration
* Render node shapes in SVG

### **Week 3**

* Real-time preview integration in Vue
* Basic error handling
* Publish MVP

### **Week 4**

* Dark/light theme
* Export features
* UX polish

---

## 7. What You Should Build First (Today)

Start small:

1. Write the parser for nodes + edges
2. Print parsed JSON in the console
3. Hook that into a minimal render (just boxes + arrows)
4. Integrate in your Vue components

Even a crude diagram is progress.

---

If you want, I can create:

* A proper technical roadmap
* Folder structure
* Step-by-step tasks with checklists
* Actual Vue files for Editor + DiagramRender ready to paste
* A spec for the parser grammar

Tell me what you want next.
