import { useState } from 'react';
import { Pencil, Trash2, AlertTriangle, Download } from 'lucide-react';
import type { Siniestro, Poliza, Cliente } from '../../types';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { formatDate } from '../../utils/dateUtils';
import { exportSiniestrosToExcel } from '../../utils/exportUtils';
import Button from '../ui/Button';

interface Props {
  siniestros: Siniestro[];
  polizas: Poliza[];
  clientes: Cliente[];
  onEdit: (siniestro: Siniestro) => void;
  onDelete: (id: string) => void;
}

const estadoBadge = (estado: Siniestro['estado']): 'green' | 'yellow' | 'orange' =>
  ({ Resuelto: 'green', Pendiente: 'yellow', 'En Proceso': 'orange' } as const)[estado];

export default function SiniestroTable({ siniestros, polizas, clientes, onEdit, onDelete }: Props) {
  const [filterEstado, setFilterEstado] = useState('');
  const [search, setSearch] = useState('');

  const polizaMap = new Map(polizas.map((p) => [p.id, p]));
  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));

  const filtered = siniestros.filter((s) => {
    const pol = polizaMap.get(s.idPoliza);
    const clienteNombre = pol ? (clienteMap.get(pol.idCliente) ?? '') : '';
    const q = search.toLowerCase();
    const matchSearch =
      s.tipo.toLowerCase().includes(q) ||
      (pol?.numeroPoliza ?? '').toLowerCase().includes(q) ||
      clienteNombre.toLowerCase().includes(q);
    const matchEstado = filterEstado ? s.estado === filterEstado : true;
    return matchSearch && matchEstado;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por tipo, póliza o cliente..."
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
          <option value="En Proceso">En Proceso</option>
          <option value="Resuelto">Resuelto</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportSiniestrosToExcel(filtered, polizas, clientes)}
          className="shrink-0"
        >
          <Download size={14} />
          Exportar Excel
        </Button>
        <span className="text-xs text-gray-500 shrink-0">{filtered.length} siniestro(s)</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<AlertTriangle size={28} />} title="No se encontraron siniestros" description="Ajusta los filtros o registra un nuevo siniestro." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Póliza / Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Observaciones</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((s) => {
                  const pol = polizaMap.get(s.idPoliza);
                  const cliente = pol ? (clienteMap.get(pol.idCliente) ?? '—') : '—';
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-medium text-gray-800">{pol?.numeroPoliza ?? s.idPoliza}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">{cliente}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-800 max-w-[180px]">
                        <p className="truncate">{s.tipo}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(s.fechaSiniestro)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={estadoBadge(s.estado)}>{s.estado}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[250px]">
                        <p className="line-clamp-2">{s.observaciones || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => onEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Editar">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => onDelete(s.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
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
