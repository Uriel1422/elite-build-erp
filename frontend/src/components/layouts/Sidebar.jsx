import React, { useState } from 'react';
import { useEliteStore } from '../../store/useEliteStore';
import {
  LayoutDashboard,
  Folder,
  Layers,
  DollarSign,
  Calendar,
  Users,
  ClipboardCheck,
  FileText,
  Cpu,
  BarChart3,
  Map,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentPage, setCurrentPage, logout, user } = useEliteStore();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard Principal', icon: LayoutDashboard, role: ['Super Admin', 'Ingeniero Civil', 'Supervisor', 'Cliente', 'Auditor'] },
    { id: 'projects', name: 'Módulo de Proyectos', icon: Folder, role: ['Super Admin', 'Ingeniero Civil', 'Arquitecto', 'Supervisor', 'Contratista', 'Cliente'] },
    { id: 'bim', name: 'Visualizador BIM 3D', icon: Layers, role: ['Super Admin', 'Ingeniero Civil', 'Arquitecto', 'Cliente'] },
    { id: 'budgets', name: 'Presupuestos & APU', icon: DollarSign, role: ['Super Admin', 'Ingeniero Civil', 'Auditor'] },
    { id: 'planning', name: 'Planificación Gantt', icon: Calendar, role: ['Super Admin', 'Ingeniero Civil', 'Contratista'] },
    { id: 'personnel', name: 'Control de Personal', icon: Users, role: ['Super Admin', 'Ingeniero Civil', 'Supervisor'] },
    { id: 'inspections', name: 'Supervisión en Obra', icon: ClipboardCheck, role: ['Super Admin', 'Ingeniero Civil', 'Supervisor', 'Contratista'] },
    { id: 'docs', name: 'Gestión Documental', icon: FileText, role: ['Super Admin', 'Ingeniero Civil', 'Arquitecto', 'Auditor'] },
    { id: 'ai', name: 'Ingeniería Predictiva IA', icon: Cpu, role: ['Super Admin', 'Ingeniero Civil', 'Arquitecto'] },
    { id: 'reports', name: 'Reportes Ejecutivos', icon: BarChart3, role: ['Super Admin', 'Ingeniero Civil', 'Cliente', 'Auditor'] },
    { id: 'map', name: 'GIS & Topografía', icon: Map, role: ['Super Admin', 'Ingeniero Civil', 'Arquitecto', 'Supervisor'] },
  ];

  // Filter items based on user role (RBAC)
  const filteredMenuItems = menuItems.filter(item => {
    if (!user) return false;
    return item.role.includes(user.role);
  });

  return (
    <aside
      className={`glass-panel h-screen border-r border-titanium-800 flex flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Header Branding */}
        <div className="p-6 flex items-center justify-between border-b border-titanium-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-electric to-neon flex items-center justify-center font-bold text-white shadow-glow">
              EB
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-smoke to-titanium-500">
                ELITE<span className="text-neon">BUILD</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded bg-titanium-800/40 border border-titanium-700/30 hover:bg-neon hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[70vh]">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-electric/25 text-white border border-neon/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'text-titanium-500 hover:text-smoke hover:bg-titanium-800/30 border border-transparent'
                }`}
                title={item.name}
              >
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-neon rounded-r-full shadow-glow"></span>
                )}
                <Icon
                  size={20}
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-neon' : 'group-hover:text-neon'
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-titanium-800/50 space-y-3">
        {user && !isCollapsed && (
          <div className="flex items-center gap-3 p-2 bg-carbon-800/40 rounded-xl border border-titanium-800/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-titanium-700 to-titanium-600 flex items-center justify-center font-bold text-smoke border border-titanium-600">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-smoke truncate">{user.fullName}</h4>
              <p className="text-[10px] text-neon uppercase tracking-wider font-semibold truncate">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-error hover:bg-error/10 border border-transparent hover:border-error/20 transition-all duration-300"
          title="Cerrar Sesión"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium text-sm">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
