import { useMemo } from "react";
import { generateQrGrid, QR_CELL_SIZE } from "./qrHelper";

interface QRCodeProps {
  code: string;
  size?: number;
}

export function QRCode({ code, size = 200 }: QRCodeProps) {
  const grid = useMemo(() => generateQrGrid(code), [code]);
  const QUIET = 4;

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <rect width="240" height="240" fill="white" />
      {grid.flatMap((row, r) =>
        row.map((active, c) => (
          <rect
            key={`${r}-${c}`}
            x={(c + QUIET) * QR_CELL_SIZE}
            y={(r + QUIET) * QR_CELL_SIZE}
            width={QR_CELL_SIZE}
            height={QR_CELL_SIZE}
            fill={active ? "#00201B" : "white"}
          />
        )),
      )}
    </svg>
  );
}
