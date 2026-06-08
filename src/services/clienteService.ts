import type { Cliente } from '../types';
import * as storage from './storage';

const KEY = storage.KEYS.CLIENTES;

export const clienteService = {
  getAll: (): Cliente[] => storage.getAll<Cliente>(KEY),
  getById: (id: string): Cliente | undefined => storage.getById<Cliente>(KEY, id),
  create: (item: Cliente): Cliente => storage.create<Cliente>(KEY, item),
  update: (id: string, updates: Partial<Omit<Cliente, 'id'>>): Cliente | undefined =>
    storage.update<Cliente>(KEY, id, updates),
  delete: (id: string): void => storage.remove(KEY, id),
};
