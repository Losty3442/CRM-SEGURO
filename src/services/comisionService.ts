import * as storage from './storage';
import type { Comision } from '../types';

const KEY = storage.KEYS.COMISIONES;

export const comisionService = {
  getAll: () => storage.getAll<Comision>(KEY),
  getById: (id: string) => storage.getById<Comision>(KEY, id),
  getByPoliza: (idPoliza: string) => storage.getAll<Comision>(KEY).filter((c) => c.idPoliza === idPoliza),
  create: (data: Omit<Comision, 'id' | 'fechaRegistro'>) => {
    const comision: Comision = {
      ...data,
      id: `com-${Date.now()}`,
      fechaRegistro: new Date().toISOString(),
    };
    return storage.create(KEY, comision);
  },
  update: (id: string, data: Partial<Omit<Comision, 'id' | 'fechaRegistro'>>) => storage.update<Comision>(KEY, id, data),
  delete: (id: string) => storage.remove(KEY, id),
};
