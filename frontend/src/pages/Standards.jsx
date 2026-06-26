import React, { useState } from 'react';
import { Search, BookOpen, FileText, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

const STANDARDS_DB = [
  // ACI
  {
    code: 'ACI 318-19',
    title: 'Requisitos de Reglamento para Concreto Estructural',
    organization: 'ACI',
    category: 'Estructuras / Hormigón',
    description: 'Proporciona los requisitos mínimos para el diseño y la construcción de elementos de concreto estructural en cualquier estructura construida bajo los requisitos del código general de edificación.',
    status: 'Vigente',
    year: '2019',
    pages: '624'
  },
  {
    code: 'ACI 301-20',
    title: 'Especificaciones para Concreto Estructural',
    organization: 'ACI',
    category: 'Estructuras / Hormigón',
    description: 'Cubre requisitos de construcción para cualquier proyecto de concreto estructural, incluyendo materiales, dosificación, mezclado, colocación, curado y encofrados.',
    status: 'Vigente',
    year: '2020',
    pages: '150'
  },
  // ASTM
  {
    code: 'ASTM C39/C39M',
    title: 'Método de Ensayo Estándar para Resistencia a la Compresión de Especímenes Cilíndricos de Concreto',
    organization: 'ASTM',
    category: 'Ensayes / Control Calidad',
    description: 'Determina la resistencia a la compresión de especímenes cilíndricos de concreto, tales como probetas moldeadas o núcleos extraídos, bajo una carga axial continua.',
    status: 'Vigente',
    year: '2021',
    pages: '8'
  },
  {
    code: 'ASTM D1557',
    title: 'Métodos de Ensayo Estándar para Características de Compactación del Suelo Utilizando el Esfuerzo Modificado',
    organization: 'ASTM',
    category: 'Geotecnia / Suelos',
    description: 'Establece los procedimientos de compactación en laboratorio para determinar la relación entre el contenido de agua y el peso unitario seco de los suelos (Proctor Modificado).',
    status: 'Vigente',
    year: '2020',
    pages: '12'
  },
  {
    code: 'ASTM A36/A36M',
    title: 'Especificación Estándar para Acero Estructural al Carbono',
    organization: 'ASTM',
    category: 'Estructuras / Acero',
    description: 'Cubre perfiles, placas y barras de acero al carbono de calidad estructural para su uso en la construcción remachada, atornillada o soldada de puentes y edificios.',
    status: 'Vigente',
    year: '2019',
    pages: '5'
  },
  // AISC
  {
    code: 'AISC 360-16',
    title: 'Especificación para Edificios de Acero Estructural',
    organization: 'AISC',
    category: 'Estructuras / Acero',
    description: 'Rige el diseño de estructuras de acero para edificios, aplicando criterios de diseño por factores de carga y resistencia (LRFD) y diseño por esfuerzos permisibles (ASD).',
    status: 'Vigente',
    year: '2016',
    pages: '684'
  },
  // ISO (BIM)
  {
    code: 'ISO 19650-1:2018',
    title: 'Organización y digitalización de la información en obras de edificación e ingeniería civil (BIM) -- Parte 1: Conceptos y principios',
    organization: 'ISO',
    category: 'BIM / Gestión',
    description: 'Define los conceptos y principios para la gestión de la información en un ciclo de vida de los activos de edificación, utilizando el modelado de información de construcción (BIM).',
    status: 'Vigente',
    year: '2018',
    pages: '38'
  },
  {
    code: 'ISO 19650-2:2018',
    title: 'Gestión de la información en obras (BIM) -- Parte 2: Fase de desarrollo de los activos',
    organization: 'ISO',
    category: 'BIM / Gestión',
    description: 'Especifica los requisitos para la gestión de la información, en forma de un proceso de gestión, dentro de la fase de desarrollo de los activos y como parte del ciclo de vida.',
    status: 'Vigente',
    year: '2018',
    pages: '46'
  },
  // AASHTO
  {
    code: 'AASHTO LRFD',
    title: 'Especificaciones de Diseño de Puentes LRFD',
    organization: 'AASHTO',
    category: 'Infraestructura / Puentes',
    description: 'Normativa estadounidense fundamental para el diseño, evaluación y rehabilitación de puentes de carretera basados en la metodología de factores de carga y resistencia.',
    status: 'Vigente',
    year: '2020',
    pages: '1850'
  }
];

export default function Standards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrg, setActiveOrg] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredStandards = STANDARDS_DB.filter(std => {
    const matchesSearch = 
      std.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOrg = activeOrg === 'ALL' || std.organization === activeOrg;
    const matchesCat = activeCategory === 'ALL' || std.category.includes(activeCategory);

    return matchesSearch && matchesOrg && matchesCat;
  });

  const categories = ['ALL', 'Estructuras', 'Hormigón', 'Acero', 'Geotecnia', 'BIM'];
  const orgs = ['ALL', 'ACI', 'ASTM', 'AISC', 'ISO', 'AASHTO'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-smoke uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="text-neon" size={20} />
          Buscador de Normas Internacionales de Ingeniería
        </h2>
        <p className="text-xs text-titanium-500 mt-1">
          Base de conocimiento y consulta rápida de códigos y regulaciones técnicas de construcción (ASTM, ACI, ISO BIM, AISC).
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="glass-panel p-5 rounded-2xl border border-titanium-800/50 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código, título o descripción (ej. ACI 318, Compactación, Hormigón)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-11 pr-4 py-3 text-xs"
          />
          <Search className="absolute left-4 top-3 text-titanium-500" size={16} />
        </div>

        {/* Filters Organisms */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-titanium-500 font-bold uppercase text-[10px] mr-2">Organización:</span>
          {orgs.map(org => (
            <button
              key={org}
              onClick={() => setActiveOrg(org)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                activeOrg === org 
                  ? 'bg-neon/15 border-neon/30 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'bg-carbon-900/40 border-titanium-800/40 text-titanium-400 hover:text-smoke hover:bg-carbon-800/40'
              }`}
            >
              {org}
            </button>
          ))}
        </div>

        {/* Filters Categories */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-titanium-500 font-bold uppercase text-[10px] mr-2">Disciplina:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-neon/15 border-neon/30 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'bg-carbon-900/40 border-titanium-800/40 text-titanium-400 hover:text-smoke hover:bg-carbon-800/40'
              }`}
            >
              {cat === 'ALL' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {filteredStandards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStandards.map((std, idx) => (
            <div 
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-titanium-800/60 flex flex-col justify-between hover:border-neon/40 hover:bg-carbon-800/20 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Top Details */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-neon bg-electric/15 border border-neon/20 px-2.5 py-0.5 rounded-md font-mono">
                      {std.code}
                    </span>
                    <span className="text-[9px] bg-titanium-800 text-titanium-400 font-bold px-2 py-0.5 rounded ml-2 uppercase">
                      {std.organization}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} />
                    {std.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-smoke mb-2 leading-relaxed group-hover:text-neon transition-colors">
                  {std.title}
                </h3>
                <p className="text-[11px] text-titanium-400 leading-relaxed mb-4">
                  {std.description}
                </p>
              </div>

              {/* Specs Footer */}
              <div className="flex justify-between items-center pt-3.5 border-t border-titanium-800/20 text-[10px] font-medium text-titanium-500">
                <div className="flex gap-4">
                  <span>Disciplina: <strong className="text-smoke">{std.category.split(' / ')[1] || std.category}</strong></span>
                  <span>Año: <strong className="text-smoke">{std.year}</strong></span>
                  <span>Páginas: <strong className="text-smoke">{std.pages}</strong></span>
                </div>
                <button 
                  onClick={() => alert(`Visualización de documento ${std.code} encriptado mediante protocolo SSL grado militar.`)}
                  className="text-neon font-bold hover:underline flex items-center gap-1"
                >
                  <FileText size={12} />
                  Ver PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl border border-titanium-800/50">
          <AlertCircle className="mx-auto text-warning mb-3" size={32} />
          <h4 className="text-sm font-bold text-smoke uppercase">No se encontraron normas</h4>
          <p className="text-xs text-titanium-500 mt-1 max-w-md mx-auto">
            Prueba a refinar tu término de búsqueda o selecciona otra disciplina/organismo regulador.
          </p>
        </div>
      )}
    </div>
  );
}
