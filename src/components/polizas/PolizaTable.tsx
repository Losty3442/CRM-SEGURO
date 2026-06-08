import { useState } from 'react';
import { Pencil, Trash2, FileText, Download } from 'lucide-react';
import type { Poliza, Cliente } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { formatDate, formatCurrency, isExpiringSoon } from '../../utils/dateUtils';
import { exportPolizasToExcel } from '../../utils/exportUtils';

interface Props {
  polizas: Poliza[];
  clientes: Cliente[];
  onEdit: (poliza: Poliza) => void;
  onDelete: (id: string) => void;
}

const estadoBadge = (estado: Poliza['estado']): 'green' | 'red' | 'gray' =>
  ({ Vigente: 'green', Vencida: 'red', Anulada: 'gray' } as const)[estado];

export default function PolizaTable({ polizas, clientes, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterRamo, setFilterRamo] = useState('');

  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));

  const filtered = polizas.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.numeroPoliza.toLowerCase().includes(q) ||
      (clienteMap.get(p.idCliente) ?? '').toLowerCase().includes(q) ||
      p.companiaSeguro.toLowerCase().includes(q);
    const matchEstado = filterEstado ? p.estado === filterEstado : true;
    const matchRamo = filterRamo ? p.ramo === filterRamo : true;
    return matchSearch && matchEstado && matchRamo;
  });

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por póliza, cliente o compañía..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los estados</option>
          <option value="Vigente">Vigente</option>
          <option value="Vencida">Vencida</option>
          <option value="Anulada">Anulada</option>
        </select>
        <select
          value={filterRamo}
          onChange={(e) => setFilterRamo(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los ramos</option>
          {['SOAT','SCTR','Vehicular','Salud','Vida','Hogar','Accidentes Personales','Otro'].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportPolizasToExcel(filtered, clientes)}
          className="shrink-0"
        >
          <Download size={14} />
          Exportar Excel
        </Button>
        <span className="text-xs text-gray-500 shrink-0">{filtered.length} resultado(s)</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FileText size={28} />} title="No se encontraron pólizas" description="Ajusta los filtros o agrega una nueva póliza." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">N° Póliza</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Compañía / Ramo</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Vigencia</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Prima</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => {
                  const expiringSoon = p.estado === 'Vigente' && isExpiringSoon(p.vigenciaHasta, 30);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-medium text-gray-800">{p.numeroPoliza}</p>
                        {p.materiaAsegurada && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]" title={p.materiaAsegurada}>
                            {p.materiaAsegurada}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 truncate max-w-[160px]">{clienteMap.get(p.idCliente) ?? '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{p.companiaSeguro}</p>
                        <span className="text-xs text-indigo-600 font-medium">{p.ramo}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <p>{formatDate(p.vigenciaDesde)}</p>
                        <p className={expiringSoon ? 'text-red-600 font-medium' : ''}>
                          {formatDate(p.vigenciaHasta)}
                          {expiringSoon && ' ⚠'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(p.prima, p.moneda)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={estadoBadge(p.estado)}>{p.estado}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Editar">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => onDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
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
