import React, { useState, useEffect } from 'react';
import { useEliteStore } from '../store/useEliteStore';
import { ShieldCheck, Lock, Mail, Server, Compass, Wifi, WifiOff, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, verifyMfa, mfaRequired } = useEliteStore();
  const [email, setEmail] = useState('admin@elitebuild.com');
  const [password, setPassword] = useState('Admin123!');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  // Verificar estado del backend al cargar
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 2000);
        const res = await fetch('http://localhost:3001/health', { signal: controller.signal });
        clearTimeout(tid);
        setBackendStatus(res.ok ? 'online' : 'offline');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) setError(res.error);
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await verifyMfa(mfaCode);
      if (!success) setError('Código incorrecto. Para esta demo el código es 123456.');
    } catch {
      setError('Error verificando código MFA.');
    } finally {
      setLoading(false);
    }
  };

  // Rellenar credencial con un click
  const fillCredential = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
  };

  const DEMO_USERS = [
    { label: 'Super Admin', email: 'admin@elitebuild.com', password: 'Admin123!', mfa: true, color: 'text-neon', badge: 'MFA' },
    { label: 'Ingeniero Civil', email: 'ingeniero@elitebuild.com', password: 'Ingeniero123!', mfa: false, color: 'text-success', badge: null },
    { label: 'Supervisor', email: 'supervisor@elitebuild.com', password: 'Super123!', mfa: false, color: 'text-warning', badge: null },
  ];

  return (
    <div className="relative w-screen h-screen bg-carbon-900 flex items-center justify-center overflow-hidden">
      {/* Background grid blueprint */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-electric/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-glass border border-titanium-800/80 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-electric to-neon shadow-glow text-white font-bold text-2xl mb-4 hover:rotate-12 transition-transform duration-300 cursor-default">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-smoke to-titanium-400">
            ELITE<span className="text-neon">BUILD</span>
          </h1>
          <p className="text-xs text-titanium-500 mt-1 uppercase tracking-widest font-semibold">ERP + BIM + IA Engineering Suite</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-error/15 border border-error/30 text-error text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!mfaRequired ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-smoke uppercase tracking-wider mb-2">Correo Corporativo</label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-3 text-sm"
                  placeholder="nombre@empresa.com"
                  required
                  autoComplete="email"
                />
                <Mail className="absolute left-3 top-3.5 text-titanium-500" size={16} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-smoke uppercase tracking-wider mb-2">Contraseña</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 pr-10 py-3 text-sm"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <Lock className="absolute left-3 top-3.5 text-titanium-500" size={16} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-titanium-500 hover:text-smoke transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-electric to-neon hover:from-neon hover:to-electric text-white font-bold text-sm rounded-xl shadow-glow hover:shadow-none transition-all duration-300 flex items-center justify-center gap-2 border border-neon/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Ingresar Seguro
                </>
              )}
            </button>

            {/* Acceso rápido de demostración */}
            <div className="relative my-2 text-center">
              <span className="absolute inset-x-0 top-2.5 h-[1px] bg-titanium-800/60" />
              <span className="relative bg-carbon-800/80 px-3 text-[10px] text-titanium-500 uppercase tracking-widest font-semibold">
                Acceso rápido de demostración
              </span>
            </div>

            <div className="space-y-2">
              {DEMO_USERS.map(u => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => fillCredential(u.email, u.password)}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-titanium-800/60 bg-carbon-800/40 hover:bg-carbon-700/50 hover:border-titanium-700 transition-all text-xs group`}
                >
                  <span className={`font-bold ${u.color}`}>{u.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-titanium-500 font-mono">{u.email}</span>
                    {u.mfa && (
                      <span className="px-1.5 py-0.5 rounded bg-neon/20 border border-neon/30 text-neon text-[10px] font-bold">MFA</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </form>
        ) : (
          /* MFA Form */
          <form onSubmit={handleMfaSubmit} className="space-y-5 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-neon/10 border-2 border-neon/30 flex items-center justify-center text-neon">
                <Lock size={28} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-smoke uppercase tracking-wider">Verificación de Identidad</h3>
              <p className="text-xs text-titanium-500 mt-2 leading-relaxed">
                Ingresa el código de 6 dígitos de tu autenticador.<br />
                <span className="text-neon font-semibold">Para esta demo usa: 123456</span>
              </p>
            </div>

            <input
              id="mfa-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              className="w-full glass-input py-4 text-center text-2xl font-bold tracking-[0.8em] focus:ring-neon"
              placeholder="000000"
              required
              autoFocus
            />

            <button
              id="mfa-submit"
              type="submit"
              disabled={loading || mfaCode.length !== 6}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-neon to-electric hover:from-electric hover:to-neon text-white font-bold text-sm rounded-xl shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Verificar y Acceder'
              )}
            </button>

            <button
              type="button"
              onClick={() => { useEliteStore.setState({ mfaRequired: false, tempUser: null }); setError(''); setMfaCode(''); }}
              className="text-xs text-titanium-500 hover:text-smoke transition-colors underline"
            >
              ← Volver al inicio de sesión
            </button>
          </form>
        )}
      </div>

      {/* Footer status bar */}
      <div className="absolute bottom-4 flex items-center gap-4 text-[10px] text-titanium-500 font-semibold z-10 uppercase tracking-widest">
        <span className="flex items-center gap-1.5">
          {backendStatus === 'online' ? (
            <><Wifi size={11} className="text-success" /> API Backend: Online</>
          ) : backendStatus === 'offline' ? (
            <><WifiOff size={11} className="text-warning" /> Modo Local Activo</>
          ) : (
            <><Server size={11} className="animate-pulse" /> Verificando...</>
          )}
        </span>
        <span className="flex items-center gap-1"><Server size={10} className="text-success" /> Auth: AES-256-GCM</span>
        <span className="flex items-center gap-1"><Server size={10} className="text-success" /> Sesión: JWT 8h</span>
      </div>
    </div>
  );
}
