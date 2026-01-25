export type NodeType = 'db' | 'svc' | 'ui' | 'queue' | 'text'

export type Node = {
    id: string
    type: NodeType
    label: string
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

export type ParseResult = {
    ast: AST
    lineCount: number
}

export type PositionedNode = Node & { x: number; y: number; width: number; height: number }

export type PositionedEdge = {
    from: PositionedNode
    to: PositionedNode
    label?: string
}

export type Layout = {
    nodes: PositionedNode[]
    edges: PositionedEdge[]
    width: number
    height: number
}
