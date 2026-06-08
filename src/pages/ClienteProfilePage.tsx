import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, User, Briefcase, FileText, Activity, AlertTriangle } from 'lucide-react';
import { clienteService } from '../services/clienteService';
import { polizaService } from '../services/polizaService';
import { cuotaService } from '../services/cuotaService';
import { siniestroService } from '../services/siniestroService';
import type { Cliente, Poliza, Cuota, Siniestro } from '../types';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatDate, formatCurrency } from '../utils/dateUtils';

export default function ClienteProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [siniestros, setSiniestros] = useState<Siniestro[]>([]);
  const [activeTab, setActiveTab] = useState<'resumen' | 'polizas' | 'cuotas' | 'siniestros'>('resumen');

  useEffect(() => {
    if (!id) return;
    
    const c = clienteService.getById(id);
    if (!c) {
      navigate('/clientes');
      return;
    }
    
    setCliente(c);
    
    const p = polizaService.getByCliente(id);
    setPolizas(p);
    
    const polizaIds = p.map(pol => pol.id);
    
    const allCuotas = cuotaService.getAll();
    setCuotas(allCuotas.filter(cuota => polizaIds.includes(cuota.idPoliza)));
    
    const allSiniestros = siniestroService.getAll();
    setSiniestros(allSiniestros.filter(sin => polizaIds.includes(sin.idPoliza)));
    
  }, [id, navigate]);

  if (!cliente) return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/clientes')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {cliente.tipoPersona === 'Jurídica' ? <Briefcase size={24} className="text-indigo-600" /> : <User size={24} className="text-indigo-600" />}
            {cliente.nombreRazonSocial}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {cliente.tipoDocumento}: {cliente.numeroDocumento} | Registrado: {formatDate(cliente.fechaRegistro)}
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant={cliente.estado === 'Activo' ? 'green' : 'gray'}>{cliente.estado}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'resumen', label: 'Resumen 360', icon: <User size={16} /> },
          { id: 'polizas', label: `Pólizas (${polizas.length})`, icon: <FileText size={16} /> },
          { id: 'cuotas', label: `Estado de Cuenta (${cuotas.filter(c => c.estado !== 'Pagado').length} pend.)`, icon: <Activity size={16} /> },
          { id: 'siniestros', label: `Siniestros (${siniestros.length})`, icon: <AlertTriangle size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="py-2">
        {activeTab === 'resumen' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Info Card */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Phone size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900 font-medium">{cliente.telefono}</p>
                      {cliente.telefono2 && <p className="text-gray-500">{cliente.telefono2} (Alt)</p>}
                      {cliente.whatsapp && <p className="text-green-600 text-xs mt-1">WhatsApp: {cliente.whatsapp}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Mail size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{cliente.email || '—'}</p>
                      {cliente.recibirNotificaciones && (
                         <Badge variant="blue" className="mt-1">Recibe Alertas</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{cliente.direccion || '—'}</p>
                      <p className="text-gray-500 text-xs">
                        {[cliente.distrito, cliente.provincia, cliente.departamento].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {cliente.masInformacion && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">Notas Adicionales</h4>
                  <p className="text-xs text-yellow-700 whitespace-pre-wrap">{cliente.masInformacion}</p>
                </div>
              )}
            </div>

            {/* Quick Stats & Recent Activity */}
            <div className="md:col-span-2 space-y-6">
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                    <span className="text-sm text-gray-500">Pólizas Vigentes</span>
                    <span className="text-2xl font-bold text-gray-900">{polizas.filter(p => p.estado === 'Vigente').length}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                    <span className="text-sm text-gray-500">Deuda Total</span>
                    <span className="text-2xl font-bold text-red-600">
                      {formatCurrency(
                        cuotas.filter(c => c.estado !== 'Pagado' && c.moneda === 'PEN').reduce((acc, c) => acc + c.monto, 0),
                        'PEN'
                      )}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                    <span className="text-sm text-gray-500">Siniestros Pendientes</span>
                    <span className="text-2xl font-bold text-amber-600">{siniestros.filter(s => s.estado !== 'Resuelto').length}</span>
                  </div>
               </div>

               <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Pólizas Activas</h3>
                 {polizas.filter(p => p.estado === 'Vigente').length === 0 ? (
                    <p className="text-sm text-gray-500">No hay pólizas vigentes.</p>
                 ) : (
                    <div className="space-y-3">
                      {polizas.filter(p => p.estado === 'Vigente').map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                           <div>
                             <p className="font-medium text-sm text-gray-900">{p.ramo} - {p.companiaSeguro}</p>
                             <p className="text-xs text-gray-500">Pol: {p.numeroPoliza}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-xs text-gray-500">Vence: {formatDate(p.vigenciaHasta)}</p>
                             <p className="font-medium text-sm text-gray-900">{formatCurrency(p.prima, p.moneda)}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {/* Polizas Tab */}
        {activeTab === 'polizas' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Pólizas</h3>
             {/* Simple list for now instead of reusing PolizaTable which might need different props */}
             <div className="space-y-3">
                {polizas.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                     <div>
                       <div className="flex items-center gap-2">
                         <p className="font-medium text-gray-900">{p.ramo} - {p.companiaSeguro}</p>
                         <Badge variant={p.estado === 'Vigente' ? 'green' : p.estado === 'Vencida' ? 'red' : 'gray'}>{p.estado}</Badge>
                       </div>
                       <p className="text-sm text-gray-500 mt-1">Pol: {p.numeroPoliza}</p>
                       {p.materiaAsegurada && (
                         <p className="text-sm text-gray-600 mt-1">Extracto: {p.materiaAsegurada}</p>
                       )}
                     </div>
                     <div className="text-right">
                       <p className="text-sm text-gray-500">{formatDate(p.vigenciaDesde)} al {formatDate(p.vigenciaHasta)}</p>
                       <p className="font-medium text-gray-900 mt-1">Prima: {formatCurrency(p.prima, p.moneda)}</p>
                     </div>
                  </div>
                ))}
                {polizas.length === 0 && <p className="text-gray-500 text-sm">Este cliente no tiene pólizas registradas.</p>}
             </div>
          </div>
        )}

        {/* Cuotas Tab */}
        {activeTab === 'cuotas' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Cuenta</h3>
             <div className="space-y-3">
                {cuotas.sort((a,b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime()).map(c => {
                  const poliza = polizas.find(p => p.id === c.idPoliza);
                  return (
                  <div key={c.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                     <div>
                       <div className="flex items-center gap-2">
                         <p className="font-medium text-gray-900">Cuota {c.numeroCuota}/{c.totalCuotas}</p>
                         <Badge variant={c.estado === 'Pagado' ? 'green' : c.estado === 'Vencido' ? 'red' : 'yellow'}>{c.estado}</Badge>
                       </div>
                       <p className="text-sm text-gray-500 mt-1">{poliza?.ramo} - {poliza?.companiaSeguro} ({poliza?.numeroPoliza})</p>
                     </div>
                     <div className="text-right">
                       <p className={`text-sm ${c.estado === 'Vencido' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                         Vencimiento: {formatDate(c.fechaVencimiento)}
                       </p>
                       <p className="font-bold text-gray-900 mt-1">{formatCurrency(c.monto, c.moneda)}</p>
                     </div>
                  </div>
                )})}
                {cuotas.length === 0 && <p className="text-gray-500 text-sm">No hay cuotas registradas.</p>}
             </div>
          </div>
        )}

        {/* Siniestros Tab */}
        {activeTab === 'siniestros' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Siniestros</h3>
             <div className="space-y-3">
                {siniestros.map(s => {
                  const poliza = polizas.find(p => p.id === s.idPoliza);
                  return (
                  <div key={s.id} className="flex flex-col p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                     <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                         <p className="font-medium text-gray-900">{s.tipo}</p>
                         <Badge variant={s.estado === 'Resuelto' ? 'green' : s.estado === 'En Proceso' ? 'blue' : 'yellow'}>{s.estado}</Badge>
                       </div>
                       <p className="text-sm text-gray-500">Fecha: {formatDate(s.fechaSiniestro)}</p>
                     </div>
                     <p className="text-sm text-gray-500 mb-2">{poliza?.ramo} - {poliza?.companiaSeguro} ({poliza?.numeroPoliza})</p>
                     <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-100">{s.observaciones}</p>
                  </div>
                )})}
                {siniestros.length === 0 && <p className="text-gray-500 text-sm">No hay siniestros registrados.</p>}
             </div>
          </div>
        )}
      </div>

    </div>
  );
}
