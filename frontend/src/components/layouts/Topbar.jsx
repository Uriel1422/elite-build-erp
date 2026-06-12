import React, { useState } from 'react';
import { useEliteStore } from '../../store/useEliteStore';
import { Search, Bell, HelpCircle, Activity } from 'lucide-react';

export default function Topbar() {
  const { projects, selectedProjectId, setSelectedProject } = useEliteStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const activeProject = projects.find(p => p.id === selectedProjectId);

  const notifications = [
    { id: 1, title: 'IA: Predicción completada', text: 'Resistencia del concreto Torre B proyectada en 28.4 MPa.', time: 'Hace 5 min' },
    { id: 2, title: 'Presupuestos SAT', text: 'Actualización de APU importada exitosamente.', time: 'Hace 1 hora' },
    { id: 3, title: 'Supervisor Check-in', text: 'Roberto Silva reportó inspección en Losa Piso 15.', time: 'Hace 2 horas' }
  ];

  return (
    <header className="glass-panel h-20 border-b border-titanium-800/50 flex items-center justify-between px-8 z-20">
      {/* Left: Project Selector */}
      <div className="flex items-center gap-4">
        <label className="text-xs font-semibold text-titanium-500 uppercase tracking-wider">Proyecto Activo:</label>
        <div className="relative">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="appearance-none bg-carbon-800/80 border border-titanium-700/50 rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-smoke focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30 cursor-pointer transition-all duration-300"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name} [{proj.code}]
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-titanium-500">
            <Activity size={14} className="text-neon neon-pulse" />
          </div>
        </div>
      </div>

      {/* Right: Search, Notifications & Actions */}
      <div className="flex items-center gap-6">
        {/* Global Search Bar */}
        <div className="relative w-64 hidden md:block">
          <input
            type="text"
            placeholder="Buscar planos, APUs, personal..."
            className="w-full glass-input pl-10 pr-4 py-2 text-xs"
          />
          <Search className="absolute left-3.5 top-2.5 text-titanium-500" size={14} />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-titanium-800/30 border border-titanium-700/20 text-titanium-500 hover:text-smoke hover:border-titanium-600 transition-all duration-300"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-error border-2 border-carbon-900 shadow-glow"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel-glow rounded-2xl p-4 shadow-glass z-50">
              <h3 className="text-sm font-bold text-smoke mb-3 border-b border-titanium-800/50 pb-2 flex items-center justify-between">
                <span>Notificaciones Recientes</span>
                <span className="text-[10px] bg-electric/20 text-neon px-2 py-0.5 rounded-full">3 Nuevas</span>
              </h3>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-2.5 rounded-lg bg-carbon-900/50 border border-titanium-800/30 hover:bg-carbon-800/30 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-smoke">{notif.title}</h4>
                      <span className="text-[9px] text-titanium-500">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-titanium-500 leading-normal">{notif.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Support Trigger */}
        <button className="p-2.5 rounded-xl bg-titanium-800/30 border border-titanium-700/20 text-titanium-500 hover:text-smoke hover:border-titanium-600 transition-all duration-300">
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
}
