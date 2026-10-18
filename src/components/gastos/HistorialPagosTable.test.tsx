import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistorialPagosTable, type HistorialEntry } from './HistorialPagosTable';

const mockHistorial: HistorialEntry[] = [
  { mes: 'Agosto 2026', total: '$600.000', estado: 'Al día', colorClass: 'text-teal-600 bg-teal-50' }
];

describe('HistorialPagosTable', () => {
  it('alinea la cabecera Total y la celda de montos a la derecha con números tabulares', () => {
    render(<HistorialPagosTable historial={mockHistorial} />);
    const thTotal = screen.getByText('Total');
    expect(thTotal).toHaveClass('text-right');
    const tdMonto = screen.getByText('$600.000');
    expect(tdMonto).toHaveClass('text-right');
    expect(tdMonto).toHaveClass('tabular-nums');
  });
});
