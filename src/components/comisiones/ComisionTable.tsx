import { useState } from 'react';
import { Pencil, Trash2, DollarSign } from 'lucide-react';
import type { Comision, Poliza, Cliente } from '../../types';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { formatDate, formatCurrency } from '../../utils/dateUtils';

interface Props {
  comisiones: Comision[];
  polizas: Poliza[];
  clientes: Cliente[];
  onEdit: (comision: Comision) => void;
  onDelete: (id: string) => void;
}

const estadoBadge = (estado: Comision['estado']): 'green' | 'yellow' =>
  ({ Cobrada: 'green', Pendiente: 'yellow' } as const)[estado];

export default function ComisionTable({ comisiones, polizas, clientes, onEdit, onDelete }: Props) {
  const [filterEstado, setFilterEstado] = useState('');
  const [search, setSearch] = useState('');

  const polizaMap = new Map(polizas.map((p) => [p.id, p]));
  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));

  const filtered = comisiones.filter((c) => {
    const pol = polizaMap.get(c.idPoliza);
    const clienteNombre = pol ? (clienteMap.get(pol.idCliente) ?? '') : '';
    const q = search.toLowerCase();
    const matchSearch =
      (pol?.numeroPoliza ?? '').toLowerCase().includes(q) ||
      (pol?.companiaSeguro ?? '').toLowerCase().includes(q) ||
      clienteNombre.toLowerCase().includes(q);
    const matchEstado = filterEstado ? c.estado === filterEstado : true;
    return matchSearch && matchEstado;
  });

  const pendientes = comisiones.filter((c) => c.estado === 'Pendiente').length;
  const montoTotalPendiente = comisiones
    .filter((c) => c.estado === 'Pendiente' && c.moneda === 'PEN')
    .reduce((s, c) => s + c.montoEsperado, 0);

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex gap-3 flex-wrap">
        <span className="text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200 ring-inset px-3 py-1.5 rounded-full font-medium">
          {pendientes} comisión(es) por cobrar
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 ring-1 ring-gray-200 ring-inset px-3 py-1.5 rounded-full font-medium">
          Total aprox. por cobrar (PEN): S/ {montoTotalPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Buscar póliza, cliente o compañía..."
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
          <option value="Cobrada">Cobrada</option>
        </select>
        <span className="text-xs text-gray-500 shrink-0">{filtered.length} registro(s)</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<DollarSign size={28} />} title="No hay comisiones" description="Ajusta los filtros o registra una." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Póliza / Compañía</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Cliente</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Comisión Estimada</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Fecha Cobro</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => {
                  const pol = polizaMap.get(c.idPoliza);
                  const cliente = pol ? (clienteMap.get(pol.idCliente) ?? '—') : '—';
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-medium text-gray-800">{pol?.numeroPoliza ?? c.idPoliza}</p>
                        <p className="text-xs text-indigo-600 font-medium">{pol?.companiaSeguro}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 truncate max-w-[180px]">{cliente}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                        {formatCurrency(c.montoEsperado, c.moneda)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={estadoBadge(c.estado)}>{c.estado}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {c.fechaCobro ? formatDate(c.fechaCobro) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => onEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Editar">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => onDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
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
