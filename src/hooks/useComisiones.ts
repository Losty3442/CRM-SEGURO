import { useState, useEffect } from 'react';
import { comisionService } from '../services/comisionService';
import type { Comision } from '../types';

export function useComisiones() {
  const [comisiones, setComisiones] = useState<Comision[]>([]);

  const loadComisiones = () => setComisiones(comisionService.getAll());

  useEffect(() => {
    loadComisiones();
  }, []);

  const addComision = (data: Omit<Comision, 'id' | 'fechaRegistro'>) => {
    comisionService.create(data);
    loadComisiones();
  };

  const updateComision = (id: string, data: Partial<Omit<Comision, 'id' | 'fechaRegistro'>>) => {
    comisionService.update(id, data);
    loadComisiones();
  };

  const deleteComision = (id: string) => {
    comisionService.delete(id);
    loadComisiones();
  };

  return {
    comisiones,
    addComision,
    updateComision,
    deleteComision,
    refresh: loadComisiones,
  };
}
