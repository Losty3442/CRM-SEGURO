import { useState } from 'react';
import type { Poliza, CompaniaSeguro, RamoSeguro, EstadoPoliza, Moneda } from '../../types';
import { COMPANIAS_SEGURO, RAMOS_SEGURO } from '../../types';
import type { Cliente } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

type FormData = Omit<Poliza, 'id' | 'fechaRegistro'>;

interface Props {
  initial?: Poliza;
  clientes: Cliente[];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const empty: FormData = {
  idCliente: '',
  companiaSeguro: 'Rimac',
  ramo: 'SOAT',
  numeroPoliza: '',
  vigenciaDesde: '',
  vigenciaHasta: '',
  prima: 0,
  moneda: 'PEN',
  comisionPorcentaje: 0,
  estado: 'Vigente',
  materiaAsegurada: '',
};

const ESTADO_OPTIONS: { value: EstadoPoliza; label: string }[] = [
  { value: 'Vigente', label: 'Vigente' },
  { value: 'Vencida', label: 'Vencida' },
  { value: 'Anulada', label: 'Anulada' },
];

const MONEDA_OPTIONS: { value: Moneda; label: string }[] = [
  { value: 'PEN', label: 'S/ Soles (PEN)' },
  { value: 'USD', label: 'US$ Dólares (USD)' },
];

export default function PolizaForm({ initial, clientes, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormData>(initial ? { ...initial } : empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.idCliente) e.idCliente = 'Selecciona un cliente';
    if (!form.numeroPoliza.trim()) e.numeroPoliza = 'Campo requerido';
    if (!form.vigenciaDesde) e.vigenciaDesde = 'Campo requerido';
    if (!form.vigenciaHasta) e.vigenciaHasta = 'Campo requerido';
    if (form.prima <= 0) e.prima = 'La prima debe ser mayor a 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const clienteOptions = clientes.map((c) => ({ value: c.id, label: c.nombreRazonSocial }));
  const companiaOptions = COMPANIAS_SEGURO.map((c) => ({ value: c, label: c }));
  const ramoOptions = RAMOS_SEGURO.map((r) => ({ value: r, label: r }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Cliente"
        required
        options={clienteOptions}
        placeholder="Seleccionar cliente..."
        value={form.idCliente}
        onChange={(e) => set('idCliente', e.target.value)}
        error={errors.idCliente}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Compañía de Seguros"
          required
          options={companiaOptions}
          value={form.companiaSeguro}
          onChange={(e) => set('companiaSeguro', e.target.value as CompaniaSeguro)}
        />
        <Select
          label="Ramo / Tipo de Seguro"
          required
          options={ramoOptions}
          value={form.ramo}
          onChange={(e) => set('ramo', e.target.value as RamoSeguro)}
        />
      </div>
      <Input
        label="Número de Póliza"
        required
        value={form.numeroPoliza}
        onChange={(e) => set('numeroPoliza', e.target.value)}
        error={errors.numeroPoliza}
        placeholder="Ej: RIM-SOAT-2025-001"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Vigencia Desde"
          required
          type="date"
          value={form.vigenciaDesde}
          onChange={(e) => set('vigenciaDesde', e.target.value)}
          error={errors.vigenciaDesde}
        />
        <Input
          label="Vigencia Hasta"
          required
          type="date"
          value={form.vigenciaHasta}
          onChange={(e) => set('vigenciaHasta', e.target.value)}
          error={errors.vigenciaHasta}
        />
      </div>
      <Input
        label="Materia Asegurada (Extracto)"
        value={form.materiaAsegurada || ''}
        onChange={(e) => set('materiaAsegurada', e.target.value)}
        placeholder="Ej: Placa ABC-123, Dirección de Inmueble, o dependientes"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prima"
          required
          type="number"
          min="0"
          step="0.01"
          value={form.prima || ''}
          onChange={(e) => set('prima', parseFloat(e.target.value) || 0)}
          error={errors.prima}
          placeholder="0.00"
        />
        <Select
          label="Moneda"
          options={MONEDA_OPTIONS}
          value={form.moneda}
          onChange={(e) => set('moneda', e.target.value as Moneda)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Comisión Pactada (%)"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={form.comisionPorcentaje || ''}
          onChange={(e) => set('comisionPorcentaje', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
        />
        <Select
          label="Estado"
          options={ESTADO_OPTIONS}
          value={form.estado}
          onChange={(e) => set('estado', e.target.value as EstadoPoliza)}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{initial ? 'Guardar Cambios' : 'Crear Póliza'}</Button>
      </div>
    </form>
  );
}
