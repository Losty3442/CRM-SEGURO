import { useState } from 'react';
import { User, MapPin, Bell, Paperclip } from 'lucide-react';
import type { Cliente, TipoDocumento, TipoPersona, EstadoCliente, Adjunto } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

type FormData = Omit<Cliente, 'id' | 'fechaRegistro'>;

interface Props {
  initial?: Cliente;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const TIPO_PERSONA_OPTIONS = [
  { value: 'Natural', label: 'Natural' },
  { value: 'Jurídica', label: 'Jurídica' },
];

const TIPO_DOC_OPTIONS = [
  { value: 'DNI', label: 'DNI' },
  { value: 'RUC', label: 'RUC' },
  { value: 'CE',  label: 'Carné de Extranjería' },
  { value: 'PAS', label: 'Pasaporte' },
];

const ESTADO_OPTIONS = [
  { value: 'Activo',   label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' },
];

const empty: FormData = {
  tipoPersona: 'Natural',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  nombreRazonSocial: '',
  telefono: '',
  telefono2: '',
  whatsapp: '',
  email: '',
  emailNotificaciones: '',
  recibirNotificaciones: false,
  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
  fechaCumpleanos: '',
  subAgenteId: '',
  contactoPrincipal: '',
  contactosSecundarios: [],
  masInformacion: '',
  adjuntos: [],
  estado: 'Activo',
};

export default function ClienteForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormData>(initial ? { ...empty, ...initial } : empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'ubicacion' | 'config' | 'adjuntos'>('general');

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.numeroDocumento.trim()) e.numeroDocumento = 'Campo requerido';
    if (!form.nombreRazonSocial.trim()) e.nombreRazonSocial = 'Campo requerido';
    if (!form.telefono.trim()) e.telefono = 'Campo requerido';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email inválido';
    
    setErrors(e);
    
    // Switch to first tab with errors if validation fails
    if (Object.keys(e).length > 0) {
      if (e.numeroDocumento || e.nombreRazonSocial || e.telefono || e.email) {
        setActiveTab('general');
      }
    }
    
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const tabs = [
    { id: 'general', label: 'Datos Generales', icon: <User size={16} /> },
    { id: 'ubicacion', label: 'Ubicación', icon: <MapPin size={16} /> },
    { id: 'config', label: 'Configuración', icon: <Bell size={16} /> },
    { id: 'adjuntos', label: 'Archivos', icon: <Paperclip size={16} /> },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[600px]">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
        
        {/* GENERAL TAB */}
        <div className={activeTab === 'general' ? 'block space-y-4' : 'hidden'}>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo de Persona"
              required
              options={TIPO_PERSONA_OPTIONS}
              value={form.tipoPersona}
              onChange={(e) => set('tipoPersona', e.target.value as TipoPersona)}
            />
            <Select
              label="Tipo de Documento"
              required
              options={TIPO_DOC_OPTIONS}
              value={form.tipoDocumento}
              onChange={(e) => set('tipoDocumento', e.target.value as TipoDocumento)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Número de Documento"
              required
              value={form.numeroDocumento}
              onChange={(e) => set('numeroDocumento', e.target.value)}
              error={errors.numeroDocumento}
              placeholder="Ej: 45671234"
            />
            <Input
              label="Nombre / Razón Social"
              required
              value={form.nombreRazonSocial}
              onChange={(e) => set('nombreRazonSocial', e.target.value)}
              error={errors.nombreRazonSocial}
              placeholder="Nombre completo o razón social"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 mt-4">
            <Input
              label="Teléfono Principal"
              required
              type="tel"
              value={form.telefono}
              onChange={(e) => set('telefono', e.target.value)}
              error={errors.telefono}
              placeholder="Ej: 987654321"
            />
             <Input
              label="Teléfono Secundario"
              type="tel"
              value={form.telefono2 || ''}
              onChange={(e) => set('telefono2', e.target.value)}
              placeholder="Opcional"
            />
            <Input
              label="WhatsApp"
              type="tel"
              value={form.whatsapp || ''}
              onChange={(e) => set('whatsapp', e.target.value)}
              placeholder="Ej: +51987654321"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-4">
             <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
              placeholder="correo@ejemplo.com"
            />
            {form.tipoPersona === 'Natural' ? (
               <Input
               label="Fecha de Cumpleaños"
               type="date"
               value={form.fechaCumpleanos || ''}
               onChange={(e) => set('fechaCumpleanos', e.target.value)}
             />
            ) : (
               <Input
               label="Contacto Principal"
               value={form.contactoPrincipal || ''}
               onChange={(e) => set('contactoPrincipal', e.target.value)}
               placeholder="Nombre y cargo del contacto"
             />
            )}
          </div>
        </div>

        {/* UBICACION TAB */}
        <div className={activeTab === 'ubicacion' ? 'block space-y-4' : 'hidden'}>
          <Input
            label="Dirección Completa"
            value={form.direccion}
            onChange={(e) => set('direccion', e.target.value)}
            placeholder="Av. / Jr. / Calle..."
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Departamento"
              value={form.departamento || ''}
              onChange={(e) => set('departamento', e.target.value)}
              placeholder="Ej: Lima"
            />
            <Input
              label="Provincia"
              value={form.provincia || ''}
              onChange={(e) => set('provincia', e.target.value)}
              placeholder="Ej: Lima"
            />
            <Input
              label="Distrito / Barrio"
              value={form.distrito || ''}
              onChange={(e) => set('distrito', e.target.value)}
              placeholder="Ej: Miraflores"
            />
          </div>
        </div>

        {/* CONFIG TAB */}
        <div className={activeTab === 'config' ? 'block space-y-4' : 'hidden'}>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Estado del Cliente"
              options={ESTADO_OPTIONS}
              value={form.estado}
              onChange={(e) => set('estado', e.target.value as EstadoCliente)}
            />
            <Input
              label="Sub Agente / Vendedor (ID)"
              value={form.subAgenteId || ''}
              onChange={(e) => set('subAgenteId', e.target.value)}
              placeholder="ID del vendedor asignado"
            />
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Notificaciones</h4>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.recibirNotificaciones}
                  onChange={(e) => set('recibirNotificaciones', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="text-sm text-gray-700">Recibir notificaciones y alertas automáticas</span>
              </label>
              
              {form.recibirNotificaciones && (
                <Input
                  label="Email para Notificaciones (Si es distinto al principal)"
                  type="email"
                  value={form.emailNotificaciones || ''}
                  onChange={(e) => set('emailNotificaciones', e.target.value)}
                  placeholder="alertas@ejemplo.com"
                />
              )}
            </div>
          </div>
        </div>

        {/* ADJUNTOS TAB */}
        <div className={activeTab === 'adjuntos' ? 'block space-y-4' : 'hidden'}>
           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <Paperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Haz clic o arrastra archivos aquí para adjuntar</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Simulación)</p>
           </div>
           
           <div className="mt-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">
                Más Información / Notas Adicionales
             </label>
             <textarea 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
                placeholder="Escribe aquí cualquier otra información relevante..."
                value={form.masInformacion || ''}
                onChange={(e) => set('masInformacion', e.target.value)}
             />
           </div>
        </div>

      </div>

      {/* Footer / Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-auto bg-white px-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{initial ? 'Guardar Cambios' : 'Crear Cliente'}</Button>
      </div>
    </form>
  );
}
