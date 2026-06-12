import React, { useState } from 'react';
import { useEliteStore } from '../store/useEliteStore';
import { Plus, Search, Calendar, DollarSign, MapPin, Grid, List, Activity } from 'lucide-react';

export default function Projects() {
  const { projects, createProject, setSelectedProject, selectedProjectId } = useEliteStore();
  const [viewMode, setViewMode] = useState('grid'); // grid, kanban
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for new project
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name || !code) return;

    const id = createProject({
      name,
      code,
      location,
      budget: Number(budget) || 0,
      startDate,
      endDate,
      status: 'Planificación'
    });

    // Reset Form
    setName('');
    setCode('');
    setLocation('');
    setBudget('');
    setStartDate('');
    setEndDate('');
    setShowAddModal(false);
    setSelectedProject(id);
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
  };

  // Mock Kanban Stages for tasks
  const kanbanColumns = [
    { id: 'todo', title: 'Por Empezar', tasks: [
      { id: 't-101', title: 'Revisión estructural cimientos', ref: 'CIV-01', engineer: 'Ing. Carlos Mendoza' },
      { id: 't-102', title: 'Inspección de encofrados pilares', ref: 'CIV-02', engineer: 'Roberto Silva' }
    ]},
    { id: 'progress', title: 'En Progreso', tasks: [
      { id: 't-103', title: 'Montaje de enfierradura losa 16', ref: 'CIV-02', engineer: 'Dra. Laura Torres' },
      { id: 't-104', title: 'Instalación ductos eléctricos', ref: 'INS-01', engineer: 'Miguel Ángel Ruz' }
    ]},
    { id: 'review', title: 'Control Calidad / SAT', tasks: [
      { id: 't-105', title: 'Ensaye de probetas concreto 28d', ref: 'CIV-02', engineer: 'Dra. Laura Torres' }
    ]},
    { id: 'done', title: 'Completado', tasks: [
      { id: 't-106', title: 'Excavación masiva y escombros', ref: 'CIV-01', engineer: 'Ing. Carlos Mendoza' }
    ]}
  ];

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Gestión de Obras y Proyectos</h2>
          <p className="text-xs text-titanium-500 mt-1">Administra presupuestos, asigna ingenieros y supervisa el cronograma de ejecución.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-electric to-neon text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-glow border border-neon/20 hover:from-neon hover:to-electric transition-all"
          >
            <Plus size={14} />
            Crear Nueva Obra
          </button>
        </div>
      </div>

      {/* Filter and View Modes Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-carbon-800/40 border border-titanium-800/50 p-4 rounded-2xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por obra o código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 glass-input pl-10 pr-4 py-2 text-xs"
          />
          <Search className="absolute left-3.5 top-2.5 text-titanium-500" size={14} />
        </div>
        <div className="flex gap-2 bg-carbon-900/50 p-1 rounded-xl border border-titanium-800/60">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-electric text-white' : 'text-titanium-500 hover:text-smoke'
            }`}
          >
            <Grid size={14} />
            Catálogo
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all ${
              viewMode === 'kanban' ? 'bg-electric text-white' : 'text-titanium-500 hover:text-smoke'
            }`}
          >
            <List size={14} />
            Tareas Kanban
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'grid' ? (
        /* GRID VIEW OF ACTIVE WORKSITES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj.id)}
                className={`glass-panel p-5 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-300 border hover:scale-[1.01] ${
                  isSelected 
                    ? 'border-neon/60 bg-carbon-800/80 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                    : 'border-titanium-800/60 bg-carbon-800/30 hover:border-titanium-700/60'
                }`}
              >
                {/* Ribbon Tag */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-smoke text-sm">{proj.name}</h3>
                    <span className="text-[10px] text-titanium-500 uppercase font-semibold">{proj.code}</span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    proj.status === 'En Progreso' ? 'bg-success/10 text-success border border-success/20' :
                    proj.status === 'Planificación' ? 'bg-neon/10 text-neon border border-neon/20' :
                    'bg-error/10 text-error border border-error/20'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-semibold text-titanium-500 mb-1">
                    <span>Avance Físico</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-titanium-800/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-neon h-1.5 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-titanium-800/40 text-xs">
                  <div className="flex items-center gap-1.5 text-titanium-500">
                    <DollarSign size={14} className="text-neon" />
                    <span className="font-semibold text-smoke truncate">{formatCurrency(proj.budget)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-titanium-500">
                    <MapPin size={14} className="text-neon" />
                    <span className="truncate text-smoke">{proj.location.split(',')[1] || proj.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-titanium-500 col-span-2 mt-1">
                    <Calendar size={14} className="text-neon" />
                    <span className="text-[11px]">
                      {proj.startDate} <span className="text-titanium-500">al</span> {proj.endDate || 'TBD'}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-neon rounded-tl shadow-glow"></div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* KANBAN TASKS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kanbanColumns.map((col) => (
            <div key={col.id} className="glass-panel p-4 rounded-2xl flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-4 border-b border-titanium-800/40 pb-2">
                <h4 className="text-xs font-bold text-smoke uppercase tracking-wider">{col.title}</h4>
                <span className="text-[10px] bg-titanium-800 text-titanium-500 px-2 py-0.5 rounded-full font-bold">
                  {col.tasks.length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {col.tasks.map((task) => (
                  <div key={task.id} className="p-3.5 rounded-xl bg-carbon-900/50 border border-titanium-800/80 hover:border-neon/40 hover:bg-carbon-800/30 transition-all duration-300 cursor-grab active:cursor-grabbing">
                    <span className="text-[9px] bg-electric/15 text-neon px-2 py-0.5 rounded font-bold">{task.ref}</span>
                    <h5 className="text-xs font-bold text-smoke mt-2 leading-relaxed">{task.title}</h5>
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-titanium-800/20 text-[10px] text-titanium-500">
                      <div className="w-5 h-5 rounded-full bg-titanium-700 flex items-center justify-center text-smoke font-bold">
                        {task.engineer.split(' ').pop()[0]}
                      </div>
                      <span>{task.engineer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-carbon-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 shadow-glass border border-titanium-800/85 relative">
            <h3 className="text-lg font-bold text-smoke mb-4 border-b border-titanium-800/50 pb-2">Registrar Nuevo Proyecto</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Nombre de la Obra</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-xs"
                    placeholder="Torre Oriente"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Código Identificador</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-xs"
                    placeholder="TO-2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Ubicación / Dirección</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 text-xs"
                  placeholder="Av. Providencia 1200, Santiago"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Presupuesto (CLP)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-xs"
                    placeholder="25000000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Fecha Término</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-titanium-800/40 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-titanium-800/30 text-titanium-500 border border-titanium-700/20 hover:text-smoke"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-electric to-neon rounded-xl text-xs font-bold text-white shadow-glow"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
