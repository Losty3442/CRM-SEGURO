import { cn } from '../../utils/cn';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export default function KPICard({ title, value, subtitle, icon, iconBg = 'bg-indigo-100', trend, className }: KPICardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow', className)}>
      <div className={cn('rounded-xl p-3 shrink-0', iconBg)}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900 leading-none">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-500 truncate">{subtitle}</p>}
        {trend && (
          <p className={cn('mt-1.5 text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-600')}>
            {trend.positive ? '▲' : '▼'} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
