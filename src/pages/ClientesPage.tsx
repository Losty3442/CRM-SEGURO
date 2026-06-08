import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Cliente } from '../types';
import { useClientes } from '../hooks/useClientes';
import ClienteTable from '../components/clientes/ClienteTable';
import ClienteForm from '../components/clientes/ClienteForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function ClientesPage() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useClientes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => { setEditing(undefined); setIsFormOpen(true); };
  const openEdit = (c: Cliente) => { setEditing(c); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditing(undefined); };

  const handleSubmit = (data: Omit<Cliente, 'id' | 'fechaRegistro'>) => {
    if (editing) updateCliente(editing.id, data);
    else addCliente(data);
    closeForm();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{clientes.length} cliente(s) registrados</p>
        </div>
        <Button onClick={openNew}>
          <UserPlus size={16} />
          Nuevo Cliente
        </Button>
      </div>

      <ClienteTable
        clientes={clientes}
        onEdit={openEdit}
        onDelete={(id) => setDeletingId(id)}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="lg"
      >
        <ClienteForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId) deleteCliente(deletingId); }}
        title="Eliminar Cliente"
        message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
      />
    </div>
  );
}
