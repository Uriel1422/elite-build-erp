import React, { useState } from 'react';
import { useEliteStore } from '../store/useEliteStore';
import { Cpu, Sparkles, TrendingUp, HelpCircle, FileText, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AIAssistant() {
  const { sensorLogs } = useEliteStore();
  const [curingDays, setCuringDays] = useState(7);
  const [concreteGrade, setConcreteGrade] = useState('H-30');
  const [temp, setTemp] = useState(22);
  const [strengthResult, setStrengthResult] = useState(21.8);
  const [loading, setLoading] = useState(false);

  const calculateEstimation = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate TensorFlow.js/Python microservice predicting strength
    setTimeout(() => {
      let base = 30; // H-30 target is 30 MPa
      if (concreteGrade === 'H-35') base = 35;
      if (concreteGrade === 'H-40') base = 40;

      // Simple logarithmic concrete curing formula: strength = base * log10(days) / log10(28)
      const factor = Math.log10(curingDays) / Math.log10(28);
      const computed = Math.round(base * factor * (1 + (temp - 20) * 0.015) * 10) / 10;
      
      setStrengthResult(computed);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Ingeniería Predictiva e IA (TensorFlow)</h2>
          <p className="text-xs text-titanium-500 mt-1">Cálculo de resistencia de hormigón en base a sensores de temperatura y algoritmos de machine learning.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon/10 border border-neon/20 text-xs text-neon font-bold animate-pulse">
          <Sparkles size={14} />
          Modelos AI-Vite Activos
        </div>
      </div>

      {/* Grid: Estimator form & Curing Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Estimator Form */}
        <div className="glass-panel p-5 rounded-2xl border border-titanium-800/40 space-y-4">
          <h3 className="text-xs font-bold text-smoke uppercase tracking-wider flex items-center gap-1.5 border-b border-titanium-800/40 pb-2">
            <Cpu size={14} className="text-neon" />
            Estimador de Resistencia de Fraguado
          </h3>

          <form onSubmit={calculateEstimation} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-titanium-500 uppercase mb-1">Grado del Hormigón</label>
              <select
                value={concreteGrade}
                onChange={(e) => setConcreteGrade(e.target.value)}
                className="w-full glass-input px-3 py-2"
              >
                <option value="H-30">H-30 (Resistencia Diseño: 30 MPa)</option>
                <option value="H-35">H-35 (Resistencia Diseño: 35 MPa)</option>
                <option value="H-40">H-40 (Resistencia Diseño: 40 MPa)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-titanium-500 uppercase mb-1">Días de Curado</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={curingDays}
                  onChange={(e) => setCuringDays(Number(e.target.value))}
                  className="w-full glass-input px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-titanium-500 uppercase mb-1">Temp Promedio (°C)</label>
                <input
                  type="number"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full glass-input px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-electric to-neon text-white font-bold rounded-xl shadow-glow hover:scale-[1.01] transition-all"
            >
              {loading ? 'Calculando Resistencia...' : 'Calcular con Tensor-Kernel'}
            </button>
          </form>

          {/* AI Result Card */}
          <div className="p-4 rounded-xl bg-carbon-900/60 border border-titanium-800/80 text-center relative overflow-hidden">
            <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest block mb-1">Resistencia Estada</span>
            <div className="text-3xl font-extrabold text-smoke flex items-baseline justify-center gap-1.5">
              <span>{strengthResult}</span>
              <span className="text-sm font-semibold text-neon">MPa</span>
            </div>
            <p className="text-[10px] text-titanium-500 mt-1 leading-normal">
              {strengthResult >= 28 ? (
                <span className="text-success font-semibold">✓ Resistencia óptima para descimbre</span>
              ) : (
                <span className="text-warning font-semibold">⚠️ Requiere fraguado adicional</span>
              )}
            </p>
          </div>
        </div>

        {/* Curing strength curve chart */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-smoke uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={14} className="text-neon" />
            Curva Logarítmica de Maduración (Presión MPa vs Días)
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensorLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="ageDays" label={{ value: 'Días Curado', position: 'insideBottomRight', offset: -5 }} stroke="#475569" fontSize={10} />
                <YAxis label={{ value: 'Resistencia (MPa)', angle: -90, position: 'insideLeft' }} stroke="#475569" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="strengthMpa" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Structural Risk assessments */}
      <div className="glass-panel p-5 rounded-2xl border border-titanium-800/40">
        <h3 className="text-xs font-bold text-smoke uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-error" />
          Análisis de Riesgos Estructurales por IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-error/10 border border-error/25 flex items-start gap-2.5">
            <span>🚨</span>
            <div>
              <h4 className="font-bold text-error uppercase mb-1">Riesgo de Agrietamiento por Calor</h4>
              <p className="text-titanium-500 leading-normal">Los sensores 4 y 7 registran una diferencia térmica interna de 22°C. Altamente propenso a fisuración por retracción térmica.</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-success/10 border border-success/25 flex items-start gap-2.5">
            <span>✓</span>
            <div>
              <h4 className="font-bold text-success uppercase mb-1">Monitoreo Sísmico de Estructuras</h4>
              <p className="text-titanium-500 leading-normal">Los acelerómetros en pilares de fachada se encuentran bajo el umbral de ruido sísmico. Estructura estable.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
