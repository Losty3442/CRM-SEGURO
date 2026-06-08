import { useState, useEffect } from 'react';
import { Calculator, HandCoins, User } from 'lucide-react';
import type { SubAgente, Cliente, Poliza } from '../types';
import * as storage from '../services/storage';
import Select from '../components/ui/Select';
import KPICard from '../components/ui/KPICard';
import EmptyState from '../components/ui/EmptyState';

type LiquidacionDetalle = Poliza & {
  clienteNombre: string;
  pagoSubagente: number;
};

export default function LiquidacionesPage() {
  const [subAgentes, setSubAgentes] = useState<SubAgente[]>([]);
  const [selectedSubAgenteId, setSelectedSubAgenteId] = useState<string>('');
  const [detalles, setDetalles] = useState<LiquidacionDetalle[]>([]);
  const [subAgenteSeleccionado, setSubAgenteSeleccionado] = useState<SubAgente | null>(null);

  useEffect(() => {
    setSubAgentes(storage.getAll<SubAgente>(storage.KEYS.SUBAGENTES));
  }, []);

  useEffect(() => {
    if (!selectedSubAgenteId) {
      setDetalles([]);
      setSubAgenteSeleccionado(null);
      return;
    }

    const subagente = subAgentes.find(s => s.id === selectedSubAgenteId) || null;
    setSubAgenteSeleccionado(subagente);

    if (subagente) {
      const clientes = storage.getAll<Cliente>(storage.KEYS.CLIENTES);
      const polizas = storage.getAll<Poliza>(storage.KEYS.POLIZAS);

      const clientesDelSubagente = clientes.filter(c => c.subAgenteId === selectedSubAgenteId);
      const idsClientes = clientesDelSubagente.map(c => c.id);

      const polizasVigentes = polizas.filter(
        p => idsClientes.includes(p.idCliente) && p.estado === 'Vigente'
      );

      const datosCalculados = polizasVigentes.map(p => {
        const cliente = clientesDelSubagente.find(c => c.id === p.idCliente)!;
        const comisionAgencia = p.prima * ((p.comisionPorcentaje || 0) / 100);
        const pagoSubagente = comisionAgencia * (subagente.comisionPorcentaje / 100);

        return {
          ...p,
          clienteNombre: cliente.nombreRazonSocial,
          pagoSubagente
        };
      });

      setDetalles(datosCalculados);
    }
  }, [selectedSubAgenteId, subAgentes]);

  const totalPen = detalles.filter(d => d.moneda === 'PEN').reduce((sum, d) => sum + d.pagoSubagente, 0);
  const totalUsd = detalles.filter(d => d.moneda === 'USD').reduce((sum, d) => sum + d.pagoSubagente, 0);

  const subAgenteOptions = [
    { value: '', label: 'Seleccione un subagente...' },
    ...subAgentes.map(s => ({ value: s.id, label: `${s.nombre} (${s.comisionPorcentaje}%)` }))
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Liquidaciones a SubAgentes</h1>
        <p className="text-sm text-gray-500 mt-1">Calcula y visualiza las comisiones a pagar por subagente.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full max-w-md">
        <Select
          label="SubAgente"
          options={subAgenteOptions}
          value={selectedSubAgenteId}
          onChange={(e) => setSelectedSubAgenteId(e.target.value)}
        />
      </div>

      {subAgenteSeleccionado ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KPICard 
              title="Total a Liquidar (PEN)" 
              value={`S/ ${totalPen.toFixed(2)}`} 
              icon={<HandCoins size={20} className="text-indigo-600" />}
              iconBg="bg-indigo-100"
            />
            <KPICard 
              title="Total a Liquidar (USD)" 
              value={`$ ${totalUsd.toFixed(2)}`} 
              icon={<HandCoins size={20} className="text-emerald-600" />}
              iconBg="bg-emerald-100"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Calculator size={18} className="text-gray-400" />
                Detalle de Liquidación
              </h3>
              <span className="text-sm text-gray-500">{detalles.length} pólizas vigentes encontradas</span>
            </div>

            {detalles.length === 0 ? (
              <EmptyState 
                icon={<User size={48} />}
                title="Sin producción"
                description="Este subagente no tiene clientes con pólizas vigentes actualmente."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Aseguradora</th>
                      <th className="px-6 py-4">Ramo</th>
                      <th className="px-6 py-4">Prima Póliza</th>
                      <th className="px-6 py-4 bg-indigo-50/50">Pago Subagente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {detalles.map((detalle) => (
                      <tr key={detalle.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{detalle.clienteNombre}</td>
                        <td className="px-6 py-4 text-gray-600">{detalle.companiaSeguro}</td>
                        <td className="px-6 py-4 text-gray-600">{detalle.ramo}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {detalle.moneda === 'PEN' ? 'S/' : '$'} {detalle.prima.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-indigo-700 bg-indigo-50/20">
                          {detalle.moneda === 'PEN' ? 'S/' : '$'} {detalle.pagoSubagente.toFixed(2)}
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
          icon={<Calculator size={48} />}
          title="Seleccione un SubAgente"
          description="Elija un subagente del selector superior para calcular su liquidación."
        />
      )}
    </div>
  );
}
