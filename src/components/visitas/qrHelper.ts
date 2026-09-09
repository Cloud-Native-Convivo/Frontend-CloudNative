// Utilities for generating deterministic QR mock grid
const GRID = 21;
const QUIET = 4;
const TOTAL = GRID + QUIET * 2;
export const QR_CELL_SIZE = 240 / TOTAL;

export function isReserved(r: number, c: number): boolean {
  if (r <= 7 && c <= 7) return true;
  if (r <= 7 && c >= 13) return true;
  if (r >= 13 && c <= 7) return true;
  if (r === 6 || c === 6) return true;
  if (r >= 14 && r <= 18 && c >= 14 && c <= 18) return true;
  return false;
}

function setFinder(grid: boolean[][], row: number, col: number): void {
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
      const onInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      if (row + r < GRID && col + c < GRID) {
        grid[row + r][col + c] = onBorder || onInner;
      }
    }
  }
}

export function generateQrGrid(code: string): boolean[][] {
  const grid: boolean[][] = Array.from({ length: GRID }, () => Array(GRID).fill(false));

  setFinder(grid, 0, 0);
  setFinder(grid, 0, 14);
  setFinder(grid, 14, 0);

  for (let i = 8; i <= 12; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  for (let r = 14; r <= 18; r++) {
    for (let c = 14; c <= 18; c++) {
      const onBorder = r === 14 || r === 18 || c === 14 || c === 18;
      const isCenter = r === 16 && c === 16;
      grid[r][c] = onBorder || isCenter;
    }
  }

  const charCodes = Array.from(code).map((ch) => ch.charCodeAt(0));
  let bitIdx = 0;
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (!isReserved(r, c)) {
        const idx = bitIdx % charCodes.length;
        const bitPos = Math.floor(bitIdx / charCodes.length) % 8;
        bitIdx++;
        grid[r][c] = ((charCodes[idx] >> bitPos) & 1) === 1;
      }
    }
  }
  return grid;
}
