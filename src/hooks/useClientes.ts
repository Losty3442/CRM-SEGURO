import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Cliente } from '../types';
import { clienteService } from '../services/clienteService';

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>(() => clienteService.getAll());

  const refresh = useCallback(() => setClientes(clienteService.getAll()), []);

  const addCliente = useCallback((data: Omit<Cliente, 'id' | 'fechaRegistro'>): Cliente => {
    const nuevo: Cliente = { ...data, id: uuidv4(), fechaRegistro: new Date().toISOString() };
    clienteService.create(nuevo);
    refresh();
    return nuevo;
  }, [refresh]);

  const updateCliente = useCallback((id: string, data: Partial<Omit<Cliente, 'id'>>): void => {
    clienteService.update(id, data);
    refresh();
  }, [refresh]);

  const deleteCliente = useCallback((id: string): void => {
    clienteService.delete(id);
    refresh();
  }, [refresh]);

  return { clientes, addCliente, updateCliente, deleteCliente, refresh };
}
