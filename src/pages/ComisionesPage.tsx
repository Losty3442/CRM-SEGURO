import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Comision } from '../types';
import { useComisiones } from '../hooks/useComisiones';
import { usePolizas } from '../hooks/usePolizas';
import { useClientes } from '../hooks/useClientes';
import ComisionTable from '../components/comisiones/ComisionTable';
import ComisionForm from '../components/comisiones/ComisionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function ComisionesPage() {
  const { comisiones, addComision, updateComision, deleteComision } = useComisiones();
  const { polizas } = usePolizas();
  const { clientes } = useClientes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Comision | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => { setEditing(undefined); setIsFormOpen(true); };
  const openEdit = (c: Comision) => { setEditing(c); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditing(undefined); };

  const handleSubmit = (data: Omit<Comision, 'id' | 'fechaRegistro'>) => {
    if (editing) updateComision(editing.id, data);
    else addComision(data);
    closeForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Control de Comisiones</h1>
        <Button onClick={openNew}>
          <PlusCircle size={16} />
          Registrar Comisión
        </Button>
      </div>

      <ComisionTable
        comisiones={comisiones}
        polizas={polizas}
        clientes={clientes}
        onEdit={openEdit}
        onDelete={(id) => setDeletingId(id)}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Editar Comisión' : 'Registrar Comisión'}
        size="lg"
      >
        <ComisionForm
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
        onConfirm={() => { if (deletingId) deleteComision(deletingId); }}
        title="Eliminar Comisión"
        message="¿Estás seguro de que deseas eliminar este registro de comisión?"
        confirmLabel="Sí, eliminar"
      />
    </div>
  );
}
