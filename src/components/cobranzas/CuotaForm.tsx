import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Cuota, EstadoCuota, Moneda, BitacoraEntry } from '../../types';
import type { Poliza, Cliente } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import BitacoraPanel from '../ui/BitacoraPanel';

type FormData = Omit<Cuota, 'id'>;

interface Props {
  initial?: Cuota;
  polizas: Poliza[];
  clientes: Cliente[];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const ESTADO_OPTIONS: { value: EstadoCuota; label: string }[] = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Pagado',    label: 'Pagado' },
  { value: 'Vencido',   label: 'Vencido' },
];

const MONEDA_OPTIONS: { value: Moneda; label: string }[] = [
  { value: 'PEN', label: 'S/ Soles (PEN)' },
  { value: 'USD', label: 'US$ Dólares (USD)' },
];

const empty: FormData = {
  idPoliza: '',
  numeroCuota: 1,
  totalCuotas: 1,
  fechaVencimiento: '',
  monto: 0,
  moneda: 'PEN',
  estado: 'Pendiente',
  fechaPago: '',
  observaciones: '',
  bitacora: [],
};

export default function CuotaForm({ initial, polizas, clientes, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormData>(initial ? { bitacora: [], ...initial } : empty);
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
    if (!form.fechaVencimiento) e.fechaVencimiento = 'Campo requerido';
    if (form.monto <= 0) e.monto = 'El monto debe ser mayor a 0';
    if (form.estado === 'Pagado' && !form.fechaPago) e.fechaPago = 'Ingresa la fecha de pago';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const data = { ...form };
      if (data.estado !== 'Pagado') data.fechaPago = undefined;
      onSubmit(data);
    }
  };

  const handleAddBitacora = (nota: string) => {
    const newEntry: BitacoraEntry = {
      id: uuidv4(),
      fecha: new Date().toISOString(),
      usuario: 'Asistente de Cobranzas',
      nota,
    };
    set('bitacora', [...(form.bitacora || []), newEntry]);
  };

  return (
    <div className={initial ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""}>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
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
            label="N° Cuota"
            type="number"
            min="1"
            value={form.numeroCuota}
            onChange={(e) => set('numeroCuota', parseInt(e.target.value) || 1)}
          />
          <Input
            label="Total Cuotas"
            type="number"
            min="1"
            value={form.totalCuotas}
            onChange={(e) => set('totalCuotas', parseInt(e.target.value) || 1)}
          />
        </div>
        <Input
          label="Fecha de Vencimiento"
          required
          type="date"
          value={form.fechaVencimiento}
          onChange={(e) => set('fechaVencimiento', e.target.value)}
          error={errors.fechaVencimiento}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Monto"
            required
            type="number"
            min="0"
            step="0.01"
            value={form.monto || ''}
            onChange={(e) => set('monto', parseFloat(e.target.value) || 0)}
            error={errors.monto}
            placeholder="0.00"
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
          onChange={(e) => set('estado', e.target.value as EstadoCuota)}
        />
        {form.estado === 'Pagado' && (
          <Input
            label="Fecha de Pago"
            required
            type="date"
            value={form.fechaPago ?? ''}
            onChange={(e) => set('fechaPago', e.target.value)}
            error={errors.fechaPago}
          />
        )}
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium text-gray-700">Observaciones Generales</label>
          <textarea
            rows={2}
            value={form.observaciones ?? ''}
            onChange={(e) => set('observaciones', e.target.value)}
            placeholder="Notas adicionales (opcional)"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[60px]"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">{initial ? 'Guardar Cambios' : 'Registrar Cuota'}</Button>
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
