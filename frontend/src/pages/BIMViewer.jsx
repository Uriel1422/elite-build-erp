import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Layers, RotateCcw, ZoomIn, ZoomOut, Scissors, Eye, AlertTriangle, Compass } from 'lucide-react';
import { useEliteStore } from '../store/useEliteStore';

// Materiales de Alta Fidelidad (Gemelo Digital)
const materials = {
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

// Plano de Corte Dinámico
const globalPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 4.5);

// Animación del Marcador de Colisión
function ClashMarker({ position, onSelect }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.elapsedTime * 6) * 0.25;
    if(ref.current) ref.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={ref} position={position} material={materials.clash}
          onClick={(e) => { 
            e.stopPropagation(); 
            onSelect({ name: '¡COLISIÓN CRÍTICA! Ducto HVAC vs Losa de Concreto', type: 'Clash Interference', volume: '0.12 m³', material: 'Interferencia' }); 
          }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}>
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
function SkylineTower({ layers, clippingPlane, onSelect }) {
  const groupRef = useRef();

  // Rotación lenta e inercial de demostración
  useFrame(() => {
    if(groupRef.current) groupRef.current.rotation.y += 0.001;
  });

  // Aplicar motor de corte (Clipping) a nivel de shader
  useMemo(() => {
    Object.values(materials).forEach(mat => {
      mat.clippingPlanes = clippingPlane ? [globalPlane] : [];
      mat.needsUpdate = true;
    });
  }, [clippingPlane]);

  return (
    <group ref={groupRef} position={[0, -4, 0]}>
      {/* 1. Capa Estructural */}
      {layers.structures && (
        <group name="Estructuras">
          {/* Núcleo Ascensores */}
          <mesh position={[0, 5, 0]} material={materials.concrete}
                onClick={(e) => { e.stopPropagation(); onSelect({ name: 'Núcleo Central de Ascensores', type: 'IfcWall', volume: '345.6 m³', material: 'Concreto Armado f\'c 350' }); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[3, 10, 3]} />
          </mesh>
          
          {/* Losas */}
          {[0, 3.3, 6.6, 9.9].map((y, i) => (
            <mesh key={`slab-${i}`} position={[0, y, 0]} material={materials.concrete} 
                  onClick={(e) => { e.stopPropagation(); onSelect({ name: `Losa de Entrepiso Nivel ${i+1}`, type: 'IfcSlab', volume: '85.2 m³', material: 'Concreto Postensado' }); }}
                  onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
              <boxGeometry args={[12, 0.3, 12]} />
            </mesh>
          ))}

          {/* Columnas Perimetrales */}
          {[-5.5, 0, 5.5].map(x => 
            [-5.5, 0, 5.5].map(z => {
              if(x === 0 && z === 0) return null; // Evitar el núcleo
              return (
                <mesh key={`col-${x}-${z}`} position={[x, 5, z]} material={materials.steel}
                      onClick={(e) => { e.stopPropagation(); onSelect({ name: `Columna Maestra ${x > 0 ? 'Este' : 'Oeste'}`, type: 'IfcColumn', volume: '4.8 m³', material: 'Acero ASTM A992' }); }}
                      onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
                  <boxGeometry args={[0.6, 10, 0.6]} />
                </mesh>
              )
            })
          )}
        </group>
      )}

      {/* 2. Capa MEP */}
      {layers.mep && (
        <group name="MEP">
          {/* HVAC Duct - Vertical */}
          <mesh position={[2, 5, -2]} material={materials.hvac}
                onClick={(e) => { e.stopPropagation(); onSelect({ name: 'Ducto Extracción HVAC Principal', type: 'IfcDuctSegment', volume: '12.5 m³', material: 'Acero Galvanizado' }); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <cylinderGeometry args={[0.4, 0.4, 10, 16]} />
          </mesh>
          {/* HVAC Duct - Horizontal P2 */}
          <mesh position={[0, 2.5, -2]} rotation={[0, 0, Math.PI / 2]} material={materials.hvac}
                onClick={(e) => { e.stopPropagation(); onSelect({ name: 'Ramal Distribución Clima P2', type: 'IfcDuctSegment', volume: '3.1 m³', material: 'Acero Galvanizado' }); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <cylinderGeometry args={[0.3, 0.3, 11, 16]} />
          </mesh>
          
          {/* Electrical Tray */}
          <mesh position={[-2, 5.8, 2]} rotation={[Math.PI / 2, 0, 0]} material={materials.electrical}
                onClick={(e) => { e.stopPropagation(); onSelect({ name: 'Bandeja Portacables Alta Tensión', type: 'IfcCableCarrierSegment', volume: '1.8 m³', material: 'Aluminio Anodizado' }); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <cylinderGeometry args={[0.2, 0.2, 11, 8]} />
          </mesh>
          
          {/* Detección de Colisión Activa */}
          <ClashMarker position={[0, 3.3, -2]} onSelect={onSelect} />
        </group>
      )}

      {/* 3. Capa Arquitectura (Muro Cortina Cristal) */}
      {layers.arch && (
        <group name="Arquitectura">
          <mesh position={[0, 5, 0]} material={materials.glass}
                onClick={(e) => { e.stopPropagation(); onSelect({ name: 'Envolvente Muro Cortina', type: 'IfcCurtainWall', volume: '350.5 m³', material: 'Cristal Low-E Doble Panel' }); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
            <boxGeometry args={[12.5, 10.2, 12.5]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function BIMViewer() {
  const { addAuditLog } = useEliteStore();
  const [layers, setLayers] = useState({ structures: true, mep: true, arch: true });
  const [clippingPlane, setClippingPlane] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    addAuditLog('BIM_VIEWER_R3F_INIT', 'Carga del motor React Three Fiber completada con éxito.');
  }, [addAuditLog]);

  const handleResetCamera = () => {
    if(controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider flex items-center gap-2">
            <Layers className="text-neon" /> Visualizador Digital Twin 4D (R3F Engine)
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
        <div className="glass-panel p-5 rounded-2xl space-y-6 lg:col-span-1 border border-titanium-800/50 relative overflow-hidden">
          {/* Brillo de fondo estético */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon/10 rounded-full blur-[40px] pointer-events-none"></div>

          {/* Selector de Capas */}
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2">
              <Eye size={14} className="text-neon" /> Capas del Modelo
            </h3>
            <div className="space-y-2">
              {[
                { key: 'structures', label: 'Estructuras de Soporte', color: 'text-smoke' },
                { key: 'mep', label: 'Instalaciones (MEP)', color: 'text-success' },
                { key: 'arch', label: 'Fachadas Vidrio', color: 'text-neon' }
              ].map(layer => (
                <label key={layer.key} className="flex items-center justify-between p-2.5 rounded-lg bg-carbon-900/60 border border-titanium-800/60 text-xs cursor-pointer hover:bg-carbon-800/80 transition-all hover:border-titanium-700">
                  <span className={`font-semibold ${layer.color}`}>{layer.label}</span>
                  <input
                    type="checkbox"
                    checked={layers[layer.key]}
                    onChange={(e) => setLayers({ ...layers, [layer.key]: e.target.checked })}
                    className="rounded border-titanium-700 bg-carbon-800 text-neon focus:ring-neon w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Corte y Sección */}
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2">
              <Scissors size={14} className="text-neon" /> Herramientas Especiales
            </h3>
            <button
              onClick={() => setClippingPlane(!clippingPlane)}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                clippingPlane
                  ? 'bg-neon text-carbon-900 border-neon shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'bg-titanium-800/30 text-titanium-400 border-titanium-700/50 hover:text-smoke hover:bg-titanium-800/60'
              }`}
            >
              {clippingPlane ? 'Desactivar Corte 3D' : 'Activar Corte de Planta (Nivel 2)'}
            </button>
          </div>

          {/* Propiedades Inteligentes (IFC Metadata) */}
          <div className="relative z-10 p-4 rounded-xl bg-gradient-to-br from-carbon-900 to-carbon-950 border border-titanium-800/50 shadow-inner">
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
              <div className="h-32 flex items-center justify-center text-center">
                <p className="text-[11px] text-titanium-500 italic">Interacciona libremente con la torre 3D.<br/><br/>Haz clic sobre cualquier cristal, pilar o conducto luminoso para extraer su Data IFC.</p>
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
            
            {/* Entorno Fotorrealista para reflejos HDR */}
            <Environment preset="city" />

            {/* Grid y Ejes */}
            <Grid infiniteGrid fadeDistance={40} sectionColor="#1e293b" cellColor="#0f1524" position={[0, -4.1, 0]} />

            {/* Componente Central de Edificio */}
            <SkylineTower layers={layers} clippingPlane={clippingPlane} onSelect={setSelectedElement} />

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
              <span className="text-[10px] font-bold text-titanium-400">FPS: 60</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-carbon-950/80 border border-titanium-800 rounded-xl p-1.5 flex gap-1.5 backdrop-blur-md shadow-lg">
            <button onClick={handleResetCamera} className="p-2.5 rounded-lg bg-titanium-800/40 text-titanium-400 hover:text-white hover:bg-neon/20 transition-all" title="Restablecer Cámara">
              <RotateCcw size={16} />
            </button>
            <div className="w-[1px] h-8 bg-titanium-800 self-center mx-1"></div>
            <div className="px-2 flex items-center text-[10px] font-medium text-titanium-500">
              Usa Clic Izquierdo para rotar, Rueda para Zoom, Clic Derecho para paneo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
