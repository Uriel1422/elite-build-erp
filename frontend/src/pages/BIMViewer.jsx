import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Layers, RotateCcw, ZoomIn, ZoomOut, Scissors, Eye, AlertTriangle, 
  Compass, Upload, Sliders, Box, Trash2, Cpu 
} from 'lucide-react';
import { useEliteStore } from '../store/useEliteStore';

// Plano de Corte Dinámico
const globalPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 4.5);

// Animación del Marcador de Colisión
function ClashMarker({ position, onSelect, material }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.elapsedTime * 6) * 0.25;
    if (ref.current) ref.current.scale.set(s, s, s);
  });
  return (
    <mesh 
      ref={ref} 
      position={position} 
      material={material}
      onClick={(e) => { 
        e.stopPropagation(); 
        onSelect({ 
          name: '¡COLISIÓN CRÍTICA! Ducto HVAC vs Losa de Concreto', 
          type: 'Clash Interference', 
          volume: '0.12 m³', 
          material: 'Interferencia' 
        }); 
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <sphereGeometry args={[0.4, 32, 32]} />
      <Html distanceFactor={15}>
        <div className="bg-error/20 border border-error text-error text-[8px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md animate-pulse">
          CLASH-042
        </div>
      </Html>
    </mesh>
  );
}

// Generador Paramétrico de la Torre (Skyline Tower)
function SkylineTower({ layers, clippingPlane, onSelect, materials, fpsLimit }) {
  const groupRef = useRef();
  const lastFrameTime = useRef(0);

  // Animación controlada por el límite de FPS
  useFrame(({ clock }) => {
    const limit = fpsLimit === '30' ? 30 : fpsLimit === '60' ? 60 : 0;
    if (limit > 0) {
      const elapsed = clock.getElapsedTime();
      const delta = elapsed - lastFrameTime.current;
      if (delta < 1 / limit) return;
      lastFrameTime.current = elapsed;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Aplicar motor de corte (Clipping) a nivel de shader
  useMemo(() => {
    Object.values(materials).forEach(mat => {
      if (mat) {
        mat.clippingPlanes = clippingPlane ? [globalPlane] : [];
        mat.needsUpdate = true;
      }
    });
  }, [clippingPlane, materials]);

  return (
    <group ref={groupRef} position={[0, -4, 0]}>
      {/* 1. Capa Estructural */}
      {layers.structures && (
        <group name="Estructuras">
          {/* Núcleo Ascensores */}
          <mesh 
            position={[0, 5, 0]} 
            material={materials.concrete}
            onClick={(e) => { 
              e.stopPropagation(); 
              onSelect({ name: 'Núcleo Central de Ascensores', type: 'IfcWall', volume: '345.6 m³', material: 'Concreto Armado f\'c 350' }); 
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'} 
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <boxGeometry args={[3, 10, 3]} />
          </mesh>
          
          {/* Losas */}
          {[0, 3.3, 6.6, 9.9].map((y, i) => (
            <mesh 
              key={`slab-${i}`} 
              position={[0, y, 0]} 
              material={materials.concrete} 
              onClick={(e) => { 
                e.stopPropagation(); 
                onSelect({ name: `Losa de Entrepiso Nivel ${i+1}`, type: 'IfcSlab', volume: '85.2 m³', material: 'Concreto Postensado' }); 
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'} 
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              <boxGeometry args={[12, 0.3, 12]} />
            </mesh>
          ))}

          {/* Columnas Perimetrales */}
          {[-5.5, 0, 5.5].map(x => 
            [-5.5, 0, 5.5].map(z => {
              if (x === 0 && z === 0) return null; // Evitar el núcleo
              return (
                <mesh 
                  key={`col-${x}-${z}`} 
                  position={[x, 5, z]} 
                  material={materials.steel}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onSelect({ name: `Columna Maestra ${x > 0 ? 'Este' : 'Oeste'}`, type: 'IfcColumn', volume: '4.8 m³', material: 'Acero ASTM A992' }); 
                  }}
                  onPointerOver={() => document.body.style.cursor = 'pointer'} 
                  onPointerOut={() => document.body.style.cursor = 'auto'}
                >
                  <boxGeometry args={[0.6, 10, 0.6]} />
                </mesh>
              );
            })
          )}
        </group>
      )}

      {/* 2. Capa MEP */}
      {layers.mep && (
        <group name="MEP">
          {/* HVAC Duct - Vertical */}
          <mesh 
            position={[2, 5, -2]} 
            material={materials.hvac}
            onClick={(e) => { 
              e.stopPropagation(); 
              onSelect({ name: 'Ducto Extracción HVAC Principal', type: 'IfcDuctSegment', volume: '12.5 m³', material: 'Acero Galvanizado' }); 
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'} 
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <cylinderGeometry args={[0.4, 0.4, 10, 16]} />
          </mesh>
          {/* HVAC Duct - Horizontal P2 */}
          <mesh 
            position={[0, 2.5, -2]} 
            rotation={[0, 0, Math.PI / 2]} 
            material={materials.hvac}
            onClick={(e) => { 
              e.stopPropagation(); 
              onSelect({ name: 'Ramal Distribución Clima P2', type: 'IfcDuctSegment', volume: '3.1 m³', material: 'Acero Galvanizado' }); 
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'} 
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <cylinderGeometry args={[0.3, 0.3, 11, 16]} />
          </mesh>
          
          {/* Electrical Tray */}
          <mesh 
            position={[-2, 5.8, 2]} 
            rotation={[Math.PI / 2, 0, 0]} 
            material={materials.electrical}
            onClick={(e) => { 
              e.stopPropagation(); 
              onSelect({ name: 'Bandeja Portacables Alta Tensión', type: 'IfcCableCarrierSegment', volume: '1.8 m³', material: 'Aluminio Anodizado' }); 
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'} 
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <cylinderGeometry args={[0.2, 0.2, 11, 8]} />
          </mesh>
          
          {/* Detección de Colisión Activa */}
          <ClashMarker position={[0, 3.3, -2]} onSelect={onSelect} material={materials.clash} />
        </group>
      )}

      {/* 3. Capa Arquitectura (Muro Cortina Cristal) */}
      {layers.arch && (
        <group name="Arquitectura">
          <mesh 
            position={[0, 5, 0]} 
            material={materials.glass}
            onClick={(e) => { 
              e.stopPropagation(); 
              onSelect({ name: 'Envolvente Muro Cortina', type: 'IfcCurtainWall', volume: '350.5 m³', material: 'Cristal Low-E Doble Panel' }); 
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'} 
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <boxGeometry args={[12.5, 10.2, 12.5]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Modelo 3D Alternativo (Importado: Puente de Acero y Concreto)
function BridgeStructure({ layers, clippingPlane, onSelect, materials, fpsLimit }) {
  const groupRef = useRef();
  const lastFrameTime = useRef(0);

  useFrame(({ clock }) => {
    const limit = fpsLimit === '30' ? 30 : fpsLimit === '60' ? 60 : 0;
    if (limit > 0) {
      const elapsed = clock.getElapsedTime();
      const delta = elapsed - lastFrameTime.current;
      if (delta < 1 / limit) return;
      lastFrameTime.current = elapsed;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Pillars de Concreto */}
      {layers.structures && (
        <group name="Pillars">
          {[-5, 5].map((x) => (
            <mesh 
              key={x} 
              position={[x, -1, 0]} 
              material={materials.concrete}
              onClick={(e) => { 
                e.stopPropagation(); 
                onSelect({ name: `Pilar de Concreto ${x > 0 ? 'Este' : 'Oeste'}`, type: 'IfcSubstructure', volume: '115.0 m³', material: 'Concreto H-40' }); 
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'} 
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              <boxGeometry args={[1.6, 4, 3]} />
            </mesh>
          ))}
          {/* Tablero Vial */}
          <mesh 
            position={[0, 1.1, 0]} 
            material={materials.concrete}
            onClick={(e) => { 
              e.stopPropagation(); 
              onSelect({ name: 'Tablero Vial del Puente', type: 'IfcBridgeDeck', volume: '320.0 m³', material: 'Concreto Pretensado' }); 
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'} 
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <boxGeometry args={[16, 0.4, 3.5]} />
          </mesh>
        </group>
      )}

      {/* Arcos Metálicos y Cables */}
      {layers.arch && (
        <group name="Arcos">
          {/* Arco Principal */}
          <mesh 
            position={[0, 2.5, 0]} 
            rotation={[0, 0, Math.PI / 2]} 
            material={materials.steel}
            onClick={(e) => { 
              e.stopPropagation(); 
              onSelect({ name: 'Arco de Acero Superior', type: 'IfcStructuralMember', volume: '25.4 m³', material: 'Acero A572' }); 
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'} 
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <cylinderGeometry args={[3.2, 3.2, 3.5, 32, 1, true, -Math.PI / 2, Math.PI]} />
          </mesh>
          {/* Cables Tensores */}
          {[-4, -2, 0, 2, 4].map((x) => (
            <mesh 
              key={x} 
              position={[x, 2, 0]} 
              material={materials.steel}
            >
              <cylinderGeometry args={[0.06, 0.06, 1.8, 8]} />
            </mesh>
          ))}
        </group>
      )}

      {/* Instalaciones y Luces */}
      {layers.mep && (
        <group name="Sistemas">
          {/* Sensores IoT del Puente */}
          <mesh 
            position={[0, 1.4, 0]} 
            material={materials.electrical}
            onClick={(e) => { 
              e.stopPropagation(); 
              onSelect({ name: 'Tablero de Telemetría e Inclinómetro', type: 'IfcDistributionBoard', volume: '0.4 m³', material: 'Aluminio Anodizado' }); 
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'} 
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <boxGeometry args={[0.5, 0.6, 0.5]} />
          </mesh>
          {/* Marcador de Colisión en Puente */}
          <ClashMarker position={[2, 1.1, 0]} onSelect={onSelect} material={materials.clash} />
        </group>
      )}
    </group>
  );
}

export default function BIMViewer() {
  const { addAuditLog } = useEliteStore();
  
  // Capas del visor
  const [layers, setLayers] = useState({ structures: true, mep: true, arch: true });
  const [clippingPlane, setClippingPlane] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const controlsRef = useRef(null);

  // FPS y Calidad de texturas
  const [fpsLimit, setFpsLimit] = useState('Unlimited');
  const [textureQuality, setTextureQuality] = useState('High');
  const [liveFps, setLiveFps] = useState(72);

  // Importar modelo
  const [importedModel, setImportedModel] = useState(null);
  const [importProgress, setImportProgress] = useState(null);
  const [importStatusText, setImportStatusText] = useState('');
  const fileInputRef = useRef(null);

  // Clasificación de materiales y Highlight
  const [highlightedMaterial, setHighlightedMaterial] = useState(null);

  // Simulación de FPS dinámicos fluctuantes
  useEffect(() => {
    const t = setInterval(() => {
      setLiveFps(prev => {
        if (fpsLimit === '30') return Math.floor(29.5 + Math.random() * 1.0);
        if (fpsLimit === '60') return Math.floor(59.2 + Math.random() * 1.5);
        return Math.floor(70.0 + Math.random() * 5.0);
      });
    }, 800);
    return () => clearInterval(t);
  }, [fpsLimit]);

  useEffect(() => {
    addAuditLog('BIM_VIEWER_R3F_INIT', 'Carga del motor React Three Fiber completada con éxito.');
  }, [addAuditLog]);

  // Generador de materiales dinámicos basados en la calidad y el resaltado
  const activeMaterials = useMemo(() => {
    let base = {};
    
    // 1. Definición por nivel de calidad
    if (textureQuality === 'Low') {
      base = {
        glass: new THREE.MeshBasicMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
        concrete: new THREE.MeshBasicMaterial({ color: 0x5a6a7c, side: THREE.DoubleSide }),
        steel: new THREE.MeshBasicMaterial({ color: 0x2e353f }),
        hvac: new THREE.MeshBasicMaterial({ color: 0x059669 }),
        electrical: new THREE.MeshBasicMaterial({ color: 0xd97706 }),
        clash: new THREE.MeshBasicMaterial({ color: 0xdc2626, transparent: true, opacity: 0.8 })
      };
    } else if (textureQuality === 'Medium') {
      base = {
        glass: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.75, roughness: 0.15, metalness: 0.4, side: THREE.DoubleSide }),
        concrete: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, metalness: 0.15, side: THREE.DoubleSide }),
        steel: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.7 }),
        hvac: new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 }),
        electrical: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }),
        clash: new THREE.MeshStandardMaterial({ color: 0xef4444, transparent: true, opacity: 0.8, emissive: 0xef4444, emissiveIntensity: 0.6 })
      };
    } else {
      // Alta calidad (Fotorrealista con reflexiones físicas complejas)
      base = {
        glass: new THREE.MeshPhysicalMaterial({
          color: 0x1e3a8a, transmission: 0.95, opacity: 1, metalness: 0.2, roughness: 0.05, 
          ior: 1.5, thickness: 1.5, transparent: true, side: THREE.DoubleSide
        }),
        concrete: new THREE.MeshStandardMaterial({ 
          color: 0x475569, roughness: 0.9, metalness: 0.1, side: THREE.DoubleSide 
        }),
        steel: new THREE.MeshStandardMaterial({ 
          color: 0x0f172a, roughness: 0.4, metalness: 0.8 
        }),
        hvac: new THREE.MeshStandardMaterial({ 
          color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.4, roughness: 0.2 
        }),
        electrical: new THREE.MeshStandardMaterial({ 
          color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.4, roughness: 0.2 
        }),
        clash: new THREE.MeshStandardMaterial({ 
          color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 2, transparent: true, opacity: 0.9 
        })
      };
    }

    // 2. Modificaciones de Opacidad para destacar materiales (Highlight)
    if (!highlightedMaterial) return base;

    const modified = {};
    Object.keys(base).forEach(key => {
      const orig = base[key];
      const cloned = orig.clone();
      
      if (key !== highlightedMaterial) {
        cloned.transparent = true;
        cloned.opacity = 0.12;
        if (cloned.transmission) cloned.transmission = 0; // Apagar cristales traslúcidos
      } else {
        // Resaltar elemento
        cloned.transparent = false;
        if (cloned.emissive) {
          cloned.emissive = new THREE.Color(cloned.color);
          cloned.emissiveIntensity = 0.9;
        } else {
          cloned.color.multiplyScalar(1.4);
        }
      }
      modified[key] = cloned;
    });

    return modified;
  }, [textureQuality, highlightedMaterial]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Simulación de carga e importación del archivo
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportProgress(1);
    setImportStatusText('Leyendo archivo de diseño...');

    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImportedModel({
            name: file.name,
            type: file.name.endsWith('.ifc') ? 'Modelo Estructural IFC 4.3' : 'Objeto 3D Importado',
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          });
          setImportProgress(null);
          addAuditLog('BIM_IMPORT_SUCCESS', `Modelo 3D importado con éxito: ${file.name}`);
          return null;
        }

        // Simular diferentes estados de lectura
        if (prev === 20) setImportStatusText('Parseando mallas 3D y vértices...');
        if (prev === 40) setImportStatusText('Leyendo jerarquía de clases IFC...');
        if (prev === 65) setImportStatusText('Validando materiales y volumetrías...');
        if (prev === 85) setImportStatusText('Enviando buffer a GPU para renderizado...');

        return prev + 5;
      });
    }, 150);
  };

  const clearImportedModel = () => {
    setImportedModel(null);
    setSelectedElement(null);
    addAuditLog('BIM_RESET_MODEL', 'Restablecido al modelo Skyline Tower por defecto.');
  };

  // Metadatos de clasificación de materiales
  const materialBreakdown = useMemo(() => {
    if (importedModel) {
      return [
        { key: 'concrete', name: 'Concreto H-40', volume: '230.0 m³', color: 'bg-[#475569]' },
        { key: 'steel', name: 'Acero Estructural A572', volume: '25.4 m³ (20 Tons)', color: 'bg-[#0f172a]' },
        { key: 'electrical', name: 'Instalaciones / Sensores', volume: '0.4 m³', color: 'bg-[#f59e0b]' }
      ];
    }
    return [
      { key: 'concrete', name: 'Concreto Postensado H-35', volume: '686.4 m³', color: 'bg-[#475569]' },
      { key: 'steel', name: 'Acero Estructural A992', volume: '43.2 m³ (34 Tons)', color: 'bg-[#0f172a]' },
      { key: 'glass', name: 'Cristal Templado Low-E', volume: '350.5 m³', color: 'bg-[#1e3a8a]' },
      { key: 'hvac', name: 'Acero Galvanizado (HVAC)', volume: '15.6 m³', color: 'bg-[#10b981]' },
      { key: 'electrical', name: 'Aluminio Anodizado', volume: '1.8 m³', color: 'bg-[#f59e0b]' }
    ];
  }, [importedModel]);

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider flex items-center gap-2">
            <Layers className="text-neon" /> Visor Digital Twin 4D (R3F Engine)
          </h2>
          <p className="text-xs text-titanium-500 mt-1">Renderizado hiperrealista de gemelo digital con materiales físicos y Raycasting interactivo.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertTriangle size={14} className="animate-pulse" />
            1 Colisión Crítica
          </span>
        </div>
      </div>

      {/* Workspace de Trabajo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Panel de Control Lateral */}
        <div className="glass-panel p-5 rounded-2xl space-y-6 lg:col-span-1 border border-titanium-800/50 relative overflow-hidden flex flex-col justify-between min-h-[600px]">
          {/* Brillo de fondo estético */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon/10 rounded-full blur-[40px] pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Controles de Rendimiento */}
            <div>
              <h3 className="text-xs font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sliders size={14} className="text-neon" /> Configuración de Motor
              </h3>
              <div className="space-y-3">
                {/* Selector FPS */}
                <div className="space-y-1">
                  <label className="text-[10px] text-titanium-500 font-bold uppercase">Límite de Renderizado (FPS)</label>
                  <select 
                    value={fpsLimit} 
                    onChange={(e) => setFpsLimit(e.target.value)}
                    className="w-full bg-carbon-900 border border-titanium-800 rounded-xl px-3 py-2 text-xs text-smoke font-semibold focus:outline-none focus:border-neon cursor-pointer"
                  >
                    <option value="Unlimited">Ilimitado (V-Sync)</option>
                    <option value="60">60 FPS (Estándar)</option>
                    <option value="30">30 FPS (Ahorro Energía)</option>
                  </select>
                </div>
                {/* Selector Textura */}
                <div className="space-y-1">
                  <label className="text-[10px] text-titanium-500 font-bold uppercase">Calidad de Texturas</label>
                  <select 
                    value={textureQuality} 
                    onChange={(e) => setTextureQuality(e.target.value)}
                    className="w-full bg-carbon-900 border border-titanium-800 rounded-xl px-3 py-2 text-xs text-smoke font-semibold focus:outline-none focus:border-neon cursor-pointer"
                  >
                    <option value="High">Alta (Materiales Físicos HDR)</option>
                    <option value="Medium">Media (Sombreadores Estándar)</option>
                    <option value="Low">Baja (Albedo color sólido)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Importador de Modelos 3D */}
            <div>
              <h3 className="text-xs font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2">
                <Upload size={14} className="text-neon" /> Importar Modelo BIM
              </h3>
              {importedModel ? (
                <div className="p-3 rounded-xl bg-carbon-900 border border-neon/30 text-xs space-y-2.5">
                  <div>
                    <span className="text-[10px] text-titanium-500 block uppercase">Modelo Activo</span>
                    <span className="font-semibold text-smoke truncate block">{importedModel.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-neon">{importedModel.type}</span>
                    <span className="text-titanium-500">{importedModel.size}</span>
                  </div>
                  <button 
                    onClick={clearImportedModel}
                    className="w-full py-2 bg-error/10 hover:bg-error/20 border border-error/30 text-error rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={12} />
                    Remover Modelo
                  </button>
                </div>
              ) : importProgress !== null ? (
                <div className="p-4 rounded-xl bg-carbon-900 border border-titanium-800 text-xs space-y-2 animate-pulse">
                  <span className="text-[10px] text-neon font-bold uppercase block">{importStatusText}</span>
                  <div className="w-full bg-titanium-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-neon h-2 rounded-full transition-all duration-150" style={{ width: `${importProgress}%` }}></div>
                  </div>
                  <span className="text-[10px] text-titanium-500 block text-right">{importProgress}% completado</span>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-titanium-800 hover:border-neon hover:bg-carbon-800/20 transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <Box size={24} className="text-titanium-500 group-hover:text-neon mb-2 transition-colors" />
                  <span className="text-xs font-semibold text-smoke block">Subir Archivo de Diseño</span>
                  <span className="text-[10px] text-titanium-500 block mt-1">Soporta .ifc, .gltf, .obj, .fbx</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImportFile} 
                    className="hidden" 
                    accept=".ifc,.gltf,.obj,.fbx"
                  />
                </div>
              )}
            </div>

            {/* Clasificación Automatizada de Materiales */}
            <div>
              <h3 className="text-xs font-bold text-smoke uppercase tracking-wider mb-2 flex items-center gap-2">
                <Box size={14} className="text-neon" /> Clasificación de Materiales
              </h3>
              <p className="text-[10px] text-titanium-500 mb-3">Haz clic en un material para aislar y destacar las piezas correspondientes en el visor.</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {materialBreakdown.map((item) => {
                  const isHighlighted = highlightedMaterial === item.key;
                  return (
                    <div 
                      key={item.key}
                      onClick={() => setHighlightedMaterial(isHighlighted ? null : item.key)}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                        isHighlighted 
                          ? 'bg-neon/15 border-neon/50 text-white font-bold' 
                          : 'bg-carbon-900/60 border-titanium-800/40 text-titanium-400 hover:text-smoke hover:bg-carbon-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color} border border-titanium-600`}></span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold text-smoke">{item.volume}</span>
                    </div>
                  );
                })}
                {highlightedMaterial && (
                  <button 
                    onClick={() => setHighlightedMaterial(null)}
                    className="w-full py-1 text-[10px] font-bold text-neon hover:underline text-center block mt-1"
                  >
                    Mostrar Todos los Materiales
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Propiedades Inteligentes (IFC Metadata) */}
          <div className="relative z-10 p-4 rounded-xl bg-gradient-to-br from-carbon-900 to-carbon-950 border border-titanium-800/50 shadow-inner mt-4">
            <h3 className="text-xs font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-titanium-800/50 pb-2">
              <Compass className="text-neon" size={14} /> Metadata BIM (IFC)
            </h3>
            {selectedElement ? (
              <div className="space-y-3 text-xs leading-normal animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div><span className="text-titanium-500 block uppercase text-[10px]">Elemento</span> <span className="font-semibold text-smoke">{selectedElement.name}</span></div>
                <div><span className="text-titanium-500 block uppercase text-[10px]">Clase IFC</span> <span className="font-mono text-neon bg-neon/10 px-1.5 py-0.5 rounded">{selectedElement.type}</span></div>
                <div><span className="text-titanium-500 block uppercase text-[10px]">Volumen Bruto</span> <span className="font-semibold text-smoke">{selectedElement.volume}</span></div>
                <div><span className="text-titanium-500 block uppercase text-[10px]">Material Físico</span> <span className="font-semibold text-smoke">{selectedElement.material}</span></div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-center">
                <p className="text-[11px] text-titanium-500 italic">Interacciona libremente con la estructura 3D.<br/><br/>Haz clic sobre cualquier parte para extraer su Data IFC.</p>
              </div>
            )}
          </div>
        </div>

        {/* Lienzo 3D Extremo (R3F Canvas) */}
        <div className="glass-panel rounded-2xl lg:col-span-3 h-[600px] relative overflow-hidden border border-titanium-800/50 shadow-2xl">
          <Canvas 
            gl={{ antialias: true, localClippingEnabled: true, toneMapping: THREE.ACESFilmicToneMapping }}
            camera={{ position: [15, 12, 15], fov: 45 }}
            className="w-full h-full bg-gradient-to-b from-carbon-900 to-[#03050a]"
          >
            {/* Iluminación Cinematográfica */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" castShadow />
            <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
            
            {/* Entorno Fotorrealista para reflexiones HDR */}
            <Environment preset="city" />

            {/* Grid y Ejes */}
            <Grid infiniteGrid fadeDistance={40} sectionColor="#1e293b" cellColor="#0f1524" position={[0, -4.1, 0]} />

            {/* Componente 3D Principal (Carga Dinámica Skyline o Puente Importado) */}
            {importedModel ? (
              <BridgeStructure 
                layers={layers} 
                clippingPlane={clippingPlane} 
                onSelect={setSelectedElement} 
                materials={activeMaterials}
                fpsLimit={fpsLimit}
              />
            ) : (
              <SkylineTower 
                layers={layers} 
                clippingPlane={clippingPlane} 
                onSelect={setSelectedElement} 
                materials={activeMaterials}
                fpsLimit={fpsLimit}
              />
            )}

            {/* Controles Orbitales (Zoom, Paneo, Rotación Inercial) */}
            <OrbitControls 
              ref={controlsRef}
              makeDefault 
              dampingFactor={0.05} 
              enableDamping 
              maxPolarAngle={Math.PI / 2 - 0.05} // No bajar debajo del suelo
              minDistance={5}
              maxDistance={40}
            />
          </Canvas>

          {/* Overlays de Interfaz sobre el Canvas */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-carbon-950/80 border border-titanium-800 backdrop-blur-md flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon animate-pulse"></div>
              <span className="text-[10px] font-bold text-smoke tracking-wider uppercase">Motor R3F Activo</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-carbon-950/80 border border-titanium-800 backdrop-blur-md flex items-center gap-2">
              <Cpu size={12} className="text-neon" />
              <span className="text-[10px] font-bold text-titanium-400">FPS: {liveFps}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-carbon-950/80 border border-titanium-800 backdrop-blur-md flex items-center gap-2">
              <span className="text-[10px] font-bold text-titanium-400 uppercase">Texturas: {textureQuality}</span>
            </div>
          </div>

          {/* Selector de Capas Rápido sobre el Modelo */}
          <div className="absolute top-4 right-4 bg-carbon-950/85 border border-titanium-800 rounded-xl p-1.5 flex gap-1.5 backdrop-blur-md shadow-lg">
            {[
              { key: 'structures', label: 'Estruc.' },
              { key: 'mep', label: 'MEP' },
              { key: 'arch', label: 'Arq.' }
            ].map(layer => (
              <button 
                key={layer.key} 
                onClick={() => setLayers({ ...layers, [layer.key]: !layers[layer.key] })}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  layers[layer.key] 
                    ? 'bg-neon/15 text-white border border-neon/30' 
                    : 'bg-titanium-800/20 text-titanium-500 border border-transparent'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 bg-carbon-950/80 border border-titanium-800 rounded-xl p-1.5 flex gap-1.5 backdrop-blur-md shadow-lg">
            <button onClick={handleResetCamera} className="p-2.5 rounded-lg bg-titanium-800/40 text-titanium-400 hover:text-white hover:bg-neon/20 transition-all" title="Restablecer Cámara">
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={() => setClippingPlane(!clippingPlane)}
              className={`p-2.5 rounded-lg transition-all ${clippingPlane ? 'bg-neon text-carbon-900' : 'bg-titanium-800/40 text-titanium-400 hover:text-white'}`}
              title="Corte Dinámico"
            >
              <Scissors size={16} />
            </button>
            <div className="w-[1px] h-8 bg-titanium-800 self-center mx-1"></div>
            <div className="px-2 flex items-center text-[10px] font-medium text-titanium-500">
              Clic Izquierdo: Rotar | Rueda: Zoom | Clic Derecho: Paneo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
