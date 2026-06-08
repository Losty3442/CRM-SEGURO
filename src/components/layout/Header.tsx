import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TITLES: Record<string, string> = {
  '/dashboard':  'Escritorio',
  '/clientes':   'Clientes',
  '/polizas':    'Pólizas',
  '/cobranzas':  'Cobranzas',
  '/siniestros': 'Siniestros',
};

export default function Header() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? 'CRM Seguros';
  const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-500 capitalize mt-0.5">{today}</p>
      </div>
    </header>
  );
}
