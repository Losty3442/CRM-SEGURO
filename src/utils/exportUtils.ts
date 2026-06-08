import * as XLSX from 'xlsx';
import type { Poliza, Cliente, Cuota, Siniestro } from '../types';
import { formatDate } from './dateUtils';

export function exportPolizasToExcel(polizas: Poliza[], clientes: Cliente[]): void {
  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));

  const rows = polizas.map((p) => ({
    'N° Póliza': p.numeroPoliza,
    'Cliente': clienteMap.get(p.idCliente) ?? '—',
    'Compañía': p.companiaSeguro,
    'Ramo': p.ramo,
    'Materia Asegurada': p.materiaAsegurada || '',
    'Vigencia Desde': formatDate(p.vigenciaDesde),
    'Vigencia Hasta': formatDate(p.vigenciaHasta),
    'Prima': p.prima,
    'Moneda': p.moneda,
    'Comisión (%)': p.comisionPorcentaje || 0,
    'Estado': p.estado,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 22 }, { wch: 36 }, { wch: 18 }, { wch: 22 }, { wch: 25 },
    { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 10 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pólizas');
  XLSX.writeFile(wb, `polizas_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportCuotasToExcel(cuotas: Cuota[], polizas: Poliza[], clientes: Cliente[]): void {
  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));
  const polizaMap = new Map(polizas.map((p) => [p.id, p]));

  const rows = cuotas.map((c) => {
    const poliza = polizaMap.get(c.idPoliza);
    return {
      'Cliente': poliza ? (clienteMap.get(poliza.idCliente) ?? '—') : '—',
      'Póliza': poliza?.numeroPoliza || '—',
      'Cuota': `${c.numeroCuota}/${c.totalCuotas}`,
      'Vencimiento': formatDate(c.fechaVencimiento),
      'Monto': c.monto,
      'Moneda': c.moneda,
      'Estado': c.estado,
      'Fecha Pago': c.fechaPago ? formatDate(c.fechaPago) : '',
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Cobranzas');
  XLSX.writeFile(wb, `cobranzas_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportSiniestrosToExcel(siniestros: Siniestro[], polizas: Poliza[], clientes: Cliente[]): void {
  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));
  const polizaMap = new Map(polizas.map((p) => [p.id, p]));

  const rows = siniestros.map((s) => {
    const poliza = polizaMap.get(s.idPoliza);
    return {
      'Cliente': poliza ? (clienteMap.get(poliza.idCliente) ?? '—') : '—',
      'Póliza': poliza?.numeroPoliza || '—',
      'Fecha Siniestro': formatDate(s.fechaSiniestro),
      'Tipo': s.tipo,
      'Estado': s.estado,
      'Observaciones': s.observaciones,
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Siniestros');
  XLSX.writeFile(wb, `siniestros_${new Date().toISOString().split('T')[0]}.xlsx`);
}
