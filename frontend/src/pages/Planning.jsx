import React, { useState } from 'react';
import { useEliteStore } from '../store/useEliteStore';
import { Calendar, AlertCircle, Plus, RefreshCw } from 'lucide-react';

export default function Planning() {
  const { tasks, selectedProjectId, updateTaskProgress, addTask } = useEliteStore();
  const [showAddTask, setShowAddTask] = useState(false);

  // Form states for new task
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [resource, setResource] = useState('');
  const [isCritical, setIsCritical] = useState(false);

  const projectTasks = tasks[selectedProjectId] || [];

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!title || !start || !end) return;

    addTask(selectedProjectId, {
      title,
      start,
      end,
      resource: resource || 'Equipo General',
      isCritical
    });

    setTitle('');
    setStart('');
    setEnd('');
    setResource('');
    setIsCritical(false);
    setShowAddTask(false);
  };

  const handleSliderChange = (taskId, val) => {
    updateTaskProgress(selectedProjectId, taskId, val);
  };

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Planificación Gantt & Ruta Crítica</h2>
          <p className="text-xs text-titanium-500 mt-1">Diagrama temporal interactivo de hitos, dependencias y asignación de recursos técnicos.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-electric to-neon text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-neon/20 shadow-glow"
          >
            <Plus size={14} />
            Crear Hito / Tarea
          </button>
          <button
            onClick={() => alert('Simulando cálculo de dependencias y balanceo de recursos...')}
            className="flex items-center gap-2 bg-titanium-800/40 text-smoke border border-titanium-700/30 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-titanium-800/80 transition-all"
          >
            <RefreshCw size={14} />
            Replanificación Automática
          </button>
        </div>
      </div>

      {/* Critical Path Warning */}
      <div className="p-4 rounded-xl bg-error/10 border border-error/25 text-xs text-error leading-normal flex items-start gap-2.5">
        <AlertCircle size={18} className="shrink-0 animate-pulse mt-0.5" />
        <div>
          <strong>Alerta de Ruta Crítica:</strong> El retraso en el montaje de la estructura metálica (ID: tsk-3) afectará directamente las partidas MEP y postergará el término general del proyecto.
        </div>
      </div>

      {/* Gantt Diagram Container */}
      <div className="glass-panel p-6 rounded-2xl border border-titanium-800/40 overflow-hidden space-y-6">
        
        {/* Table/Gantt Split Header */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 text-[10px] font-bold text-titanium-500 uppercase tracking-widest border-b border-titanium-800/50 pb-3">
          <div className="col-span-4">Nombre de la Tarea / Hito</div>
          <div className="col-span-2">Asignado a</div>
          <div className="col-span-2">Cronología</div>
          <div className="col-span-3 text-center">Control de Avance</div>
          <div className="col-span-1 text-center">Ruta Crítica</div>
        </div>

        {/* List of Gantt Rows */}
        <div className="space-y-4">
          {projectTasks.map((task) => (
            <div
              key={task.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-3.5 rounded-xl border transition-all ${
                task.isCritical 
                  ? 'border-error/20 bg-error/5 hover:border-error/45' 
                  : 'border-titanium-800/40 bg-carbon-800/20 hover:border-titanium-700/50'
              }`}
            >
              {/* Name */}
              <div className="col-span-1 lg:col-span-4 flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${task.isCritical ? 'bg-error shadow-glow' : 'bg-neon'}`}></span>
                <div>
                  <h4 className="text-xs font-bold text-smoke">{task.title}</h4>
                  <span className="text-[10px] text-titanium-500 font-semibold uppercase">{task.id}</span>
                </div>
              </div>

              {/* Resource */}
              <div className="col-span-1 lg:col-span-2 text-xs font-semibold text-smoke">
                {task.resource}
              </div>

              {/* Date interval */}
              <div className="col-span-1 lg:col-span-2 flex items-center gap-1.5 text-xs text-titanium-500">
                <Calendar size={12} className="text-neon" />
                <span>{task.start}</span>
                <span className="text-[10px] text-titanium-600">→</span>
                <span>{task.end}</span>
              </div>

              {/* Interactive Progress Slider */}
              <div className="col-span-1 lg:col-span-3 flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => handleSliderChange(task.id, e.target.value)}
                  className="w-full h-1.5 bg-titanium-800 rounded-lg appearance-none cursor-pointer accent-neon focus:outline-none"
                />
                <span className="text-xs font-bold text-smoke w-10 text-right">{task.progress}%</span>
              </div>

              {/* Critical Indicator Badge */}
              <div className="col-span-1 lg:col-span-1 text-center">
                {task.isCritical ? (
                  <span className="inline-block text-[9px] font-bold text-error bg-error/15 border border-error/30 px-2 py-0.5 rounded uppercase">Ruta Crítica</span>
                ) : (
                  <span className="inline-block text-[9px] font-semibold text-titanium-500 bg-titanium-800 px-2 py-0.5 rounded uppercase">Normal</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-carbon-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-glass border border-titanium-800/85">
            <h3 className="text-base font-bold text-smoke mb-4 border-b border-titanium-800/50 pb-2">Añadir Tarea al Cronograma</h3>
            
            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Título de la Tarea</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs"
                  placeholder="Encofrado de columnas sector norte"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Fecha Término</label>
                  <input
                    type="date"
                    required
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Recurso Asignado / Responsable</label>
                <input
                  type="text"
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs"
                  placeholder="Ej: Contratista Estructural"
                />
              </div>

              <label className="flex items-center justify-between p-2 rounded-lg bg-carbon-900/40 border border-titanium-800/40 text-xs cursor-pointer hover:bg-carbon-800/40 transition-colors">
                <span className="font-semibold text-error">¿Incluir en la Ruta Crítica?</span>
                <input
                  type="checkbox"
                  checked={isCritical}
                  onChange={(e) => setIsCritical(e.target.checked)}
                  className="rounded border-titanium-700 bg-carbon-800 text-error focus:ring-error"
                />
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-titanium-800/40 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-titanium-800/30 text-titanium-500 border border-titanium-700/20 hover:text-smoke"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-electric to-neon rounded-xl text-xs font-bold text-white shadow-glow"
                >
                  Registrar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
