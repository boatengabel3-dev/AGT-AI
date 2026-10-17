import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Farm } from '../../types';
import {
  MapPin,
  Layers,
  Sprout,
  Package,
  Tractor,
  CheckCircle2,
  Clock,
  Filter,
  Maximize2,
  Minimize2,
  ZoomIn,
  Compass,
  AlertCircle,
  Truck,
  Building2,
} from 'lucide-react';

export interface RegionalInputDistributionHub {
  id: string;
  name: string;
  operator: string;
  category: 'fertilizer' | 'seed' | 'machinery' | 'integrated_hub';
  country: string;
  region: string;
  coordinates: { lat: number; lng: number };
  capacityMetricTons: number;
  availableStockMT: number;
  featuredInputs: string[];
  activeVouchersRedeemed: number;
  dispatchStatus: 'active_dispatches' | 'receiving_shipment' | 'fully_stocked';
  phone: string;
}

const REGIONAL_INPUT_HUBS: RegionalInputDistributionHub[] = [
  {
    id: 'hub_gh_01',
    name: 'AfriAgro Central Fertilizer Distribution Hub',
    operator: 'AfriAgro Inputs Ltd (MoFA Registered)',
    category: 'fertilizer',
    country: 'Ghana',
    region: 'Ashanti Region (Kumasi Hub)',
    coordinates: { lat: 6.6885, lng: -1.6244 },
    capacityMetricTons: 3500,
    availableStockMT: 2840,
    featuredInputs: ['Bio-Harvest NPK 15-15-15', 'Granular Urea 46% N', 'Muriate of Potash (MOP)'],
    activeVouchersRedeemed: 412,
    dispatchStatus: 'active_dispatches',
    phone: '+233 20 891 2345',
  },
  {
    id: 'hub_gh_02',
    name: 'Heritage Certified Seed Logistics Center',
    operator: 'Heritage Seeds & CSIR-CRI Partner',
    category: 'seed',
    country: 'Ghana',
    region: 'Bono Region (Sunyani Depot)',
    coordinates: { lat: 7.3399, lng: -2.3268 },
    capacityMetricTons: 1200,
    availableStockMT: 920,
    featuredInputs: ['Obatanpa Hybrid White Maize', 'Afife Drought-Tolerant Rice', 'Anidaso Soybean Seed'],
    activeVouchersRedeemed: 286,
    dispatchStatus: 'fully_stocked',
    phone: '+233 24 777 8899',
  },
  {
    id: 'hub_gh_03',
    name: 'Volta Basin Mechanization & Tractor Center',
    operator: 'Volta Mechanised Fleet Services',
    category: 'machinery',
    country: 'Ghana',
    region: 'Volta Region (Ho Logistics Base)',
    coordinates: { lat: 6.6111, lng: 0.4708 },
    capacityMetricTons: 500,
    availableStockMT: 380,
    featuredInputs: ['John Deere 5075E 4WD Tractors', '3-Disc Plough Implements', 'Grain Harvester Attachments'],
    activeVouchersRedeemed: 94,
    dispatchStatus: 'active_dispatches',
    phone: '+233 27 123 4567',
  },
  {
    id: 'hub_gh_04',
    name: 'Tamale Savannah Bulk Agro-Input Depot',
    operator: 'Northern Ghana Agricultural Consortium',
    category: 'integrated_hub',
    country: 'Ghana',
    region: 'Northern Region (Tamale Logistics)',
    coordinates: { lat: 9.4008, lng: -0.8393 },
    capacityMetricTons: 6000,
    availableStockMT: 4850,
    featuredInputs: ['Subsidized Fertilizer Bags', 'Certified Sorghum & Millet', 'Tillage Equipment Fleet'],
    activeVouchersRedeemed: 650,
    dispatchStatus: 'active_dispatches',
    phone: '+233 37 200 4500',
  },
  {
    id: 'hub_gh_05',
    name: 'Tema Port Fertilizer Blending & Export Terminal',
    operator: 'West Africa Chemical & Fertilizer Terminal',
    category: 'fertilizer',
    country: 'Ghana',
    region: 'Greater Accra / Coastal Corridor',
    coordinates: { lat: 5.6700, lng: -0.0166 },
    capacityMetricTons: 20000,
    availableStockMT: 16500,
    featuredInputs: ['Bulk Diammonium Phosphate (DAP)', 'Sulphate of Ammonia', 'Micronutrient Blends'],
    activeVouchersRedeemed: 1100,
    dispatchStatus: 'receiving_shipment',
    phone: '+233 30 270 1200',
  },
  {
    id: 'hub_ci_01',
    name: 'Yamoussoukro Cocoa & Cereal Inputs Hub',
    operator: 'Côte d’Ivoire Agricultural Supply Chain',
    category: 'integrated_hub',
    country: 'Côte d’Ivoire',
    region: 'Lacs District',
    coordinates: { lat: 6.8276, lng: -5.2893 },
    capacityMetricTons: 4000,
    availableStockMT: 3100,
    featuredInputs: ['Cocoa Pod Protection Sprayers', 'Potassium-Rich Soil Conditioners', 'Certified Hybrid Seeds'],
    activeVouchersRedeemed: 320,
    dispatchStatus: 'active_dispatches',
    phone: '+225 30 64 0000',
  },
  {
    id: 'hub_ng_01',
    name: 'Kaduna Grain Belt Distribution Depot',
    operator: 'Nigeria National Seed & Inputs Alliance',
    category: 'seed',
    country: 'Nigeria',
    region: 'Kaduna Agricultural Corridor',
    coordinates: { lat: 10.5105, lng: 7.4165 },
    capacityMetricTons: 8500,
    availableStockMT: 6200,
    featuredInputs: ['High-Yield Hybrid Maize', 'Soybean Seed Inoculants', 'Tractor Mechanization Pools'],
    activeVouchersRedeemed: 890,
    dispatchStatus: 'fully_stocked',
    phone: '+234 62 240 100',
  },
];

// Additional Pan-African reference smallholder farms
const PAN_AFRICAN_REFERENCE_FARMS: Partial<Farm>[] = [
  {
    id: 'farm_ext_01',
    farmName: 'Offinso Cocoa & Plantain Grove',
    farmerName: 'Akosua Boakye',
    region: 'Ashanti Region',
    community: 'Offinso',
    centerCoordinates: { lat: 6.9021, lng: -1.6580 },
    boundaryPolygon: [
      { lat: 6.9045, lng: -1.6600 },
      { lat: 6.9050, lng: -1.6555 },
      { lat: 6.9000, lng: -1.6560 },
      { lat: 6.8995, lng: -1.6605 },
    ],
    reportedAreaAcres: 18.5,
    cropType: 'Cocoa (Amelonado) & Plantain',
    verificationStatus: 'verified',
  },
  {
    id: 'farm_ext_02',
    farmName: 'Yendi Savannah Soybean Plantation',
    farmerName: 'Ibrahim Alhassan',
    region: 'Northern Region',
    community: 'Yendi Municipal',
    centerCoordinates: { lat: 9.4450, lng: -0.0100 },
    boundaryPolygon: [
      { lat: 9.4480, lng: -0.0130 },
      { lat: 9.4490, lng: -0.0075 },
      { lat: 9.4420, lng: -0.0070 },
      { lat: 9.4415, lng: -0.0125 },
    ],
    reportedAreaAcres: 28.0,
    cropType: 'Soybeans & Yellow Sorghum',
    verificationStatus: 'verified',
  },
  {
    id: 'farm_ext_03',
    farmName: 'Keta Lagoon Irrigated Rice Plot',
    farmerName: 'Elorm Kudzo',
    region: 'Volta Region',
    community: 'Anloga',
    centerCoordinates: { lat: 5.7900, lng: 0.8980 },
    boundaryPolygon: [
      { lat: 5.7925, lng: 0.8950 },
      { lat: 5.7930, lng: 0.9010 },
      { lat: 5.7870, lng: 0.9005 },
      { lat: 5.7865, lng: 0.8945 },
    ],
    reportedAreaAcres: 14.5,
    cropType: 'Paddy Rice (Jasmine 85)',
    verificationStatus: 'verified',
  },
];

interface AdminGeospatialMapProps {
  farms: Farm[];
  onVerifyFarm?: (farmId: string) => void;
}

export const AdminGeospatialMap: React.FC<AdminGeospatialMapProps> = ({
  farms,
  onVerifyFarm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayerFilter, setActiveLayerFilter] = useState<'all' | 'farms' | 'hubs' | 'verified_only'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('ghana');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // Combine live farms with representative continental parcels
  const allFarms: Farm[] = [
    ...farms,
    ...(farms.length < 5 ? (PAN_AFRICAN_REFERENCE_FARMS as Farm[]) : []),
  ];

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default view centered on Ghana & West Africa
      const map = L.map(mapContainerRef.current, {
        center: [7.5, -1.5],
        zoom: 7,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap high-legibility base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · AgriTrust AI GIS',
        maxZoom: 18,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render markers and polygons based on active filters
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. RENDER FARM PARCEL MARKERS & POLYGONS
    if (activeLayerFilter === 'all' || activeLayerFilter === 'farms' || activeLayerFilter === 'verified_only') {
      allFarms.forEach((farm) => {
        if (activeLayerFilter === 'verified_only' && farm.verificationStatus !== 'verified') {
          return;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            farm.farmName.toLowerCase().includes(q) ||
            farm.farmerName.toLowerCase().includes(q) ||
            farm.cropType.toLowerCase().includes(q) ||
            farm.region.toLowerCase().includes(q);
          if (!matches) return;
        }

        const isVerified = farm.verificationStatus === 'verified';
        const lat = farm.centerCoordinates.lat;
        const lng = farm.centerCoordinates.lng;

        // Draw Polygon perimeter if boundaryPolygon exists
        if (farm.boundaryPolygon && farm.boundaryPolygon.length >= 3) {
          const latLngs: [number, number][] = farm.boundaryPolygon.map((p) => [p.lat, p.lng]);
          const polygon = L.polygon(latLngs, {
            color: isVerified ? '#2E7D32' : '#D97706',
            fillColor: isVerified ? '#103B2D' : '#F59E0B',
            fillOpacity: 0.35,
            weight: 2,
            dashArray: isVerified ? undefined : '5, 5',
          });

          polygon.bindTooltip(
            `<strong>${farm.farmName}</strong><br/>${farm.cropType} · ${farm.reportedAreaAcres} Acres`,
            { sticky: true, className: 'leaflet-custom-tooltip' }
          );

          polygon.on('click', () => {
            setSelectedEntity({ type: 'farm', data: farm });
          });

          polygon.addTo(markersGroup);
        }

        // Custom HTML DivIcon for Farm Pin
        const farmIcon = L.divIcon({
          className: 'custom-farm-pin',
          html: `
            <div style="
              width: 30px; 
              height: 30px; 
              background: ${isVerified ? '#103B2D' : '#92400E'}; 
              border: 2px solid ${isVerified ? '#D4AF37' : '#FBBF24'}; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-size: 13px; 
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              🌱
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([lat, lng], { icon: farmIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-xs max-w-xs space-y-2';
        popupContent.innerHTML = `
          <div style="border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-weight: 700; color: #103B2D; font-size: 13px;">${farm.farmName}</span>
              <span style="
                font-size: 9px; 
                font-weight: 700; 
                text-transform: uppercase; 
                padding: 2px 6px; 
                border-radius: 9999px; 
                background: ${isVerified ? '#DCFCE7' : '#FEF3C7'}; 
                color: ${isVerified ? '#166534' : '#92400E'};
              ">
                ${isVerified ? 'Verified GPS' : 'Pending Survey'}
              </span>
            </div>
            <div style="color: #64748B; font-size: 11px; margin-top: 2px;">
              Farmer: <strong>${farm.farmerName}</strong> &middot; ${farm.region}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
            <div><span style="color: #64748B;">Crop:</span> <strong>${farm.cropType.split('(')[0]}</strong></div>
            <div><span style="color: #64748B;">Area:</span> <strong>${farm.reportedAreaAcres} Acres</strong></div>
            <div><span style="color: #64748B;">Soil:</span> ${farm.soilType || 'Loam'}</div>
            <div><span style="color: #64748B;">Irrigation:</span> ${farm.irrigationType || 'Rainfed'}</div>
          </div>

          <div style="font-family: monospace; font-size: 10px; color: #94A3B8; background: #F8FAFC; padding: 4px; border-radius: 4px;">
            GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°W
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedEntity({ type: 'farm', data: farm });
        });

        marker.addTo(markersGroup);
      });
    }

    // 2. RENDER REGIONAL INPUT DISTRIBUTION HUBS
    if (activeLayerFilter === 'all' || activeLayerFilter === 'hubs') {
      REGIONAL_INPUT_HUBS.forEach((hub) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            hub.name.toLowerCase().includes(q) ||
            hub.operator.toLowerCase().includes(q) ||
            hub.region.toLowerCase().includes(q) ||
            hub.featuredInputs.some((i) => i.toLowerCase().includes(q));
          if (!matches) return;
        }

        const getHubBadgeColor = (cat: string) => {
          if (cat === 'fertilizer') return '#1E40AF'; // Blue
          if (cat === 'seed') return '#15803D';       // Green
          if (cat === 'machinery') return '#C2410C';  // Orange
          return '#7E22CE';                          // Purple
        };

        const getHubEmoji = (cat: string) => {
          if (cat === 'fertilizer') return '📦';
          if (cat === 'seed') return '🌾';
          if (cat === 'machinery') return '🚜';
          return '🏢';
        };

        const hubColor = getHubBadgeColor(hub.category);

        const hubIcon = L.divIcon({
          className: 'custom-hub-pin',
          html: `
            <div style="
              width: 36px; 
              height: 36px; 
              background: ${hubColor}; 
              border: 3px solid white; 
              border-radius: 10px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-size: 16px; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              cursor: pointer;
            ">
              ${getHubEmoji(hub.category)}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([hub.coordinates.lat, hub.coordinates.lng], { icon: hubIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-xs max-w-xs space-y-2';
        popupContent.innerHTML = `
          <div style="border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-weight: 700; color: #1E293B; font-size: 13px;">${hub.name}</span>
            </div>
            <div style="color: #64748B; font-size: 11px; margin-top: 2px;">
              ${hub.operator} &middot; <strong>${hub.region}</strong>
            </div>
          </div>

          <div style="background: #F1F5F9; padding: 6px; border-radius: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px;">
            <div><span style="color: #64748B;">Capacity:</span> <strong>${hub.capacityMetricTons.toLocaleString()} MT</strong></div>
            <div><span style="color: #64748B;">Available:</span> <strong style="color: #15803D;">${hub.availableStockMT.toLocaleString()} MT</strong></div>
            <div><span style="color: #64748B;">Vouchers:</span> <strong>${hub.activeVouchersRedeemed} Settled</strong></div>
            <div><span style="color: #64748B;">Contact:</span> ${hub.phone}</div>
          </div>

          <div style="font-size: 10.5px; color: #475569;">
            <strong style="color: #0F172A;">Featured Inputs:</strong>
            <ul style="margin-top: 2px; padding-left: 14px; list-style-type: disc;">
              ${hub.featuredInputs.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedEntity({ type: 'hub', data: hub });
        });

        marker.addTo(markersGroup);
      });
    }
  }, [allFarms, activeLayerFilter, searchQuery]);

  // Handle region zoom presets
  const handleRegionChange = (regionKey: string) => {
    setSelectedRegion(regionKey);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (regionKey === 'all_africa') {
      map.setView([8.0, 10.0], 4);
    } else if (regionKey === 'ghana') {
      map.setView([7.4, -1.8], 7);
    } else if (regionKey === 'bono_ashanti') {
      map.setView([7.1, -2.0], 8);
    } else if (regionKey === 'northern') {
      map.setView([9.5, -0.8], 8);
    } else if (regionKey === 'west_africa') {
      map.setView([7.8, -2.5], 6);
    }
  };

  return (
    <div className={`rounded-3xl border border-[#CBD5E1] bg-white shadow-lg overflow-hidden transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'relative'
    }`}>
      {/* Top Map Control Bar */}
      <div className="bg-[#103B2D] text-white p-4 sm:p-5 border-b border-[#2A4D3F]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E7D32] text-[#D4AF37] shadow-sm shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  Pan-African Agricultural Geospatial Map &amp; Input Distributions
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#103B2D] uppercase hidden sm:inline">
                  Leaflet GIS v1.9
                </span>
              </div>
              <p className="text-xs text-[#F7F5EF]/80 mt-0.5">
                Visualizing smallholder GPS perimeters, certified seed reserves, and regional fertilizer supply depots
              </p>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white/10 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveLayerFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeLayerFilter === 'all' ? 'bg-[#D4AF37] text-[#103B2D]' : 'text-white/80 hover:text-white'
                }`}
              >
                All Entities
              </button>
              <button
                type="button"
                onClick={() => setActiveLayerFilter('farms')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeLayerFilter === 'farms' ? 'bg-[#D4AF37] text-[#103B2D]' : 'text-white/80 hover:text-white'
                }`}
              >
                Farms Only
              </button>
              <button
                type="button"
                onClick={() => setActiveLayerFilter('hubs')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeLayerFilter === 'hubs' ? 'bg-[#D4AF37] text-[#103B2D]' : 'text-white/80 hover:text-white'
                }`}
              >
                Input Depots Only
              </button>
              <button
                type="button"
                onClick={() => setActiveLayerFilter('verified_only')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeLayerFilter === 'verified_only' ? 'bg-[#D4AF37] text-[#103B2D]' : 'text-white/80 hover:text-white'
                }`}
              >
                Verified Only
              </button>
            </div>

            {/* Region Selector */}
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="ghana" className="text-slate-900">Ghana (National Hubs)</option>
              <option value="bono_ashanti" className="text-slate-900">Bono &amp; Ashanti Zones</option>
              <option value="northern" className="text-slate-900">Northern Savannah Corridor</option>
              <option value="west_africa" className="text-slate-900">West Africa Corridor</option>
              <option value="all_africa" className="text-slate-900">All Africa (Continental)</option>
            </select>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-slate-300 block text-[11px]">Total Mapped Parcels</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">{allFarms.length} Farms</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-slate-300 block text-[11px]">Input Hubs Active</span>
            <span className="text-base font-bold text-[#D4AF37] font-mono mt-0.5 block">
              {REGIONAL_INPUT_HUBS.length} Regional Depots
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-slate-300 block text-[11px]">Fertilizer In Inventory</span>
            <span className="text-base font-bold text-emerald-300 font-mono mt-0.5 block">24,340 MT</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-slate-300 block text-[11px]">Vouchers Dispatched</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">3,762 Farmers</span>
          </div>
        </div>
      </div>

      {/* Map Body & Side Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative">
        {/* Leaflet Canvas Container */}
        <div className={`lg:col-span-8 ${isFullscreen ? 'h-[70vh]' : 'h-[500px] sm:h-[550px]'} w-full relative z-10`}>
          <div ref={mapContainerRef} className="h-full w-full" />

          {/* Interactive Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md text-[11px] space-y-1.5 max-w-xs pointer-events-auto">
            <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wider">
              Geospatial Legend
            </span>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#103B2D] border border-[#D4AF37]" />
              <span className="text-slate-700">Verified Smallholder Farm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#92400E] border border-[#FBBF24]" />
              <span className="text-slate-700">Pending GPS Verification Farm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#1E40AF]" />
              <span className="text-slate-700">Fertilizer Supply Depot (NPK/Urea)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#15803D]" />
              <span className="text-slate-700">Certified Seed Hub (Hybrid Maize/Rice)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#C2410C]" />
              <span className="text-slate-700">Mechanization Fleet Hub (Tractors)</span>
            </div>
          </div>
        </div>

        {/* Right Detail Inspection & Entity Explorer Panel */}
        <div className="lg:col-span-4 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto max-h-[550px]">
          <div>
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Search Farms or Input Hubs
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, farmer, or hub name..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#103B2D]"
              />
            </div>

            {selectedEntity ? (
              <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs space-y-3 animate-fade-in">
                {selectedEntity.type === 'farm' ? (
                  <>
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Sprout className="h-4 w-4 text-[#2E7D32]" />
                          <h4 className="font-bold text-sm text-[#103B2D]">{selectedEntity.data.farmName}</h4>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Farmer: {selectedEntity.data.farmerName} &middot; {selectedEntity.data.region}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        selectedEntity.data.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedEntity.data.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Reported Acreage</span>
                        <span className="font-bold text-slate-800">{selectedEntity.data.reportedAreaAcres} Acres</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Primary Crop</span>
                        <span className="font-bold text-slate-800 truncate block">{selectedEntity.data.cropType}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Irrigation Mode</span>
                        <span className="font-bold text-slate-800 capitalize">{selectedEntity.data.irrigationType || 'Rainfed'}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">GPS Coordinates</span>
                        <span className="font-mono text-[10px] text-slate-600">
                          {selectedEntity.data.centerCoordinates.lat.toFixed(3)}°, {selectedEntity.data.centerCoordinates.lng.toFixed(3)}°
                        </span>
                      </div>
                    </div>

                    {selectedEntity.data.verificationStatus !== 'verified' && onVerifyFarm && (
                      <button
                        type="button"
                        onClick={() => onVerifyFarm(selectedEntity.data.id)}
                        className="w-full py-2 px-3 rounded-xl bg-[#103B2D] text-[#D4AF37] hover:bg-[#0B2A20] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Validate Farm Perimeter GPS</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-blue-700" />
                          <h4 className="font-bold text-sm text-slate-900">{selectedEntity.data.name}</h4>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {selectedEntity.data.operator} &middot; {selectedEntity.data.region}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                        {selectedEntity.data.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Depot Capacity</span>
                        <span className="font-bold text-slate-800">{selectedEntity.data.capacityMetricTons.toLocaleString()} MT</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Available Stock</span>
                        <span className="font-bold text-emerald-700">{selectedEntity.data.availableStockMT.toLocaleString()} MT</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Farmer Vouchers</span>
                        <span className="font-bold text-slate-800">{selectedEntity.data.activeVouchersRedeemed} Settled</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Phone Hotline</span>
                        <span className="font-mono text-[10px] text-slate-700">{selectedEntity.data.phone}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                        Stocked Inputs Available for Farmer Dispatch:
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {selectedEntity.data.featuredInputs.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 text-center py-8">
                <MapPin className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <span className="font-semibold text-slate-700 block">Click any marker on the map</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Select a farm parcel or distribution depot to inspect inventory, acreage, and GPS coordinates.
                </span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Leaflet 1.9 &middot; GeoJSON Ready</span>
            <span className="font-semibold text-[#103B2D]">MoFA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
