import {
  format,
  isAfter,
  isBefore,
  startOfMonth,
  endOfMonth,
  addMonths,
  parseISO,
  isValid,
} from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'dd/MM/yyyy', { locale: es }) : dateStr;
  } catch { return dateStr; }
}

export function formatCurrency(amount: number, currency: 'PEN' | 'USD'): string {
  const symbol = currency === 'PEN' ? 'S/' : 'US$';
  return `${symbol} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function isExpiringSoon(dateStr: string, daysThreshold = 30): boolean {
  try {
    const today = new Date();
    const expiry = parseISO(dateStr);
    const threshold = new Date(today.getTime() + daysThreshold * 86_400_000);
    return isAfter(expiry, today) && isBefore(expiry, threshold);
  } catch { return false; }
}

export function isExpiredDate(dateStr: string): boolean {
  try { return isBefore(parseISO(dateStr), new Date()); }
  catch { return false; }
}

/** Counts vigente policies expiring per month for the next `monthsAhead` months */
export function getPoliciesExpiringByMonth(
  polizas: Array<{ vigenciaHasta: string; estado: string }>,
  monthsAhead = 6
): Array<{ mes: string; cantidad: number }> {
  const today = new Date();
  return Array.from({ length: monthsAhead }, (_, i) => {
    const target = addMonths(today, i);
    const start = startOfMonth(target);
    const end = endOfMonth(target);
    const cantidad = polizas.filter((p) => {
      if (p.estado !== 'Vigente') return false;
      try {
        const exp = parseISO(p.vigenciaHasta);
        return exp >= start && exp <= end;
      } catch { return false; }
    }).length;
    return { mes: format(target, 'MMM yy', { locale: es }), cantidad };
  });
}

/** Sums pending/overdue cuota amounts (converted to PEN) per month */
export function getCuotasPendientesByMonth(
  cuotas: Array<{ fechaVencimiento: string; estado: string; monto: number; moneda: string }>,
  monthsRange = 6
): Array<{ mes: string; monto: number }> {
  const today = new Date();
  return Array.from({ length: monthsRange + 1 }, (_, i) => {
    const target = addMonths(today, i - 1);
    const start = startOfMonth(target);
    const end = endOfMonth(target);
    const monto = cuotas
      .filter((c) => {
        if (c.estado === 'Pagado') return false;
        try {
          const fecha = parseISO(c.fechaVencimiento);
          return fecha >= start && fecha <= end;
        } catch { return false; }
      })
      .reduce((sum, c) => sum + c.monto * (c.moneda === 'USD' ? 3.8 : 1), 0);
    return { mes: format(target, 'MMM yy', { locale: es }), monto: Math.round(monto) };
  });
}
