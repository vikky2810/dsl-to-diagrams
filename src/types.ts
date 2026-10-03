export type NodeType = 'db' | 'svc' | 'ui' | 'queue' | 'text'

export type Node = {
    id: string
    type: NodeType
    label: string
    notes: string[]
}

export type Edge = {
    from: string
    to: string
    label?: string
}

export type AST = {
    nodes: Node[]
    edges: Edge[]
}

export type ParseError = {
    line: number
    message: string
}

export type ParseResult = {
    ast: AST
    errors: ParseError[]
    lineCount: number
}

// x/y/width/height describe the node's box; notes hang below it
export type PositionedNode = Node & { x: number; y: number; width: number; height: number }

export type PositionedEdge = {
    from: PositionedNode
    to: PositionedNode
    label?: string
    labelWidth: number
}

export type Layout = {
    nodes: PositionedNode[]
    edges: PositionedEdge[]
    width: number
    height: number
}
