import React from 'react';
import { useEliteStore } from '../store/useEliteStore';
import { Users, Clock, MapPin, Shield, CheckCircle } from 'lucide-react';

export default function Personnel() {
  const { personnel } = useEliteStore();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Control de Personal & Roles</h2>
        <p className="text-xs text-titanium-500 mt-1">Monitoreo de ingresos a faena por geolocalización satelital y roles asignados.</p>
      </div>

      {/* Grid: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Presentes Hoy</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">
            {personnel.filter(p => p.checkIn && !p.checkOut).length}
          </h3>
          <p className="text-[10px] text-success font-semibold mt-1">Ingresos validados por GPS</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Tasa de Asistencia</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">80%</h3>
          <p className="text-[10px] text-titanium-500 mt-1">Sobre dotación total de 5 profesionales</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Roles Críticos Activos</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">3</h3>
          <p className="text-[10px] text-neon font-semibold mt-1">Super Admin, Ingeniero, Supervisor</p>
        </div>
      </div>

      {/* Grid: Personnel Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-titanium-800/40">
        <div className="bg-carbon-800/80 px-6 py-4 border-b border-titanium-800/50 flex justify-between items-center">
          <h4 className="text-xs font-bold text-smoke uppercase tracking-wider">Planilla de Asistencia Diaria</h4>
          <span className="text-xs font-semibold text-neon">Ubicación GPS Activada</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-carbon-900/40 border-b border-titanium-800/50 text-titanium-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-6 py-3.5">Colaborador</th>
                <th className="px-6 py-3.5">Cargo / Rol</th>
                <th className="px-6 py-3.5">Check-In</th>
                <th className="px-6 py-3.5">Check-Out</th>
                <th className="px-6 py-3.5">Coordenadas de Ingreso</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-titanium-800/20">
              {personnel.map((p) => (
                <tr key={p.id} className="hover:bg-carbon-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-titanium-700 to-titanium-600 flex items-center justify-center font-bold text-smoke border border-titanium-600 text-xs">
                      {p.name.split(' ').pop()[0]}
                    </div>
                    <div>
                      <h5 className="font-bold text-smoke">{p.name}</h5>
                      <span className="text-[10px] text-titanium-500 uppercase">{p.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-neon">{p.role}</td>
                  <td className="px-6 py-4 text-titanium-500 font-medium">
                    {p.checkIn ? (
                      <span className="flex items-center gap-1.5 text-smoke font-semibold">
                        <Clock size={12} className="text-success" />
                        {new Date(p.checkIn).toLocaleTimeString()}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-titanium-500 font-medium">
                    {p.checkOut ? (
                      <span className="flex items-center gap-1.5 text-smoke font-semibold">
                        <Clock size={12} className="text-warning" />
                        {new Date(p.checkOut).toLocaleTimeString()}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-titanium-500 font-mono">
                    {p.lat ? (
                      <span className="flex items-center gap-1 text-neon">
                        <MapPin size={12} />
                        {p.lat}, {p.lng}
                      </span>
                    ) : 'Sin coordenadas GPS'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      p.status === 'Presente' ? 'bg-success/15 text-success border border-success/20' :
                      p.status === 'Presente (Tarde)' ? 'bg-warning/15 text-warning border border-warning/20' :
                      p.status === 'Retirado' ? 'bg-titanium-800 text-titanium-500' :
                      'bg-error/15 text-error border border-error/20'
                    }`}>
                      {p.status}
                    </span>
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
