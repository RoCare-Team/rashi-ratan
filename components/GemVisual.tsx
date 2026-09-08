import type { GemArt } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * GemVisual
 * ---------
 * Renders a faceted gemstone entirely in SVG from three colours, so the
 * prototype needs no product photography. Every product in /data/products.ts
 * carries an `art` descriptor; drop real `images` on a product and the
 * ProductImage wrapper below will use the photograph instead.
 */

interface GemVisualProps {
  art: GemArt;
  /** Must be unique per instance — gradient ids are derived from it */
  seed: string;
  className?: string;
  /** Adds the radial aura behind the stone */
  glow?: boolean;
  /** Adds the twinkling sparkles */
  sparkle?: boolean;
}

/** Regular polygon points, rotation in degrees. */
function polygon(cx: number, cy: number, r: number, sides: number, rotation = 0): string {
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = ((i / sides) * 360 + rotation - 90) * (Math.PI / 180);
    points.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return points.join(' ');
}

/** Octagon with cut corners — the classic step cut outline. */
function octagon(cx: number, cy: number, w: number, h: number, cut: number): string {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return [
    `${x + cut},${y}`,
    `${x + w - cut},${y}`,
    `${x + w},${y + cut}`,
    `${x + w},${y + h - cut}`,
    `${x + w - cut},${y + h}`,
    `${x + cut},${y + h}`,
    `${x},${y + h - cut}`,
    `${x},${y + cut}`,
  ].join(' ');
}

export default function GemVisual({ art, seed, className, glow = true, sparkle = true }: GemVisualProps) {
  const id = `gem-${seed.replace(/[^a-z0-9]/gi, '')}`;
  const { light, base, deep, cut } = art;

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn('h-full w-full', className)}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id={`${id}-aura`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={base} stopOpacity="0.55" />
          <stop offset="55%" stopColor={base} stopOpacity="0.16" />
          <stop offset="100%" stopColor={base} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${id}-face`} x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor={light} />
          <stop offset="42%" stopColor={base} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>

        <linearGradient id={`${id}-face-alt`} x1="85%" y1="10%" x2="15%" y2="95%">
          <stop offset="0%" stopColor={base} />
          <stop offset="70%" stopColor={deep} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>

        <linearGradient id={`${id}-table`} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="38%" stopColor={light} stopOpacity="0.85" />
          <stop offset="100%" stopColor={base} stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id={`${id}-sheen`} x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={`${id}-bead`} cx="35%" cy="30%" r="78%">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={base} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>

        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>

      {glow && <circle cx="100" cy="98" r="92" fill={`url(#${id}-aura)`} />}

      {/* ------------------------------ Round brilliant ------------------------------ */}
      {cut === 'round' && (
        <g>
          <polygon points={polygon(100, 100, 72, 16)} fill={`url(#${id}-face)`} />
          {Array.from({ length: 16 }).map((_, i) => {
            const a1 = ((i / 16) * 360 - 90) * (Math.PI / 180);
            const a2 = (((i + 1) / 16) * 360 - 90) * (Math.PI / 180);
            const x1 = 100 + 72 * Math.cos(a1);
            const y1 = 100 + 72 * Math.sin(a1);
            const x2 = 100 + 72 * Math.cos(a2);
            const y2 = 100 + 72 * Math.sin(a2);
            const mid = ((i + 0.5) / 16) * 360 - 90;
            const mx = 100 + 38 * Math.cos(mid * (Math.PI / 180));
            const my = 100 + 38 * Math.sin(mid * (Math.PI / 180));
            return (
              <polygon
                key={i}
                points={`${x1},${y1} ${x2},${y2} ${mx},${my}`}
                fill={i % 2 ? deep : base}
                fillOpacity={i % 2 ? 0.45 : 0.25}
                stroke="#ffffff"
                strokeOpacity="0.18"
                strokeWidth="0.6"
              />
            );
          })}
          <polygon points={polygon(100, 100, 36, 8, 22.5)} fill={`url(#${id}-table)`} />
          <polygon
            points={polygon(100, 100, 36, 8, 22.5)}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.55"
            strokeWidth="0.9"
          />
        </g>
      )}

      {/* ---------------------------------- Oval ---------------------------------- */}
      {cut === 'oval' && (
        <g>
          <ellipse cx="100" cy="100" rx="54" ry="74" fill={`url(#${id}-face)`} />
          <ellipse cx="100" cy="100" rx="54" ry="74" fill="none" stroke={deep} strokeOpacity="0.5" strokeWidth="1.4" />
          <path d="M100 26 L146 100 L100 174 L54 100 Z" fill={`url(#${id}-face-alt)`} fillOpacity="0.5" />
          <ellipse cx="100" cy="100" rx="27" ry="40" fill={`url(#${id}-table)`} />
          <ellipse cx="100" cy="100" rx="27" ry="40" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.9" />
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={100 + 27 * Math.cos(((i * 90 + 45) * Math.PI) / 180)}
              y1={100 + 40 * Math.sin(((i * 90 + 45) * Math.PI) / 180)}
              x2={100 + 54 * Math.cos(((i * 90 + 45) * Math.PI) / 180)}
              y2={100 + 74 * Math.sin(((i * 90 + 45) * Math.PI) / 180)}
              stroke="#ffffff"
              strokeOpacity="0.3"
              strokeWidth="0.8"
            />
          ))}
        </g>
      )}

      {/* -------------------------------- Emerald cut -------------------------------- */}
      {cut === 'emerald' && (
        <g>
          <polygon points={octagon(100, 100, 104, 138, 22)} fill={`url(#${id}-face)`} />
          <polygon
            points={octagon(100, 100, 104, 138, 22)}
            fill="none"
            stroke={deep}
            strokeOpacity="0.55"
            strokeWidth="1.4"
          />
          <polygon points={octagon(100, 100, 80, 110, 17)} fill={`url(#${id}-face-alt)`} fillOpacity="0.55" />
          <polygon
            points={octagon(100, 100, 80, 110, 17)}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.28"
            strokeWidth="0.8"
          />
          <polygon points={octagon(100, 100, 56, 80, 12)} fill={`url(#${id}-table)`} />
          <polygon
            points={octagon(100, 100, 56, 80, 12)}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.5"
            strokeWidth="0.9"
          />
        </g>
      )}

      {/* ----------------------------------- Pear ----------------------------------- */}
      {cut === 'pear' && (
        <g>
          <path
            d="M100 22 C126 60 148 92 148 118 A48 48 0 0 1 52 118 C52 92 74 60 100 22 Z"
            fill={`url(#${id}-face)`}
          />
          <path
            d="M100 22 C126 60 148 92 148 118 A48 48 0 0 1 52 118 C52 92 74 60 100 22 Z"
            fill="none"
            stroke={deep}
            strokeOpacity="0.5"
            strokeWidth="1.4"
          />
          <path d="M100 44 C118 74 132 98 132 118 A32 32 0 0 1 68 118 C68 98 82 74 100 44 Z" fill={`url(#${id}-table)`} />
          <line x1="100" y1="44" x2="100" y2="150" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.8" />
          <line x1="68" y1="118" x2="132" y2="118" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.8" />
        </g>
      )}

      {/* ---------------------------------- Cushion ---------------------------------- */}
      {cut === 'cushion' && (
        <g>
          <rect x="30" y="30" width="140" height="140" rx="42" fill={`url(#${id}-face)`} />
          <rect
            x="30"
            y="30"
            width="140"
            height="140"
            rx="42"
            fill="none"
            stroke={deep}
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
          <polygon points="100,34 166,100 100,166 34,100" fill={`url(#${id}-face-alt)`} fillOpacity="0.45" />
          <rect x="62" y="62" width="76" height="76" rx="22" fill={`url(#${id}-table)`} />
          <rect
            x="62"
            y="62"
            width="76"
            height="76"
            rx="22"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.5"
            strokeWidth="0.9"
          />
        </g>
      )}

      {/* ------------------------------ Rudraksha bead ------------------------------ */}
      {cut === 'bead' && (
        <g>
          <circle cx="100" cy="100" r="72" fill={`url(#${id}-bead)`} />
          {Array.from({ length: 5 }).map((_, i) => {
            const offset = (i - 2) * 27;
            return (
              <path
                key={i}
                d={`M100 28 C${100 + offset} 60 ${100 + offset} 140 100 172`}
                fill="none"
                stroke={deep}
                strokeOpacity="0.55"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const r = 30 + (i % 4) * 11;
            return (
              <circle
                key={`t-${i}`}
                cx={100 + r * Math.cos(angle)}
                cy={100 + r * Math.sin(angle) * 0.92}
                r={1.6 + (i % 3) * 0.5}
                fill={deep}
                fillOpacity="0.35"
              />
            );
          })}
          <circle cx="100" cy="100" r="72" fill="none" stroke={deep} strokeOpacity="0.5" strokeWidth="1.5" />
          <ellipse cx="76" cy="70" rx="20" ry="13" fill="#ffffff" fillOpacity="0.28" filter={`url(#${id}-soft)`} />
        </g>
      )}

      {/* -------------------------------- Yantra plate -------------------------------- */}
      {cut === 'plate' && (
        <g>
          <rect x="22" y="22" width="156" height="156" rx="8" fill={`url(#${id}-face)`} />
          <rect
            x="22"
            y="22"
            width="156"
            height="156"
            rx="8"
            fill="none"
            stroke={deep}
            strokeOpacity="0.6"
            strokeWidth="2"
          />
          <rect x="34" y="34" width="132" height="132" fill="none" stroke={light} strokeOpacity="0.5" strokeWidth="1.2" />
          {/* gates */}
          {[
            'M84 22 L84 34 L116 34 L116 22',
            'M84 178 L84 166 L116 166 L116 178',
            'M22 84 L34 84 L34 116 L22 116',
            'M178 84 L166 84 L166 116 L178 116',
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke={light} strokeOpacity="0.55" strokeWidth="1.4" />
          ))}
          <circle cx="100" cy="100" r="60" fill="none" stroke={light} strokeOpacity="0.55" strokeWidth="1.2" />
          {/* lotus petals */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * 360;
            return (
              <ellipse
                key={`p-${i}`}
                cx="100"
                cy="46"
                rx="6"
                ry="12"
                fill={light}
                fillOpacity="0.22"
                transform={`rotate(${angle} 100 100)`}
              />
            );
          })}
          <circle cx="100" cy="100" r="46" fill="none" stroke={light} strokeOpacity="0.5" strokeWidth="1.1" />
          {/* interlocking triangles */}
          {[0, 1, 2].map((i) => (
            <polygon
              key={`up-${i}`}
              points={polygon(100, 100, 42 - i * 11, 3, 0)}
              fill="none"
              stroke={light}
              strokeOpacity="0.75"
              strokeWidth="1.2"
            />
          ))}
          {[0, 1, 2].map((i) => (
            <polygon
              key={`dn-${i}`}
              points={polygon(100, 100, 42 - i * 11, 3, 180)}
              fill="none"
              stroke={light}
              strokeOpacity="0.75"
              strokeWidth="1.2"
            />
          ))}
          <circle cx="100" cy="100" r="5" fill={light} fillOpacity="0.9" />
        </g>
      )}

      {/* -------------------------------- Raw crystal -------------------------------- */}
      {cut === 'raw' && (
        <g>
          <polygon points="72,42 128,30 158,86 140,166 76,172 44,102" fill={`url(#${id}-face)`} />
          <polygon points="72,42 128,30 116,104 76,112" fill={light} fillOpacity="0.35" />
          <polygon points="116,104 158,86 140,166 118,150" fill={deep} fillOpacity="0.45" />
          <polygon points="76,112 116,104 118,150 76,172" fill={base} fillOpacity="0.35" />
          <polygon points="44,102 76,112 76,172" fill={deep} fillOpacity="0.55" />
          <polygon
            points="72,42 128,30 158,86 140,166 76,172 44,102"
            fill="none"
            stroke={deep}
            strokeOpacity="0.55"
            strokeWidth="1.6"
          />
          <line x1="116" y1="104" x2="76" y2="112" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.9" />
          <line x1="116" y1="104" x2="118" y2="150" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.9" />
        </g>
      )}

      {/* Specular sheen shared by every cut */}
      <ellipse
        cx="76"
        cy="66"
        rx="30"
        ry="18"
        fill={`url(#${id}-sheen)`}
        transform="rotate(-24 76 66)"
        opacity="0.75"
      />

      {sparkle && (
        <g>
          {[
            { x: 158, y: 46, s: 7, d: '0s' },
            { x: 44, y: 62, s: 5, d: '1.1s' },
            { x: 150, y: 152, s: 5.5, d: '2.1s' },
            { x: 60, y: 158, s: 4, d: '0.7s' },
          ].map((star, i) => (
            <path
              key={i}
              d={`M${star.x} ${star.y - star.s} Q${star.x} ${star.y} ${star.x + star.s} ${star.y} Q${star.x} ${star.y} ${star.x} ${star.y + star.s} Q${star.x} ${star.y} ${star.x - star.s} ${star.y} Q${star.x} ${star.y} ${star.x} ${star.y - star.s} Z`}
              fill="#ffffff"
              className="animate-twinkle"
              style={{ animationDelay: star.d }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

interface ProductImageProps {
  art: GemArt;
  seed: string;
  image?: string;
  alt: string;
  className?: string;
  glow?: boolean;
  sparkle?: boolean;
}

/**
 * Use real photography when a product has an `images` entry, otherwise fall
 * back to the procedural gemstone. This is the single swap point for moving
 * the prototype onto a real image CDN.
 */
export function ProductImage({ art, seed, image, alt, className, glow, sparkle }: ProductImageProps) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} className={cn('h-full w-full object-cover', className)} loading="lazy" />;
  }
  return <GemVisual art={art} seed={seed} className={className} glow={glow} sparkle={sparkle} />;
}
