import React, { useState } from 'react';
import { useEliteStore } from '../store/useEliteStore';
import { Plus, Download, BarChart2, Check, Calculator } from 'lucide-react';

export default function Budgets() {
  const { budgets, selectedProjectId, addApuItem, projects } = useEliteStore();
  const [showAddApu, setShowAddApu] = useState(false);

  // Form states for new APU
  const [category, setCategory] = useState('Obras Civiles');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('m3');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const items = budgets[selectedProjectId] || [];

  const handleAddApuSubmit = (e) => {
    e.preventDefault();
    if (!description || !quantity || !unitCost) return;

    addApuItem(selectedProjectId, {
      category,
      code: code || 'GEN-01',
      description,
      unit,
      quantity: Number(quantity),
      unitCost: Number(unitCost)
    });

    // Reset Form
    setCode('');
    setDescription('');
    setQuantity('');
    setUnitCost('');
    setShowAddApu(false);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);
  };

  // Group by category
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const totalBudget = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Presupuestos y Cubicaciones (APU)</h2>
          <p className="text-xs text-titanium-500 mt-1">Análisis de Precios Unitarios integrados por etapa estructural del proyecto.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddApu(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-electric to-neon text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-neon/20 shadow-glow"
          >
            <Plus size={14} />
            Añadir Partida APU
          </button>
          <button
            onClick={() => alert('Exportando presupuesto consolidado a Excel/PDF...')}
            className="flex items-center gap-2 bg-titanium-800/40 text-smoke border border-titanium-700/30 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-titanium-800/80 transition-all"
          >
            <Download size={14} />
            Exportar XLS
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-neon">
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Presupuesto Consolidado</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">{formatCurrency(totalBudget)}</h3>
          <p className="text-[10px] text-titanium-500 mt-1">Calculado dinámicamente sobre {items.length} partidas</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-success">
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Partidas Ejecutadas</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">
            {items.filter(i => i.code.startsWith('CIV')).length} / {items.length}
          </h3>
          <p className="text-[10px] text-titanium-500 mt-1">Fases iniciales e intermedias al 100%</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-warning">
          <span className="text-[10px] font-bold text-titanium-500 uppercase tracking-widest">Margen de Desviación Proyectada</span>
          <h3 className="text-2xl font-bold text-smoke mt-2">-0.8%</h3>
          <p className="text-[10px] text-success font-semibold mt-1">Por debajo del margen de contingencia</p>
        </div>
      </div>

      {/* APU Grouped Tables */}
      <div className="space-y-6">
        {Object.keys(categories).length > 0 ? (
          Object.keys(categories).map((catName) => (
            <div key={catName} className="glass-panel rounded-2xl overflow-hidden border border-titanium-800/40">
              <div className="bg-carbon-800/80 px-6 py-4 border-b border-titanium-800/50 flex justify-between items-center">
                <h4 className="text-xs font-bold text-smoke uppercase tracking-wider">{catName}</h4>
                <span className="text-xs font-semibold text-neon">
                  Subtotal: {formatCurrency(categories[catName].reduce((s, i) => s + i.total, 0))}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-carbon-900/40 border-b border-titanium-800/50 text-titanium-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="px-6 py-3.5 w-24">Código</th>
                      <th className="px-6 py-3.5">Descripción de la Partida</th>
                      <th className="px-6 py-3.5 w-20 text-center">Unidad</th>
                      <th className="px-6 py-3.5 w-28 text-right">Cantidad</th>
                      <th className="px-6 py-3.5 w-32 text-right">Costo Unitario</th>
                      <th className="px-6 py-3.5 w-36 text-right">Costo Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-titanium-800/20">
                    {categories[catName].map((item) => (
                      <tr key={item.id} className="hover:bg-carbon-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-neon">{item.code}</td>
                        <td className="px-6 py-4 font-medium text-smoke">{item.description}</td>
                        <td className="px-6 py-4 text-center font-semibold text-titanium-500">{item.unit}</td>
                        <td className="px-6 py-4 text-right font-bold text-smoke">{item.quantity.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-semibold text-titanium-500">{formatCurrency(item.unitCost)}</td>
                        <td className="px-6 py-4 text-right font-extrabold text-smoke">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center border border-titanium-800/50">
            <Calculator className="mx-auto w-12 h-12 text-titanium-600 mb-4 animate-bounce" />
            <h4 className="font-bold text-smoke mb-1">Sin Partidas Presupuestarias</h4>
            <p className="text-xs text-titanium-500 max-w-sm mx-auto">
              Aún no has registrado análisis de precios unitarios (APU) para esta obra. Añade una partida usando el botón superior.
            </p>
          </div>
        )}
      </div>

      {/* Add APU Modal */}
      {showAddApu && (
        <div className="fixed inset-0 bg-carbon-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-glass border border-titanium-800/85">
            <h3 className="text-base font-bold text-smoke mb-4 border-b border-titanium-800/50 pb-2">Añadir Nueva Partida de Costo</h3>
            
            <form onSubmit={handleAddApuSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs"
                >
                  <option value="Obras Civiles">Obras Civiles</option>
                  <option value="Terminaciones">Terminaciones</option>
                  <option value="Instalaciones">Instalaciones (MEP)</option>
                  <option value="Gastos Generales">Gastos Generales / Administración</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Código</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs"
                    placeholder="CIV-03"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Unidad</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs"
                    placeholder="m3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Descripción del Ítem</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full glass-input px-3 py-2 text-xs"
                  placeholder="Instalación de marcos metálicos..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Cantidad</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-titanium-500 uppercase mb-1">Costo Unitario (CLP)</label>
                  <input
                    type="number"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    className="w-full glass-input px-3 py-2 text-xs"
                    placeholder="12500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-titanium-800/40 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddApu(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-titanium-800/30 text-titanium-500 border border-titanium-700/20 hover:text-smoke"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-electric to-neon rounded-xl text-xs font-bold text-white shadow-glow"
                >
                  Agregar Partida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
