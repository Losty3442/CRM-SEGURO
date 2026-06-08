import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import ClienteProfilePage from './pages/ClienteProfilePage';
import PolizasPage from './pages/PolizasPage';
import CobranzasPage from './pages/CobranzasPage';
import SiniestrosPage from './pages/SiniestrosPage';
import ComisionesPage from './pages/ComisionesPage';
import RenovacionesPage from './pages/RenovacionesPage';
import EstadoCuentaCliente from './pages/EstadoCuentaCliente';
import LiquidacionesPage from './pages/LiquidacionesPage';
import VentaCruzadaPage from './pages/VentaCruzadaPage';
import ProduccionPage from './pages/ProduccionPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"  element={<DashboardPage />} />
          <Route path="clientes"   element={<ClientesPage />} />
          <Route path="clientes/:id" element={<ClienteProfilePage />} />
          <Route path="polizas"    element={<PolizasPage />} />
          <Route path="renovaciones" element={<RenovacionesPage />} />
          <Route path="cobranzas"  element={<CobranzasPage />} />
          <Route path="estado-cuenta" element={<EstadoCuentaCliente />} />
          <Route path="siniestros" element={<SiniestrosPage />} />
          <Route path="comisiones" element={<ComisionesPage />} />
          <Route path="liquidaciones" element={<LiquidacionesPage />} />
          <Route path="venta-cruzada" element={<VentaCruzadaPage />} />
          <Route path="produccion" element={<ProduccionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
