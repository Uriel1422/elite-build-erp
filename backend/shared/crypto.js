const crypto = require('crypto');

// En un entorno de producción real, esto vendría de un AWS KMS o un Hardware Security Module (HSM)
// Para efectos del MVP, usamos una variable de entorno o una llave estática segura.
const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

/**
 * Encripta texto plano usando AES-256-GCM
 * @param {string} text 
 * @returns {string} Texto encriptado con IV y AuthTag en formato base64
 */
function encryptData(text) {
  if (!text) return text;
  
  // El Vector de Inicialización (IV) debe ser único para cada encriptación
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Tag de autenticación para GCM (asegura que el texto no ha sido manipulado)
  const authTag = cipher.getAuthTag();

  // Devolvemos el IV + AuthTag + Texto Encriptado
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/**
 * Desencripta texto cifrado usando AES-256-GCM
 * @param {string} encryptedData 
 * @returns {string} Texto original
 */
function decryptData(encryptedData) {
  if (!encryptedData) return encryptedData;

  const parts = encryptedData.split(':');
  if (parts.length !== 3) throw new Error('Formato de dato encriptado inválido.');

  const iv = Buffer.from(parts[0], 'base64');
  const authTag = Buffer.from(parts[1], 'base64');
  const encryptedText = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Genera un Hash criptográfico SHA-256 para validación de inmutabilidad (Blockchain Ledger)
 * @param {Object} dataPayload 
 * @returns {string} Hash hexadecimal
 */
function generateHash(dataPayload) {
  return crypto.createHash('sha256').update(JSON.stringify(dataPayload)).digest('hex');
}

module.exports = {
  encryptData,
  decryptData,
  generateHash
};
