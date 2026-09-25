import { useMemo } from "react";

const GRID = 21;
const QUIET = 4;
const CELL = 240 / (GRID + QUIET * 2);

function isFinder(r: number, c: number): boolean {
  const inTopLeft = r < 7 && c < 7;
  const inTopRight = r < 7 && c >= 14;
  const inBottomLeft = r >= 14 && c < 7;
  if (!inTopLeft && !inTopRight && !inBottomLeft) return false;
  const localR = r >= 14 ? r - 14 : r;
  const localC = c >= 14 ? c - 14 : c;
  return (
    localR === 0 ||
    localR === 6 ||
    localC === 0 ||
    localC === 6 ||
    (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4)
  );
}

function generateQrCells(code: string): { r: number; c: number }[] {
  const cells: { r: number; c: number }[] = [];
  const chars = Array.from(code).map((c) => c.charCodeAt(0));
  let bit = 0;

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (isFinder(r, c)) {
        cells.push({ r, c });
      } else if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) cells.push({ r, c });
      } else {
        const char = chars[bit % chars.length] || 42;
        const bitVal = (char >> (bit % 8)) & 1;
        bit++;
        if (bitVal === 1) cells.push({ r, c });
      }
    }
  }
  return cells;
}

export function QRCode({ code, size = 200 }: { code: string; size?: number }) {
  const cells = useMemo(() => generateQrCells(code), [code]);

  return (
    <svg viewBox="0 0 240 240" width={size} height={size} className="block">
      <rect width="240" height="240" fill="white" />
      {cells.map(({ r, c }) => (
        <rect
          key={`${r}-${c}`}
          x={(c + QUIET) * CELL}
          y={(r + QUIET) * CELL}
          width={CELL}
          height={CELL}
          fill="#00201B"
        />
      ))}
    </svg>
  );
}
