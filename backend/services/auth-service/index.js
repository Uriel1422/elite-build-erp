const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const { requireZeroTrustAuth, JWT_SECRET } = require('./zeroTrustMiddleware');
const { generateHash } = require('../../shared/crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Seguridad a nivel HTTP
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mock DB Users con información de seguridad
const usersDb = [
  {
    id: 'usr-admin-111',
    email: 'admin@elitebuild.com',
    passwordHash: bcrypt.hashSync('Admin123!', 10),
    fullName: 'Ing. Carlos Mendoza',
    role: 'Super Admin',
    mfaEnabled: true,
    mfaSecret: 'JBSWY3DPEHPK3PXP'
  },
  {
    id: 'usr-eng-222',
    email: 'ingeniero@elitebuild.com',
    passwordHash: bcrypt.hashSync('Ingeniero123!', 10),
    fullName: 'Dra. Laura Torres',
    role: 'Ingeniero Civil',
    // Simularemos que se requiere biometría o MFA estricto para perfiles de ingeniería alta
    mfaEnabled: true 
  }
];

// Helper to sign JWT con Nivel de Garantía (AAL - Authenticator Assurance Level)
const signToken = (user, aalLevel, req) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      aal: aalLevel, // AAL1: Password, AAL2: Password + TOTP/SMS, AAL3: Biometric/FIDO2
      registeredIp: clientIp,
      sessionHash: generateHash({ id: user.id, ip: clientIp, time: Date.now() }) // Trazabilidad blockchain
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
};

// --- RUTAS DE AUTENTICACIÓN ---

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service (Zero-Trust Enabled)', timestamp: new Date() });
});

// 1. Primer factor: Contraseña
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

  const user = usersDb.find(u => u.email === email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Credenciales inválidas o cuenta bloqueada.' });
  }

  // Zero-Trust: Siempre exigimos un segundo factor para cuentas corporativas
  if (user.mfaEnabled) {
    return res.json({
      mfaRequired: true,
      tempToken: jwt.sign({ tempId: user.id }, JWT_SECRET, { expiresIn: '5m' }),
      message: 'Token Biométrico o Llave FIDO2 requerida (Simulado MFA)'
    });
  }

  // Solo para cuentas invitadas de bajo riesgo (AAL1)
  const token = signToken(user, 'AAL1', req);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// 2. Segundo factor: MFA / Biometría
app.post('/mfa/verify', (req, res) => {
  const { tempToken, code } = req.body;
  if (!tempToken || !code) return res.status(400).json({ error: 'Token temporal y código MFA requeridos' });

  try {
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    const user = usersDb.find(u => u.id === decoded.tempId);
    
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado en BBDD' });

    // Aceptamos un código de prueba para el MVP
    if (code !== '123456') return res.status(401).json({ error: 'Firma biométrica / MFA incorrecta' });

    // Elevación de privilegios a AAL2 tras MFA exitoso
    const token = signToken(user, 'AAL2', req);
    res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      securityLevel: 'AAL2_MFA_VERIFIED'
    });
  } catch (err) {
    res.status(401).json({ error: 'Intento de hijacking de sesión: Token MFA inválido o expirado' });
  }
});

// Endpoint seguro para validación entre microservicios
app.get('/verify-token', requireZeroTrustAuth, (req, res) => {
  // Si pasa el middleware, la sesión es AAL2+ y legítima
  res.json({ valid: true, user: req.user, securityLevel: req.user.aal });
});

app.listen(PORT, () => {
  console.log(`[EliteBuild Auth Service - Zero Trust Engine] listening on port ${PORT}`);
});
