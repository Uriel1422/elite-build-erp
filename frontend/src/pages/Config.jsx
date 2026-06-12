import React from 'react';
import { Settings, Shield, Server, Database, Key } from 'lucide-react';

export default function Config() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-smoke uppercase tracking-wider">Configuración del Sistema Élite</h2>
        <p className="text-xs text-titanium-500 mt-1">Gestión de conexiones a bases de datos PostgreSQL/MongoDB, claves API, integraciones SAP/Stripe y WAF corporativo.</p>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* DB Connection Config */}
        <div className="glass-panel p-5 rounded-2xl border border-titanium-800/40 space-y-4">
          <h3 className="text-xs font-bold text-smoke uppercase tracking-wider flex items-center gap-1.5 border-b border-titanium-800/40 pb-2">
            <Database size={14} className="text-neon" />
            Bases de Datos & Caché (Production Setup)
          </h3>
          <div className="space-y-3 leading-relaxed">
            <div className="flex justify-between">
              <span className="text-titanium-500">PostgreSQL (Relacional):</span>
              <span className="font-mono text-smoke">postgresql://elite_db:5432/main</span>
            </div>
            <div className="flex justify-between">
              <span className="text-titanium-500">MongoDB (Planos IFC/Audit Logs):</span>
              <span className="font-mono text-smoke">mongodb://mongo_nodes:27017/docs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-titanium-500">Redis (Sesiones & Tiempo Real):</span>
              <span className="font-mono text-smoke">redis://redis_cache:6379/1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-titanium-500">S3 File Storage (Amazon AWS):</span>
              <span className="font-mono text-smoke">s3://elitebuild-corporate-bucket/</span>
            </div>
          </div>
        </div>

        {/* Security / WAF Setup */}
        <div className="glass-panel p-5 rounded-2xl border border-titanium-800/40 space-y-4">
          <h3 className="text-xs font-bold text-smoke uppercase tracking-wider flex items-center gap-1.5 border-b border-titanium-800/40 pb-2">
            <Shield size={14} className="text-error" />
            Seguridad & Cumplimiento Corporativo WAF
          </h3>
          <div className="space-y-3 leading-relaxed">
            <div className="flex justify-between">
              <span className="text-titanium-500">Autenticación Multifactor (MFA):</span>
              <span className="font-bold text-success uppercase">Activado (Google Auth TOTP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-titanium-500">Helmet Express Headers:</span>
              <span className="font-bold text-success uppercase">Activo (Protección XSS/Clickjacking)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-titanium-500">Token JWT Expiration:</span>
              <span className="font-mono text-smoke">8 Horas (Esquema RS256 Asimétrico)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-titanium-500">Copias de Seguridad (Disaster Recovery):</span>
              <span className="font-bold text-success uppercase">Automático (Cada 12 Horas S3)</span>
            </div>
          </div>
        </div>

        {/* Integrations SAP/Stripe */}
        <div className="glass-panel p-5 rounded-2xl border border-titanium-800/40 space-y-4 md:col-span-2">
          <h3 className="text-xs font-bold text-smoke uppercase tracking-wider flex items-center gap-1.5 border-b border-titanium-800/40 pb-2">
            <Key size={14} className="text-warning" />
            Integraciones API & ERP Externos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-carbon-900/40 border border-titanium-800/40">
              <h4 className="font-bold text-smoke mb-1">SAP Business One API</h4>
              <p className="text-[11px] text-titanium-500 mb-2">Sincronización de costos de materiales, compras y proveedores.</p>
              <span className="text-[10px] bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded font-bold uppercase">Conectado</span>
            </div>
            <div className="p-3 rounded-xl bg-carbon-900/40 border border-titanium-800/40">
              <h4 className="font-bold text-smoke mb-1">Autodesk Forge / Construction Cloud</h4>
              <p className="text-[11px] text-titanium-500 mb-2">Lectura directa de modelos arquitectónicos RVT y planos DWG.</p>
              <span className="text-[10px] bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded font-bold uppercase">Conectado</span>
            </div>
            <div className="p-3 rounded-xl bg-carbon-900/40 border border-titanium-800/40">
              <h4 className="font-bold text-smoke mb-1">Stripe Payment Gateway</h4>
              <p className="text-[11px] text-titanium-500 mb-2">Cobro de facturas y desembolsos automáticos a contratistas.</p>
              <span className="text-[10px] bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded font-bold uppercase">Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
