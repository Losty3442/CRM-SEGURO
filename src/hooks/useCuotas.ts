import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Cuota } from '../types';
import { cuotaService } from '../services/cuotaService';

export function useCuotas() {
  const [cuotas, setCuotas] = useState<Cuota[]>(() => cuotaService.getAll());

  const refresh = useCallback(() => setCuotas(cuotaService.getAll()), []);

  const addCuota = useCallback((data: Omit<Cuota, 'id'>): Cuota => {
    const nueva: Cuota = { ...data, id: uuidv4() };
    cuotaService.create(nueva);
    refresh();
    return nueva;
  }, [refresh]);

  const updateCuota = useCallback((id: string, data: Partial<Omit<Cuota, 'id'>>): void => {
    cuotaService.update(id, data);
    refresh();
  }, [refresh]);

  const deleteCuota = useCallback((id: string): void => {
    cuotaService.delete(id);
    refresh();
  }, [refresh]);

  return { cuotas, addCuota, updateCuota, deleteCuota, refresh };
}
