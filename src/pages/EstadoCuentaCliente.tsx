import { useState, useEffect } from 'react';
import { CreditCard, FileText } from 'lucide-react';
import type { Cliente, Poliza, Cuota } from '../types';
import * as storage from '../services/storage';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import KPICard from '../components/ui/KPICard';

type CuotaDetalle = Cuota & {
  polizaNumero: string;
  compania: string;
};

export default function EstadoCuentaCliente() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [cuotas, setCuotas] = useState<CuotaDetalle[]>([]);

  useEffect(() => {
    setClientes(storage.getAll<Cliente>(storage.KEYS.CLIENTES));
  }, []);

  useEffect(() => {
    if (!selectedClienteId) {
      setCuotas([]);
      return;
    }

    const allPolizas = storage.getAll<Poliza>(storage.KEYS.POLIZAS);
    const polizasCliente = allPolizas.filter(p => p.idCliente === selectedClienteId);
    const polizasIds = polizasCliente.map(p => p.id);

    const allCuotas = storage.getAll<Cuota>(storage.KEYS.CUOTAS);
    const cuotasPendientes = allCuotas
      .filter(c => polizasIds.includes(c.idPoliza) && (c.estado === 'Pendiente' || c.estado === 'Vencido'))
      .map(c => {
        const p = polizasCliente.find(pol => pol.id === c.idPoliza)!;
        return {
          ...c,
          polizaNumero: p.numeroPoliza,
          compania: p.companiaSeguro,
        };
      })
      .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime());

    setCuotas(cuotasPendientes);
  }, [selectedClienteId]);

  const totalPen = cuotas.filter(c => c.moneda === 'PEN').reduce((acc, c) => acc + c.monto, 0);
  const totalUsd = cuotas.filter(c => c.moneda === 'USD').reduce((acc, c) => acc + c.monto, 0);

  const clienteOptions = [
    { value: '', label: 'Seleccione un cliente...' },
    ...clientes.map(c => ({ value: c.id, label: c.nombreRazonSocial }))
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Estado de Cuenta</h1>
        <p className="text-sm text-gray-500 mt-1">Consulta las cuotas pendientes y vencidas consolidadas por cliente.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full max-w-md">
        <Select
          label="Buscar Cliente"
          options={clienteOptions}
          value={selectedClienteId}
          onChange={(e) => setSelectedClienteId(e.target.value)}
        />
      </div>

      {selectedClienteId ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KPICard 
              title="Deuda Total (PEN)" 
              value={`S/ ${totalPen.toFixed(2)}`} 
              icon={<CreditCard size={20} className="text-indigo-600" />}
              trend={{ value: totalPen > 0 ? "Pendiente" : "Al día", positive: totalPen === 0 }}
            />
            <KPICard 
              title="Deuda Total (USD)" 
              value={`$ ${totalUsd.toFixed(2)}`} 
              icon={<CreditCard size={20} className="text-emerald-600" />}
              trend={{ value: totalUsd > 0 ? "Pendiente" : "Al día", positive: totalUsd === 0 }}
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {cuotas.length === 0 ? (
              <EmptyState 
                icon={<CreditCard size={48} />}
                title="Cliente al día"
                description="Este cliente no tiene cuotas pendientes ni vencidas en ninguna de sus pólizas."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Póliza</th>
                      <th className="px-6 py-4">Compañía</th>
                      <th className="px-6 py-4">Cuota</th>
                      <th className="px-6 py-4">Vencimiento</th>
                      <th className="px-6 py-4">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cuotas.map((cuota) => (
                      <tr key={cuota.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <Badge variant={cuota.estado === 'Vencido' ? 'red' : 'yellow'}>
                            {cuota.estado}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{cuota.polizaNumero}</td>
                        <td className="px-6 py-4 text-gray-600">{cuota.compania}</td>
                        <td className="px-6 py-4 text-gray-600">{cuota.numeroCuota} / {cuota.totalCuotas}</td>
                        <td className="px-6 py-4 text-gray-600">{cuota.fechaVencimiento}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {cuota.moneda === 'PEN' ? 'S/' : '$'} {cuota.monto.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState 
          icon={<FileText size={48} />}
          title="Seleccione un cliente"
          description="Elija un cliente de la lista para visualizar su estado de cuenta consolidado."
        />
      )}
    </div>
  );
}
