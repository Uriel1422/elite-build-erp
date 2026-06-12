import React from 'react';
import { useEliteStore } from '../store/useEliteStore';
import { FileText, FileSpreadsheet, Signature, CheckSquare, History, FileUp } from 'lucide-react';

export default function Documental() {
  const { documents, signDocument } = useEliteStore();

  const handleSign = (docId) => {
    signDocument(docId);
    alert('Firma digital estampa con éxito usando criptografía corporativa SHA256.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Gestión Documental (DMS & OCR)</h2>
          <p className="text-xs text-titanium-500 mt-1">Control de planos IFC, memorias de cálculo y contratos con versionamiento y firmas digitales.</p>
        </div>
        <button
          onClick={() => alert('Simulando subida de planos DWG/IFC con extracción de datos OCR...')}
          className="flex items-center gap-2 bg-gradient-to-r from-electric to-neon text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-neon/20 shadow-glow"
        >
          <FileUp size={14} />
          Subir Archivo Técnico
        </button>
      </div>

      {/* Grid: Document List */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-titanium-800/40">
        <div className="bg-carbon-800/80 px-6 py-4 border-b border-titanium-800/50 flex justify-between items-center">
          <h4 className="text-xs font-bold text-smoke uppercase tracking-wider">Planoteca y Repositorio de Contratos</h4>
          <span className="text-xs font-semibold text-success flex items-center gap-1">🔒 Encriptación AES-256 Activa</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-carbon-900/40 border-b border-titanium-800/50 text-titanium-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-6 py-3.5">Documento</th>
                <th className="px-6 py-3.5">Categoría</th>
                <th className="px-6 py-3.5 text-center">Versión</th>
                <th className="px-6 py-3.5">Autor de Carga</th>
                <th className="px-6 py-3.5 text-center">Estado OCR</th>
                <th className="px-6 py-3.5 text-center">Firmado Digitalmente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-titanium-800/20">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-carbon-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-titanium-800/40 border border-titanium-700/30 flex items-center justify-center text-neon">
                      {doc.type === 'BIM/IFC' ? <FileText size={16} /> : <FileSpreadsheet size={16} />}
                    </div>
                    <div>
                      <h5 className="font-bold text-smoke">{doc.name}</h5>
                      <span className="text-[10px] text-titanium-500">{doc.size} | {doc.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-titanium-500">{doc.type}</td>
                  <td className="px-6 py-4 text-center font-bold text-smoke">
                    <span className="bg-titanium-800/60 px-2 py-0.5 rounded border border-titanium-700/20">{doc.version}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-smoke">{doc.author}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold ${
                      doc.ocrStatus.startsWith('Procesado') ? 'text-success' : 'text-titanium-500'
                    }`}>
                      {doc.ocrStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {doc.signed ? (
                      <span className="inline-flex items-center gap-1 text-success text-[10px] font-bold bg-success/15 border border-success/30 px-2 py-0.5 rounded uppercase">
                        ✓ Verificado (SHA256)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSign(doc.id)}
                        className="flex items-center gap-1 mx-auto bg-neon/10 hover:bg-neon hover:text-white border border-neon/30 text-neon px-2.5 py-1 rounded text-[10px] font-bold transition-all"
                      >
                        <Signature size={12} />
                        Firmar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
