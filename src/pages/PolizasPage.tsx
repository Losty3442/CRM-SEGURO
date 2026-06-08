import { useState } from 'react';
import { FilePlus } from 'lucide-react';
import type { Poliza } from '../types';
import { usePolizas } from '../hooks/usePolizas';
import { useClientes } from '../hooks/useClientes';
import PolizaTable from '../components/polizas/PolizaTable';
import PolizaForm from '../components/polizas/PolizaForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function PolizasPage() {
  const { polizas, addPoliza, updatePoliza, deletePoliza } = usePolizas();
  const { clientes } = useClientes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Poliza | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => { setEditing(undefined); setIsFormOpen(true); };
  const openEdit = (p: Poliza) => { setEditing(p); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditing(undefined); };

  const handleSubmit = (data: Omit<Poliza, 'id' | 'fechaRegistro'>) => {
    if (editing) updatePoliza(editing.id, data);
    else addPoliza(data);
    closeForm();
  };

  const vigentes = polizas.filter((p) => p.estado === 'Vigente').length;
  const vencidas = polizas.filter((p) => p.estado === 'Vencida').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">{polizas.length} póliza(s) en total</p>
          <span className="text-xs bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 ring-inset px-2.5 py-1 rounded-full font-medium">{vigentes} vigentes</span>
          <span className="text-xs bg-red-50 text-red-700 ring-1 ring-red-200 ring-inset px-2.5 py-1 rounded-full font-medium">{vencidas} vencidas</span>
        </div>
        <Button onClick={openNew}>
          <FilePlus size={16} />
          Nueva Póliza
        </Button>
      </div>

      <PolizaTable
        polizas={polizas}
        clientes={clientes}
        onEdit={openEdit}
        onDelete={(id) => setDeletingId(id)}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Editar Póliza' : 'Nueva Póliza'}
        size="lg"
      >
        <PolizaForm
          initial={editing}
          clientes={clientes}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId) deletePoliza(deletingId); }}
        title="Eliminar Póliza"
        message="¿Estás seguro de que deseas eliminar esta póliza? Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
      />
    </div>
  );
}
