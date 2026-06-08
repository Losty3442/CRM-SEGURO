import { useMemo } from 'react';
import { Users, FileText, Bell, CreditCard } from 'lucide-react';
import { useClientes } from '../hooks/useClientes';
import { usePolizas } from '../hooks/usePolizas';
import { useCuotas } from '../hooks/useCuotas';
import { useComisiones } from '../hooks/useComisiones';
import KPICard from '../components/ui/KPICard';
import ChartPolizasRenovacion from '../components/dashboard/ChartPolizasRenovacion';
import ChartCuotasPendientes from '../components/dashboard/ChartCuotasPendientes';
import { getPoliciesExpiringByMonth, getCuotasPendientesByMonth, isExpiringSoon } from '../utils/dateUtils';

export default function DashboardPage() {
  const { clientes } = useClientes();
  const { polizas } = usePolizas();
  const { cuotas } = useCuotas();
  const { comisiones } = useComisiones();

  const kpis = useMemo(() => {
    const clientesActivos = clientes.filter((c) => c.estado === 'Activo').length;
    const polizasVigentes = polizas.filter((p) => p.estado === 'Vigente').length;
    const polizasVencenEsteMes = polizas.filter(
      (p) => p.estado === 'Vigente' && isExpiringSoon(p.vigenciaHasta, 30)
    ).length;
    const cuotasVencidas = cuotas.filter((c) => c.estado === 'Vencido').length;
    const comisionesPendientes = comisiones.filter((c) => c.estado === 'Pendiente').length;
    return { clientesActivos, polizasVigentes, polizasVencenEsteMes, cuotasVencidas, comisionesPendientes };
  }, [clientes, polizas, cuotas, comisiones]);

  const chartPolizas = useMemo(() => getPoliciesExpiringByMonth(polizas, 6), [polizas]);
  const chartCuotas = useMemo(() => getCuotasPendientesByMonth(cuotas, 6), [cuotas]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Clientes Activos"
          value={kpis.clientesActivos}
          icon={<Users size={20} className="text-indigo-600" />}
          iconBg="bg-indigo-100"
          subtitle="Total en cartera"
        />
        <KPICard
          title="Pólizas Vigentes"
          value={kpis.polizasVigentes}
          icon={<FileText size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-100"
          subtitle={`De ${polizas.length} pólizas totales`}
        />
        <KPICard
          title="Renovaciones Próx."
          value={kpis.polizasVencenEsteMes}
          icon={<Bell size={20} className="text-amber-600" />}
          iconBg="bg-amber-100"
          subtitle="Vencen en < 30 días"
        />
        <KPICard
          title="Cuotas Vencidas"
          value={kpis.cuotasVencidas}
          icon={<CreditCard size={20} className="text-red-600" />}
          iconBg="bg-red-100"
          subtitle="Pagos atrasados"
        />
        <KPICard
          title="Comisiones Pend."
          value={kpis.comisionesPendientes}
          icon={<FileText size={20} className="text-blue-600" />}
          iconBg="bg-blue-100"
          subtitle="Por cobrar a cías."
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartPolizasRenovacion data={chartPolizas} />
        <ChartCuotasPendientes data={chartCuotas} />
      </div>

      {/* Quick alerts */}
      {kpis.polizasVencenEsteMes > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-amber-800">
            ⚠ Atención: {kpis.polizasVencenEsteMes} póliza(s) vencen en los próximos 30 días.
          </p>
          <p className="text-xs text-amber-700 mt-1">Revisa el módulo de Pólizas para gestionarlas a tiempo.</p>
        </div>
      )}
    </div>
  );
}
