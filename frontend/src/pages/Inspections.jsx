import React, { useState } from 'react';
import { useEliteStore } from '../store/useEliteStore';
import { ClipboardCheck, Plus, Camera, CheckSquare, AlertCircle, Sparkles } from 'lucide-react';

export default function Inspections() {
  const { inspections, addInspection } = useEliteStore();
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [area, setArea] = useState('');
  const [item, setItem] = useState('Armaduras de Refuerzo');
  const [status, setStatus] = useState('Aprobado');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!area || !notes) return;

    addInspection({
      area,
      item,
      status,
      notes,
      inspector: 'Dra. Laura Torres'
    });

    setArea('');
    setNotes('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Supervisión en Obra & Checklist</h2>
          <p className="text-xs text-titanium-500 mt-1">Inspecciones técnicas de calidad y prevención de riesgos laborales con soporte móvil.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-electric to-neon text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-neon/20 shadow-glow"
        >
          <Plus size={14} />
          Registrar Inspección
        </button>
      </div>

      {/* Grid: Inspections cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspections.map((insp) => (
          <div key={insp.id} className="glass-panel p-5 rounded-2xl border border-titanium-800/40 relative overflow-hidden flex flex-col justify-between h-56">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] bg-electric/15 text-neon px-2.5 py-0.5 rounded font-bold uppercase">{insp.item}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  insp.status === 'Aprobado' ? 'bg-success/15 text-success border border-success/30' :
                  insp.status === 'Con Observaciones' ? 'bg-warning/15 text-warning border border-warning/30' :
                  'bg-error/15 text-error border border-error/30'
                }`}>
                  {insp.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-smoke uppercase tracking-wider">{insp.area}</h4>
              <p className="text-xs text-titanium-500 mt-2 leading-relaxed italic">"{insp.notes}"</p>
            </div>
            <div className="border-t border-titanium-800/40 pt-3 flex justify-between items-center text-[10px] text-titanium-500 mt-4">
              <span>Por: <strong>{insp.inspector}</strong></span>
              <span>{new Date(insp.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Inspection Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-carbon-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-glass border border-titanium-800/85">
            <h3 className="text-base font-bold text-smoke mb-4 border-b border-titanium-800/50 pb-2">Registrar Inspección de Campo</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Área o Sector del Proyecto</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs"
                  placeholder="Fundaciones, Eje A-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Ítem Evaluado</label>
                  <select
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs"
                  >
                    <option value="Armaduras de Refuerzo">Armaduras de Refuerzo</option>
                    <option value="Instalaciones MEP">Instalaciones MEP</option>
                    <option value="Encofrado e Plomos">Encofrado e Plomos</option>
                    <option value="Higiene y Seguridad">Higiene y Seguridad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Calificación</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs"
                  >
                    <option value="Aprobado">Aprobado</option>
                    <option value="Con Observaciones">Con Observaciones</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Notas y Evidencias</label>
                <textarea
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full glass-input px-3 py-2 text-xs"
                  placeholder="Se inspecciona armadura del pilar P-12, se encuentra conforme..."
                />
              </div>

              <div className="p-3.5 rounded-xl bg-carbon-900/40 border border-titanium-800/40 text-xs flex items-center justify-between cursor-pointer hover:bg-carbon-800/40 transition-colors">
                <span className="text-titanium-500 flex items-center gap-1.5"><Camera size={14} /> Subir Evidencia Fotográfica</span>
                <span className="text-[10px] bg-electric/20 text-neon px-2 py-0.5 rounded font-bold uppercase">Adjuntar</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-titanium-800/40 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-titanium-800/30 text-titanium-500 border border-titanium-700/20 hover:text-smoke"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-electric to-neon rounded-xl text-xs font-bold text-white shadow-glow"
                >
                  Subir Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
