import type { Poliza } from '../types';
import * as storage from './storage';

const KEY = storage.KEYS.POLIZAS;

export const polizaService = {
  getAll: (): Poliza[] => storage.getAll<Poliza>(KEY),
  getById: (id: string): Poliza | undefined => storage.getById<Poliza>(KEY, id),
  getByCliente: (idCliente: string): Poliza[] =>
    storage.getAll<Poliza>(KEY).filter((p) => p.idCliente === idCliente),
  create: (item: Poliza): Poliza => storage.create<Poliza>(KEY, item),
  update: (id: string, updates: Partial<Omit<Poliza, 'id'>>): Poliza | undefined =>
    storage.update<Poliza>(KEY, id, updates),
  delete: (id: string): void => storage.remove(KEY, id),
};
