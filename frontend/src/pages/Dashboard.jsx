import React from 'react';
import { useEliteStore } from '../store/useEliteStore';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertTriangle,
  CloudSun,
  Activity,
  UserCheck,
  Zap,
  TrendingDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function Dashboard() {
  const { projects, selectedProjectId, auditLogs, personnel } = useEliteStore();

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Helper formatting currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
  };

  // Mock data for charts
  const financialData = [
    { name: 'Ene', Presupuesto: 4000000, Real: 3800000 },
    { name: 'Feb', Presupuesto: 8000000, Real: 7900000 },
    { name: 'Mar', Presupuesto: 15000000, Real: 14800000 },
    { name: 'Abr', Presupuesto: 25000000, Real: 26200000 },
    { name: 'May', Presupuesto: 35000000, Real: 34100000 },
    { name: 'Jun', Presupuesto: 45000000, Real: 43500000 }
  ];

  const resourcesData = [
    { name: 'CIV-01 Excavación', Progreso: 100, Rendimiento: 98 },
    { name: 'CIV-02 Hormigón', Progreso: 100, Rendimiento: 102 },
    { name: 'MNT-03 Estructura', Progreso: 85, Rendimiento: 92 },
    { name: 'MEP-04 Instalaciones', Progreso: 20, Rendimiento: 88 },
    { name: 'REV-05 Acabados', Progreso: 5, Rendimiento: 95 }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Dashboard de Control Ejecutivo</h2>
          <p className="text-xs text-titanium-500 mt-1">Consola principal de monitoreo en tiempo real para {activeProject.name}.</p>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-titanium-800/20 border border-titanium-800/40 text-xs">
          <CloudSun className="text-warning animate-bounce" size={16} />
          <span className="font-bold">Vitacura: 18°C</span>
          <span className="text-titanium-500">| Despejado, Vientos 12km/h</span>
        </div>
      </div>

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Total Budget */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute right-4 top-4 p-2.5 rounded-xl bg-electric/10 border border-electric/20 text-electric">
            <DollarSign size={20} />
          </div>
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Presupuesto Consumido</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">{formatCurrency(activeProject.budget * (activeProject.progress / 100))}</h3>
          <p className="text-xs text-titanium-500 mt-1.5 flex items-center gap-1">
            <span className="text-success font-semibold flex items-center"><TrendingUp size={12} /> +1.2%</span>
            <span>vs proyección inicial</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-electric to-neon opacity-50"></div>
        </div>

        {/* KPI 2: Overall Progress */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2.5 rounded-xl bg-neon/10 border border-neon/20 text-neon">
            <TrendingUp size={20} />
          </div>
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Avance del Proyecto</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">{activeProject.progress}%</h3>
          <div className="w-full bg-titanium-800/40 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-neon h-1.5 rounded-full transition-all duration-500" style={{ width: `${activeProject.progress}%` }}></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neon opacity-50"></div>
        </div>

        {/* KPI 3: Operational Risks */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
          <div className={`absolute right-4 top-4 p-2.5 rounded-xl border ${
            activeProject.curingRisk === 'Crítico' 
              ? 'bg-error/15 border-error/30 text-error' 
              : 'bg-warning/15 border-warning/30 text-warning'
          }`}>
            <AlertTriangle size={20} />
          </div>
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Nivel de Riesgo Estructural</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">{activeProject.curingRisk}</h3>
          <p className="text-xs text-titanium-500 mt-1.5 flex items-center gap-1">
            {activeProject.curingRisk === 'Bajo' ? (
              <span className="text-success font-semibold">Sensores Estables</span>
            ) : (
              <span className="text-warning font-semibold">Revisar Curado Concreto</span>
            )}
          </p>
          <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-50 ${
            activeProject.curingRisk === 'Crítico' ? 'bg-error' : 'bg-warning'
          }`}></div>
        </div>

        {/* KPI 4: Active Personnel */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2.5 rounded-xl bg-success/10 border border-success/20 text-success">
            <UserCheck size={20} />
          </div>
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Personal en Terreno</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">
            {personnel.filter(p => p.checkIn && !p.checkOut).length} / {personnel.length}
          </h3>
          <p className="text-xs text-titanium-500 mt-1.5">
            Ingenieros: {personnel.filter(p => p.role === 'Ingeniero Civil' && p.checkIn).length} | Sensores IoT: {activeProject.concreteSensors}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-success opacity-50"></div>
        </div>
      </div>

      {/* Grid Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Area Chart */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-smoke uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-neon" />
              Curva S de Costos (Proyectado vs Real)
            </h3>
            <span className="text-[10px] bg-titanium-800 text-titanium-500 px-2 py-0.5 rounded font-semibold">En millones CLP</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresupuesto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E293B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1E293B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickFormatter={(v) => `${v/1000000}M`} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Presupuesto" stroke="#475569" fillOpacity={1} fill="url(#colorPresupuesto)" strokeWidth={2} />
                <Area type="monotone" dataKey="Real" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resources / Performance Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-smoke uppercase tracking-wider flex items-center gap-2 mb-6">
            <Zap size={16} className="text-warning" />
            Rendimiento Técnico por Partida
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourcesData} layout="vertical" margin={{ top: 0, right: 10, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" domain={[0, 120]} stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={9} tickLine={false} tickFormatter={(v) => v.split(' ')[0]} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Bar dataKey="Rendimiento" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Audit Logs & Live Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Activity Logs (Simulating MongoDB collection query) */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-smoke uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-neon animate-pulse" />
              Auditoría en Tiempo Real (MongoDB Logs)
            </h3>
            <span className="text-[10px] text-neon font-semibold animate-pulse uppercase">Conectado (Socket.io)</span>
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-carbon-900/40 border border-titanium-800/40 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon"></span>
                  <div>
                    <span className="font-bold text-smoke">{log.action}</span>
                    <span className="text-titanium-500 mx-2">|</span>
                    <span className="text-titanium-500">{log.details}</span>
                  </div>
                </div>
                <div className="text-right text-[10px]">
                  <span className="text-smoke font-semibold">{log.user}</span>
                  <p className="text-titanium-500 text-[9px] mt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Weather Forecast / Daily Risk Assessment */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-smoke uppercase tracking-wider mb-4 flex items-center gap-2">
              <CloudSun size={16} className="text-warning" />
              Factores Climáticos Críticos
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-carbon-900/40 border border-titanium-800/30">
                <span className="text-[10px] text-titanium-500 block">Viento</span>
                <span className="font-bold text-smoke block mt-1">12 km/h</span>
                <span className="text-[9px] text-success font-semibold mt-0.5 block">Seguro</span>
              </div>
              <div className="p-2 rounded-xl bg-carbon-900/40 border border-titanium-800/30">
                <span className="text-[10px] text-titanium-500 block">Humedad</span>
                <span className="font-bold text-smoke block mt-1">45%</span>
                <span className="text-[9px] text-success font-semibold mt-0.5 block">Óptimo</span>
              </div>
              <div className="p-2 rounded-xl bg-carbon-900/40 border border-titanium-800/30">
                <span className="text-[10px] text-titanium-500 block">Radiación UV</span>
                <span className="font-bold text-smoke block mt-1">Índice 8</span>
                <span className="text-[9px] text-warning font-semibold mt-0.5 block">Protección</span>
              </div>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-electric/10 border border-electric/25 text-xs text-neon mt-4 leading-normal flex items-start gap-2.5">
            <span>ℹ️</span>
            <span>
              <strong>Evaluación de Concreto:</strong> Condiciones ideales para el vaciado de losa. No se prevén lluvias en las próximas 48 horas.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
