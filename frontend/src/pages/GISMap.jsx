import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEliteStore } from '../store/useEliteStore';
import {
  MapPin, Layers, Activity, Radio, Navigation, Thermometer,
  Wind, Zap, AlertTriangle, Users, Crosshair, Satellite,
  BarChart2, Shield, Camera, Clock, ChevronDown, ChevronUp,
  TrendingUp, Wifi, WifiOff
} from 'lucide-react';

// ─── Datos enriquecidos por proyecto ─────────────────────────────────────────
const GEO_DATA = {
  'prj-skyline-101': {
    zonification: 'Zona A1 – Urbano Alta Densidad',
    seismicZone: 'Zona Sísmica 3 (Alta)',
    elevation: '567 msnm',
    soilType: 'Suelo Tipo C – Medianamente Rígido',
    cadastralRef: 'ROL 8001-123-4',
    area: '4,850 m²',
    perimeter: '284 m',
    floodRisk: 'Bajo',
    windSpeed: '18 km/h NE',
    temperature: '14°C',
    humidity: '62%',
    uv: 4,
    drones: [
      { id: 'DRN-01', lat: -33.4071, lng: -70.5882, battery: 87, altitude: 120, status: 'Activo', signal: 95 },
      { id: 'DRN-02', lat: -33.4079, lng: -70.5895, battery: 54, altitude: 85, status: 'Retornando', signal: 78 }
    ],
    sensors: [
      { id: 'SEN-A1', lat: -33.4073, lng: -70.5885, type: 'Concreto', value: '28.4°C / 21.8 MPa', status: 'OK' },
      { id: 'SEN-A2', lat: -33.4077, lng: -70.5891, type: 'Sísmico', value: '0.02g PGA', status: 'OK' },
      { id: 'SEN-A3', lat: -33.4075, lng: -70.5888, type: 'Inclinómetro', value: '0.12° desv.', status: 'Alerta' }
    ],
    geofenceRadius: 350,
    exclusionZones: [
      { lat: -33.4068, lng: -70.5880, radius: 80, label: 'Grúa Torre Activa' },
      { lat: -33.4082, lng: -70.5896, radius: 50, label: 'Almacén Explosivos' }
    ]
  },
  'prj-nordic-202': {
    zonification: 'Zona R3 – Residencial Mixta',
    seismicZone: 'Zona Sísmica 2 (Media)',
    elevation: '85 msnm',
    soilType: 'Suelo Tipo D – Blando',
    cadastralRef: 'ROL 2204-456-7',
    area: '12,340 m²',
    perimeter: '520 m',
    floodRisk: 'Medio',
    windSpeed: '31 km/h SO',
    temperature: '7°C',
    humidity: '88%',
    uv: 1,
    drones: [
      { id: 'DRN-05', lat: -41.3175, lng: -72.9850, battery: 12, altitude: 0, status: 'En tierra', signal: 0 }
    ],
    sensors: [
      { id: 'SEN-B1', lat: -41.3178, lng: -72.9855, type: 'Nivel Freático', value: '1.2m prof.', status: 'Alerta' }
    ],
    geofenceRadius: 500,
    exclusionZones: []
  },
  'prj-industrial-303': {
    zonification: 'Zona Industrial E – Energía Renovable',
    seismicZone: 'Zona Sísmica 2 (Media)',
    elevation: '1,240 msnm',
    soilType: 'Suelo Tipo B – Rígido',
    cadastralRef: 'ROL 4401-789-0',
    area: '892,000 m²',
    perimeter: '4,120 m',
    floodRisk: 'Muy Bajo',
    windSpeed: '45 km/h N',
    temperature: '28°C',
    humidity: '18%',
    uv: 11,
    drones: [
      { id: 'DRN-10', lat: -27.3668, lng: -70.3315, battery: 91, altitude: 200, status: 'Activo', signal: 99 }
    ],
    sensors: [
      { id: 'SEN-C1', lat: -27.3672, lng: -70.3322, type: 'Irradiancia Solar', value: '1,124 W/m²', status: 'OK' },
      { id: 'SEN-C2', lat: -27.3675, lng: -70.3328, type: 'Temperatura Panel', value: '62.4°C', status: 'Alerta' }
    ],
    geofenceRadius: 2000,
    exclusionZones: [
      { lat: -27.3660, lng: -70.3300, radius: 150, label: 'Subestación Eléctrica 220kV' }
    ]
  }
};

// Colores por estado
const STATUS_COLORS = {
  'En Progreso': '#3b82f6',
  'Planificación': '#f59e0b',
  'Detenido': '#ef4444',
  'Completado': '#10b981'
};

// Tiles disponibles
const MAP_LAYERS = {
  dark: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', label: 'Dark (CARTO)', attr: '© OSM © CARTO' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', label: 'Satélite (ESRI)', attr: '© ESRI' },
  terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', label: 'Topografía', attr: '© OpenTopoMap' },
  streets: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', label: 'Calles (OSM)', attr: '© OSM' }
};

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function GISMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({ base: null, overlays: {} });
  const timerRef = useRef(null);

  const { projects, selectedProjectId, setSelectedProject, personnel } = useEliteStore();
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const geoData = GEO_DATA[activeProject.id] || GEO_DATA['prj-skyline-101'];

  const [activeLayer, setActiveLayer] = useState('dark');
  const [overlays, setOverlays] = useState({ geofence: true, personnel: true, drones: true, sensors: true, exclusion: true, heatmap: false });
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [measureDistance, setMeasureDistance] = useState(null);
  const [liveTime, setLiveTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('geo'); // geo | sensors | drones | weather

  // Reloj en vivo
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { clearInterval(t); window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  // ─── Inicializar Mapa ─────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [activeProject.latitude, activeProject.longitude],
      zoom: 15,
      zoomControl: false,
      attributionControl: true
    });

    // Tile base
    const baseTile = L.tileLayer(MAP_LAYERS.dark.url, { attribution: MAP_LAYERS.dark.attr, maxZoom: 20, subdomains: 'abcd' });
    baseTile.addTo(map);
    layersRef.current.base = baseTile;

    // Control de zoom custom (posición)
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Escala
    L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ─── Cambio de Capa Base ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !layersRef.current.base) return;
    layersRef.current.base.setUrl(MAP_LAYERS[activeLayer].url);
  }, [activeLayer]);

  // ─── Dibujar todas las capas en el mapa ──────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Limpiar overlays previos
    Object.values(layersRef.current.overlays).forEach(layer => {
      if (layer && map.hasLayer(layer)) map.removeLayer(layer);
    });
    layersRef.current.overlays = {};

    const projectsGroup = L.layerGroup();

    // ── Marcadores de proyectos ──
    projects.forEach(proj => {
      const geo = GEO_DATA[proj.id] || geoData;
      const isActive = proj.id === activeProject.id;
      const color = STATUS_COLORS[proj.status] || '#3b82f6';
      const pulseClass = isActive ? 'gis-pulse-active' : '';

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative; width:${isActive ? 28 : 20}px; height:${isActive ? 28 : 20}px;">
            ${isActive ? `<div style="position:absolute;inset:-8px;border-radius:50%;border:2px solid ${color};opacity:0.4;animation:gis-ring 1.8s ease-out infinite;"></div>` : ''}
            <div style="
              width:100%;height:100%;border-radius:50%;
              background:${color};
              border:3px solid ${isActive ? '#fff' : color};
              box-shadow:0 0 ${isActive ? 18 : 8}px ${color};
              display:flex;align-items:center;justify-content:center;
              color:white;font-size:${isActive ? 11 : 8}px;font-weight:800;font-family:monospace;
            ">${proj.progress.toFixed(0)}%</div>
          </div>`,
        iconSize: [isActive ? 28 : 20, isActive ? 28 : 20],
        iconAnchor: [isActive ? 14 : 10, isActive ? 14 : 10]
      });

      const marker = L.marker([proj.latitude, proj.longitude], { icon })
        .bindTooltip(`<b>${proj.name}</b><br>${proj.status} · ${proj.progress}%`, { className: 'gis-tooltip' })
        .on('click', () => { setSelectedProject(proj.id); setSelectedFeature({ type: 'project', data: proj }); });

      projectsGroup.addLayer(marker);

      // Geofence del proyecto activo
      if (isActive && overlays.geofence) {
        const geofence = L.circle([proj.latitude, proj.longitude], {
          radius: geo.geofenceRadius,
          color: color, fillColor: color, fillOpacity: 0.07, weight: 2, dashArray: '6 4'
        });
        projectsGroup.addLayer(geofence);
      }
    });

    projectsGroup.addTo(map);
    layersRef.current.overlays.projects = projectsGroup;

    // ── Personal GPS ──
    if (overlays.personnel) {
      const personnelGroup = L.layerGroup();
      personnel.filter(p => p.lat && p.lng).forEach(person => {
        const personIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:22px;height:22px;border-radius:4px;
            background:${person.status === 'Presente' ? '#10b981' : person.status.includes('Tarde') ? '#f59e0b' : '#6b7280'};
            border:2px solid white;
            display:flex;align-items:center;justify-content:center;
            color:white;font-size:9px;font-weight:800;
            box-shadow:0 2px 8px rgba(0,0,0,0.5);">
            ${person.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>`,
          iconSize: [22, 22], iconAnchor: [11, 11]
        });
        L.marker([person.lat, person.lng], { icon: personIcon })
          .bindTooltip(`<b>${person.name}</b><br>${person.role}<br>${person.status}`, { className: 'gis-tooltip' })
          .on('click', () => setSelectedFeature({ type: 'person', data: person }))
          .addTo(personnelGroup);
      });
      personnelGroup.addTo(map);
      layersRef.current.overlays.personnel = personnelGroup;
    }

    // ── Drones ──
    if (overlays.drones) {
      const dronesGroup = L.layerGroup();
      geoData.drones.forEach(drone => {
        const droneColor = drone.battery > 30 ? '#3b82f6' : '#ef4444';
        const droneIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:26px;height:26px;border-radius:50%;
            background:#0f172a;border:2px solid ${droneColor};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 12px ${droneColor};font-size:14px;">✈</div>`,
          iconSize: [26, 26], iconAnchor: [13, 13]
        });
        L.marker([drone.lat, drone.lng], { icon: droneIcon })
          .bindTooltip(`<b>${drone.id}</b><br>Alt: ${drone.altitude}m · Bat: ${drone.battery}%<br>${drone.status}`, { className: 'gis-tooltip' })
          .on('click', () => setSelectedFeature({ type: 'drone', data: drone }))
          .addTo(dronesGroup);
      });
      dronesGroup.addTo(map);
      layersRef.current.overlays.drones = dronesGroup;
    }

    // ── Sensores IoT ──
    if (overlays.sensors) {
      const sensorsGroup = L.layerGroup();
      geoData.sensors.forEach(sensor => {
        const sColor = sensor.status === 'OK' ? '#10b981' : '#f59e0b';
        const sIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:18px;height:18px;border-radius:3px;
            background:${sColor}22;border:2px solid ${sColor};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 8px ${sColor};font-size:10px;">◉</div>`,
          iconSize: [18, 18], iconAnchor: [9, 9]
        });
        L.marker([sensor.lat, sensor.lng], { icon: sIcon })
          .bindTooltip(`<b>${sensor.id}</b><br>${sensor.type}<br>${sensor.value}`, { className: 'gis-tooltip' })
          .on('click', () => setSelectedFeature({ type: 'sensor', data: sensor }))
          .addTo(sensorsGroup);
      });
      sensorsGroup.addTo(map);
      layersRef.current.overlays.sensors = sensorsGroup;
    }

    // ── Zonas de Exclusión ──
    if (overlays.exclusion) {
      const exclusionGroup = L.layerGroup();
      geoData.exclusionZones.forEach(zone => {
        L.circle([zone.lat, zone.lng], {
          radius: zone.radius, color: '#ef4444', fillColor: '#ef4444',
          fillOpacity: 0.15, weight: 2, dashArray: '4 3'
        }).bindTooltip(`⚠️ Zona Restringida: ${zone.label}`, { className: 'gis-tooltip' }).addTo(exclusionGroup);
      });
      exclusionGroup.addTo(map);
      layersRef.current.overlays.exclusion = exclusionGroup;
    }

    // ── Volar a la obra activa ──
    map.flyTo([activeProject.latitude, activeProject.longitude], 15, { animate: true, duration: 1.2 });

  }, [projects, selectedProjectId, overlays, personnel]);

  // ─── Modo de Medición de Distancias ──────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (measureMode) {
      map.getContainer().style.cursor = 'crosshair';
      const handleClick = (e) => {
        setMeasurePoints(prev => {
          const newPoints = [...prev, [e.latlng.lat, e.latlng.lng]];
          if (newPoints.length >= 2) {
            const d = map.distance(newPoints[newPoints.length - 2], newPoints[newPoints.length - 1]);
            setMeasureDistance(prev => (prev || 0) + d);
          }
          return newPoints;
        });
      };
      map.on('click', handleClick);
      return () => { map.off('click', handleClick); map.getContainer().style.cursor = ''; };
    } else {
      map.getContainer().style.cursor = '';
      setMeasurePoints([]);
      setMeasureDistance(null);
    }
  }, [measureMode]);

  // Dibujar línea de medición
  useEffect(() => {
    if (!mapRef.current || measurePoints.length < 2) return;
    const map = mapRef.current;
    if (layersRef.current.overlays.measure) map.removeLayer(layersRef.current.overlays.measure);
    const line = L.polyline(measurePoints, { color: '#f59e0b', weight: 2, dashArray: '6 3' }).addTo(map);
    layersRef.current.overlays.measure = line;
  }, [measurePoints]);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const formatDist = (m) => m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
  const personnelOnSite = personnel.filter(p => p.lat && p.lng && p.status !== 'Ausente').length;
  const alertSensors = geoData.sensors.filter(s => s.status !== 'OK').length;
  const activeDrones = geoData.drones.filter(d => d.status === 'Activo').length;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* CSS animations inline */}
      <style>{`
        @keyframes gis-ring { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(2.5);opacity:0} }
        .gis-tooltip { background:#0f172a!important;color:#f8fafc!important;border:1px solid #1e293b!important;border-radius:8px!important;font-size:11px!important;font-family:'Outfit',sans-serif!important;box-shadow:0 4px 12px rgba(0,0,0,0.5)!important; }
        .gis-tooltip::before { border-top-color:#1e293b!important; }
        .leaflet-control-attribution { background:rgba(6,9,17,0.8)!important;color:#475569!important;font-size:9px!important; }
        .leaflet-control-attribution a { color:#3b82f6!important; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h2 className="text-xl font-bold text-smoke uppercase tracking-wider flex items-center gap-2">
            <Satellite className="text-neon" size={20} />
            GIS & Topografía · Módulo Avanzado
          </h2>
          <p className="text-xs text-titanium-500 mt-0.5">Telemetría en tiempo real, geofencing, drones IoT y análisis geoespacial.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Estado conexión */}
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'border-success/30 bg-success/10 text-success' : 'border-error/30 bg-error/10 text-error'}`}>
            {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-titanium-800/50 bg-carbon-800/40 text-[10px] font-bold text-titanium-400">
            <Clock size={10} className="text-neon" />
            {liveTime.toLocaleTimeString('es-CL')}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-titanium-800/50 bg-carbon-800/40 text-[10px] font-bold text-titanium-400">
            <Navigation size={10} className="text-neon" />
            Datum: WGS84
          </span>
          {alertSensors > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-warning/30 bg-warning/10 text-[10px] font-bold text-warning animate-pulse">
              <AlertTriangle size={10} />
              {alertSensors} Alerta{alertSensors > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ── KPIs rápidos ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Personal en Obra', value: `${personnelOnSite}/${personnel.length}`, color: 'text-success', bg: 'bg-success/10 border-success/20' },
          { icon: Radio, label: 'Drones Activos', value: `${activeDrones}/${geoData.drones.length}`, color: 'text-neon', bg: 'bg-neon/10 border-neon/20' },
          { icon: Activity, label: 'Sensores Alertando', value: alertSensors, color: alertSensors > 0 ? 'text-warning' : 'text-success', bg: alertSensors > 0 ? 'bg-warning/10 border-warning/20' : 'bg-success/10 border-success/20' },
          { icon: Crosshair, label: 'Zona de Geofencing', value: `${geoData.geofenceRadius} m`, color: 'text-neon', bg: 'bg-neon/10 border-neon/20' }
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${bg} glass-panel`}>
            <Icon size={18} className={color} />
            <div>
              <p className="text-[10px] text-titanium-500 uppercase tracking-wide">{label}</p>
              <p className={`text-lg font-extrabold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Workspace principal ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* ── Panel de Control Lateral ── */}
        <div className="lg:col-span-1 space-y-3">

          {/* Selector de capa del mapa */}
          <div className="glass-panel rounded-2xl border border-titanium-800/50 p-4">
            <h3 className="text-[10px] font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers size={12} className="text-neon" /> Capa Base del Mapa
            </h3>
            <div className="space-y-1.5">
              {Object.entries(MAP_LAYERS).map(([key, val]) => (
                <button key={key} onClick={() => setActiveLayer(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${activeLayer === key ? 'bg-neon/15 border-neon/40 text-white' : 'bg-carbon-900/40 border-titanium-800/40 text-titanium-400 hover:text-smoke hover:bg-carbon-800/40'}`}>
                  {val.label}
                  {activeLayer === key && <span className="w-2 h-2 rounded-full bg-neon" />}
                </button>
              ))}
            </div>
          </div>

          {/* Overlays activos */}
          <div className="glass-panel rounded-2xl border border-titanium-800/50 p-4">
            <h3 className="text-[10px] font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers size={12} className="text-neon" /> Capas Visibles
            </h3>
            <div className="space-y-2">
              {[
                { key: 'geofence', label: 'Geocerca Virtual', color: '#3b82f6' },
                { key: 'personnel', label: 'GPS Personal', color: '#10b981' },
                { key: 'drones', label: 'Drones en Vuelo', color: '#3b82f6' },
                { key: 'sensors', label: 'Sensores IoT', color: '#10b981' },
                { key: 'exclusion', label: 'Zonas Restringidas', color: '#ef4444' }
              ].map(({ key, label, color }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-carbon-800/40 transition-colors">
                  <span className="flex items-center gap-2 text-xs text-titanium-400">
                    <span style={{ color }} className="text-sm">●</span>
                    {label}
                  </span>
                  <div onClick={() => setOverlays(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`w-9 h-5 rounded-full border transition-all flex items-center px-0.5 ${overlays[key] ? 'bg-neon border-neon' : 'bg-carbon-900 border-titanium-700'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${overlays[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Herramienta de medición */}
          <div className="glass-panel rounded-2xl border border-titanium-800/50 p-4">
            <h3 className="text-[10px] font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2">
              <Crosshair size={12} className="text-neon" /> Medir Distancia
            </h3>
            <button onClick={() => { setMeasureMode(!measureMode); if (measureMode) { setMeasurePoints([]); setMeasureDistance(null); } }}
              className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all ${measureMode ? 'bg-warning text-carbon-900 border-warning shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'bg-carbon-900/50 text-titanium-400 border-titanium-700/50 hover:text-smoke'}`}>
              {measureMode ? '⏹ Detener Medición' : '📏 Iniciar Medición'}
            </button>
            {measureMode && (
              <p className="text-[10px] text-titanium-500 mt-2 text-center">Haz clic en el mapa para medir distancias</p>
            )}
            {measureDistance && (
              <div className="mt-2 p-2.5 rounded-xl bg-warning/10 border border-warning/30 text-center">
                <p className="text-[10px] text-titanium-500">Distancia acumulada</p>
                <p className="text-lg font-extrabold text-warning">{formatDist(measureDistance)}</p>
              </div>
            )}
          </div>

          {/* Proyectos activos (selector) */}
          <div className="glass-panel rounded-2xl border border-titanium-800/50 p-4">
            <h3 className="text-[10px] font-bold text-smoke uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin size={12} className="text-neon" /> Obras Monitoreadas
            </h3>
            <div className="space-y-2">
              {projects.map(proj => (
                <button key={proj.id} onClick={() => setSelectedProject(proj.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${proj.id === activeProject.id ? 'bg-neon/10 border-neon/30' : 'bg-carbon-900/40 border-titanium-800/40 hover:bg-carbon-800/40'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-smoke truncate">{proj.name}</span>
                    <span style={{ color: STATUS_COLORS[proj.status] || '#fff' }} className="text-[10px] font-semibold whitespace-nowrap ml-1">{proj.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-carbon-900">
                    <div style={{ width: `${proj.progress}%`, background: STATUS_COLORS[proj.status] || '#3b82f6' }} className="h-full rounded-full transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mapa Principal ── */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="glass-panel rounded-2xl border border-titanium-800/50 overflow-hidden relative" style={{ height: '480px' }}>
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Overlay: coordenadas del centro del mapa */}
            <div className="absolute top-3 left-3 z-[1000] bg-carbon-950/85 border border-titanium-800/80 backdrop-blur-md rounded-xl px-3 py-2 text-[10px] font-mono text-titanium-400 space-y-0.5">
              <div className="flex items-center gap-1.5 text-neon font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                LIVE · GNSS/GPS Lock
              </div>
              <div>Lat: <span className="text-smoke">{activeProject.latitude.toFixed(6)}°</span></div>
              <div>Lng: <span className="text-smoke">{activeProject.longitude.toFixed(6)}°</span></div>
              <div>Alt: <span className="text-smoke">{geoData.elevation}</span></div>
            </div>

            {/* Overlay: capa activa */}
            <div className="absolute top-3 right-3 z-[1000] bg-carbon-950/85 border border-titanium-800/80 backdrop-blur-md rounded-xl px-3 py-1.5 text-[10px] font-bold text-neon uppercase tracking-wider">
              🛰 {MAP_LAYERS[activeLayer].label}
            </div>

            {/* Overlay: modo medición activo */}
            {measureMode && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-[1000] bg-warning/90 text-carbon-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                📏 Modo Medición Activo — Haz clic en el mapa para medir
              </div>
            )}
          </div>

          {/* ── Panel de Datos Geoespaciales ── */}
          <div className="glass-panel rounded-2xl border border-titanium-800/50 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-titanium-800/50">
              {[
                { id: 'geo', icon: MapPin, label: 'Catastro & Suelo' },
                { id: 'sensors', icon: Activity, label: 'Sensores IoT' },
                { id: 'drones', icon: Radio, label: 'Drones UAV' },
                { id: 'weather', icon: Wind, label: 'Meteorología' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-neon text-neon bg-neon/5' : 'border-transparent text-titanium-500 hover:text-smoke hover:bg-carbon-800/30'}`}>
                  <tab.icon size={12} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {/* ── Tab: Catastro ── */}
              {activeTab === 'geo' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'Zonificación SAT', value: geoData.zonification },
                    { label: 'Zona Sísmica', value: geoData.seismicZone },
                    { label: 'Tipo de Suelo', value: geoData.soilType },
                    { label: 'Rol Catastral', value: geoData.cadastralRef },
                    { label: 'Área del Predio', value: geoData.area },
                    { label: 'Perímetro', value: geoData.perimeter },
                    { label: 'Riesgo de Inundación', value: geoData.floodRisk },
                    { label: 'Elevación', value: geoData.elevation }
                  ].map(item => (
                    <div key={item.label} className="bg-carbon-900/60 rounded-xl p-3 border border-titanium-800/40">
                      <p className="text-[10px] text-titanium-500 uppercase tracking-wide mb-1">{item.label}</p>
                      <p className="font-bold text-smoke text-[11px] leading-tight">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tab: Sensores ── */}
              {activeTab === 'sensors' && (
                <div className="space-y-2">
                  {geoData.sensors.length === 0 ? (
                    <p className="text-xs text-titanium-500 text-center py-4">No hay sensores activos en este proyecto.</p>
                  ) : geoData.sensors.map(sensor => (
                    <div key={sensor.id} className="flex items-center justify-between p-3 rounded-xl bg-carbon-900/60 border border-titanium-800/40">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${sensor.status === 'OK' ? 'bg-success/20' : 'bg-warning/20'}`}>
                          {sensor.type.includes('Concreto') ? '🧱' : sensor.type.includes('Sísmico') ? '📡' : sensor.type.includes('Inclinó') ? '📐' : sensor.type.includes('Freático') ? '💧' : sensor.type.includes('Irrad') ? '☀️' : '🌡️'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-smoke">{sensor.id} · {sensor.type}</p>
                          <p className="text-[11px] text-titanium-400">{sensor.value}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${sensor.status === 'OK' ? 'bg-success/15 border-success/30 text-success' : 'bg-warning/15 border-warning/30 text-warning animate-pulse'}`}>
                        {sensor.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tab: Drones ── */}
              {activeTab === 'drones' && (
                <div className="space-y-2">
                  {geoData.drones.map(drone => (
                    <div key={drone.id} className="p-3 rounded-xl bg-carbon-900/60 border border-titanium-800/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-smoke">✈ {drone.id}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${drone.status === 'Activo' ? 'bg-neon/15 text-neon border border-neon/30' : drone.status === 'Retornando' ? 'bg-warning/15 text-warning border border-warning/30' : 'bg-titanium-800/40 text-titanium-400 border border-titanium-700'}`}>
                          {drone.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div><span className="text-titanium-500 block">Altitud</span><span className="font-bold text-smoke">{drone.altitude} m</span></div>
                        <div><span className="text-titanium-500 block">Señal</span><span className="font-bold text-smoke">{drone.signal}%</span></div>
                        <div><span className="text-titanium-500 block">Batería</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="flex-1 h-1.5 rounded-full bg-carbon-900">
                              <div style={{ width: `${drone.battery}%`, background: drone.battery > 30 ? '#10b981' : '#ef4444' }} className="h-full rounded-full transition-all" />
                            </div>
                            <span className={`font-bold text-[10px] ${drone.battery > 30 ? 'text-success' : 'text-error'}`}>{drone.battery}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tab: Meteorología ── */}
              {activeTab === 'weather' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { icon: '🌡️', label: 'Temperatura', value: geoData.temperature },
                    { icon: '💨', label: 'Viento', value: geoData.windSpeed },
                    { icon: '💧', label: 'Humedad', value: geoData.humidity },
                    { icon: '☀️', label: 'Índice UV', value: `UV ${geoData.uv}` }
                  ].map(item => (
                    <div key={item.label} className="bg-carbon-900/60 rounded-xl p-3 border border-titanium-800/40 text-center">
                      <p className="text-3xl mb-1">{item.icon}</p>
                      <p className="text-[10px] text-titanium-500 uppercase tracking-wide">{item.label}</p>
                      <p className="font-extrabold text-smoke text-base mt-0.5">{item.value}</p>
                    </div>
                  ))}
                  <div className="col-span-2 sm:col-span-4 bg-carbon-900/60 rounded-xl p-3 border border-titanium-800/40">
                    <p className="text-[10px] text-titanium-500 uppercase tracking-wide mb-2">Condiciones de Trabajabilidad del Hormigón</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-success via-warning to-error" />
                      <span className="text-xs font-bold text-success">FAVORABLE</span>
                    </div>
                    <p className="text-[10px] text-titanium-500 mt-1">Temperatura y humedad dentro de rangos óptimos para vaciado de hormigón.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Panel de Elemento Seleccionado ── */}
          {selectedFeature && (
            <div className="glass-panel rounded-2xl border border-neon/30 bg-neon/5 p-4 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-neon uppercase tracking-wider flex items-center gap-2">
                  <Shield size={12} />
                  {selectedFeature.type === 'project' ? 'Proyecto Seleccionado' :
                   selectedFeature.type === 'person' ? 'Personal GPS' :
                   selectedFeature.type === 'drone' ? 'Drone UAV' : 'Sensor IoT'}
                </h4>
                <button onClick={() => setSelectedFeature(null)} className="text-titanium-500 hover:text-smoke text-xs">✕ Cerrar</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {selectedFeature.type === 'project' && Object.entries({
                  'Nombre': selectedFeature.data.name, 'Código': selectedFeature.data.code,
                  'Avance': `${selectedFeature.data.progress}%`, 'Estado': selectedFeature.data.status,
                  'Presupuesto': `$${selectedFeature.data.budget?.toLocaleString('es-CL')}`, 'Ingeniero': selectedFeature.data.engineer,
                  'Inicio': selectedFeature.data.startDate, 'Término': selectedFeature.data.endDate
                }).map(([k, v]) => (
                  <div key={k} className="bg-carbon-900/60 p-2 rounded-lg border border-titanium-800/40">
                    <p className="text-[10px] text-titanium-500">{k}</p>
                    <p className="font-bold text-smoke truncate">{v}</p>
                  </div>
                ))}
                {selectedFeature.type === 'person' && Object.entries({
                  'Nombre': selectedFeature.data.name, 'Rol': selectedFeature.data.role,
                  'Estado': selectedFeature.data.status, 'Check-in': selectedFeature.data.checkIn ? new Date(selectedFeature.data.checkIn).toLocaleTimeString('es-CL') : '—'
                }).map(([k, v]) => (
                  <div key={k} className="bg-carbon-900/60 p-2 rounded-lg border border-titanium-800/40">
                    <p className="text-[10px] text-titanium-500">{k}</p>
                    <p className="font-bold text-smoke">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
