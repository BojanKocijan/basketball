import { useLayoutEffect, useRef } from 'react'
import type { JerseyColor } from '../hooks/usePlayers'

// Actual fill values (not Tailwind classes — this renders as SVG, not DOM elements) matching
// the JERSEY_COLORS palette's Tailwind swatches (*-500, yellow-400) elsewhere in the app.
const FILL: Record<JerseyColor, string> = {
  orange: '#f97316',
  blue: '#3b82f6',
  red: '#ef4444',
  green: '#22c55e',
  purple: '#a855f7',
  black: '#171717',
  white: '#ffffff',
  yellow: '#facc15',
}

// White/yellow are too light for white text; everything else gets white text.
const LIGHT_COLORS = new Set<JerseyColor>(['white', 'yellow'])

function textFill(color: JerseyColor | null) {
  if (color === null) return '#525252' // neutral-600, readable on the "no color chosen" gray
  return LIGHT_COLORS.has(color) ? '#171717' : '#ffffff'
}

// The torso fill (see the path below) spans x=22 to x=78 — this is that width minus a small
// margin, used to scale long nicknames down to fit instead of spilling past the jersey's own
// silhouette (where text would land on the card background instead of the jersey, and — for a
// dark nickname on a light card — disappear).
const MAX_TEXT_WIDTH = 52

/** A basketball jersey (sleeveless) rendered as SVG, with the player's nickname across the
 * chest and their number below it — like a real jersey back. `color: null` (no jersey color
 * chosen yet) renders a neutral gray placeholder rather than defaulting into the palette.
 * Long nicknames are measured at runtime (`getComputedTextLength`) and scaled down to fit the
 * torso width — font-size alone can't reliably predict a bold sans-serif string's rendered
 * width across browsers, so this fits it precisely instead of guessing. */
export function JerseyGraphic({
  color,
  number,
  nickname,
}: {
  color: JerseyColor | null
  number: number | null
  nickname: string
}) {
  const textRef = useRef<SVGTextElement>(null)
  const fill = color === null ? '#d4d4d4' : FILL[color]
  const textColor = textFill(color)
  const upper = nickname.toUpperCase()
  const displayText = upper.length > 14 ? `${upper.slice(0, 13)}…` : upper

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    el.removeAttribute('transform')
    try {
      const natural = el.getComputedTextLength()
      if (natural > MAX_TEXT_WIDTH) {
        const scale = MAX_TEXT_WIDTH / natural
        el.setAttribute('transform', `translate(50,0) scale(${scale},1) translate(-50,0)`)
      }
    } catch {
      // getComputedTextLength unsupported (e.g. a test environment) — leave unscaled.
    }
  }, [displayText])

  return (
    <svg
      viewBox="0 0 100 120"
      className="h-28 w-24"
      role="img"
      aria-label={`${nickname}'s jersey${number !== null ? `, number ${number}` : ''}`}
    >
      <path
        d="M18 8 Q30 0 44 8 Q50 13 56 8 Q70 0 82 8 L80 26 Q79 20 78 30 L78 108 Q50 114 22 108 L22 30 Q21 20 20 26 Z"
        fill={fill}
        stroke="#71717a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        ref={textRef}
        x="50"
        y="54"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={textColor}
        letterSpacing="0.5"
      >
        {displayText}
      </text>
      {number !== null && (
        <text x="50" y="90" textAnchor="middle" fontSize="26" fontWeight="800" fill={textColor}>
          {number}
        </text>
      )}
    </svg>
  )
}
