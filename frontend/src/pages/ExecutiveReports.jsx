import React from 'react';
import { FileDown, Printer, FileText, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useEliteStore } from '../store/useEliteStore';

export default function ExecutiveReports() {
  const { projects, selectedProjectId } = useEliteStore();

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Reportes Ejecutivos & Auditorías</h2>
          <p className="text-xs text-titanium-500 mt-1">Generación y exportación de reportes de cumplimiento financiero, tributario e inspección.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Imprimiendo reporte consolidado...')}
            className="flex items-center gap-1.5 p-2 px-3 rounded-xl bg-titanium-800/40 text-smoke border border-titanium-700/30 text-xs font-semibold hover:bg-titanium-800/80 transition-colors"
          >
            <Printer size={14} />
            Imprimir
          </button>
        </div>
      </div>

      {/* Grid: Download report blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Report Block 1 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-48 border border-titanium-800/40">
          <div>
            <div className="w-9 h-9 rounded-xl bg-electric/10 border border-electric/25 flex items-center justify-center text-neon mb-3">
              <FileText size={18} />
            </div>
            <h4 className="text-xs font-bold text-smoke uppercase tracking-wider">Ficha de Avance Físico & Hitos</h4>
            <p className="text-[11px] text-titanium-500 mt-1.5 leading-normal">Detalle del cronograma Gantt, tareas críticas y hitos de construcción consolidados.</p>
          </div>
          <button
            onClick={() => alert('Descargando Ficha de Avance Físico PDF...')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-titanium-800/30 text-xs text-smoke font-semibold hover:bg-titanium-800/60 border border-titanium-700/10 transition-colors"
          >
            <FileDown size={14} /> Descargar PDF
          </button>
        </div>

        {/* Report Block 2 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-48 border border-titanium-800/40">
          <div>
            <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/25 flex items-center justify-center text-success mb-3">
              <TrendingUp size={18} />
            </div>
            <h4 className="text-xs font-bold text-smoke uppercase tracking-wider">Reporte de Costo Real vs APU</h4>
            <p className="text-[11px] text-titanium-500 mt-1.5 leading-normal">Análisis financiero de variaciones presupuestarias, estimaciones de compra y cobro de facturas.</p>
          </div>
          <button
            onClick={() => alert('Descargando Reporte de Costos Excel...')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-titanium-800/30 text-xs text-smoke font-semibold hover:bg-titanium-800/60 border border-titanium-700/10 transition-colors"
          >
            <FileDown size={14} /> Descargar Excel
          </button>
        </div>

        {/* Report Block 3 */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-48 border border-titanium-800/40">
          <div>
            <div className="w-9 h-9 rounded-xl bg-warning/10 border border-warning/25 flex items-center justify-center text-warning mb-3">
              <AlertTriangle size={18} />
            </div>
            <h4 className="text-xs font-bold text-smoke uppercase tracking-wider">Reporte de Inspecciones & SAT</h4>
            <p className="text-[11px] text-titanium-500 mt-1.5 leading-normal">Registro consolidado de inspecciones técnicas validadas para fiscalizaciones municipales SAT.</p>
          </div>
          <button
            onClick={() => alert('Descargando Reporte Inspecciones PDF...')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-titanium-800/30 text-xs text-smoke font-semibold hover:bg-titanium-800/60 border border-titanium-700/10 transition-colors"
          >
            <FileDown size={14} /> Descargar PDF
          </button>
        </div>
      </div>

      {/* Summary Statements */}
      <div className="glass-panel p-5 rounded-2xl border border-titanium-800/40 space-y-4">
        <h4 className="text-xs font-bold text-smoke uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={16} className="text-success" />
          Cumplimiento Financiero & Legal
        </h4>
        <div className="space-y-2 text-xs leading-normal">
          <div className="flex justify-between border-b border-titanium-800/20 pb-2">
            <span className="text-titanium-500">Impuestos / Declaraciones Declaradas:</span>
            <span className="font-semibold text-success">Aprobado (Declaración SAT 2026 Vigente)</span>
          </div>
          <div className="flex justify-between border-b border-titanium-800/20 pb-2">
            <span className="text-titanium-500">Monto Asegurado Contra Riesgos Estructurales:</span>
            <span className="font-semibold text-smoke">{formatCurrency(activeProject.budget * 1.5)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-titanium-500">Auditoría de Logs (CUMPLIMIENTO ISO-27001):</span>
            <span className="font-semibold text-success">100% de Trazabilidad en Operaciones Críticas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
