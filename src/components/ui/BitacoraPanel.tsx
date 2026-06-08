import { useState } from 'react';
import { Clock, Send, User } from 'lucide-react';
import type { BitacoraEntry } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import Button from './Button';

interface Props {
  bitacora: BitacoraEntry[];
  onAddEntry: (nota: string) => void;
}

export default function BitacoraPanel({ bitacora, onAddEntry }: Props) {
  const [nota, setNota] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nota.trim()) return;
    onAddEntry(nota.trim());
    setNota('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <Clock size={18} className="text-gray-500" />
        <h3 className="font-semibold text-gray-800">Bitácora de Gestión</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
        {bitacora.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No hay registros en la bitácora aún.
          </div>
        ) : (
          <div className="space-y-4">
            {bitacora.map((entry, index) => (
              <div key={entry.id || index} className="flex gap-3">
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <User size={14} />
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-gray-700">{entry.usuario}</span>
                    <span className="text-[10px] text-gray-500">{formatDate(entry.fecha)}</span>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{entry.nota}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Añadir una nota..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button type="submit" disabled={!nota.trim()} className="px-3">
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
