import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend
} from 'recharts';
import { BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import type { Poliza } from '../types';
import * as storage from '../services/storage';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
const EXCHANGE_RATE_USD = 3.80; // Tasa de cambio simulada para unificar primas

interface DataPrimas {
  name: string;
  value: number;
}

interface DataRamos {
  name: string;
  cantidad: number;
}

export default function ProduccionPage() {
  const [dataPrimas, setDataPrimas] = useState<DataPrimas[]>([]);
  const [dataRamos, setDataRamos] = useState<DataRamos[]>([]);

  useEffect(() => {
    const polizas = storage.getAll<Poliza>(storage.KEYS.POLIZAS);
    const vigentes = polizas.filter(p => p.estado === 'Vigente');

    // Procesar Primas por Aseguradora (Unificado a PEN referencial)
    const primasMap = vigentes.reduce((acc, p) => {
      const primaPEN = p.moneda === 'USD' ? p.prima * EXCHANGE_RATE_USD : p.prima;
      acc[p.companiaSeguro] = (acc[p.companiaSeguro] || 0) + primaPEN;
      return acc;
    }, {} as Record<string, number>);

    const primasArr = Object.keys(primasMap)
      .map(key => ({ name: key, value: Math.round(primasMap[key]) }))
      .sort((a, b) => b.value - a.value);

    // Procesar Pólizas por Ramo
    const ramosMap = vigentes.reduce((acc, p) => {
      acc[p.ramo] = (acc[p.ramo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ramosArr = Object.keys(ramosMap)
      .map(key => ({ name: key, cantidad: ramosMap[key] }))
      .sort((a, b) => b.cantidad - a.cantidad);

    setDataPrimas(primasArr);
    setDataRamos(ramosArr);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <BarChart2 className="text-indigo-600" /> Producción
        </h1>
        <p className="text-sm text-gray-500 mt-1">Análisis gráfico de las ventas consolidadas del corredor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Primas por Aseguradora */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <PieChartIcon size={18} className="text-indigo-500" />
            <h3 className="text-base font-semibold text-gray-900">Primas por Aseguradora</h3>
            <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Equiv. en PEN</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPrimas}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {dataPrimas.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`S/ ${value.toLocaleString()}`, 'Total Primas']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Cantidad de Pólizas por Ramo */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <BarChart2 size={18} className="text-emerald-500" />
            <h3 className="text-base font-semibold text-gray-900">Pólizas por Ramo</h3>
            <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Vigentes</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRamos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip 
                  formatter={(value: number) => [value, 'Pólizas']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                  {dataRamos.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
