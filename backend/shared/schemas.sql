-- ==========================================
-- ELITEBUILD ERP - DATABASE ARCHITECTURE
-- PostgreSQL Schemas (Relational & Financial Data)
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES & PERMISSIONS (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
('Super Admin', 'Acceso total al sistema y configuraciones críticas'),
('Ingeniero Civil', 'Gestión de proyectos, planificación, control técnico e IA'),
('Arquitecto', 'Gestión de planos, modelos BIM 3D y especificaciones'),
('Supervisor', 'Inspección de obras en terreno, reportes de incidencias y check-ins'),
('Contratista', 'Visualización de tareas asignadas e ingreso de avances'),
('Cliente', 'Acceso de solo lectura a avances, reportes y finanzas'),
('Auditor', 'Inspección financiera, logs y cumplimiento de normativas')
ON CONFLICT (name) DO NOTHING;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role_id UUID REFERENCES roles(id),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    location VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Planificación', -- Planificación, En Progreso, Detenido, Finalizado
    budget NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- BUDGETS & QUANTITY TAKEOFFS (APU)
CREATE TABLE IF NOT EXISTS budget_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    order_index INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS apu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES budget_categories(id) ON DELETE CASCADE,
    code VARCHAR(50),
    description TEXT NOT NULL,
    unit VARCHAR(20) NOT NULL, -- m3, m2, kg, global, etc.
    quantity NUMERIC(12, 3) NOT NULL DEFAULT 0.000,
    unit_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_cost NUMERIC(15, 2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GANTT PLANNING (TASKS & CRITICAL PATH)
CREATE TABLE IF NOT EXISTS gantt_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    progress NUMERIC(5, 2) DEFAULT 0.00, -- 0.00 to 100.00
    dependencies UUID[] DEFAULT '{}', -- Array of parent task UUIDs
    assigned_to UUID REFERENCES users(id),
    color VARCHAR(20) DEFAULT '#3B82F6',
    is_critical_path BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PERSONNEL CONTROL (ATTENDANCE & GEOLOCATION)
CREATE TABLE IF NOT EXISTS personnel_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    check_in TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    check_out TIMESTAMP WITH TIME ZONE,
    latitude_in DOUBLE PRECISION,
    longitude_in DOUBLE PRECISION,
    latitude_out DOUBLE PRECISION,
    longitude_out DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'Presente' -- Presente, Tarde, Ausente, Justificado
);

-- INSPECTIONS & SUPERVISION (MOBILE FIRST)
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES users(id) ON DELETE SET NULL,
    inspection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    area VARCHAR(100) NOT NULL,
    result VARCHAR(50) DEFAULT 'Pendiente', -- Aprobado, Con Observaciones, Rechazado, Pendiente
    notes TEXT,
    photos VARCHAR[] DEFAULT '{}', -- S3 URL Array
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- MongoDB Schemas (Document JSON Templates)
-- ==========================================

/*
  1. Colección: 'technical_documents'
  Almacena planos IFC, DWG, PDF y sus metadatos de versión y firmas digitales.
  {
    "_id": ObjectId("..."),
    "project_id": "uuid-proyecto",
    "filename": "plano_estructural_nivel_1.ifc",
    "version": "v2.1",
    "uploaded_by": "uuid-usuario",
    "file_url": "s3://elitebuild-bucket/docs/plano_estructural_nivel_1.ifc",
    "file_size": 25489000,
    "ocr_data": {
      "detected_text": "CIMIENTOS CORRIDOS TIPO C-1 CONCRETO H-20...",
      "confidence": 0.94
    },
    "digital_signatures": [
      {
        "signer_id": "uuid-ingeniero",
        "name": "Ing. Carlos Mendoza",
        "timestamp": ISODate("2026-05-25T12:00:00Z"),
        "signature_hash": "sha256-hash..."
      }
    ],
    "history": [
      { "version": "v1.0", "date": ISODate("2026-05-10Z"), "author": "uuid..." }
    ]
  }

  2. Colección: 'audit_logs'
  Auditoría de alta granularidad a nivel empresarial para el cumplimiento de RBAC y WAF.
  {
    "_id": ObjectId("..."),
    "timestamp": ISODate("2026-05-25T14:42:00Z"),
    "user_id": "uuid-usuario",
    "user_email": "supervisor@elitebuild.com",
    "role": "Supervisor",
    "ip_address": "192.168.10.45",
    "user_agent": "Mozilla/5.0 ...",
    "action": "APPROVE_INSPECTION",
    "resource": "inspections/uuid-inspeccion",
    "status": "SUCCESS",
    "details": {
      "notes": "Aprobación de fraguado de concreto en sector B"
    }
  }

  3. Colección: 'ai_estimations_log'
  Registra predicciones de IA para auditoría de decisiones y optimización de algoritmos.
  {
    "_id": ObjectId("..."),
    "project_id": "uuid-proyecto",
    "run_date": ISODate("2026-05-25T14:45:00Z"),
    "inputs": {
      "curing_days": 7,
      "concrete_grade": "H-30",
      "measured_temperature": [22.4, 21.8, 25.1, 19.8]
    },
    "predictions": {
      "curing_strength_mpa": 28.4,
      "days_to_target_90percent": 12,
      "risk_factor": "Bajo"
    }
  }
*/
