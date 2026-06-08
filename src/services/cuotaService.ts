import type { Cuota } from '../types';
import * as storage from './storage';

const KEY = storage.KEYS.CUOTAS;

export const cuotaService = {
  getAll: (): Cuota[] => storage.getAll<Cuota>(KEY),
  getById: (id: string): Cuota | undefined => storage.getById<Cuota>(KEY, id),
  getByPoliza: (idPoliza: string): Cuota[] =>
    storage.getAll<Cuota>(KEY).filter((c) => c.idPoliza === idPoliza),
  create: (item: Cuota): Cuota => storage.create<Cuota>(KEY, item),
  update: (id: string, updates: Partial<Omit<Cuota, 'id'>>): Cuota | undefined =>
    storage.update<Cuota>(KEY, id, updates),
  delete: (id: string): void => storage.remove(KEY, id),
};
