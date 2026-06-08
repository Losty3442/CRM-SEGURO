import { useState, useEffect } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { CalendarClock, Search } from 'lucide-react';
import type { Poliza, Cliente } from '../types';
import * as storage from '../services/storage';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';

type PolizaRenovacion = Poliza & {
  clienteNombre: string;
  diasRestantes: number;
};

export default function RenovacionesPage() {
  const [renovaciones, setRenovaciones] = useState<PolizaRenovacion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const clientes = storage.getAll<Cliente>(storage.KEYS.CLIENTES);
    const polizas = storage.getAll<Poliza>(storage.KEYS.POLIZAS);
    
    const now = new Date();

    const renovables = polizas
      .map(p => {
        const cliente = clientes.find(c => c.id === p.idCliente);
        const diasRestantes = differenceInDays(parseISO(p.vigenciaHasta), now);
        return {
          ...p,
          clienteNombre: cliente ? cliente.nombreRazonSocial : 'Cliente Desconocido',
          diasRestantes,
        };
      })
      .filter(p => p.diasRestantes <= 60)
      .sort((a, b) => a.diasRestantes - b.diasRestantes);

    setRenovaciones(renovables);
  }, []);

  const filtered = renovaciones.filter(p => 
    p.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.numeroPoliza.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.placaMotor || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (dias: number) => {
    if (dias < 0) return <Badge variant="red">Vencida ({Math.abs(dias)}d)</Badge>;
    if (dias <= 15) return <Badge variant="yellow">Vence en {dias}d</Badge>;
    if (dias <= 30) return <Badge variant="green">Vence en {dias}d</Badge>;
    return <Badge variant="blue">Vence en {dias}d</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Renovaciones</h1>
          <p className="text-sm text-gray-500 mt-1">Pólizas vencidas o por vencer en los próximos 60 días.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="w-96">
            <Input
              placeholder="Buscar por cliente, póliza o placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            {filtered.length} pólizas encontradas
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState 
            icon={<CalendarClock size={48} />}
            title="No hay renovaciones pendientes"
            description="No se encontraron pólizas vencidas o próximas a vencer en los siguientes 60 días."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Estado Renovación</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Póliza / Ramo</th>
                  <th className="px-6 py-4">Materia / Placa</th>
                  <th className="px-6 py-4">Vigencia Hasta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((poliza) => (
                  <tr key={poliza.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">{getStatusBadge(poliza.diasRestantes)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{poliza.clienteNombre}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-900">{poliza.numeroPoliza}</span>
                        <div className="flex gap-2">
                          <span className="text-xs font-medium text-gray-500">{poliza.companiaSeguro}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{poliza.ramo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {poliza.placaMotor ? (
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700 border border-gray-200">
                          {poliza.placaMotor}
                        </span>
                      ) : (
                        poliza.materiaAsegurada || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{poliza.vigenciaHasta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
