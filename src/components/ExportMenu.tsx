import { useEffect, useId, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import styles from './ExportMenu.module.css'

type ExportMenuProps = {
    svgRef: RefObject<SVGSVGElement | null>
    width: number
    height: number
}

type Format = 'png' | 'jpg' | 'svg'
type Fill = 'transparent' | 'colored'

const FORMATS: Format[] = ['png', 'jpg', 'svg']

const COLORS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#0a0a0b' },
    { name: 'Slate', value: '#94a3b8' },
    { name: 'Lavender', value: '#e9d5ff' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Sky', value: '#bae6fd' },
    { name: 'Amber', value: '#fcd34d' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Green', value: '#15803d' },
    { name: 'Mint', value: '#bbf7d0' },
    { name: 'Rose', value: '#fecdd3' },
    { name: 'Red', value: '#dc2626' },
]

const STORAGE_KEY = 'varch-export'

type Settings = { format: Format; fill: Fill; color: string }

const DEFAULTS: Settings = { format: 'png', fill: 'transparent', color: COLORS[0].value }

function loadSettings(): Settings {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
        return { ...DEFAULTS, ...saved }
    } catch {
        return DEFAULTS
    }
}

// Diagram colours come from CSS variables, which don't survive serialisation,
// so copy the computed values onto the clone before exporting.
const INLINE_PROPS = [
    'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'opacity',
    'font-family', 'font-size', 'font-weight', 'letter-spacing', 'text-transform',
] as const

function inlineStyles(source: SVGSVGElement, clone: SVGSVGElement, theme?: 'light' | 'dark') {
    // Temporarily switch the live SVG's palette so text and strokes contrast with the chosen
    // background. Read and restored synchronously, so it never paints.
    const previousTheme = source.getAttribute('data-theme')
    if (theme) source.setAttribute('data-theme', theme)

    const from = source.querySelectorAll('*')
    const to = clone.querySelectorAll('*')
    from.forEach((el, i) => {
        const computed = getComputedStyle(el)
        const target = to[i] as SVGElement
        INLINE_PROPS.forEach(prop => target.style.setProperty(prop, computed.getPropertyValue(prop)))
        target.style.setProperty('animation', 'none')
        target.style.setProperty('stroke-dashoffset', '0')
    })

    if (previousTheme === null) source.removeAttribute('data-theme')
    else source.setAttribute('data-theme', previousTheme)
}

// Relative luminance, used to pick the diagram palette that reads on the chosen background
function isLight(hex: string) {
    const [r, g, b] = [1, 3, 5].map(i => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.35
}

function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export function ExportMenu({ svgRef, width, height }: ExportMenuProps) {
    const [open, setOpen] = useState(false)
    const [settings, setSettings] = useState(loadSettings)
    const rootRef = useRef<HTMLDivElement>(null)
    const id = useId()

    const { format, color } = settings
    // JPG can't store transparency
    const fill: Fill = format === 'jpg' ? 'colored' : settings.fill

    const update = (patch: Partial<Settings>) => {
        setSettings(prev => {
            const next = { ...prev, ...patch }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            return next
        })
    }

    useEffect(() => {
        if (!open) return
        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open])

    const download = () => {
        setOpen(false)
        const source = svgRef.current
        if (!source) return

        const background = fill === 'colored' ? color : null
        const svg = source.cloneNode(true) as SVGSVGElement
        inlineStyles(source, svg, background ? (isLight(background) ? 'light' : 'dark') : undefined)

        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

        if (background) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
            rect.setAttribute('width', String(width))
            rect.setAttribute('height', String(height))
            rect.setAttribute('fill', background)
            svg.insertBefore(rect, svg.firstChild)
        }

        if (format === 'svg') {
            svg.setAttribute('width', String(width))
            svg.setAttribute('height', String(height))
            const data = new XMLSerializer().serializeToString(svg)
            saveBlob(new Blob([data], { type: 'image/svg+xml;charset=utf-8' }), 'diagram.svg')
            return
        }

        // 2x scale for crisp images
        const scale = 2
        const scaledWidth = width * scale
        const scaledHeight = height * scale
        svg.setAttribute('width', String(scaledWidth))
        svg.setAttribute('height', String(scaledHeight))

        const data = new XMLSerializer().serializeToString(svg)
        const url = URL.createObjectURL(new Blob([data], { type: 'image/svg+xml;charset=utf-8' }))

        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = scaledWidth
            canvas.height = scaledHeight
            const ctx = canvas.getContext('2d', { alpha: !background })
            if (!ctx) {
                URL.revokeObjectURL(url)
                return
            }

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)
            URL.revokeObjectURL(url)

            canvas.toBlob(blob => {
                if (blob) saveBlob(blob, `diagram.${format}`)
            }, format === 'png' ? 'image/png' : 'image/jpeg', 1.0)
        }
        img.onerror = () => {
            URL.revokeObjectURL(url)
            console.error('Failed to load SVG for download')
        }
        img.src = url
    }

    return (
        <div className={styles.root} ref={rootRef}>
            <button
                className={styles.trigger}
                onClick={() => setOpen(o => !o)}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={`${id}-panel`}
            >
                <Download size={14} strokeWidth={2} /> Export
                <ChevronDown size={13} strokeWidth={2} className={styles.chevron} data-open={open} />
            </button>

            {open && (
                <div id={`${id}-panel`} className={styles.panel} role="dialog" aria-label="Export diagram">
                    <div className={styles.formats} role="radiogroup" aria-label="Format">
                        {FORMATS.map(f => (
                            <label key={f} className={styles.format}>
                                <input
                                    type="radio"
                                    name={`${id}-format`}
                                    checked={format === f}
                                    onChange={() => update({ format: f })}
                                />
                                <span>{f.toUpperCase()}</span>
                            </label>
                        ))}
                    </div>

                    <div className={styles.fills} role="radiogroup" aria-label="Background">
                        <label className={styles.fill} data-disabled={format === 'jpg'}>
                            <input
                                type="radio"
                                name={`${id}-fill`}
                                checked={fill === 'transparent'}
                                disabled={format === 'jpg'}
                                onChange={() => update({ fill: 'transparent' })}
                            />
                            <span className={styles.radio} />
                            Transparent
                            {format === 'jpg' && <span className={styles.hint}>PNG or SVG only</span>}
                        </label>
                        <label className={styles.fill}>
                            <input
                                type="radio"
                                name={`${id}-fill`}
                                checked={fill === 'colored'}
                                onChange={() => update({ fill: 'colored' })}
                            />
                            <span className={styles.radio} />
                            Coloured
                        </label>
                    </div>

                    <fieldset className={styles.colors} disabled={fill !== 'colored'}>
                        <legend className={styles.srOnly}>Background colour</legend>
                        {COLORS.map(c => (
                            <label key={c.value} className={styles.color} title={c.name}>
                                <input
                                    type="radio"
                                    name={`${id}-color`}
                                    checked={color === c.value}
                                    onChange={() => update({ color: c.value, fill: 'colored' })}
                                    aria-label={c.name}
                                />
                                <span className={styles.dot} style={{ background: c.value }} />
                            </label>
                        ))}
                    </fieldset>

                    <button className={styles.download} onClick={download}>
                        <Download size={14} strokeWidth={2} /> Download {format.toUpperCase()}
                    </button>
                </div>
            )}
        </div>
    )
}
