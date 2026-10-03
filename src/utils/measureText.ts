import { useEffect, useState } from 'react'

// Canvas font shorthands matching the diagram styles in LiveDiagram.module.css
export const FONTS = {
    nodeLabel: `550 13px 'Geist Variable', system-ui, sans-serif`,
    nodeType: `9px 'Geist Mono Variable', ui-monospace, monospace`,
    note: `11px 'Geist Variable', system-ui, sans-serif`,
    edgeLabel: `11px 'Geist Mono Variable', ui-monospace, monospace`,
}

let context: CanvasRenderingContext2D | null | undefined

export function measureText(text: string, font: string): number {
    if (context === undefined) context = document.createElement('canvas').getContext('2d')
    if (!context) return text.length * 8
    context.font = font
    return context.measureText(text).width
}

// Canvas measures with a fallback font until the web fonts arrive, and doesn't
// request them itself, so load them explicitly
const fontsLoaded = Promise.all(Object.values(FONTS).map(font => document.fonts.load(font)))
let fontsReady = false
fontsLoaded.then(() => { fontsReady = true }, () => {})

// Flips to true once the diagram fonts load; add it to layout deps so
// measurements are redone with the real fonts
export function useFontsReady() {
    const [ready, setReady] = useState(fontsReady)
    useEffect(() => {
        if (ready) return
        let active = true
        fontsLoaded.then(() => { if (active) setReady(true) }, () => {})
        return () => { active = false }
    }, [ready])
    return ready
}
