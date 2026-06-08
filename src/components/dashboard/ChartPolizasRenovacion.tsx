import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw } from 'lucide-react';

interface DataPoint { mes: string; cantidad: number; }

interface Props { data: DataPoint[]; }

const COLORS = ['#ef4444', '#f97316', '#eab308', '#6366f1', '#6366f1', '#6366f1'];

export default function ChartPolizasRenovacion({ data }: Props) {
  const total = data.reduce((s, d) => s + d.cantidad, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-indigo-500" />
            <h3 className="text-sm font-semibold text-gray-900">Pólizas por Renovar</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Próximos 6 meses · {total} pólizas vigentes</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={32} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(v: number) => [v, 'Pólizas']}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i] ?? '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex items-center gap-4 flex-wrap">
        {data.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] ?? '#6366f1' }} />
            {d.mes}: <strong>{d.cantidad}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
