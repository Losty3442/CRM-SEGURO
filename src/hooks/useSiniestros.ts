import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Siniestro } from '../types';
import { siniestroService } from '../services/siniestroService';

export function useSiniestros() {
  const [siniestros, setSiniestros] = useState<Siniestro[]>(() => siniestroService.getAll());

  const refresh = useCallback(() => setSiniestros(siniestroService.getAll()), []);

  const addSiniestro = useCallback((data: Omit<Siniestro, 'id' | 'fechaRegistro'>): Siniestro => {
    const nuevo: Siniestro = { ...data, id: uuidv4(), fechaRegistro: new Date().toISOString() };
    siniestroService.create(nuevo);
    refresh();
    return nuevo;
  }, [refresh]);

  const updateSiniestro = useCallback((id: string, data: Partial<Omit<Siniestro, 'id'>>): void => {
    siniestroService.update(id, data);
    refresh();
  }, [refresh]);

  const deleteSiniestro = useCallback((id: string): void => {
    siniestroService.delete(id);
    refresh();
  }, [refresh]);

  return { siniestros, addSiniestro, updateSiniestro, deleteSiniestro, refresh };
}
