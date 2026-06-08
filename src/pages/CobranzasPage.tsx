import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Cuota } from '../types';
import { useCuotas } from '../hooks/useCuotas';
import { usePolizas } from '../hooks/usePolizas';
import { useClientes } from '../hooks/useClientes';
import CuotaTable from '../components/cobranzas/CuotaTable';
import CuotaForm from '../components/cobranzas/CuotaForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function CobranzasPage() {
  const { cuotas, addCuota, updateCuota, deleteCuota } = useCuotas();
  const { polizas } = usePolizas();
  const { clientes } = useClientes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cuota | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => { setEditing(undefined); setIsFormOpen(true); };
  const openEdit = (c: Cuota) => { setEditing(c); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditing(undefined); };

  const handleSubmit = (data: Omit<Cuota, 'id'>) => {
    if (editing) updateCuota(editing.id, data);
    else addCuota(data);
    closeForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{cuotas.length} cuota(s) registradas</p>
        <Button onClick={openNew}>
          <PlusCircle size={16} />
          Registrar Cuota
        </Button>
      </div>

      <CuotaTable
        cuotas={cuotas}
        polizas={polizas}
        clientes={clientes}
        onEdit={openEdit}
        onDelete={(id) => setDeletingId(id)}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Editar Cuota' : 'Registrar Cuota'}
        size={editing ? 'xl' : 'lg'}
      >
        <CuotaForm
          initial={editing}
          polizas={polizas}
          clientes={clientes}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId) deleteCuota(deletingId); }}
        title="Eliminar Cuota"
        message="¿Estás seguro de que deseas eliminar esta cuota?"
        confirmLabel="Sí, eliminar"
      />
    </div>
  );
}
