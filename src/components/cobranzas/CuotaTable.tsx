import { useState } from 'react';
import { Pencil, Trash2, CreditCard, Download } from 'lucide-react';
import type { Cuota, Poliza, Cliente } from '../../types';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { formatDate, formatCurrency } from '../../utils/dateUtils';
import { exportCuotasToExcel } from '../../utils/exportUtils';
import Button from '../ui/Button';

interface Props {
  cuotas: Cuota[];
  polizas: Poliza[];
  clientes: Cliente[];
  onEdit: (cuota: Cuota) => void;
  onDelete: (id: string) => void;
}

const estadoBadge = (estado: Cuota['estado']): 'green' | 'red' | 'yellow' =>
  ({ Pagado: 'green', Vencido: 'red', Pendiente: 'yellow' } as const)[estado];

export default function CuotaTable({ cuotas, polizas, clientes, onEdit, onDelete }: Props) {
  const [filterEstado, setFilterEstado] = useState('');
  const [search, setSearch] = useState('');

  const polizaMap = new Map(polizas.map((p) => [p.id, p]));
  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));

  const filtered = cuotas.filter((c) => {
    const pol = polizaMap.get(c.idPoliza);
    const clienteNombre = pol ? (clienteMap.get(pol.idCliente) ?? '') : '';
    const q = search.toLowerCase();
    const matchSearch =
      (pol?.numeroPoliza ?? '').toLowerCase().includes(q) ||
      clienteNombre.toLowerCase().includes(q);
    const matchEstado = filterEstado ? c.estado === filterEstado : true;
    return matchSearch && matchEstado;
  });

  const pendientes = cuotas.filter((c) => c.estado !== 'Pagado').length;
  const montoTotal = cuotas
    .filter((c) => c.estado !== 'Pagado')
    .reduce((s, c) => s + c.monto, 0);

  return (
    <div className="space-y-3">
      {/* Summary chips */}
      <div className="flex gap-3 flex-wrap">
        <span className="text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200 ring-inset px-3 py-1.5 rounded-full font-medium">
          {pendientes} cuota(s) no pagadas
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 ring-1 ring-gray-200 ring-inset px-3 py-1.5 rounded-full font-medium">
          Monto pendiente aprox.: S/ {montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por número de póliza o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
          <option value="Vencido">Vencido</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportCuotasToExcel(filtered, polizas, clientes)}
          className="shrink-0"
        >
          <Download size={14} />
          Exportar Excel
        </Button>
        <span className="text-xs text-gray-500 shrink-0">{filtered.length} cuota(s)</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<CreditCard size={28} />} title="No se encontraron cuotas" description="Ajusta los filtros o registra una nueva cuota." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Póliza / Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Cuota</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Vencimiento</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Monto</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Fecha Pago</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((cuota) => {
                  const pol = polizaMap.get(cuota.idPoliza);
                  const cliente = pol ? (clienteMap.get(pol.idCliente) ?? '—') : '—';
                  return (
                    <tr key={cuota.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-medium text-gray-800">{pol?.numeroPoliza ?? cuota.idPoliza}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">{cliente}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {cuota.numeroCuota} / {cuota.totalCuotas}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(cuota.fechaVencimiento)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(cuota.monto, cuota.moneda)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={estadoBadge(cuota.estado)}>{cuota.estado}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {cuota.fechaPago ? formatDate(cuota.fechaPago) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => onEdit(cuota)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Editar">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => onDelete(cuota.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
