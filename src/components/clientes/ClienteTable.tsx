import { useState } from 'react';
import { Pencil, Trash2, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Cliente } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { formatDate } from '../../utils/dateUtils';

interface Props {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

export default function ClienteTable({ clientes, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = clientes.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.nombreRazonSocial.toLowerCase().includes(q) ||
      c.numeroDocumento.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre, documento o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <span className="text-xs text-gray-500 shrink-0">{filtered.length} resultado(s)</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No se encontraron clientes" description="Prueba con otro término de búsqueda o agrega un nuevo cliente." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Documento</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Contacto</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Registro</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/clientes/${c.id}`)} className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline text-left">
                        {c.nombreRazonSocial}
                      </button>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{c.direccion || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{c.tipoDocumento}</span>
                      <p className="text-sm text-gray-700 mt-0.5">{c.numeroDocumento}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{c.telefono}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[160px]">{c.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.estado === 'Activo' ? 'green' : 'gray'}>{c.estado}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(c.fechaRegistro)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/clientes/${c.id}`)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Ver Perfil 360">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => onEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Editar">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => onDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
