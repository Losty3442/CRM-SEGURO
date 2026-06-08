import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Siniestro } from '../types';
import { useSiniestros } from '../hooks/useSiniestros';
import { usePolizas } from '../hooks/usePolizas';
import { useClientes } from '../hooks/useClientes';
import SiniestroTable from '../components/siniestros/SiniestroTable';
import SiniestroForm from '../components/siniestros/SiniestroForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function SiniestrosPage() {
  const { siniestros, addSiniestro, updateSiniestro, deleteSiniestro } = useSiniestros();
  const { polizas } = usePolizas();
  const { clientes } = useClientes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Siniestro | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => { setEditing(undefined); setIsFormOpen(true); };
  const openEdit = (s: Siniestro) => { setEditing(s); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditing(undefined); };

  const handleSubmit = (data: Omit<Siniestro, 'id' | 'fechaRegistro'>) => {
    if (editing) updateSiniestro(editing.id, data);
    else addSiniestro(data);
    closeForm();
  };

  const pendientes = siniestros.filter((s) => s.estado === 'Pendiente').length;
  const enProceso = siniestros.filter((s) => s.estado === 'En Proceso').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">{siniestros.length} siniestro(s) registrados</p>
          {pendientes > 0 && (
            <span className="text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200 ring-inset px-2.5 py-1 rounded-full font-medium">{pendientes} pendientes</span>
          )}
          {enProceso > 0 && (
            <span className="text-xs bg-orange-50 text-orange-700 ring-1 ring-orange-200 ring-inset px-2.5 py-1 rounded-full font-medium">{enProceso} en proceso</span>
          )}
        </div>
        <Button onClick={openNew}>
          <PlusCircle size={16} />
          Registrar Siniestro
        </Button>
      </div>

      <SiniestroTable
        siniestros={siniestros}
        polizas={polizas}
        clientes={clientes}
        onEdit={openEdit}
        onDelete={(id) => setDeletingId(id)}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Editar Siniestro' : 'Registrar Siniestro'}
        size={editing ? 'xl' : 'lg'}
      >
        <SiniestroForm
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
        onConfirm={() => { if (deletingId) deleteSiniestro(deletingId); }}
        title="Eliminar Siniestro"
        message="¿Estás seguro de que deseas eliminar este siniestro?"
        confirmLabel="Sí, eliminar"
      />
    </div>
  );
}
