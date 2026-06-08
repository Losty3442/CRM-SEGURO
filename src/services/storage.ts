// ─── Storage keys ────────────────────────────────────────────────────────────
// All localStorage access is isolated here so future migration to a real
// backend requires changes only in this layer (and the service files).

export const KEYS = {
  CLIENTES: 'crm_clientes',
  POLIZAS: 'crm_polizas',
  CUOTAS: 'crm_cuotas',
  SINIESTROS: 'crm_siniestros',
  COMISIONES: 'crm_comisiones',
  SUBAGENTES: 'crm_subagentes',
  INITIALIZED: 'crm_initialized',
} as const;

// ─── Generic CRUD helpers ─────────────────────────────────────────────────────

export function getAll<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function saveAll<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function getById<T extends { id: string }>(key: string, id: string): T | undefined {
  return getAll<T>(key).find((item) => item.id === id);
}

export function create<T extends { id: string }>(key: string, item: T): T {
  const items = getAll<T>(key);
  items.push(item);
  saveAll(key, items);
  return item;
}

export function update<T extends { id: string }>(
  key: string,
  id: string,
  updates: Partial<Omit<T, 'id'>>
): T | undefined {
  const items = getAll<T>(key);
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return undefined;
  items[idx] = { ...items[idx], ...updates };
  saveAll(key, items);
  return items[idx];
}

export function remove(key: string, id: string): void {
  const items = getAll<{ id: string }>(key);
  saveAll(key, items.filter((item) => item.id !== id));
}

export function isInitialized(): boolean {
  return localStorage.getItem(KEYS.INITIALIZED) === 'true';
}

export function markInitialized(): void {
  localStorage.setItem(KEYS.INITIALIZED, 'true');
}
