import { SVGProps } from "react";

// Each icon is drawn on an 8×8 pixel grid inside a 16×16 viewBox.
// Every "pixel" is a 2×2 <rect>. Coordinates are [col, row] (0-indexed).

type P = SVGProps<SVGSVGElement>;

function Icon({ pixels, ...props }: { pixels: [number, number][] } & P) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      {pixels.map(([c, r]) => (
        <rect key={`${c}-${r}`} x={c * 2} y={r * 2} width={2} height={2} />
      ))}
    </svg>
  );
}

// ──────────── icon pixel maps ────────────

const CROWN: [number, number][] = [
  [1,0],[6,0],
  [0,1],[1,1],[6,1],[7,1],
  [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],
  [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
  [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],
];

// Four-quadrant grid (dashboard)
const DASHBOARD: [number, number][] = [
  [0,0],[1,0],[2,0],[4,0],[5,0],[6,0],
  [0,1],[1,1],[2,1],[4,1],[5,1],[6,1],
  [0,2],[1,2],[2,2],[4,2],[5,2],[6,2],
  // gap row 3
  [0,4],[1,4],[2,4],[4,4],[5,4],[6,4],
  [0,5],[1,5],[2,5],[4,5],[5,5],[6,5],
  [0,6],[1,6],[2,6],[4,6],[5,6],[6,6],
];

// Vertical sword: tip → blade → guard → grip → pommel
const SWORD: [number, number][] = [
  [3,0],
  [3,1],
  [3,2],
  [1,3],[2,3],[3,3],[4,3],[5,3],
  [3,4],
  [3,5],
  [2,6],[3,6],[4,6],
];

// Flame shape
const FLAME: [number, number][] = [
  [2,0],[4,0],
  [1,1],[2,1],[3,1],[4,1],[5,1],
  [1,2],[2,2],[3,2],[4,2],[5,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],
  [1,4],[2,4],[3,4],[4,4],[5,4],
  [2,5],[3,5],[4,5],
  [3,6],
];

// Treasure chest
const CHEST: [number, number][] = [
  // lid arc
  [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
  [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
  [0,2],[7,2],[3,2],[4,2],
  [0,3],[7,3],[3,3],[4,3],
  // hinge line
  [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],
  // base
  [0,5],[7,5],
  [0,6],[7,6],
  [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],
];

// Three-bar bar chart
const CHART: [number, number][] = [
  // tallest bar (right)
  [6,1],[6,2],[6,3],[6,4],[6,5],
  // medium bar (centre)
  [4,3],[4,4],[4,5],
  // short bar (left)
  [2,5],
  // baseline
  [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],
];

// Door frame (left) + right arrow (logout)
const LOGOUT: [number, number][] = [
  // door frame
  [0,1],[1,1],[2,1],[3,1],
  [0,2],[3,2],
  [0,3],[3,3],
  [0,4],[3,4],
  [0,5],[3,5],
  [0,6],[1,6],[2,6],[3,6],
  // arrow →
  [6,2],
  [5,3],[6,3],[7,3],
  [5,4],[6,4],[7,4],
  [6,5],
];

// ──────────── exports ────────────

export const PixelCrown     = (p: P) => <Icon pixels={CROWN}     {...p} />;
export const PixelDashboard = (p: P) => <Icon pixels={DASHBOARD} {...p} />;
export const PixelSword     = (p: P) => <Icon pixels={SWORD}     {...p} />;
export const PixelFlame     = (p: P) => <Icon pixels={FLAME}     {...p} />;
export const PixelChest     = (p: P) => <Icon pixels={CHEST}     {...p} />;
export const PixelChart     = (p: P) => <Icon pixels={CHART}     {...p} />;
export const PixelLogout    = (p: P) => <Icon pixels={LOGOUT}    {...p} />;
