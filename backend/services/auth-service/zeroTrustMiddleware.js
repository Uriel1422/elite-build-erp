const jwt = require('jsonwebtoken');

// Clave secreta (en prod vendría de un Vault)
const JWT_SECRET = process.env.JWT_SECRET || 'military-grade-super-secret-key-256';

/**
 * Zero-Trust Architecture Middleware
 * Valida no solo el token JWT, sino el nivel de garantía de identidad (AAL).
 */
const requireZeroTrustAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Zero-Trust Policy: Token ausente o formato inválido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificación Zero-Trust estricta: Se requiere haber superado MFA (Multi-Factor)
    if (decoded.aal !== 'AAL2' && decoded.aal !== 'AAL3') {
      return res.status(403).json({ 
        error: 'Zero-Trust Policy: Nivel de Autenticación Insuficiente. Se requiere Biometría o Llave FIDO2 (MFA).' 
      });
    }

    // Comprobación de IP anómala o huella de dispositivo (Simulado)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (decoded.registeredIp && decoded.registeredIp !== clientIp) {
      // En un caso real, esto dispararía un flag en el sistema de analítica de amenazas.
      console.warn(`[THREAT INTEL] Intento de acceso desde IP anómala: ${clientIp}`);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Zero-Trust Policy: Token expirado o firma criptográfica inválida.' });
  }
};

module.exports = {
  requireZeroTrustAuth,
  JWT_SECRET
};
