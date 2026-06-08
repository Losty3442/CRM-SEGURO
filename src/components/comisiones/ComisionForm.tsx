import { useState } from 'react';
import type { Comision, EstadoComision, Moneda } from '../../types';
import type { Poliza, Cliente } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

type FormData = Omit<Comision, 'id' | 'fechaRegistro'>;

interface Props {
  initial?: Comision;
  polizas: Poliza[];
  clientes: Cliente[];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const ESTADO_OPTIONS: { value: EstadoComision; label: string }[] = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Cobrada',   label: 'Cobrada' },
];

const MONEDA_OPTIONS: { value: Moneda; label: string }[] = [
  { value: 'PEN', label: 'S/ Soles (PEN)' },
  { value: 'USD', label: 'US$ Dólares (USD)' },
];

const empty: FormData = {
  idPoliza: '',
  montoEsperado: 0,
  moneda: 'PEN',
  estado: 'Pendiente',
  fechaCobro: '',
  observaciones: '',
};

export default function ComisionForm({ initial, polizas, clientes, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormData>(initial ? { ...initial } : empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const clienteMap = new Map(clientes.map((c) => [c.id, c.nombreRazonSocial]));
  const polizaOptions = polizas.map((p) => ({
    value: p.id,
    label: `${p.numeroPoliza} — ${clienteMap.get(p.idCliente) ?? '?'}`,
  }));

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.idPoliza) e.idPoliza = 'Selecciona una póliza';
    if (form.montoEsperado <= 0) e.montoEsperado = 'Monto debe ser > 0';
    if (form.estado === 'Cobrada' && !form.fechaCobro) e.fechaCobro = 'Ingresa fecha de cobro';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const data = { ...form };
      if (data.estado !== 'Cobrada') data.fechaCobro = undefined;
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Póliza"
        required
        options={polizaOptions}
        placeholder="Seleccionar póliza..."
        value={form.idPoliza}
        onChange={(e) => set('idPoliza', e.target.value)}
        error={errors.idPoliza}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monto Esperado"
          required
          type="number"
          min="0"
          step="0.01"
          value={form.montoEsperado || ''}
          onChange={(e) => set('montoEsperado', parseFloat(e.target.value) || 0)}
          error={errors.montoEsperado}
        />
        <Select
          label="Moneda"
          options={MONEDA_OPTIONS}
          value={form.moneda}
          onChange={(e) => set('moneda', e.target.value as Moneda)}
        />
      </div>
      <Select
        label="Estado"
        options={ESTADO_OPTIONS}
        value={form.estado}
        onChange={(e) => set('estado', e.target.value as EstadoComision)}
      />
      {form.estado === 'Cobrada' && (
        <Input
          label="Fecha de Cobro"
          required
          type="date"
          value={form.fechaCobro ?? ''}
          onChange={(e) => set('fechaCobro', e.target.value)}
          error={errors.fechaCobro}
        />
      )}
      <Input
        label="Observaciones"
        value={form.observaciones ?? ''}
        onChange={(e) => set('observaciones', e.target.value)}
        placeholder="Notas (ej. Transferencia #12345)"
      />
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{initial ? 'Guardar Cambios' : 'Registrar Comisión'}</Button>
      </div>
    </form>
  );
}
