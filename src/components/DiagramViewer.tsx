import { useMemo, useRef } from 'react'
import type { AST } from '../types'
import { buildLayout } from '../utils/layout'
import { LiveDiagram } from './LiveDiagram'
import styles from './DiagramViewer.module.css'
import { Download, Workflow } from 'lucide-react'

type DiagramViewerProps = {
    ast: AST
}

// Diagram colours come from CSS variables, which don't survive serialisation,
// so copy the computed values onto the clone before rasterising.
const INLINE_PROPS = [
    'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'opacity',
    'font-family', 'font-size', 'font-weight', 'letter-spacing', 'text-transform',
] as const

function inlineStyles(source: SVGSVGElement, clone: SVGSVGElement) {
    const from = source.querySelectorAll('*')
    const to = clone.querySelectorAll('*')
    from.forEach((el, i) => {
        const computed = getComputedStyle(el)
        const target = to[i] as SVGElement
        INLINE_PROPS.forEach(prop => target.style.setProperty(prop, computed.getPropertyValue(prop)))
        target.style.setProperty('animation', 'none')
        target.style.setProperty('stroke-dashoffset', '0')
    })
}

export function DiagramViewer({ ast }: DiagramViewerProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const layout = useMemo(() => buildLayout(ast), [ast])

    if (ast.nodes.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <Workflow size={36} strokeWidth={1.5} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No diagram yet</h3>
                    <p className={styles.emptyText}>
                        Add a component like <code>svc api "API"</code> in the editor to start drawing.
                    </p>
                </div>
            </div>
        )
    }

    const downloadDiagram = (format: 'png' | 'jpg') => {
        if (!svgRef.current) return

        const svg = svgRef.current.cloneNode(true) as SVGSVGElement
        inlineStyles(svgRef.current, svg)

        // 2x scale for crisp images
        const scale = 2
        const scaledWidth = layout.width * scale
        const scaledHeight = layout.height * scale

        svg.setAttribute('width', scaledWidth.toString())
        svg.setAttribute('height', scaledHeight.toString())
        svg.setAttribute('viewBox', `0 0 ${layout.width} ${layout.height}`)

        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)

        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = scaledWidth
            canvas.height = scaledHeight
            const ctx = canvas.getContext('2d', { alpha: format === 'png' })

            if (!ctx) {
                URL.revokeObjectURL(url)
                return
            }

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            // JPG has no transparency: paint the current theme background
            if (format === 'jpg') {
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--l-bg').trim() || '#ffffff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)

            canvas.toBlob((blob) => {
                if (!blob) {
                    URL.revokeObjectURL(url)
                    return
                }

                const downloadUrl = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = downloadUrl
                link.download = `diagram.${format}`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(downloadUrl)
                URL.revokeObjectURL(url)
            }, format === 'png' ? 'image/png' : 'image/jpeg', 1.0)
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            console.error('Failed to load SVG for download')
        }

        img.src = url
    }

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <span className={styles.title}>Preview</span>
                <span className={styles.meta}>
                    {layout.nodes.length} {layout.nodes.length === 1 ? 'component' : 'components'}, {layout.edges.length} {layout.edges.length === 1 ? 'connection' : 'connections'}
                </span>
                <div className={styles.actions}>
                    <button
                        className={styles.downloadButton}
                        onClick={() => downloadDiagram('png')}
                        title="Download as PNG"
                    >
                        <Download size={14} strokeWidth={2} /> PNG
                    </button>
                    <button
                        className={styles.downloadButton}
                        onClick={() => downloadDiagram('jpg')}
                        title="Download as JPG"
                    >
                        <Download size={14} strokeWidth={2} /> JPG
                    </button>
                </div>
            </div>
            <div className={styles.svgContainer}>
                <LiveDiagram ref={svgRef} layout={layout} />
            </div>
        </div>
    )
}
