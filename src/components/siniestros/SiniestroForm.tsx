import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Siniestro, EstadoSiniestro, BitacoraEntry } from '../../types';
import type { Poliza, Cliente } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import BitacoraPanel from '../ui/BitacoraPanel';

type FormData = Omit<Siniestro, 'id' | 'fechaRegistro'>;

interface Props {
  initial?: Siniestro;
  polizas: Poliza[];
  clientes: Cliente[];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const ESTADO_OPTIONS: { value: EstadoSiniestro; label: string }[] = [
  { value: 'Pendiente',   label: 'Pendiente' },
  { value: 'En Proceso',  label: 'En Proceso' },
  { value: 'Resuelto',    label: 'Resuelto' },
];

const TIPOS_SINIESTRO = [
  'Choque / Colisión',
  'Robo Total de Vehículo',
  'Robo Parcial de Vehículo',
  'Daño por Agua',
  'Incendio',
  'Accidente de Trabajo - SCTR',
  'Emergencia Médica - Hospitalización',
  'Emergencia Médica - Ambulatoria',
  'Accidente de Tránsito - SOAT',
  'Incapacidad Total Temporal',
  'Invalidez Permanente',
  'Fallecimiento',
  'Otro',
];

const empty: FormData = {
  idPoliza: '',
  fechaSiniestro: '',
  tipo: '',
  estado: 'Pendiente',
  observaciones: '',
  bitacora: [],
};

export default function SiniestroForm({ initial, polizas, clientes, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormData>(initial ? { bitacora: [], ...initial } : empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));
  const polizaOptions = polizas
    .filter((p) => p.estado !== 'Anulada')
    .map((p) => ({
      value: p.id,
      label: `${p.numeroPoliza} — ${clienteMap.get(p.idCliente) ?? '?'} (${p.ramo})`,
    }));

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.idPoliza) e.idPoliza = 'Selecciona una póliza';
    if (!form.fechaSiniestro) e.fechaSiniestro = 'Campo requerido';
    if (!form.tipo) e.tipo = 'Campo requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const handleAddBitacora = (nota: string) => {
    const newEntry: BitacoraEntry = {
      id: uuidv4(),
      fecha: new Date().toISOString(),
      usuario: 'Asesor Comercial', // Simulated user
      nota,
    };
    set('bitacora', [...(form.bitacora || []), newEntry]);
  };

  return (
    <div className={initial ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""}>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
        <Select
          label="Póliza Asociada"
          required
          options={polizaOptions}
          placeholder="Seleccionar póliza..."
          value={form.idPoliza}
          onChange={(e) => set('idPoliza', e.target.value)}
          error={errors.idPoliza}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Fecha del Siniestro"
            required
            type="date"
            value={form.fechaSiniestro}
            onChange={(e) => set('fechaSiniestro', e.target.value)}
            error={errors.fechaSiniestro}
          />
          <Select
            label="Tipo de Siniestro"
            required
            options={TIPOS_SINIESTRO.map((t) => ({ value: t, label: t }))}
            placeholder="Seleccionar tipo..."
            value={form.tipo}
            onChange={(e) => set('tipo', e.target.value)}
            error={errors.tipo}
          />
        </div>
        <Select
          label="Estado del Caso"
          options={ESTADO_OPTIONS}
          value={form.estado}
          onChange={(e) => set('estado', e.target.value as EstadoSiniestro)}
        />
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium text-gray-700">Observaciones Generales</label>
          <textarea
            rows={4}
            value={form.observaciones}
            onChange={(e) => set('observaciones', e.target.value)}
            placeholder="Descripción inicial del siniestro..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1 min-h-[100px]"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">{initial ? 'Guardar Cambios' : 'Registrar Siniestro'}</Button>
        </div>
      </form>

      {initial && (
        <div className="h-[500px]">
          <BitacoraPanel 
            bitacora={form.bitacora || []} 
            onAddEntry={handleAddBitacora} 
          />
        </div>
      )}
    </div>
  );
}
