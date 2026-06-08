// ─── Scalar / Enum types ──────────────────────────────────────────────────────

export type TipoDocumento = 'DNI' | 'RUC' | 'CE' | 'PAS';
export type TipoPersona = 'Natural' | 'Jurídica';
export type EstadoCliente = 'Activo' | 'Inactivo';

export const COMPANIAS_SEGURO = [
  'Rimac',
  'Mapfre Perú',
  'La Positiva',
  'Pacífico Seguros',
  'BNP Paribas Cardif',
  'Protecta',
  'Otro',
] as const;
export type CompaniaSeguro = (typeof COMPANIAS_SEGURO)[number];

export const RAMOS_SEGURO = [
  'SOAT',
  'SCTR',
  'Vehicular',
  'Salud',
  'Vida',
  'Hogar',
  'Accidentes Personales',
  'Otro',
] as const;
export type RamoSeguro = (typeof RAMOS_SEGURO)[number];

export type EstadoPoliza = 'Vigente' | 'Vencida' | 'Anulada';
export type Moneda = 'PEN' | 'USD';
export type EstadoCuota = 'Pendiente' | 'Pagado' | 'Vencido';
export type EstadoSiniestro = 'Pendiente' | 'En Proceso' | 'Resuelto';
export type EstadoComision = 'Pendiente' | 'Cobrada';
export type EstadoSubAgente = 'Activo' | 'Inactivo';
// ─── Shared Models ────────────────────────────────────────────────────────────

export interface Adjunto {
  id: string;
  nombre: string;
  url: string; // Simulated for now
  fechaSubida: string; // ISO 8601
}

export interface BitacoraEntry {
  id: string;
  fecha: string; // ISO 8601
  usuario: string; // For future user panel
  nota: string;
}

// ─── Data models ──────────────────────────────────────────────────────────────

export interface SubAgente {
  id: string;
  nombre: string;
  comisionPorcentaje: number; // Porcentaje de comisión que se le paga
  email: string;
  telefono: string;
  estado: EstadoSubAgente;
}

export interface Cliente {
  id: string;
  tipoPersona: TipoPersona;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombreRazonSocial: string;
  telefono: string;
  telefono2?: string;
  whatsapp?: string;
  email: string;
  emailNotificaciones?: string;
  recibirNotificaciones: boolean;
  direccion: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  fechaCumpleanos?: string; // YYYY-MM-DD
  subAgenteId?: string | null;
  contactoPrincipal?: string; // Nombre + Telefono/Email (para Juridicas)
  contactosSecundarios?: {
    nombre: string;
    telefono?: string;
    email?: string;
    cargo?: string;
  }[];
  masInformacion?: string;
  adjuntos?: Adjunto[];
  estado: EstadoCliente;
  fechaRegistro: string; // ISO 8601
}

export interface Poliza {
  id: string;
  idCliente: string;
  companiaSeguro: CompaniaSeguro;
  ramo: RamoSeguro;
  numeroPoliza: string;
  placaMotor?: string | null;
  materiaAsegurada?: string; // Ej: "Auto Toyota Yaris ABC-123", "Casa en Miraflores"
  vigenciaDesde: string; // YYYY-MM-DD
  vigenciaHasta: string; // YYYY-MM-DD
  prima: number;
  moneda: Moneda;
  comisionPorcentaje?: number; // % de comisión pactado con la aseguradora
  estado: EstadoPoliza;
  fechaRegistro: string; // ISO 8601
}

export interface Cuota {
  id: string;
  idPoliza: string;
  numeroCuota: number;
  totalCuotas: number;
  fechaVencimiento: string; // YYYY-MM-DD
  monto: number;
  moneda: Moneda;
  estado: EstadoCuota;
  fechaPago?: string; // YYYY-MM-DD, presente sólo si está pagado
  observaciones?: string;
  bitacora?: BitacoraEntry[];
}

export interface Siniestro {
  id: string;
  idPoliza: string;
  fechaSiniestro: string; // YYYY-MM-DD
  tipo: string;
  estado: EstadoSiniestro;
  observaciones: string;
  fechaRegistro: string; // ISO 8601
  bitacora?: BitacoraEntry[];
  adjuntos?: Adjunto[];
}

export interface Comision {
  id: string;
  idPoliza: string;
  idCuota?: string; // Si se paga por cuota
  montoEsperado: number;
  moneda: Moneda;
  estado: EstadoComision;
  fechaCobro?: string; // YYYY-MM-DD
  observaciones?: string;
  fechaRegistro: string; // ISO 8601
}
