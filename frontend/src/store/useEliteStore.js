import { create } from 'zustand';

// Initial Mock Projects Database
const INITIAL_PROJECTS = [
  {
    id: 'prj-skyline-101',
    name: 'Torre Skyline Vitacura',
    code: 'TSV-2026',
    location: 'Av. Vitacura 4500, Santiago',
    latitude: -33.4075,
    longitude: -70.5888,
    status: 'En Progreso',
    budget: 45000000.00,
    progress: 68.5,
    startDate: '2025-01-10',
    endDate: '2026-12-15',
    engineer: 'Dra. Laura Torres',
    dronesActive: 2,
    concreteSensors: 8,
    curingRisk: 'Bajo'
  },
  {
    id: 'prj-nordic-202',
    name: 'Condominio Lagos del Sur',
    code: 'CLS-2026',
    location: 'Ruta 225, Puerto Varas',
    latitude: -41.3178,
    longitude: -72.9855,
    status: 'Planificación',
    budget: 18200000.00,
    progress: 12.0,
    startDate: '2026-06-01',
    endDate: '2028-02-28',
    engineer: 'Ing. Carlos Mendoza',
    dronesActive: 0,
    concreteSensors: 2,
    curingRisk: 'Normal'
  },
  {
    id: 'prj-industrial-303',
    name: 'Planta Solar Atacama Desert',
    code: 'PSA-2025',
    location: 'Ruta 5 Norte, Copiapó',
    latitude: -27.3672,
    longitude: -70.3322,
    status: 'Detenido',
    budget: 95000000.00,
    progress: 89.2,
    startDate: '2024-03-15',
    endDate: '2026-08-30',
    engineer: 'Roberto Silva',
    dronesActive: 1,
    concreteSensors: 14,
    curingRisk: 'Crítico'
  }
];

// Initial Mock APU Budget Rows
const INITIAL_BUDGETS = {
  'prj-skyline-101': [
    { id: 'apu-1', category: 'Obras Civiles', code: 'CIV-01', description: 'Excavación masiva en suelo duro con maquinaria', unit: 'm3', quantity: 2400, unitCost: 15.50, total: 37200 },
    { id: 'apu-2', category: 'Obras Civiles', code: 'CIV-02', description: 'Hormigón armado en fundaciones H-30', unit: 'm3', quantity: 850, unitCost: 185.00, total: 157250 },
    { id: 'apu-3', category: 'Terminaciones', code: 'TER-01', description: 'Revestimiento cerámico premium en baños', unit: 'm2', quantity: 1200, unitCost: 32.80, total: 39360 },
    { id: 'apu-4', category: 'Instalaciones', code: 'INS-01', description: 'Tableros de distribución eléctrica principal', unit: 'global', quantity: 1, unitCost: 45000.00, total: 45000 }
  ],
  'prj-nordic-202': [
    { id: 'apu-5', category: 'Obras Civiles', code: 'CIV-01', description: 'Nivelación de terreno y despeje de vegetación', unit: 'm2', quantity: 8200, unitCost: 4.80, total: 39360 },
    { id: 'apu-6', category: 'Obras Civiles', code: 'CIV-02', description: 'Instalación de faenas y bodegas temporales', unit: 'global', quantity: 1, unitCost: 12000.00, total: 12000 }
  ],
  'prj-industrial-303': [
    { id: 'apu-7', category: 'Instalaciones', code: 'INS-SOL-01', description: 'Montaje de seguidores solares tracking biaxial', unit: 'unidad', quantity: 1450, unitCost: 350.00, total: 507500 },
    { id: 'apu-8', category: 'Instalaciones', code: 'INS-SOL-02', description: 'Instalación de paneles solares silicio monocristalino', unit: 'unidad', quantity: 29000, unitCost: 120.00, total: 3480000 }
  ]
};

// Initial Mock Gantt Tasks
const INITIAL_TASKS = {
  'prj-skyline-101': [
    { id: 'tsk-1', title: 'Excavación y Movimiento de Tierra', start: '2025-01-10', end: '2025-04-15', progress: 100, isCritical: true, dependencies: [], resource: 'Maquinaria Pesada' },
    { id: 'tsk-2', title: 'Hormigonado de Fundaciones', start: '2025-04-16', end: '2025-08-20', progress: 100, isCritical: true, dependencies: ['tsk-1'], resource: 'Ingeniero Estructuras' },
    { id: 'tsk-3', title: 'Montaje de Estructura de Acero', start: '2025-08-21', end: '2026-02-28', progress: 85, isCritical: true, dependencies: ['tsk-2'], resource: 'Contratista Acero' },
    { id: 'tsk-4', title: 'Instalaciones Sanitarias y Eléctricas', start: '2026-03-01', end: '2026-08-15', progress: 20, isCritical: false, dependencies: ['tsk-3'], resource: 'Subcontrato MEP' },
    { id: 'tsk-5', title: 'Revestimientos y Fachada Glassmorphic', start: '2026-06-10', end: '2026-11-30', progress: 5, isCritical: false, dependencies: ['tsk-4'], resource: 'Arquitecto Faena' },
    { id: 'tsk-6', title: 'Inspección Final y Recepción SAT', start: '2026-12-01', end: '2026-12-15', progress: 0, isCritical: true, dependencies: ['tsk-5'], resource: 'Auditor Municipal' }
  ],
  'prj-nordic-202': [
    { id: 'tsk-10', title: 'Nivelación de Terreno', start: '2026-06-01', end: '2026-08-15', progress: 10, isCritical: true, dependencies: [], resource: 'Operadores' },
    { id: 'tsk-11', title: 'Instalación de Faenas', start: '2026-08-16', end: '2026-09-30', progress: 0, isCritical: false, dependencies: ['tsk-10'], resource: 'Logística' }
  ],
  'prj-industrial-303': [
    { id: 'tsk-20', title: 'Zanjas y Canalización de Cables', start: '2024-03-15', end: '2024-09-30', progress: 100, isCritical: true, dependencies: [], resource: 'Subcontrato Civil' },
    { id: 'tsk-21', title: 'Anclaje de Hincas y Estructuras', start: '2024-10-01', end: '2025-06-15', progress: 100, isCritical: true, dependencies: ['tsk-20'], resource: 'Montajistas' },
    { id: 'tsk-22', title: 'Instalación de Paneles e Inversores', start: '2025-06-16', end: '2026-05-20', progress: 95, isCritical: true, dependencies: ['tsk-21'], resource: 'Electricistas AC/DC' }
  ]
};

// Initial Mock Personnel Attendance
const INITIAL_PERSONNEL = [
  { id: 'p1', name: 'Ing. Carlos Mendoza', role: 'Super Admin', checkIn: '2026-05-25T07:45:00Z', checkOut: null, lat: -33.4074, lng: -70.5886, status: 'Presente' },
  { id: 'p2', name: 'Dra. Laura Torres', role: 'Ingeniero Civil', checkIn: '2026-05-25T07:58:00Z', checkOut: null, lat: -33.4076, lng: -70.5890, status: 'Presente' },
  { id: 'p3', name: 'Roberto Silva', role: 'Supervisor', checkIn: '2026-05-25T08:15:00Z', checkOut: null, lat: -33.4072, lng: -70.5882, status: 'Presente (Tarde)' },
  { id: 'p4', name: 'Miguel Ángel Ruz', role: 'Contratista', checkIn: null, checkOut: null, lat: null, lng: null, status: 'Ausente' },
  { id: 'p5', name: 'Clara Domínguez', role: 'Arquitecto', checkIn: '2026-05-25T08:00:00Z', checkOut: '2026-05-25T14:00:00Z', lat: -33.4075, lng: -70.5889, status: 'Retirado' }
];

// Initial Technical Documents Collection
const INITIAL_DOCUMENTS = [
  { id: 'doc-1', name: 'plano_estructural_vitacura_v2.ifc', type: 'BIM/IFC', size: '24.2 MB', version: 'v2.4', date: '2026-05-18', author: 'Clara Domínguez', signed: true, ocrStatus: 'Procesado (100%)' },
  { id: 'doc-2', name: 'especificaciones_hormigon_H30.pdf', type: 'Especificación', size: '3.8 MB', version: 'v1.1', date: '2026-05-10', author: 'Dra. Laura Torres', signed: true, ocrStatus: 'Procesado (100%)' },
  { id: 'doc-3', name: 'presupuesto_consolidado_sat.xlsx', type: 'Financiero', size: '8.4 MB', version: 'v3.0', date: '2026-05-22', author: 'Ing. Carlos Mendoza', signed: false, ocrStatus: 'Omitido' },
  { id: 'doc-4', name: 'trazado_instalaciones_electricas.dwg', type: 'Plano CAD', size: '15.1 MB', version: 'v1.0', date: '2026-05-24', author: 'Clara Domínguez', signed: false, ocrStatus: 'Procesado (89%)' }
];

// Initial Inspection Checklists
const INITIAL_INSPECTIONS = [
  { id: 'insp-1', date: '2026-05-25T10:30:00Z', area: 'Sector Fundaciones Subterráneo -2', inspector: 'Roberto Silva', item: 'Encofrados y Armaduras', status: 'Aprobado', notes: 'Armadura cumple con cálculo estructural. Encofrados estancos.', photo: 'inspeccion_fundaciones.jpg' },
  { id: 'insp-2', date: '2026-05-24T15:00:00Z', area: 'Losa Estructural Piso 15', inspector: 'Roberto Silva', item: 'Vibrado e Instalaciones Embebidas', status: 'Con Observaciones', notes: 'Tuberías MEP requieren fijación adicional antes del vaciado.', photo: 'inspeccion_losa.jpg' },
  { id: 'insp-3', date: '2026-05-20T09:15:00Z', area: 'Tabiquerías Interiores Torre B', inspector: 'Dra. Laura Torres', item: 'Alineación e Plomos', status: 'Rechazado', notes: 'Tabique eje E-18 fuera de tolerancia. Requiere rehacer montaje.', photo: 'inspeccion_tabiques.jpg' }
];

// ===== USUARIOS LOCALES (funciona sin backend) =====
const LOCAL_USERS = [
  {
    id: 'usr-admin-111',
    email: 'admin@elitebuild.com',
    password: 'Admin123!',
    fullName: 'Ing. Carlos Mendoza',
    role: 'Super Admin',
    mfaEnabled: true,
    avatar: 'CM'
  },
  {
    id: 'usr-eng-222',
    email: 'ingeniero@elitebuild.com',
    password: 'Ingeniero123!',
    fullName: 'Dra. Laura Torres',
    role: 'Ingeniero Civil',
    mfaEnabled: false,
    avatar: 'LT'
  },
  {
    id: 'usr-sup-333',
    email: 'supervisor@elitebuild.com',
    password: 'Super123!',
    fullName: 'Roberto Silva',
    role: 'Supervisor de Obra',
    mfaEnabled: false,
    avatar: 'RS'
  }
];

// Recuperar sesión guardada del localStorage
const savedSession = (() => {
  try {
    const raw = localStorage.getItem('elitebuild_session');
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Verificar que no haya expirado (8 horas)
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('elitebuild_session');
      return null;
    }
    return session;
  } catch {
    return null;
  }
})();

export const useEliteStore = create((set, get) => ({
  // Authentication state — restaurado desde localStorage si hay sesión activa
  user: savedSession?.user || null,
  token: savedSession?.token || null,
  isAuthenticated: !!savedSession,
  mfaRequired: false,
  tempUser: null,
  
  // Dashboard navigation
  currentPage: 'dashboard', // dashboard, projects, bim, budgets, planning, personnel, inspections, docs, ai, reports, map, config
  
  // Projects states
  projects: INITIAL_PROJECTS,
  selectedProjectId: 'prj-skyline-101',
  
  // Master Databases (Keyed by project ID where applicable)
  budgets: INITIAL_BUDGETS,
  tasks: INITIAL_TASKS,
  personnel: INITIAL_PERSONNEL,
  documents: INITIAL_DOCUMENTS,
  inspections: INITIAL_INSPECTIONS,
  
  // Real-time Audit Logs (Simulating MongoDB capped collection)
  auditLogs: [
    { timestamp: '2026-05-25T14:42:01Z', user: 'admin@elitebuild.com', action: 'LOGIN_MFA_SUCCESS', details: 'Ingreso exitoso al sistema con MFA' },
    { timestamp: '2026-05-25T14:43:10Z', user: 'admin@elitebuild.com', action: 'BIM_VIEWER_INIT', details: 'Carga de plano_estructural_vitacura_v2.ifc exitosa' },
    { timestamp: '2026-05-25T14:44:18Z', user: 'supervisor@elitebuild.com', action: 'PERSONNEL_CHECKIN', details: 'Check-in registrado via GPS' }
  ],
  
  // IoT/Digital Twin concrete curing sensors
  sensorLogs: [
    { id: 's1', ageDays: 1, tempC: 28.5, strengthMpa: 4.8 },
    { id: 's2', ageDays: 3, tempC: 26.2, strengthMpa: 12.5 },
    { id: 's3', ageDays: 7, tempC: 22.4, strengthMpa: 21.8 },
    { id: 's4', ageDays: 14, tempC: 20.1, strengthMpa: 26.5 },
    { id: 's5', ageDays: 28, tempC: 18.3, strengthMpa: 31.2 }
  ],

  // Actions
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setSelectedProject: (id) => {
    set({ selectedProjectId: id });
    get().addAuditLog('PROJECT_SELECT', `Proyecto seleccionado: ${id}`);
  },

  // Auth Operations — Funciona LOCALMENTE (sin backend requerido)
  login: async (email, password) => {
    // 1. Intentar primero contra el backend real
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (!response.ok) {
        // El backend respondió pero con error → las credenciales son inválidas
        return { success: false, error: data.error || 'Credenciales inválidas' };
      }

      if (data.mfaRequired) {
        set({ mfaRequired: true, tempUser: { tempToken: data.tempToken, mode: 'backend' } });
        return { success: true, mfaRequired: true };
      }

      const sessionData = { user: data.user, token: data.token, expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
      localStorage.setItem('elitebuild_session', JSON.stringify(sessionData));
      set({ user: data.user, token: data.token, isAuthenticated: true, mfaRequired: false, tempUser: null });
      get().addAuditLog('LOGIN_SUCCESS', 'Ingreso validado por API Auth-Service (Backend)');
      return { success: true, mfaRequired: false };

    } catch (err) {
      // 2. Backend no disponible → autenticación LOCAL con usuarios integrados
      const emailLower = email.toLowerCase().trim();
      const localUser = LOCAL_USERS.find(u => u.email === emailLower);

      if (!localUser || localUser.password !== password) {
        return { success: false, error: 'Credenciales incorrectas. Revisa el correo y la contraseña.' };
      }

      if (localUser.mfaEnabled) {
        set({ mfaRequired: true, tempUser: { userId: localUser.id, mode: 'local' } });
        return { success: true, mfaRequired: true };
      }

      // Crear token local simulado
      const fakeToken = btoa(JSON.stringify({ id: localUser.id, role: localUser.role, exp: Date.now() + 8 * 3600000 }));
      const userPayload = { id: localUser.id, email: localUser.email, fullName: localUser.fullName, role: localUser.role, avatar: localUser.avatar };
      const sessionData = { user: userPayload, token: fakeToken, expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
      localStorage.setItem('elitebuild_session', JSON.stringify(sessionData));
      set({ user: userPayload, token: fakeToken, isAuthenticated: true, mfaRequired: false, tempUser: null });
      get().addAuditLog('LOGIN_SUCCESS_LOCAL', `Ingreso local validado para ${localUser.email}`);
      return { success: true, mfaRequired: false };
    }
  },

  verifyMfa: async (code) => {
    const { tempUser } = get();
    if (!tempUser) return false;

    // Código de validación aceptado: 123456
    if (code !== '123456') return false;

    if (tempUser.mode === 'backend' && tempUser.tempToken) {
      try {
        const response = await fetch('http://localhost:3001/mfa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tempToken: tempUser.tempToken, code })
        });
        const data = await response.json();
        if (!response.ok) return false;
        const sessionData = { user: data.user, token: data.token, expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
        localStorage.setItem('elitebuild_session', JSON.stringify(sessionData));
        set({ user: data.user, token: data.token, isAuthenticated: true, mfaRequired: false, tempUser: null });
        get().addAuditLog('LOGIN_MFA_SUCCESS', 'MFA validado por API Auth-Service');
        return true;
      } catch { /* cae a modo local */ }
    }

    // Modo local: encontrar el usuario por id
    const localUser = LOCAL_USERS.find(u => u.id === tempUser.userId);
    if (!localUser) return false;

    const fakeToken = btoa(JSON.stringify({ id: localUser.id, role: localUser.role, aal: 'AAL2', exp: Date.now() + 8 * 3600000 }));
    const userPayload = { id: localUser.id, email: localUser.email, fullName: localUser.fullName, role: localUser.role, avatar: localUser.avatar };
    const sessionData = { user: userPayload, token: fakeToken, expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
    localStorage.setItem('elitebuild_session', JSON.stringify(sessionData));
    set({ user: userPayload, token: fakeToken, isAuthenticated: true, mfaRequired: false, tempUser: null });
    get().addAuditLog('LOGIN_MFA_SUCCESS_LOCAL', `MFA local validado para ${localUser.email} (AAL2)`);
    return true;
  },

  logout: () => {
    get().addAuditLog('LOGOUT', 'Usuario cerró sesión');
    localStorage.removeItem('elitebuild_session');
    set({ user: null, token: null, isAuthenticated: false, mfaRequired: false, tempUser: null, currentPage: 'dashboard' });
  },

  // Audit Logs Helper
  addAuditLog: (action, details) => {
    const { user } = get();
    const newLog = {
      timestamp: new Date().toISOString(),
      user: user ? user.email : 'system',
      action,
      details
    };
    set(state => ({
      auditLogs: [newLog, ...state.auditLogs.slice(0, 49)]
    }));
  },

  // Project Operations
  createProject: (newProj) => {
    const id = `prj-${Math.random().toString(36).substr(2, 9)}`;
    const project = {
      id,
      progress: 0,
      concreteSensors: 0,
      dronesActive: 0,
      curingRisk: 'Normal',
      ...newProj
    };
    
    set(state => ({
      projects: [...state.projects, project],
      budgets: { ...state.budgets, [id]: [] },
      tasks: { ...state.tasks, [id]: [] }
    }));
    
    get().addAuditLog('PROJECT_CREATE', `Creado proyecto: ${project.name} [${project.code}]`);
    return id;
  },

  // APU Budget modifications
  addApuItem: (projectId, apu) => {
    const id = `apu-${Math.random().toString(36).substr(2, 9)}`;
    const newItem = {
      id,
      ...apu,
      total: Number(apu.quantity) * Number(apu.unitCost)
    };
    
    set(state => {
      const currentList = state.budgets[projectId] || [];
      const updatedList = [...currentList, newItem];
      
      // Update overall project budget based on APUs sum
      const totalBudget = updatedList.reduce((acc, item) => acc + item.total, 0);
      const updatedProjects = state.projects.map(p => 
        p.id === projectId ? { ...p, budget: totalBudget } : p
      );
      
      return {
        budgets: { ...state.budgets, [projectId]: updatedList },
        projects: updatedProjects
      };
    });
    
    get().addAuditLog('BUDGET_ADD_ITEM', `Añadido APU "${apu.description}" al proyecto ${projectId}`);
  },

  // Planning Tasks CRUD
  addTask: (projectId, task) => {
    const id = `tsk-${Math.random().toString(36).substr(2, 9)}`;
    const newTask = {
      id,
      progress: 0,
      isCritical: false,
      dependencies: [],
      ...task
    };
    
    set(state => {
      const current = state.tasks[projectId] || [];
      return {
        tasks: { ...state.tasks, [projectId]: [...current, newTask] }
      };
    });
    
    get().addAuditLog('TASK_CREATE', `Añadida tarea de Gantt: ${task.title}`);
  },

  updateTaskProgress: (projectId, taskId, progress) => {
    set(state => {
      const current = state.tasks[projectId] || [];
      const updated = current.map(t => 
        t.id === taskId ? { ...t, progress: Number(progress) } : t
      );
      
      // Calculate overall project progress from tasks average progress weighted or simple
      const avgProgress = updated.reduce((acc, t) => acc + t.progress, 0) / (updated.length || 1);
      const updatedProjects = state.projects.map(p => 
        p.id === projectId ? { ...p, progress: Math.round(avgProgress * 10) / 10 } : p
      );
      
      return {
        tasks: { ...state.tasks, [projectId]: updated },
        projects: updatedProjects
      };
    });
    get().addAuditLog('TASK_UPDATE', `Progreso de tarea ${taskId} actualizado a ${progress}%`);
  },

  // Inspection Operations
  addInspection: (inspection) => {
    const id = `insp-${Math.random().toString(36).substr(2, 9)}`;
    const newInsp = {
      id,
      date: new Date().toISOString(),
      ...inspection
    };
    set(state => ({
      inspections: [newInsp, ...state.inspections]
    }));
    get().addAuditLog('INSPECTION_ADD', `Registrada inspección en área ${inspection.area} con resultado ${inspection.status}`);
  },

  // Document management
  signDocument: (docId) => {
    const { user } = get();
    set(state => ({
      documents: state.documents.map(d => 
        d.id === docId ? { ...d, signed: true, author: user ? user.fullName : d.author } : d
      )
    }));
    get().addAuditLog('DOC_SIGN', `Firma digital estampa en documento ${docId}`);
  }
}));
