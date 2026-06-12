const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { encryptData, decryptData } = require('../../shared/crypto');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Mock database projects (Datos financieros cifrados At-Rest)
const projectsDb = [
  {
    id: 'prj-skyline-101',
    name: 'Torre Skyline Vitacura',
    code: 'TSV-2026',
    location: 'Av. Vitacura 4500, Santiago',
    latitude: -33.4075,
    longitude: -70.5888,
    status: 'En Progreso',
    // Cifrado AES-256-GCM para presupuestos de alta confidencialidad
    encryptedBudget: encryptData('45000000.00'), 
    progress: 68.5,
    startDate: '2025-01-10',
    endDate: '2026-12-15'
  },
  {
    id: 'prj-nordic-202',
    name: 'Condominio Lagos del Sur',
    code: 'CLS-2026',
    location: 'Ruta 225, Puerto Varas',
    latitude: -41.3178,
    longitude: -72.9855,
    status: 'Planificación',
    encryptedBudget: encryptData('18200000.00'),
    progress: 12.0,
    startDate: '2026-06-01',
    endDate: '2028-02-28'
  }
];

// APUs Mock Data (Datos cifrados)
const budgetApus = {
  'prj-skyline-101': [
    { id: 'apu-1', category: 'Obras Civiles', code: 'CIV-01', description: 'Excavación masiva en suelo duro', unit: 'm3', quantity: 2400, encryptedUnitCost: encryptData('15.50') },
    { id: 'apu-2', category: 'Obras Civiles', code: 'CIV-02', description: 'Hormigón armado en fundaciones H-30', unit: 'm3', quantity: 850, encryptedUnitCost: encryptData('185.00') },
    { id: 'apu-3', category: 'Terminaciones', code: 'TER-01', description: 'Revestimiento cerámico premium en baños', unit: 'm2', quantity: 1200, encryptedUnitCost: encryptData('32.80') }
  ]
};

// Zero-Trust Auth middleware mock (Valida Tokens del Gateway)
const checkAuth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Military-Grade Security: Access Denied. Token ausente.' });
  }
  // En un entorno real validaría la firma JWT contra la clave pública del auth-service
  next();
};

// --- ROUTES ---

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'project-service (Crypto Enabled)', timestamp: new Date() });
});

// List Projects (Desencripta al vuelo si el usuario tiene permiso)
app.get('/', checkAuth, (req, res) => {
  const safeProjects = projectsDb.map(p => ({
    ...p,
    budget: parseFloat(decryptData(p.encryptedBudget))
  }));
  res.json(safeProjects);
});

// Get Project Details
app.get('/:id', checkAuth, (req, res) => {
  const prj = projectsDb.find(p => p.id === req.params.id);
  if (!prj) return res.status(404).json({ error: 'Proyecto no encontrado' });
  
  const safePrj = { ...prj, budget: parseFloat(decryptData(prj.encryptedBudget)) };
  res.json(safePrj);
});

// Get Budget/APU
app.get('/:id/budget', checkAuth, (req, res) => {
  const apus = budgetApus[req.params.id] || [];
  const safeApus = apus.map(a => ({
    ...a,
    unitCost: parseFloat(decryptData(a.encryptedUnitCost))
  }));
  res.json(safeApus);
});

// Create Project (Encripta al guardar)
app.post('/', checkAuth, (req, res) => {
  const { name, code, location, budget, startDate, endDate } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Nombre y Código son requeridos' });
  }
  const newPrj = {
    id: `prj-${Math.random().toString(36).substr(2, 9)}`,
    name,
    code,
    location: location || '',
    latitude: -33.4075 + (Math.random() - 0.5) * 0.1,
    longitude: -70.5888 + (Math.random() - 0.5) * 0.1,
    status: 'Planificación',
    encryptedBudget: encryptData(budget.toString()),
    progress: 0,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || ''
  };
  projectsDb.push(newPrj);
  res.status(201).json({ ...newPrj, budget: parseFloat(budget) }); // Devuelve desencriptado
});

app.listen(PORT, () => {
  console.log(`[EliteBuild Project Service - Crypto Engine] listening on port ${PORT}`);
});
