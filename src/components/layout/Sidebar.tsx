import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  AlertTriangle,
  Shield,
  DollarSign,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/dashboard',  label: 'Escritorio',  icon: LayoutDashboard },
  { to: '/clientes',   label: 'Clientes',    icon: Users },
  { to: '/polizas',    label: 'Pólizas',     icon: FileText },
  { to: '/cobranzas',  label: 'Cobranzas',   icon: CreditCard },
  { to: '/comisiones', label: 'Comisiones',  icon: DollarSign },
  { to: '/siniestros', label: 'Siniestros',  icon: AlertTriangle },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="bg-indigo-600 rounded-xl p-2 shadow-lg">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">CRM Seguros</p>
          <p className="text-slate-400 text-xs leading-tight">Corredor de Seguros</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Menú Principal</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={cn('shrink-0 transition-colors', isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300')}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700/60">
        <p className="text-xs text-slate-500 text-center">MVP v0.1 · localStorage</p>
      </div>
    </aside>
  );
}
