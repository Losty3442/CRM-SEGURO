import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Poliza } from '../types';
import { polizaService } from '../services/polizaService';

export function usePolizas() {
  const [polizas, setPolizas] = useState<Poliza[]>(() => polizaService.getAll());

  const refresh = useCallback(() => setPolizas(polizaService.getAll()), []);

  const addPoliza = useCallback((data: Omit<Poliza, 'id' | 'fechaRegistro'>): Poliza => {
    const nueva: Poliza = { ...data, id: uuidv4(), fechaRegistro: new Date().toISOString() };
    polizaService.create(nueva);
    refresh();
    return nueva;
  }, [refresh]);

  const updatePoliza = useCallback((id: string, data: Partial<Omit<Poliza, 'id'>>): void => {
    polizaService.update(id, data);
    refresh();
  }, [refresh]);

  const deletePoliza = useCallback((id: string): void => {
    polizaService.delete(id);
    refresh();
  }, [refresh]);

  return { polizas, addPoliza, updatePoliza, deletePoliza, refresh };
}
