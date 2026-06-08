import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard } from 'lucide-react';

interface DataPoint { mes: string; monto: number; }

interface Props { data: DataPoint[]; }

const formatSoles = (v: number) => `S/ ${v.toLocaleString('es-PE')}`;

export default function ChartCuotasPendientes({ data }: Props) {
  const total = data.reduce((s, d) => s + d.monto, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900">Cuotas Pendientes de Cobro</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Últimos 7 meses · Total: {formatSoles(total)} aprox. en PEN
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={32} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(v: number) => [formatSoles(v), 'Monto (PEN)'] }
            cursor={{ fill: '#fffbeb' }}
          />
          <Bar dataKey="monto" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
