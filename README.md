# varch
A tiny DSL that lets you write architecture diagrams the same way you write code. You type things like db userDB or api authService, and the app turns it into a clean visual diagram. No dragging boxes, no messy tools — just text in, diagram out.
# VArch — A Minimal DSL for Architecture Diagrams

VArch is a lightweight domain-specific language for creating software architecture diagrams using plain text.  
Write a few lines, get a rendered diagram. Simple, fast, and easy to understand.

## Why VArch?
Architecture tools usually force you to drag boxes, wire arrows, and fiddle with UI.  
VArch flips that. You write a short script, and the app renders a clean diagram instantly.

It works like PlantUML, but focused only on high-level architecture: databases, services, APIs, queues, UI components, and connections.

## Core Ideas
- **Text in → Diagram out**  
- **Pure web app** — runs in the browser, no installs  
- **Small DSL** — only the essentials: nodes, labels, and relationships  
- **Readable** — anyone can understand the diagram by just reading the code  

---

## The VArch DSL

### 1. Create Nodes
Nodes represent components:

```

db databaseName "Human Friendly Label"
svc serviceName "Service Label"
ui frontEnd "Frontend App"
queue q1 "Message Queue"

```

Short forms:
- `db` → Database  
- `svc` → Service  
- `ui` → Frontend/UI  
- `queue` → Queue or event bus  

### 2. Add Descriptions
Use the `text` command to attach metadata or notes to any node:

```

text databaseName "Stores user credentials"
text serviceName "Handles authentication"

```

These show up as annotations near the node.

### 3. Connect Components

```

connect serviceName -> databaseName
connect frontEnd -> serviceName "Login Request"

```

Or the shorter arrow format:

```

serviceName -> databaseName "Read/Write"

```

### Full Example

```

db db1 "UserDB"
svc api "Auth Service"

text db1 "Stores user credentials"
text db1 "10k users"

api -> db1 "Read/Write"

```

This produces a diagram with:
- A database node named *UserDB*
- A service named *Auth Service*
- Two notes under the DB node
- A directional link from the service to the DB with a label *Read/Write*

---

## How the Renderer Works (High-Level)
1. Parse the DSL into an AST  
2. Build a graph model (nodes + edges + metadata)  
3. Render using a layout engine (e.g., Dagre, Elk.js, or custom)  
4. Draw SVG on the canvas  
5. Live-update as the user types  

---

## Planned Features
- Real-time preview  
- Dark/Light theme  
- Copy-as-SVG/PNG  
- Auto-layout with smart spacing  
- Export/Import diagram files  
- Snippets for common patterns (API → Service → DB)  
- Sharing links (optional)

---

## Example Use Cases
- System architecture diagrams  
- Microservices maps  
- API flows  
- Data pipelines  
- Deployment overviews  
- Quick brainstorming diagrams

---

## File Format
You can store and reload diagrams simply as `.varch` files, which are just text DSL.

Example file:

```

svc api "Product API"
db db1 "ProductDB"
api -> db1 "Fetch/Store Products"

```

---

## Why the Name *VArch*?
Short for **Visual Architecture** — a compact DSL that turns your architecture text into diagrams instantly.