-- ==========================================
-- ELITEBUILD ERP - BLOCKCHAIN IMMUTABLE LEDGER
-- Nivel de Seguridad: Military-Grade Zero Trust
-- ==========================================

-- Tabla del Libro Mayor Inmutable (Append-Only)
-- Ningún registro puede ser actualizado (UPDATE) o eliminado (DELETE).
CREATE TABLE IF NOT EXISTS audit_blockchain_ledger (
    block_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    previous_hash VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Identidad verificada (Zero Trust)
    actor_user_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- ej: 'APPROVE_BUDGET', 'UPDATE_BIM_MODEL', 'SIGN_INSPECTION'
    
    -- Datos cifrados (AES-256-GCM base64 string)
    encrypted_payload TEXT NOT NULL,
    
    -- Hash criptográfico de este bloque (SHA-256 de: previous_hash + timestamp + actor + payload)
    block_hash VARCHAR(64) NOT NULL UNIQUE
);

-- Trigger para garantizar que la tabla sea Append-Only a nivel de base de datos
CREATE OR REPLACE FUNCTION prevent_ledger_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'ALERTA DE SEGURIDAD CRÍTICA: Operación denegada. El libro mayor blockchain es inmutable y no permite modificaciones ni borrados (Append-Only).';
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger para evitar UPDATE
CREATE TRIGGER prevent_ledger_update
BEFORE UPDATE ON audit_blockchain_ledger
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_tampering();

-- Aplicar trigger para evitar DELETE
CREATE TRIGGER prevent_ledger_delete
BEFORE DELETE ON audit_blockchain_ledger
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_tampering();
