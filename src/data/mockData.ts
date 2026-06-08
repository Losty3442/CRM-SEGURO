import * as storage from '../services/storage';
import type { Cliente, Poliza, Cuota, Siniestro, Comision, SubAgente } from '../types';

// Reference date: 2026-06-06

const SUBAGENTES: SubAgente[] = [
  { id: 'sub-001', nombre: 'Roberto Sánchez', comisionPorcentaje: 50, email: 'rsanchez@seguros.com', telefono: '987123654', estado: 'Activo' },
  { id: 'sub-002', nombre: 'Carla Díaz', comisionPorcentaje: 40, email: 'cdiaz@seguros.com', telefono: '912345678', estado: 'Activo' },
];

const CLIENTES: Cliente[] = [
  { id: 'cli-001', tipoPersona: 'Natural', tipoDocumento: 'DNI', numeroDocumento: '45671234', nombreRazonSocial: 'Carlos Alberto Mendoza Ríos', telefono: '987654321', whatsapp: '987654321', email: 'c.mendoza@gmail.com', recibirNotificaciones: true, direccion: 'Av. Arequipa 1245, Miraflores, Lima', estado: 'Activo', fechaRegistro: '2024-01-15T08:30:00.000Z', subAgenteId: 'sub-001' },
  { id: 'cli-002', tipoPersona: 'Natural', tipoDocumento: 'DNI', numeroDocumento: '39827654', nombreRazonSocial: 'María Elena García Torres', telefono: '998765432', email: 'maria.garcia@hotmail.com', recibirNotificaciones: false, direccion: 'Jr. Tacna 567, Barranco, Lima', estado: 'Activo', fechaRegistro: '2024-02-20T10:00:00.000Z', subAgenteId: 'sub-001' },
  { id: 'cli-003', tipoPersona: 'Jurídica', tipoDocumento: 'RUC', numeroDocumento: '20512345678', nombreRazonSocial: 'Transportes Lima Express SAC', telefono: '014567890', email: 'admin@translima.com.pe', recibirNotificaciones: true, direccion: 'Av. Argentina 3456, Callao', estado: 'Activo', fechaRegistro: '2024-01-08T09:00:00.000Z', contactoPrincipal: 'Juan Pérez - 999888777', contactosSecundarios: [{ nombre: 'Ana Gómez', cargo: 'Gerente Finanzas', email: 'agomez@translima.com.pe', telefono: '999111222' }], subAgenteId: 'sub-002' },
  { id: 'cli-004', tipoPersona: 'Natural', tipoDocumento: 'DNI', numeroDocumento: '72345678', nombreRazonSocial: 'Ana Lucía Rodríguez Paz', telefono: '956781234', email: 'ana.rodriguez@outlook.com', recibirNotificaciones: true, direccion: 'Calle Las Begonias 890, San Isidro, Lima', estado: 'Activo', fechaRegistro: '2024-03-05T11:00:00.000Z' },
  { id: 'cli-005', tipoPersona: 'Jurídica', tipoDocumento: 'RUC', numeroDocumento: '20601234567', nombreRazonSocial: 'Constructora Norte Perú SAC', telefono: '017891234', email: 'gerencia@construccnorte.pe', recibirNotificaciones: true, direccion: 'Av. Industrial 2345, Los Olivos, Lima', estado: 'Activo', fechaRegistro: '2024-01-22T08:00:00.000Z' },
  { id: 'cli-006', tipoPersona: 'Natural', tipoDocumento: 'CE', numeroDocumento: 'C12345678', nombreRazonSocial: 'John Michael Smith', telefono: '976543210', email: 'j.smith@email.com', recibirNotificaciones: false, direccion: 'Av. La Paz 1234, Miraflores, Lima', estado: 'Activo', fechaRegistro: '2024-04-10T14:00:00.000Z' },
  { id: 'cli-007', tipoPersona: 'Natural', tipoDocumento: 'DNI', numeroDocumento: '10234567', nombreRazonSocial: 'Pedro José Vargas Castillo', telefono: '943216789', email: 'pedro.vargas@gmail.com', recibirNotificaciones: true, direccion: 'Jr. Huancavelica 456, Cercado de Lima', estado: 'Activo', fechaRegistro: '2024-02-14T09:30:00.000Z' },
  { id: 'cli-008', tipoPersona: 'Jurídica', tipoDocumento: 'RUC', numeroDocumento: '20456789012', nombreRazonSocial: 'Comercial Torres y Asociados SRL', telefono: '013456789', email: 'comercial@torres.com.pe', recibirNotificaciones: true, direccion: 'Av. Primavera 789, Surco, Lima', estado: 'Activo', fechaRegistro: '2024-03-18T10:30:00.000Z' },
  { id: 'cli-009', tipoPersona: 'Natural', tipoDocumento: 'DNI', numeroDocumento: '29874561', nombreRazonSocial: 'Rosa María Huanca Quispe', telefono: '921345678', email: 'rhuanca@gmail.com', recibirNotificaciones: false, direccion: 'Av. Grau 2345, La Victoria, Lima', estado: 'Activo', fechaRegistro: '2024-05-07T15:00:00.000Z' },
  { id: 'cli-010', tipoPersona: 'Jurídica', tipoDocumento: 'RUC', numeroDocumento: '20312345987', nombreRazonSocial: 'Inversiones del Pacífico SAC', telefono: '016789012', email: 'info@invpacifico.pe', recibirNotificaciones: true, direccion: 'Av. Conquistadores 1567, San Isidro, Lima', estado: 'Activo', fechaRegistro: '2024-01-30T08:00:00.000Z' },
];

const POLIZAS: Poliza[] = [
  // ── Vence junio 2026 ──────────────────────────────────────────────────────
  { id: 'pol-001', idCliente: 'cli-001', companiaSeguro: 'Rimac', ramo: 'SOAT', numeroPoliza: 'RIM-SOAT-2025-001', materiaAsegurada: 'Auto Kia Picanto A1B-234', placaMotor: 'A1B-234', comisionPorcentaje: 10, vigenciaDesde: '2025-06-10', vigenciaHasta: '2026-06-10', prima: 98.50, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-06-09T10:00:00.000Z' },
  { id: 'pol-002', idCliente: 'cli-002', companiaSeguro: 'Pacífico Seguros', ramo: 'Salud', numeroPoliza: 'PAC-SAL-2025-018', comisionPorcentaje: 15, vigenciaDesde: '2025-06-28', vigenciaHasta: '2026-06-28', prima: 2450.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-06-27T09:00:00.000Z' },
  { id: 'pol-003', idCliente: 'cli-004', companiaSeguro: 'Rimac', ramo: 'SOAT', numeroPoliza: 'RIM-SOAT-2025-047', vigenciaDesde: '2025-06-20', vigenciaHasta: '2026-06-20', prima: 98.50, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-06-19T11:00:00.000Z' },
  { id: 'pol-004', idCliente: 'cli-010', companiaSeguro: 'La Positiva', ramo: 'SCTR', numeroPoliza: 'LAP-SCTR-2025-023', comisionPorcentaje: 12, vigenciaDesde: '2025-06-30', vigenciaHasta: '2026-06-30', prima: 3200.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-06-29T08:00:00.000Z' },
  // ── Vence julio 2026 ──────────────────────────────────────────────────────
  { id: 'pol-005', idCliente: 'cli-004', companiaSeguro: 'Rimac', ramo: 'Vehicular', numeroPoliza: 'RIM-VEH-2025-089', materiaAsegurada: 'Camioneta Toyota Hilux XYZ-987', placaMotor: 'XYZ-987', comisionPorcentaje: 15, vigenciaDesde: '2025-07-15', vigenciaHasta: '2026-07-15', prima: 1850.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-07-14T10:00:00.000Z' },
  { id: 'pol-006', idCliente: 'cli-003', companiaSeguro: 'La Positiva', ramo: 'SOAT', numeroPoliza: 'LAP-SOAT-2025-112', vigenciaDesde: '2025-07-31', vigenciaHasta: '2026-07-31', prima: 98.50, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-07-30T09:00:00.000Z' },
  { id: 'pol-007', idCliente: 'cli-007', companiaSeguro: 'La Positiva', ramo: 'SOAT', numeroPoliza: 'LAP-SOAT-2025-134', vigenciaDesde: '2025-07-31', vigenciaHasta: '2026-07-31', prima: 98.50, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-07-30T14:00:00.000Z' },
  // ── Vence agosto 2026 ─────────────────────────────────────────────────────
  { id: 'pol-008', idCliente: 'cli-001', companiaSeguro: 'Mapfre Perú', ramo: 'Vehicular', numeroPoliza: 'MAP-VEH-2025-056', materiaAsegurada: 'Honda Civic B2C-456', placaMotor: 'B2C-456', comisionPorcentaje: 15, vigenciaDesde: '2025-08-31', vigenciaHasta: '2026-08-31', prima: 2100.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-08-30T10:00:00.000Z' },
  { id: 'pol-009', idCliente: 'cli-007', companiaSeguro: 'Mapfre Perú', ramo: 'Hogar', numeroPoliza: 'MAP-HOG-2025-034', materiaAsegurada: 'Casa de Playa Asia', comisionPorcentaje: 20, vigenciaDesde: '2025-08-15', vigenciaHasta: '2026-08-15', prima: 850.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-08-14T11:00:00.000Z' },
  { id: 'pol-010', idCliente: 'cli-008', companiaSeguro: 'Mapfre Perú', ramo: 'Vehicular', numeroPoliza: 'MAP-VEH-2025-078', vigenciaDesde: '2025-08-31', vigenciaHasta: '2026-08-31', prima: 1950.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-08-30T09:00:00.000Z' },
  // ── Vence setiembre 2026 ──────────────────────────────────────────────────
  { id: 'pol-011', idCliente: 'cli-003', companiaSeguro: 'La Positiva', ramo: 'SCTR', numeroPoliza: 'LAP-SCTR-2025-045', vigenciaDesde: '2025-09-30', vigenciaHasta: '2026-09-30', prima: 8500.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-09-29T08:00:00.000Z' },
  { id: 'pol-012', idCliente: 'cli-008', companiaSeguro: 'Pacífico Seguros', ramo: 'Salud', numeroPoliza: 'PAC-SAL-2025-067', vigenciaDesde: '2025-09-15', vigenciaHasta: '2026-09-15', prima: 3800.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-09-14T10:00:00.000Z' },
  { id: 'pol-013', idCliente: 'cli-005', companiaSeguro: 'Rimac', ramo: 'SCTR', numeroPoliza: 'RIM-SCTR-2025-091', vigenciaDesde: '2025-09-30', vigenciaHasta: '2026-09-30', prima: 12000.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-09-29T09:00:00.000Z' },
  // ── Vence octubre 2026 ────────────────────────────────────────────────────
  { id: 'pol-014', idCliente: 'cli-005', companiaSeguro: 'Rimac', ramo: 'SCTR', numeroPoliza: 'RIM-SCTR-2025-104', vigenciaDesde: '2025-10-31', vigenciaHasta: '2026-10-31', prima: 6500.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-10-30T10:00:00.000Z' },
  // ── Vence noviembre 2026 ──────────────────────────────────────────────────
  { id: 'pol-015', idCliente: 'cli-006', companiaSeguro: 'Pacífico Seguros', ramo: 'Vida', numeroPoliza: 'PAC-VID-2025-023', vigenciaDesde: '2025-11-30', vigenciaHasta: '2026-11-30', prima: 1200.00, moneda: 'USD', estado: 'Vigente', fechaRegistro: '2025-11-29T11:00:00.000Z' },
  { id: 'pol-016', idCliente: 'cli-009', companiaSeguro: 'BNP Paribas Cardif', ramo: 'Vida', numeroPoliza: 'BNP-VID-2025-041', vigenciaDesde: '2025-11-01', vigenciaHasta: '2026-11-01', prima: 800.00, moneda: 'PEN', estado: 'Vigente', fechaRegistro: '2025-10-31T14:00:00.000Z' },
  // ── Vencidas ──────────────────────────────────────────────────────────────
  { id: 'pol-017', idCliente: 'cli-001', companiaSeguro: 'Rimac', ramo: 'SOAT', numeroPoliza: 'RIM-SOAT-2024-001', vigenciaDesde: '2024-06-10', vigenciaHasta: '2025-06-10', prima: 95.00, moneda: 'PEN', estado: 'Vencida', fechaRegistro: '2024-06-09T10:00:00.000Z' },
  { id: 'pol-018', idCliente: 'cli-002', companiaSeguro: 'Pacífico Seguros', ramo: 'Salud', numeroPoliza: 'PAC-SAL-2024-012', vigenciaDesde: '2024-03-31', vigenciaHasta: '2025-03-31', prima: 2200.00, moneda: 'PEN', estado: 'Vencida', fechaRegistro: '2024-03-30T09:00:00.000Z' },
  { id: 'pol-019', idCliente: 'cli-009', companiaSeguro: 'La Positiva', ramo: 'SOAT', numeroPoliza: 'LAP-SOAT-2024-089', vigenciaDesde: '2024-05-15', vigenciaHasta: '2025-05-15', prima: 98.50, moneda: 'PEN', estado: 'Vencida', fechaRegistro: '2024-05-14T11:00:00.000Z' },
  // ── Anulada ───────────────────────────────────────────────────────────────
  { id: 'pol-020', idCliente: 'cli-010', companiaSeguro: 'Rimac', ramo: 'Vehicular', numeroPoliza: 'RIM-VEH-2025-045', vigenciaDesde: '2025-03-01', vigenciaHasta: '2026-03-01', prima: 2800.00, moneda: 'PEN', estado: 'Anulada', fechaRegistro: '2025-02-28T10:00:00.000Z' },
];

const CUOTAS: Cuota[] = [
  // pol-002 (Salud - María García)
  { id: 'cuota-001', idPoliza: 'pol-002', numeroCuota: 1, totalCuotas: 3, fechaVencimiento: '2025-06-28', monto: 816.67, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-06-25' },
  { id: 'cuota-002', idPoliza: 'pol-002', numeroCuota: 2, totalCuotas: 3, fechaVencimiento: '2025-09-28', monto: 816.67, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-09-26' },
  { id: 'cuota-003', idPoliza: 'pol-002', numeroCuota: 3, totalCuotas: 3, fechaVencimiento: '2025-12-28', monto: 816.66, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-12-27' },
  // pol-004 (SCTR - Inversiones del Pacífico)
  { id: 'cuota-004', idPoliza: 'pol-004', numeroCuota: 1, totalCuotas: 4, fechaVencimiento: '2025-06-30', monto: 800.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-06-28' },
  { id: 'cuota-005', idPoliza: 'pol-004', numeroCuota: 2, totalCuotas: 4, fechaVencimiento: '2025-09-30', monto: 800.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-09-29' },
  { id: 'cuota-006', idPoliza: 'pol-004', numeroCuota: 3, totalCuotas: 4, fechaVencimiento: '2025-12-30', monto: 800.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-12-28' },
  { id: 'cuota-007', idPoliza: 'pol-004', numeroCuota: 4, totalCuotas: 4, fechaVencimiento: '2026-03-30', monto: 800.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-03-28' },
  // pol-005 (Vehicular - Ana Rodríguez)
  { id: 'cuota-008', idPoliza: 'pol-005', numeroCuota: 1, totalCuotas: 3, fechaVencimiento: '2025-07-15', monto: 616.67, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-07-12' },
  { id: 'cuota-009', idPoliza: 'pol-005', numeroCuota: 2, totalCuotas: 3, fechaVencimiento: '2025-10-15', monto: 616.67, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-10-13' },
  { id: 'cuota-010', idPoliza: 'pol-005', numeroCuota: 3, totalCuotas: 3, fechaVencimiento: '2026-01-15', monto: 616.66, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-01-14' },
  // pol-008 (Vehicular - Mendoza / Mapfre) — última vencida
  { id: 'cuota-011', idPoliza: 'pol-008', numeroCuota: 1, totalCuotas: 4, fechaVencimiento: '2025-08-31', monto: 525.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-08-28' },
  { id: 'cuota-012', idPoliza: 'pol-008', numeroCuota: 2, totalCuotas: 4, fechaVencimiento: '2025-11-30', monto: 525.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-11-28' },
  { id: 'cuota-013', idPoliza: 'pol-008', numeroCuota: 3, totalCuotas: 4, fechaVencimiento: '2026-02-28', monto: 525.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-02-26' },
  { id: 'cuota-014', idPoliza: 'pol-008', numeroCuota: 4, totalCuotas: 4, fechaVencimiento: '2026-05-31', monto: 525.00, moneda: 'PEN', estado: 'Vencido' },
  // pol-011 (SCTR - Transportes Lima) — última pendiente
  { id: 'cuota-015', idPoliza: 'pol-011', numeroCuota: 1, totalCuotas: 4, fechaVencimiento: '2025-09-30', monto: 2125.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-09-28' },
  { id: 'cuota-016', idPoliza: 'pol-011', numeroCuota: 2, totalCuotas: 4, fechaVencimiento: '2025-12-31', monto: 2125.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-12-30' },
  { id: 'cuota-017', idPoliza: 'pol-011', numeroCuota: 3, totalCuotas: 4, fechaVencimiento: '2026-03-31', monto: 2125.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-03-28' },
  { id: 'cuota-018', idPoliza: 'pol-011', numeroCuota: 4, totalCuotas: 4, fechaVencimiento: '2026-06-30', monto: 2125.00, moneda: 'PEN', estado: 'Pendiente' },
  // pol-012 (Salud - Comercial Torres)
  { id: 'cuota-019', idPoliza: 'pol-012', numeroCuota: 1, totalCuotas: 3, fechaVencimiento: '2025-09-15', monto: 1266.67, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-09-12' },
  { id: 'cuota-020', idPoliza: 'pol-012', numeroCuota: 2, totalCuotas: 3, fechaVencimiento: '2025-12-15', monto: 1266.67, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-12-14' },
  { id: 'cuota-021', idPoliza: 'pol-012', numeroCuota: 3, totalCuotas: 3, fechaVencimiento: '2026-03-15', monto: 1266.66, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-03-12' },
  // pol-013 (SCTR - Constructora Norte) — vencida + pendiente
  { id: 'cuota-022', idPoliza: 'pol-013', numeroCuota: 1, totalCuotas: 4, fechaVencimiento: '2025-09-30', monto: 3000.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-09-28' },
  { id: 'cuota-023', idPoliza: 'pol-013', numeroCuota: 2, totalCuotas: 4, fechaVencimiento: '2025-12-31', monto: 3000.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-01-05' },
  { id: 'cuota-024', idPoliza: 'pol-013', numeroCuota: 3, totalCuotas: 4, fechaVencimiento: '2026-03-31', monto: 3000.00, moneda: 'PEN', estado: 'Vencido' },
  { id: 'cuota-025', idPoliza: 'pol-013', numeroCuota: 4, totalCuotas: 4, fechaVencimiento: '2026-06-30', monto: 3000.00, moneda: 'PEN', estado: 'Pendiente' },
  // pol-014 (SCTR - Constructora Norte / Rimac) — vencida + pendiente
  { id: 'cuota-026', idPoliza: 'pol-014', numeroCuota: 1, totalCuotas: 4, fechaVencimiento: '2025-10-31', monto: 1625.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-10-29' },
  { id: 'cuota-027', idPoliza: 'pol-014', numeroCuota: 2, totalCuotas: 4, fechaVencimiento: '2026-01-31', monto: 1625.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-01-30' },
  { id: 'cuota-028', idPoliza: 'pol-014', numeroCuota: 3, totalCuotas: 4, fechaVencimiento: '2026-04-30', monto: 1625.00, moneda: 'PEN', estado: 'Vencido' },
  { id: 'cuota-029', idPoliza: 'pol-014', numeroCuota: 4, totalCuotas: 4, fechaVencimiento: '2026-07-31', monto: 1625.00, moneda: 'PEN', estado: 'Pendiente' },
  // pol-015 (Vida - John Smith / USD)
  { id: 'cuota-030', idPoliza: 'pol-015', numeroCuota: 1, totalCuotas: 3, fechaVencimiento: '2025-11-30', monto: 400.00, moneda: 'USD', estado: 'Pagado', fechaPago: '2025-11-28' },
  { id: 'cuota-031', idPoliza: 'pol-015', numeroCuota: 2, totalCuotas: 3, fechaVencimiento: '2026-02-28', monto: 400.00, moneda: 'USD', estado: 'Pagado', fechaPago: '2026-02-25' },
  { id: 'cuota-032', idPoliza: 'pol-015', numeroCuota: 3, totalCuotas: 3, fechaVencimiento: '2026-05-30', monto: 400.00, moneda: 'USD', estado: 'Vencido' },
  // pol-016 (Vida - Rosa Huanca / BNP)
  { id: 'cuota-033', idPoliza: 'pol-016', numeroCuota: 1, totalCuotas: 2, fechaVencimiento: '2025-11-01', monto: 400.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-10-31' },
  { id: 'cuota-034', idPoliza: 'pol-016', numeroCuota: 2, totalCuotas: 2, fechaVencimiento: '2026-05-01', monto: 400.00, moneda: 'PEN', estado: 'Vencido' },
  // pol-009 (Hogar - Pedro Vargas)
  { id: 'cuota-035', idPoliza: 'pol-009', numeroCuota: 1, totalCuotas: 2, fechaVencimiento: '2025-08-15', monto: 425.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-08-13' },
  { id: 'cuota-036', idPoliza: 'pol-009', numeroCuota: 2, totalCuotas: 2, fechaVencimiento: '2026-02-15', monto: 425.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-02-14' },
  // pol-010 (Vehicular - Comercial Torres)
  { id: 'cuota-037', idPoliza: 'pol-010', numeroCuota: 1, totalCuotas: 3, fechaVencimiento: '2025-08-31', monto: 650.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-08-29' },
  { id: 'cuota-038', idPoliza: 'pol-010', numeroCuota: 2, totalCuotas: 3, fechaVencimiento: '2025-11-30', monto: 650.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2025-11-28' },
  { id: 'cuota-039', idPoliza: 'pol-010', numeroCuota: 3, totalCuotas: 3, fechaVencimiento: '2026-02-28', monto: 650.00, moneda: 'PEN', estado: 'Pagado', fechaPago: '2026-02-27' },
  // Cuotas pendientes futuras para el chart
  { id: 'cuota-040', idPoliza: 'pol-006', numeroCuota: 1, totalCuotas: 1, fechaVencimiento: '2026-07-31', monto: 98.50, moneda: 'PEN', estado: 'Pendiente' },
  { id: 'cuota-041', idPoliza: 'pol-007', numeroCuota: 1, totalCuotas: 1, fechaVencimiento: '2026-07-31', monto: 98.50, moneda: 'PEN', estado: 'Pendiente' },
];

const SINIESTROS: Siniestro[] = [
  { id: 'sin-001', idPoliza: 'pol-008', fechaSiniestro: '2026-02-14', tipo: 'Choque / Colisión', estado: 'Resuelto', observaciones: 'Colisión menor en estacionamiento. Daño en parachoque delantero. Reparación aprobada y completada por taller autorizado Mapfre. Costo total: S/ 2,850.', fechaRegistro: '2026-02-15T09:00:00.000Z' },
  { id: 'sin-002', idPoliza: 'pol-011', fechaSiniestro: '2026-01-20', tipo: 'Accidente de Trabajo - SCTR', estado: 'Resuelto', observaciones: 'Trabajador sufrió caída desde andamio. Fractura de muñeca derecha. Atendido en clínica con subsidio por incapacidad temporal durante 30 días.', fechaRegistro: '2026-01-21T08:30:00.000Z' },
  { id: 'sin-003', idPoliza: 'pol-002', fechaSiniestro: '2026-04-05', tipo: 'Emergencia Médica - Hospitalización', estado: 'En Proceso', observaciones: 'Paciente hospitalizada por apendicitis aguda. Cirugía programada. Pendiente liquidación final de gastos médicos por S/ 8,450.', fechaRegistro: '2026-04-06T10:00:00.000Z' },
  { id: 'sin-004', idPoliza: 'pol-005', fechaSiniestro: '2026-03-15', tipo: 'Robo Parcial de Vehículo', estado: 'En Proceso', observaciones: 'Robo de accesorios (espejos, emblemas, audio). Denuncia policial presentada. En proceso de peritaje.', fechaRegistro: '2026-03-16T11:00:00.000Z' },
  { id: 'sin-005', idPoliza: 'pol-013', fechaSiniestro: '2026-05-02', tipo: 'Accidente de Trabajo - SCTR', estado: 'Pendiente', observaciones: 'Operario golpeado por material de construcción. Contusión en hombro derecho. Pendiente evaluación médica.', fechaRegistro: '2026-05-03T09:00:00.000Z' },
  { id: 'sin-006', idPoliza: 'pol-009', fechaSiniestro: '2026-01-08', tipo: 'Daño por Agua', estado: 'Resuelto', observaciones: 'Filtración de agua desde techo por lluvias. Daño en sala y dormitorio. Reparación aprobada y ejecutada. Costo: S/ 3,200.', fechaRegistro: '2026-01-09T14:00:00.000Z' },
  { id: 'sin-007', idPoliza: 'pol-003', fechaSiniestro: '2026-05-22', tipo: 'Accidente de Tránsito - SOAT', estado: 'Pendiente', observaciones: 'Atropello menor. Peatón con lesiones leves en pierna derecha. Pendiente documentación para liquidación SOAT.', fechaRegistro: '2026-05-23T08:00:00.000Z' },
  { id: 'sin-008', idPoliza: 'pol-015', fechaSiniestro: '2026-04-20', tipo: 'Incapacidad Total Temporal', estado: 'En Proceso', observaciones: 'Asegurado con incapacidad temporal diagnosticada. Pendiente junta médica y determinación de beneficios.', fechaRegistro: '2026-04-22T10:00:00.000Z' },
];

const COMISIONES: Comision[] = [
  { id: 'com-001', idPoliza: 'pol-001', montoEsperado: 9.85, moneda: 'PEN', estado: 'Cobrada', fechaCobro: '2025-07-15', observaciones: 'Pago puntual de Rimac', fechaRegistro: '2025-06-10T10:00:00.000Z' },
  { id: 'com-002', idPoliza: 'pol-002', idCuota: 'cuota-001', montoEsperado: 122.50, moneda: 'PEN', estado: 'Cobrada', fechaCobro: '2025-07-10', fechaRegistro: '2025-06-27T09:00:00.000Z' },
  { id: 'com-003', idPoliza: 'pol-002', idCuota: 'cuota-002', montoEsperado: 122.50, moneda: 'PEN', estado: 'Cobrada', fechaCobro: '2025-10-15', fechaRegistro: '2025-09-28T09:00:00.000Z' },
  { id: 'com-004', idPoliza: 'pol-005', idCuota: 'cuota-008', montoEsperado: 92.50, moneda: 'PEN', estado: 'Cobrada', fechaCobro: '2025-08-20', fechaRegistro: '2025-07-15T09:00:00.000Z' },
  { id: 'com-005', idPoliza: 'pol-005', idCuota: 'cuota-009', montoEsperado: 92.50, moneda: 'PEN', estado: 'Cobrada', fechaCobro: '2025-11-20', fechaRegistro: '2025-10-15T09:00:00.000Z' },
  { id: 'com-006', idPoliza: 'pol-008', idCuota: 'cuota-011', montoEsperado: 78.75, moneda: 'PEN', estado: 'Cobrada', fechaCobro: '2025-09-15', fechaRegistro: '2025-08-31T09:00:00.000Z' },
  { id: 'com-007', idPoliza: 'pol-008', idCuota: 'cuota-014', montoEsperado: 78.75, moneda: 'PEN', estado: 'Pendiente', observaciones: 'Cuota vencida del cliente, pendiente de pago', fechaRegistro: '2026-05-31T09:00:00.000Z' },
];

export function initializeMockData(): void {
  if (storage.isInitialized()) return;
  storage.saveAll(storage.KEYS.CLIENTES, CLIENTES);
  storage.saveAll(storage.KEYS.POLIZAS, POLIZAS);
  storage.saveAll(storage.KEYS.CUOTAS, CUOTAS);
  storage.saveAll(storage.KEYS.SINIESTROS, SINIESTROS);
  storage.saveAll(storage.KEYS.COMISIONES, COMISIONES);
  storage.saveAll(storage.KEYS.SUBAGENTES, SUBAGENTES);
  storage.markInitialized();
}
