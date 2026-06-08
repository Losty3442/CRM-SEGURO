import type { Siniestro } from '../types';
import * as storage from './storage';

const KEY = storage.KEYS.SINIESTROS;

export const siniestroService = {
  getAll: (): Siniestro[] => storage.getAll<Siniestro>(KEY),
  getById: (id: string): Siniestro | undefined => storage.getById<Siniestro>(KEY, id),
  getByPoliza: (idPoliza: string): Siniestro[] =>
    storage.getAll<Siniestro>(KEY).filter((s) => s.idPoliza === idPoliza),
  create: (item: Siniestro): Siniestro => storage.create<Siniestro>(KEY, item),
  update: (id: string, updates: Partial<Omit<Siniestro, 'id'>>): Siniestro | undefined =>
    storage.update<Siniestro>(KEY, id, updates),
  delete: (id: string): void => storage.remove(KEY, id),
};
