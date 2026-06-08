import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import type { Cliente, Poliza, RamoSeguro } from '../types';
import { RAMOS_SEGURO } from '../types';
import * as storage from '../services/storage';
import Badge from '../components/ui/Badge';

type VentaCruzadaItem = Cliente & {
  actuales: RamoSeguro[];
  oportunidades: RamoSeguro[];
};

export default function VentaCruzadaPage() {
  const [data, setData] = useState<VentaCruzadaItem[]>([]);

  useEffect(() => {
    const clientes = storage.getAll<Cliente>(storage.KEYS.CLIENTES);
    const polizas = storage.getAll<Poliza>(storage.KEYS.POLIZAS);

    const cruzada = clientes.map(cliente => {
      // Tomamos en cuenta solo pólizas vigentes para la venta cruzada
      const polizasVigentes = polizas.filter(
        p => p.idCliente === cliente.id && p.estado === 'Vigente'
      );
      
      const ramosActuales = Array.from(new Set(polizasVigentes.map(p => p.ramo)));
      const oportunidades = RAMOS_SEGURO.filter(ramo => !ramosActuales.includes(ramo));

      return {
        ...cliente,
        actuales: ramosActuales,
        oportunidades: oportunidades
      };
    });

    setData(cruzada);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Target className="text-indigo-600" /> Venta Cruzada
        </h1>
        <p className="text-sm text-gray-500 mt-1">Identifica oportunidades de venta ofreciendo seguros que tus clientes aún no tienen.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 w-1/4">Cliente</th>
                <th className="px-6 py-4 w-1/3">Seguros Actuales</th>
                <th className="px-6 py-4 w-auto">Oportunidades de Venta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{item.nombreRazonSocial}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.tipoPersona}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {item.actuales.length > 0 ? (
                        item.actuales.map(ramo => (
                          <Badge key={ramo} variant="green">{ramo}</Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-xs">Sin seguros vigentes</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-blue-50/30">
                    <div className="flex flex-wrap gap-2">
                      {item.oportunidades.map(ramo => (
                        <Badge key={ramo} variant="blue">{ramo}</Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
