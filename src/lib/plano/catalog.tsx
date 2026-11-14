import type { ReactNode } from "react";

/**
 * Catálogo de piezas del generador de planos.
 * Cada pieza define su tamaño base en cm y un draw() centrado en 0,0.
 */

export type CatalogItem = {
  key: string;
  label: string;
  w: number;
  h: number;
  draw: () => ReactNode;
};

export type CatalogGroup = {
  id: string;
  label: string;
  items: CatalogItem[];
};

const WALL = "#1c1f24";

export const CATALOG: CatalogGroup[] = [
  {
    id: "salon",
    label: "Salón",
    items: [
      { key: "sofa3", label: "Sofá 3 pl.", w: 210, h: 90, draw: () => (<><rect x={-105} y={-45} width={210} height={90} rx={10} /><rect x={-87} y={-30} width={174} height={62} rx={6} fill="none" /><path d="M-29 -30 V32 M29 -30 V32" fill="none" /></>) },
      { key: "sofa2", label: "Sofá 2 pl.", w: 160, h: 90, draw: () => (<><rect x={-80} y={-45} width={160} height={90} rx={10} /><rect x={-63} y={-30} width={126} height={62} rx={6} fill="none" /><path d="M0 -30 V32" fill="none" /></>) },
      { key: "butaca", label: "Butaca", w: 90, h: 85, draw: () => (<><rect x={-45} y={-42} width={90} height={85} rx={10} /><rect x={-30} y={-26} width={60} height={54} rx={6} fill="none" /></>) },
      { key: "sofa-cama", label: "Sofá cama", w: 200, h: 90, draw: () => (<><rect x={-100} y={-45} width={200} height={90} rx={10} /><rect x={-85} y={-30} width={170} height={62} rx={6} fill="none" /><path d="M-20 -30 V32 M20 -30 V32" fill="none" /><path d="M-100 0 H100" fill="none" strokeDasharray="6 4" /></>) },
      { key: "mesa-aux", label: "Mesa aux.", w: 60, h: 45, draw: () => (<><rect x={-30} y={-22} width={60} height={45} rx={6} /><circle cx={0} cy={0} r={9} fill="none" /></>) },
      { key: "chimenea", label: "Chimenea", w: 100, h: 60, draw: () => (<><rect x={-50} y={-30} width={100} height={60} rx={4} fill="#6b7280" stroke={WALL} strokeWidth={2} /><rect x={-30} y={-20} width={60} height={40} rx={2} fill="#1c1f24" /><circle cx={0} cy={-5} r={12} fill="#f97316" opacity={0.9} /><path d="M-8 -15 Q0 -25 8 -15 Q4 -10 0 -5 Q-4 -10 -8 -15" fill="#fbbf24" /></>) },
      { key: "piano", label: "Piano", w: 150, h: 90, draw: () => (<><rect x={-75} y={-45} width={150} height={90} rx={6} fill="#1c1f24" stroke={WALL} /><rect x={-62} y={-32} width={124} height={30} rx={2} fill="#faf9f7" /><path d="M-50 -32 V-2 M-35 -32 V-2 M-20 -32 V-2 M-5 -32 V-2 M10 -32 V-2 M25 -32 V-2 M40 -32 V-2" fill="none" stroke="#94a3b8" strokeWidth={1} /><rect x={-56} y={-32} width={8} height={19} rx={1} fill="#1c1f24" /><rect x={-41} y={-32} width={8} height={19} rx={1} fill="#1c1f24" /><rect x={-11} y={-32} width={8} height={19} rx={1} fill="#1c1f24" /><rect x={4} y={-32} width={8} height={19} rx={1} fill="#1c1f24" /><rect x={19} y={-32} width={8} height={19} rx={1} fill="#1c1f24" /></>) },
      { key: "barra-americana", label: "Barra americana", w: 200, h: 50, draw: () => (<><rect x={-100} y={-25} width={200} height={50} rx={8} fill="#78350f" stroke={WALL} strokeWidth={2} /><rect x={-90} y={-18} width={180} height={8} rx={4} fill="#92400e" /><path d="M-80 -25 V25 M-55 -25 V25 M-30 -25 V25 M-5 -25 V25 M20 -25 V25 M45 -25 V25 M70 -25 V25" fill="none" stroke="#6b4a32" strokeWidth={2} /></>) },
      { key: "tv", label: "TV / barra", w: 140, h: 25, draw: () => (<><rect x={-70} y={-12} width={140} height={25} rx={3} /><path d="M-58 0 H58" fill="none" /></>) },
      { key: "estanteria", label: "Estantería", w: 80, h: 30, draw: () => (<><rect x={-40} y={-15} width={80} height={30} rx={3} /><path d="M-14 -15 V15 M14 -15 V15" fill="none" /></>) },
    ],
  },
  {
    id: "comedor",
    label: "Comedor",
    items: [
      { key: "mesa4", label: "Mesa 4", w: 120, h: 80, draw: () => (<><rect x={-60} y={-40} width={120} height={80} rx={8} /><rect x={-48} y={-28} width={96} height={56} rx={5} fill="none" /></>) },
      { key: "mesa6", label: "Mesa 6", w: 180, h: 90, draw: () => (<><rect x={-90} y={-45} width={180} height={90} rx={8} /><rect x={-77} y={-32} width={154} height={64} rx={5} fill="none" /></>) },
      { key: "mesa-ronda", label: "Mesa redonda", w: 120, h: 120, draw: () => (<><circle cx={0} cy={0} r={60} /><circle cx={0} cy={0} r={49} fill="none" /></>) },
      { key: "silla", label: "Silla", w: 45, h: 45, draw: () => (<><rect x={-22} y={-22} width={45} height={45} rx={6} /><rect x={-22} y={-22} width={45} height={10} rx={4} fill="none" /></>) },
    ],
  },
  {
    id: "dormitorio",
    label: "Dormitorio",
    items: [
      { key: "cama150", label: "Cama 150", w: 150, h: 200, draw: () => (<><rect x={-75} y={-100} width={150} height={200} rx={8} /><rect x={-75} y={-100} width={150} height={22} fill="none" /><rect x={-64} y={-70} width={58} height={30} rx={6} /><rect x={6} y={-70} width={58} height={30} rx={6} /><path d="M-75 -28 H75" fill="none" /></>) },
      { key: "cama90", label: "Cama 90", w: 90, h: 200, draw: () => (<><rect x={-45} y={-100} width={90} height={200} rx={8} /><rect x={-45} y={-100} width={90} height={22} fill="none" /><rect x={-34} y={-70} width={68} height={30} rx={6} /><path d="M-45 -28 H45" fill="none" /></>) },
      { key: "litera", label: "Litera", w: 95, h: 200, draw: () => (<><rect x={-47} y={-100} width={95} height={200} rx={6} fill="#faf9f7" stroke={WALL} strokeWidth={2} /><rect x={-47} y={-100} width={95} height={22} fill="none" stroke={WALL} strokeWidth={2} /><rect x={-36} y={-70} width={72} height={28} rx={5} /><path d="M-47 -28 H47" fill="none" stroke={WALL} strokeWidth={2} /><rect x={-47} y={-28} width={95} height={22} fill="none" stroke={WALL} strokeWidth={2} /><rect x={-36} y={20} width={72} height={28} rx={5} /><path d="M-47 60 H47" fill="none" stroke={WALL} strokeWidth={2} /><path d="M-47 -100 V100 M47 -100 V100" fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 4" /></>) },
      { key: "mesita", label: "Mesita", w: 45, h: 40, draw: () => (<><rect x={-22} y={-20} width={45} height={40} rx={4} /><circle cx={0} cy={0} r={8} fill="none" /></>) },
      { key: "armario", label: "Armario", w: 180, h: 60, draw: () => (<><rect x={-90} y={-30} width={180} height={60} rx={3} /><path d="M0 -30 V30" fill="none" /><path d="M-8 -5 V5 M8 -5 V5" fill="none" /></>) },
      { key: "comoda", label: "Cómoda", w: 120, h: 50, draw: () => (<><rect x={-60} y={-25} width={120} height={50} rx={3} /><path d="M-60 0 H60" fill="none" /><path d="M-14 -12 V-4 M14 -12 V-4 M-14 4 V12 M14 4 V12" fill="none" /></>) },
    ],
  },
  {
    id: "cocina",
    label: "Cocina",
    items: [
      { key: "encimera", label: "Encimera", w: 180, h: 60, draw: () => (<><rect x={-90} y={-30} width={180} height={60} rx={3} /><rect x={-80} y={-21} width={160} height={42} rx={2} fill="none" /></>) },
      { key: "fregadero", label: "Fregadero", w: 60, h: 55, draw: () => (<><rect x={-30} y={-27} width={60} height={55} rx={5} /><rect x={-22} y={-8} width={44} height={30} rx={4} fill="none" /><circle cx={0} cy={-17} r={5} fill="none" /></>) },
      { key: "campana", label: "Campana extractora", w: 60, h: 45, draw: () => (<><rect x={-30} y={-22} width={60} height={15} rx={4} /><rect x={-24} y={-7} width={48} height={29} rx={4} fill="none" /><path d="M-18 -22 V-30 M0 -22 V-30 M18 -22 V-30" fill="none" /></>) },
      { key: "placa", label: "Placa", w: 60, h: 60, draw: () => (<><rect x={-30} y={-30} width={60} height={60} rx={4} /><circle cx={-15} cy={-15} r={9} fill="none" /><circle cx={15} cy={-15} r={9} fill="none" /><circle cx={-15} cy={15} r={9} fill="none" /><circle cx={15} cy={15} r={9} fill="none" /></>) },
      { key: "frigorifico", label: "Frigorífico", w: 60, h: 65, draw: () => (<><rect x={-30} y={-32} width={60} height={65} rx={4} /><path d="M-30 -12 H30" fill="none" /><path d="M20 -28 V-16 M20 -8 V4" fill="none" /></>) },
      { key: "microondas", label: "Microondas", w: 55, h: 35, draw: () => (<><rect x={-27} y={-17} width={55} height={35} rx={4} fill="#faf9f7" stroke="#1c1f24" strokeWidth={2} /><rect x={-20} y={-11} width={30} height={22} rx={2} fill="#1c1f24" /><rect x={16} y={-11} width={8} height={22} rx={2} fill="#e5e7eb" stroke="#9ca3af" strokeWidth={1} /><circle cx={20} cy={-4} r={3} fill="#f6821f" /><circle cx={20} cy={6} r={3} fill="#374151" /></>) },
      { key: "horno", label: "Horno empotrado", w: 60, h: 60, draw: () => (<><rect x={-30} y={-30} width={60} height={60} rx={4} fill="#374151" stroke="#1c1f24" strokeWidth={2} /><rect x={-22} y={-22} width={44} height={34} rx={3} fill="#1c1f24" /><rect x={-20} y={-20} width={40} height={30} rx={2} fill="#111827" stroke="#6b7280" strokeWidth={1} /><rect x={-20} y={18} width={40} height={8} rx={2} fill="#6b7280" /><circle cx={-12} cy={22} r={3} fill="#f6821f" /><circle cx={0} cy={22} r={3} fill="#374151" /><circle cx={12} cy={22} r={3} fill="#374151" /></>) },
      { key: "lavavajillas", label: "Lavavajillas", w: 60, h: 60, draw: () => (<><rect x={-30} y={-30} width={60} height={60} rx={4} fill="#faf9f7" stroke={WALL} strokeWidth={2} /><rect x={-22} y={-22} width={44} height={34} rx={3} fill="none" stroke="#6b7280" strokeWidth={1.5} /><path d="M-18 -10 H18 M-18 -2 H18 M-18 6 H18" fill="none" stroke="#94a3b8" strokeWidth={1.5} /><rect x={-20} y={18} width={40} height={8} rx={3} fill="#e5e7eb" stroke="#9ca3af" strokeWidth={1} /><circle cx={16} cy={22} r={3} fill="#f6821f" /></>) },
      { key: "mesa-desayuno", label: "Mesa desayuno", w: 80, h: 60, draw: () => (<><rect x={-40} y={-30} width={80} height={60} rx={6} fill="#faf9f7" stroke={WALL} strokeWidth={2} /><rect x={-32} y={-22} width={64} height={44} rx={4} fill="none" stroke="#6b7280" /><circle cx={-15} cy={0} r={8} fill="none" stroke="#94a3b8" strokeWidth={1.5} /><circle cx={15} cy={0} r={8} fill="none" stroke="#94a3b8" strokeWidth={1.5} /></>) },
      { key: "isla", label: "Isla", w: 120, h: 80, draw: () => (<><rect x={-60} y={-40} width={120} height={80} rx={4} /><rect x={-48} y={-29} width={96} height={58} rx={3} fill="none" /></>) },
    ],
  },
  {
    id: "banio",
    label: "Baño",
    items: [
      { key: "inodoro", label: "Inodoro", w: 40, h: 70, draw: () => (<><rect x={-20} y={-35} width={40} height={18} rx={4} /><rect x={-17} y={-17} width={34} height={52} rx={14} /><circle cx={0} cy={6} r={9} fill="none" /></>) },
      { key: "bide", label: "Bidé", w: 40, h: 55, draw: () => (<><rect x={-20} y={-27} width={40} height={55} rx={14} /><rect x={-14} y={-15} width={28} height={30} rx={10} fill="none" /><circle cx={0} cy={-10} r={4} fill="none" /></>) },
      { key: "lavabo", label: "Lavabo", w: 55, h: 45, draw: () => (<><rect x={-27} y={-22} width={55} height={45} rx={8} /><ellipse cx={0} cy={3} rx={17} ry={12} fill="none" /><circle cx={0} cy={-14} r={4} fill="none" /></>) },
      { key: "ducha", label: "Ducha", w: 90, h: 90, draw: () => (<><rect x={-45} y={-45} width={90} height={90} rx={5} /><path d="M-45 -45 L45 45" fill="none" /><circle cx={0} cy={0} r={6} fill="none" /></>) },
      { key: "banera", label: "Bañera", w: 170, h: 75, draw: () => (<><rect x={-85} y={-37} width={170} height={75} rx={16} /><rect x={-74} y={-27} width={148} height={55} rx={12} fill="none" /><circle cx={62} cy={0} r={5} fill="none" /></>) },
      {
        key: "jacuzzi",
        label: "Jacuzzi",
        w: 180, h: 180,
        draw: () => (
          <>
            <rect x={-90} y={-90} width={180} height={180} rx={20} fill="#dceef8" stroke={WALL} strokeWidth={4} />
            <rect x={-76} y={-76} width={152} height={152} rx={16} fill="#bfdbfe" stroke="#93c5fd" strokeWidth={2} />
            {/* Chorros de agua */}
            {[[-55,-55],[55,-55],[-55,55],[55,55],[0,-68],[0,68],[-68,0],[68,0]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={6} fill="#60a5fa" opacity={0.8} />
            ))}
            {/* Asientos */}
            <rect x={-80} y={-80} width={30} height={16} rx={4} fill="#93c5fd" stroke="#3b82f6" strokeWidth={1.5} />
            <rect x={50} y={-80} width={30} height={16} rx={4} fill="#93c5fd" stroke="#3b82f6" strokeWidth={1.5} />
            <rect x={-80} y={64} width={30} height={16} rx={4} fill="#93c5fd" stroke="#3b82f6" strokeWidth={1.5} />
            <rect x={50} y={64} width={30} height={16} rx={4} fill="#93c5fd" stroke="#3b82f6" strokeWidth={1.5} />
            {/* Control panel */}
            <rect x={-18} y={-82} width={36} height={12} rx={4} fill="#1e40af" />
            <circle cx={-8} cy={-76} r={3} fill="#f6821f" />
            <circle cx={0} cy={-76} r={3} fill="#22c55e" />
            <circle cx={8} cy={-76} r={3} fill="#ef4444" />
          </>
        ),
      },
      {
        key: "sauna",
        label: "Sauna",
        w: 200, h: 180,
        draw: () => (
          <>
            <rect x={-100} y={-90} width={200} height={180} rx={6} fill="#d2b48c" stroke={WALL} strokeWidth={4} />
            {/* Bancos */}
            <rect x={-88} y={-78} width={176} height={35} rx={4} fill="#92400e" stroke="#78350f" strokeWidth={2} />
            <rect x={-88} y={-35} width={176} height={35} rx={4} fill="#a16207" stroke="#78350f" strokeWidth={2} />
            {/* Fogón / piedras */}
            <rect x={-30} y={30} width={60} height={48} rx={6} fill="#374151" stroke="#1f2937" strokeWidth={2} />
            {[-15,-5,5,15,-10,10,-20,20].map((x,i) => (
              <ellipse key={i} cx={x} cy={40 + (i%3)*8} rx={6} ry={4} fill="#6b7280" />
            ))}
            {/* Vapor */}
            <path d="M-10 28 Q-5 18 0 28 Q5 18 10 28" fill="none" stroke="#94a3b8" strokeWidth={2} opacity={0.6} />
            {/* Puerta */}
            <rect x={-100} y={-10} width={5} height={50} rx={2} fill="#6b4a32" />
            <rect x={-95} y={-10} width={2} height={50} fill="#92400e" />
          </>
        ),
      },
      {
        key: "hidromasaje",
        label: "Ducha hidromasaje",
        w: 110, h: 110,
        draw: () => (
          <>
            <rect x={-55} y={-55} width={110} height={110} rx={8} fill="#f8fafc" stroke={WALL} strokeWidth={3} />
            {/* Panel de control */}
            <rect x={-50} y={-50} width={22} height={35} rx={4} fill="#1e40af" />
            <circle cx={-39} cy={-42} r={4} fill="#f6821f" />
            <rect x={-46} y={-34} width={14} height={3} rx={1} fill="#60a5fa" />
            <rect x={-46} y={-28} width={10} height={3} rx={1} fill="#93c5fd" />
            {/* Lluvia efecto */}
            {[[-20,-30],[-8,-35],[4,-28],[16,-33],[-14,-20],[0,-18],[12,-22]].map(([x,y],i) => (
              <line key={i} x1={x} y1={y} x2={x-2} y2={y+10} stroke="#93c5fd" strokeWidth={2} strokeLinecap="round" />
            ))}
            {/* Cabezal */}
            <rect x={-24} y={-42} width={48} height={8} rx={4} fill="#6b7280" />
            {/* Suelo con desagüe */}
            <circle cx={10} cy={30} r={8} fill="none" stroke="#94a3b8" strokeWidth={2} />
            <path d="M6 30 H14 M10 26 V34" stroke="#94a3b8" strokeWidth={1.5} />
          </>
        ),
      },
      { key: "mampara", label: "Mampara ducha", w: 100, h: 10, draw: () => (<><rect x={-50} y={-5} width={100} height={10} rx={2} fill="#dceef8" stroke="#1d4ed8" strokeWidth={2} /><path d="M0 -5 V5" fill="none" stroke="#93c5fd" strokeWidth={2} /><path d="M-45 -5 V5 M45 -5 V5" fill="none" stroke="#3b82f6" strokeWidth={1.5} /></>) },
      { key: "espejo", label: "Espejo", w: 80, h: 12, draw: () => (<><rect x={-40} y={-10} width={80} height={20} rx={4} fill="#faf9f7" stroke="#1c1f24" /><rect x={-34} y={-6} width={68} height={12} fill="#dce6f1" stroke="#4a5568" /><path d="M-18 -6 H18" fill="none" stroke="#94a3b8" strokeWidth={1.5} /></>) },
      { key: "toallero", label: "Toallero", w: 60, h: 8, draw: () => (<><rect x={-30} y={-4} width={60} height={8} rx={4} fill="#faf9f7" stroke="#1c1f24" /><path d="M-24 -2 h48" fill="none" stroke="#94a3b8" strokeWidth={1.5} /></>) },
      { key: "calefactor", label: "Calefactor", w: 50, h: 20, draw: () => (<><rect x={-25} y={-10} width={50} height={20} rx={4} fill="#faf9f7" stroke="#1c1f24" /><path d="M-18 -6 H18 M-18 0 H18 M-18 6 H18" fill="none" stroke="#f6821f" strokeWidth={2} /></>) },
    ],
  },
  {
    id: "construccion",
    label: "Construcción",
    items: [
      { key: "tabique", label: "Tabique", w: 200, h: 12, draw: () => (<rect x={-100} y={-6} width={200} height={12} fill={WALL} stroke={WALL} />) },
      { key: "portero", label: "Portero automático", w: 150, h: 9, draw: () => (<><rect x={-75} y={-4} width={150} height={9} rx={3} fill={WALL} stroke={WALL} /><rect x={-70} y={-7} width={18} height={14} rx={2} fill="#1f2937" /><circle cx={0} cy={0} r={2.5} fill="#f6821f" /><path d="M-50 -4 L-50 5 M50 -4 L50 5" fill="none" stroke="#1f2937" strokeWidth={1.5} /></>) },
      { key: "puerta", label: "Puerta", w: 90, h: 90, draw: () => (<><path d="M-45 -45 A 90 90 0 0 1 45 45" fill="none" strokeDasharray="10 8" strokeWidth={2} /><rect x={-45} y={-45} width={9} height={90} fill={WALL} stroke={WALL} strokeWidth={1.5} /><circle cx={-45} cy={45} r={5} fill={WALL} stroke="none" /></>) },
      { key: "puerta-doble", label: "Puerta doble (2 hojas)", w: 160, h: 90, draw: () => (<><path d="M-80 -45 Q-20 -10 80 45" fill="none" strokeDasharray="10 8" strokeWidth={2} /><path d="M80 -45 Q20 -10 -80 45" fill="none" strokeDasharray="10 8" strokeWidth={2} /><rect x={-80} y={-45} width={8} height={90} fill={WALL} stroke={WALL} strokeWidth={1.5} /><rect x={72} y={-45} width={8} height={90} fill={WALL} stroke={WALL} strokeWidth={1.5} /><circle cx={-72} cy={45} r={5} fill={WALL} stroke="none" /><circle cx={72} cy={45} r={5} fill={WALL} stroke="none" /></>) },
      { key: "ventana", label: "Ventana", w: 120, h: 15, draw: () => (<><rect x={-60} y={-7} width={120} height={15} rx={2} fill="#faf9f7" stroke="#1c1f24" strokeWidth={1.8} /><rect x={-52} y={-5} width={104} height={10} rx={1} fill="#dcecf8" stroke="#4a5568" strokeWidth={1} /><path d="M0 -5 V5" fill="none" stroke="#4a5568" strokeWidth={1.4} /><path d="M-52 0 H52" fill="none" stroke="#4a5568" strokeWidth={1.4} /><rect x={-55} y={-6} width={7} height={2} rx={1} fill="#6b7280" /><rect x={48} y={-6} width={7} height={2} rx={1} fill="#6b7280" /></>) },
      { key: "columna", label: "Columna", w: 30, h: 30, draw: () => (<rect x={-15} y={-15} width={30} height={30} fill={WALL} stroke={WALL} />) },
      {
        key: "ascensor",
        label: "Ascensor",
        w: 120, h: 120,
        draw: () => (
          <>
            <rect x={-60} y={-60} width={120} height={120} rx={4} fill="#f1f5f9" stroke={WALL} strokeWidth={4} />
            <rect x={-50} y={-50} width={100} height={100} rx={3} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={2} />
            {/* Puertas */}
            <rect x={-50} y={-50} width={48} height={100} rx={2} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={1.5} />
            <rect x={2} y={-50} width={48} height={100} rx={2} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={1.5} />
            {/* Tirador */}
            <rect x={-6} y={-8} width={12} height={5} rx={2} fill="#6b7280" />
            {/* Panel botones */}
            <rect x={55} y={-30} width={15} height={60} rx={3} fill="#374151" />
            {[-20,-8,4,16,28].map((y,i) => (
              <circle key={i} cx={62} cy={y} r={4} fill={i===2?"#22c55e":"#6b7280"} />
            ))}
            {/* Flecha arriba/abajo */}
            <path d="M62 -38 L58 -44 L66 -44 Z" fill="#fbbf24" />
            <path d="M62 36 L58 42 L66 42 Z" fill="#fbbf24" transform="rotate(180 62 39)" />
          </>
        ),
      },
      {
        key: "rampa",
        label: "Rampa acceso",
        w: 120, h: 200,
        draw: () => (
          <>
            <rect x={-60} y={-100} width={120} height={200} rx={4} fill="#f8fafc" stroke={WALL} strokeWidth={3} />
            {/* Superficie inclinada (efecto con líneas) */}
            {[-80,-55,-30,-5,20,45,70].map((y,i) => (
              <line key={i} x1={-55} y1={y} x2={55} y2={y} stroke="#cbd5e1" strokeWidth={2} />
            ))}
            {/* Barandillas */}
            <line x1={-52} y1={-95} x2={-52} y2={95} stroke="#6b7280" strokeWidth={4} strokeLinecap="round" />
            <line x1={52} y1={-95} x2={52} y2={95} stroke="#6b7280" strokeWidth={4} strokeLinecap="round" />
            {/* Flecha dirección */}
            <path d="M0 50 V-70" fill="none" stroke="#f6821f" strokeWidth={3} />
            <path d="M-12 -50 L0 -75 L12 -50" fill="none" stroke="#f6821f" strokeWidth={3} />
            {/* Pendiente % */}
            <rect x={-18} y={-12} width={36} height={18} rx={3} fill="#1e40af" />
            <text x={0} y={2} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#ffffff">8%</text>
          </>
        ),
      },
      { key: "escalera-construccion", label: "Escalera", w: 90, h: 240, draw: () => (<><rect x={-45} y={-120} width={90} height={240} fill="#ffffff" />{Array.from({ length: 7 }, (_, i) => (<path key={i} d={`M-45 ${-120 + (i + 1) * 30} H45`} fill="none" strokeWidth={2} />))}<path d="M0 105 V-95" fill="none" strokeWidth={2} /><path d="M-12 -75 L0 -100 L12 -75" fill="none" strokeWidth={2} /></>) },
      { key: "curva90", label: "Curva 90°", w: 150, h: 150, draw: () => (<><path d="M 0 -75 A 75 75 0 0 1 75 0" fill="none" stroke={WALL} strokeWidth={12} strokeLinecap="butt" /><circle cx={0} cy={-75} r={3} fill={WALL} /><circle cx={75} cy={0} r={3} fill={WALL} /></>) },
      { key: "curva180", label: "Curva 180°", w: 150, h: 75, draw: () => (<><path d="M -75 0 A 75 75 0 0 1 75 0" fill="none" stroke={WALL} strokeWidth={12} strokeLinecap="butt" /><circle cx={-75} cy={0} r={3} fill={WALL} /><circle cx={75} cy={0} r={3} fill={WALL} /></>) },
    ],
  },
  {
    id: "varios",
    label: "Varios",
    items: [
      { key: "alfombra", label: "Alfombra", w: 200, h: 140, draw: () => (<><rect x={-100} y={-70} width={200} height={140} rx={6} strokeDasharray="12 9" fill="none" /><rect x={-86} y={-56} width={172} height={112} rx={5} strokeDasharray="8 7" fill="none" /></>) },
      { key: "planta", label: "Planta", w: 60, h: 60, draw: () => (<><circle cx={0} cy={0} r={28} /><circle cx={0} cy={0} r={15} fill="none" /></>) },
      { key: "mesa-centro", label: "Mesa centro", w: 120, h: 60, draw: () => (<><rect x={-60} y={-30} width={120} height={60} rx={8} /><rect x={-48} y={-18} width={96} height={36} rx={4} fill="none" /></>) },
      { key: "lampara-pie", label: "Lámpara pie", w: 40, h: 40, draw: () => (<><circle cx={0} cy={0} r={18} /><circle cx={0} cy={0} r={6} fill="none" /><path d="M0 18 V40" fill="none" strokeWidth={2} /></>) },
      { key: "librero", label: "Librería", w: 90, h: 30, draw: () => (<><rect x={-45} y={-15} width={90} height={30} rx={3} /><path d="M-30 -15 V15 M-15 -15 V15 M0 -15 V15 M15 -15 V15 M30 -15 V15" fill="none" /></>) },
      { key: "tv-mueble", label: "Mueble TV", w: 160, h: 45, draw: () => (<><rect x={-80} y={-22} width={160} height={45} rx={4} /><rect x={-70} y={-12} width={140} height={22} rx={3} fill="none" /><path d="M-60 0 H60" fill="none" /></>) },
      { key: "aparador", label: "Aparador/Buffet", w: 160, h: 45, draw: () => (<><rect x={-80} y={-22} width={160} height={45} rx={4} fill="#faf9f7" stroke="#1c1f24" strokeWidth={2} /><path d="M0 -22 V22" fill="none" stroke="#94a3b8" strokeWidth={1.5} /><path d="M-72 -22 V-8" fill="none" stroke="#6b7280" strokeWidth={1.5} /><path d="M72 -22 V-8" fill="none" stroke="#6b7280" strokeWidth={1.5} /><rect x={-70} y={-20} width={60} height={12} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} /><rect x={10} y={-20} width={60} height={12} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} /><path d="M-14 -14 V-14 M14 -14 V-14" fill="none" stroke="#6b7280" strokeWidth={1.5} /><circle cx={-4} cy={-14} r={2.5} fill="#94a3b8" /><circle cx={4} cy={-14} r={2.5} fill="#94a3b8" /></>) },
      { key: "rinconera", label: "Rinconera", w: 90, h: 90, draw: () => (<><path d="M-45 45 L-45 -45 L45 -45" fill="none" stroke="#1c1f24" strokeWidth={2} /><rect x={-45} y={-45} width={90} height={22} rx={3} fill="#faf9f7" stroke="#1c1f24" strokeWidth={2} /><rect x={-45} y={23} width={22} height={22} rx={3} fill="#faf9f7" stroke="#1c1f24" strokeWidth={2} /></>) },
    ],
  },
  {
    id: "oficina",
    label: "Oficina",
    items: [
      { key: "escritorio", label: "Escritorio", w: 140, h: 70, draw: () => (<><rect x={-70} y={-35} width={140} height={70} rx={4} /><rect x={-60} y={-25} width={120} height={50} rx={3} fill="none" /><path d="M-50 0 H50" fill="none" /></>) },
      { key: "silla-oficina", label: "Silla oficina", w: 60, h: 60, draw: () => (<><rect x={-30} y={-30} width={60} height={60} rx={8} /><circle cx={0} cy={0} r={18} fill="none" /><path d="M-20 25 H20" fill="none" strokeWidth={2} /></>) },
      { key: "archivador", label: "Archivador", w: 45, h: 60, draw: () => (<><rect x={-22} y={-30} width={45} height={60} rx={3} /><path d="M-22 -10 H23 M-22 10 H23" fill="none" /><path d="M10 -20 V-16 M10 0 V4 M10 20 V24" fill="none" /></>) },
      { key: "estanteria-libros", label: "Estantería libros", w: 80, h: 30, draw: () => (<><rect x={-40} y={-15} width={80} height={30} rx={3} /><path d="M-32 -15 V15 M-16 -15 V15 M0 -15 V15 M16 -15 V15 M32 -15 V15" fill="none" /></>) },
    ],
  },
  {
    id: "lavanderia",
    label: "Lavandería",
    items: [
      { key: "lavadora", label: "Lavadora", w: 60, h: 60, draw: () => (<><rect x={-30} y={-30} width={60} height={60} rx={6} /><circle cx={0} cy={5} r={18} fill="none" /><circle cx={0} cy={5} r={10} fill="none" /><path d="M-12 -22 H12" fill="none" strokeWidth={2} /></>) },
      { key: "secadora", label: "Secadora", w: 60, h: 60, draw: () => (<><rect x={-30} y={-30} width={60} height={60} rx={6} /><circle cx={0} cy={5} r={18} fill="none" /><path d="M-10 -2 H10 M0 -12 V12" fill="none" strokeWidth={2} /><path d="M-12 -22 H12" fill="none" strokeWidth={2} /></>) },
      { key: "tendedero", label: "Tendedero", w: 120, h: 40, draw: () => (<><rect x={-60} y={-20} width={120} height={40} rx={4} /><path d="M-50 -12 H50 M-50 -4 H50 M-50 4 H50 M-50 12 H50" fill="none" /></>) },
    ],
  },
  {
    id: "dormitorio-extra",
    label: "Dormitorio extra",
    items: [
      { key: "cuna", label: "Cuna", w: 70, h: 130, draw: () => (<><rect x={-35} y={-65} width={70} height={130} rx={6} /><path d="M-35 -55 H35 M-35 -40 H35" fill="none" /><circle cx={0} cy={-50} r={6} fill="none" /></>) },
      { key: "tocador", label: "Tocador", w: 100, h: 45, draw: () => (<><rect x={-50} y={-22} width={100} height={45} rx={4} /><rect x={-40} y={-15} width={80} height={30} rx={3} fill="none" /><circle cx={-25} cy={0} r={6} fill="none" /><circle cx={25} cy={0} r={6} fill="none" /></>) },
      { key: "ropero", label: "Ropero", w: 120, h: 60, draw: () => (<><rect x={-60} y={-30} width={120} height={60} rx={3} /><path d="M-60 0 H60" fill="none" /><path d="M-50 -20 V-5 M-40 -20 V-5 M50 -20 V-5 M40 -20 V-5" fill="none" /></>) },
    ],
  },
  {
    id: "exterior",
    label: "Exterior / Jardín",
    items: [
      { key: "maceta", label: "Maceta", w: 45, h: 45, draw: () => (<><circle cx={0} cy={0} r={22} fill="#faf9f7" /><rect x={-14} y={-2} width={28} height={14} rx={3} fill="#92400e" stroke="#78350f" /><path d="M-20 16 H20" fill="none" stroke="#92400e" strokeWidth={2.5} /></>) },
      { key: "planta-ext", label: "Planta", w: 60, h: 60, draw: () => (<><circle cx={0} cy={0} r={22} fill="#22c55e" /><circle cx={0} cy={0} r={14} fill="#16a34a" /><path d="M0 0 V-8" fill="none" stroke="#166534" strokeWidth={2} /><circle cx={-8} cy={-2} r={3} fill="#166534" /><circle cx={10} cy={-5} r={3} fill="#166534" /></>) },
      { key: "fuente", label: "Fuente", w: 90, h: 90, draw: () => (<><circle cx={0} cy={0} r={45} fill="#dcecf8" stroke="#1c1f24" /><circle cx={0} cy={0} r={18} fill="#faf9f7" stroke="#1c1f24" /><circle cx={0} cy={0} r={6} fill="#f6821f" /><path d="M-18 -12 C-10 -24 10 -24 18 -12 M-12 12 C-4 4 4 4 12 12" fill="none" stroke="#4f96e6" strokeWidth={2.5} /></>) },
      { key: "barbacoa", label: "Barbacoa", w: 120, h: 60, draw: () => (<><rect x={-60} y={-30} width={120} height={60} rx={8} fill="#faf9f7" stroke="#1c1f24" /><rect x={-48} y={-18} width={96} height={24} rx={4} fill="#d1d5db" stroke="#6b7280" /><path d="M-36 -26 V-52 M-12 -26 V-52 M12 -26 V-52 M6 -26 V-52 M36 -26 V-52" fill="none" stroke="#6b7280" strokeWidth={3} /></>) },
      { key: "piscina", label: "Piscina", w: 300, h: 200, draw: () => (<><rect x={-150} y={-100} width={300} height={200} rx={18} fill="#dcecf8" stroke="#1c1f24" strokeWidth={4} /><rect x={-136} y={-86} width={272} height={172} rx={14} fill="none" stroke="#93c5fd" /><path d="M-120 -30 H120 M-110 30 H110" fill="none" stroke="#4f96e6" strokeWidth={2.5} strokeDasharray="14 10" /></>) },
      { key: "escalera-piscina-ladrillo", label: "Escalera piscina (ladrillo curvo)", w: 90, h: 100, draw: () => (<><path d="M-45 -50 C-10 -50 42 -20 45 45" fill="none" stroke="#92400e" strokeWidth={18} /><path d="M-42 -40 C-8 -40 36 -12 38 45" fill="none" stroke="#c77b3c" strokeWidth={9} /><rect x={-34} y={-40} width={70} height={12} rx={4} fill="#faf9f7" stroke="#92400e" /><rect x={-24} y={-20} width={62} height={12} rx={4} fill="#faf9f7" stroke="#92400e" /><rect x={-12} y={-0} width={58} height={12} rx={4} fill="#faf9f7" stroke="#92400e" /><rect x={0} y={20} width={52} height={12} rx={4} fill="#faf9f7" stroke="#92400e" /><circle cx={-40} cy={-45} r={4} fill="#78350f" /><circle cx={42} cy={42} r={4} fill="#78350f" /></>) },
      { key: "escalera-piscina-metal", label: "Escalera piscina (metal)", w: 70, h: 110, draw: () => (<><path d="M-32 -55 V55" fill="none" stroke="#1f2937" strokeWidth={6} /><path d="M32 -55 V55" fill="none" stroke="#1f2937" strokeWidth={6} /><path d="M-32 -55 L32 -55" fill="none" stroke="#1f2937" strokeWidth={5} /><rect x={-32} y={-45} width={64} height={9} rx={2} fill="#faf9f7" stroke="#1f2937" /><rect x={-32} y={-25} width={64} height={9} rx={2} fill="#faf9f7" stroke="#1f2937" /><rect x={-32} y={-5} width={64} height={9} rx={2} fill="#faf9f7" stroke="#1f2937" /><rect x={-32} y={15} width={64} height={9} rx={2} fill="#faf9f7" stroke="#1f2937" /><rect x={-32} y={35} width={64} height={9} rx={2} fill="#faf9f7" stroke="#1f2937" /><path d="M-32 -55 C-45 -40 -45 40 -32 55" fill="none" stroke="#6b7280" strokeWidth={3} /><path d="M32 -55 C45 -40 45 40 32 55" fill="none" stroke="#6b7280" strokeWidth={3} /></>) },
      { key: "parasol", label: "Sombrilla/Parásol", w: 150, h: 150, draw: () => (<><circle cx={0} cy={0} r={10} fill="#faf9f7" stroke="#1c1f24" /><path d="M-70 0 A 70 70 0 0 1 75 0" fill="#fbbf24" stroke="#1c1f24" /><path d="M-70 0 A 70 70 0 0 0 75 0" fill="#fbbf24" stroke="#1c1f24" /><path d="M0 0 V-75" fill="none" stroke="#78350f" strokeWidth={3} /></>) },
      { key: "pergola", label: "Pérgola", w: 200, h: 150, draw: () => (<><rect x={-100} y={-65} width={200} height={130} rx={6} fill="none" stroke="#1c1f24" strokeDasharray="14 10" /><path d="M-90 -55 H90 M-90 -20 H90 M-90 15 H90 M-90 50 H90" fill="none" stroke="#22c55e" strokeWidth={2.5} /></>) },
      { key: "banco-ext", label: "Banco exterior", w: 120, h: 40, draw: () => (<><rect x={-60} y={-20} width={120} height={40} rx={6} fill="#faf9f7" stroke="#1c1f24" /><path d="M-48 -10 H48 M-48 0 H48 M-48 10 H48" fill="none" stroke="#92400e" strokeWidth={2} /></>) },
      { key: "celosia", label: "Celosía", w: 200, h: 12, draw: () => (<><rect x={-100} y={-6} width={200} height={12} rx={2} fill="#faf9f7" stroke="#92400e" /><path d="M-94 -6 L-82 6 M-78 -6 L-66 6 M-62 -6 L-50 6 M-46 -6 L-34 6 M-30 -6 L-18 6 M-14 -6 L-2 6 M2 -6 L14 6 M18 -6 L30 6 M34 -6 L46 6 M50 -6 L62 6 M66 -6 L78 6 M82 -6 L94 6" fill="none" stroke="#92400e" strokeWidth={1.5} /></>) },
      { key: "arbol", label: "Árbol", w: 200, h: 200, draw: () => (<><circle cx={0} cy={-6} r={62} fill="#16a34a" stroke="#166534" /><circle cx={-40} cy={12} r={34} fill="#22c55e" /><circle cx={40} cy={10} r={32} fill="#22c55e" /><circle cx={0} cy={-6} r={9} fill="none" /><rect x={-6} y={44} width={12} height={26} rx={4} fill="#92400e" stroke="#78350f" /></>) },
      { key: "arbusto", label: "Arbusto", w: 60, h: 25, draw: () => (<><ellipse cx={0} cy={0} rx={30} ry={12} fill="#22c55e" stroke="#166534" /><circle cx={-12} cy={-3} r={7} fill="#4ade80" /><circle cx={8} cy={-2} r={8} fill="#4ade80" /><circle cx={20} cy={0} r={6} fill="#4ade80" /></>) },
      { key: "seto", label: "Seto", w: 200, h: 40, draw: () => (<><rect x={-100} y={-19} width={200} height={38} rx={18} /><circle cx={-84} cy={0} r={16} fill="none" /><circle cx={-52} cy={0} r={16} fill="none" /><circle cx={-20} cy={0} r={16} fill="none" /><circle cx={12} cy={0} r={16} fill="none" /><circle cx={44} cy={0} r={16} fill="none" /><circle cx={76} cy={0} r={16} fill="none" /></>) },
      { key: "farol", label: "Farol", w: 30, h: 30, draw: () => (<><circle cx={0} cy={0} r={11} /><circle cx={0} cy={0} r={4} fill="none" /><path d="M0 -20 V-15 M0 15 V20 M-20 0 H-15 M15 0 H20" fill="none" strokeWidth={2} /></>) },
      { key: "huerto", label: "Huerto / Bancales", w: 250, h: 140, draw: () => (<><rect x={-125} y={-70} width={250} height={140} rx={8} fill="#92400e" stroke="#78350f" /><rect x={-112} y={-56} width={224} height={112} rx={6} fill="#3f6212" stroke="#14532d" /><path d="M-112 -28 H112 M-112 -2 H112 M-112 24 H112 M-75 -56 V56 M-37 -56 V56 M1 -56 V56 M37 -56 V56 M75 -56 V56" fill="none" stroke="#65a30d" strokeWidth={1.5} /></>) },
      { key: "jardinera", label: "Jardinera", w: 120, h: 35, draw: () => (<><rect x={-60} y={-17} width={120} height={35} rx={6} fill="#92400e" stroke="#78350f" /><rect x={-52} y={-10} width={104} height={20} rx={4} fill="#3f6212" stroke="#14532d" /><circle cx={-30} cy={-2} r={5} fill="#22c55e" /><circle cx={-10} cy={-2} r={5} fill="#22c55e" /><circle cx={10} cy={-2} r={5} fill="#22c55e" /><circle cx={30} cy={-2} r={5} fill="#22c55e" /></>) },
      { key: "cerramiento-ext", label: "Cerramiento exterior", w: 200, h: 20, draw: () => (<><rect x={-100} y={-10} width={200} height={20} rx={4} fill="#fde68a" stroke="#c2410c" /><rect x={-92} y={-7} width={184} height={14} rx={2} fill="none" stroke="#f97316" /><path d="M-85 -7 V7 M-68 -7 V7 M-51 -7 V7 M-34 -7 V7 M-17 -7 V7 M1 -7 V7 M18 -7 V7 M35 -7 V7 M52 -7 V7 M69 -7 V7 M86 -7 V7" fill="none" stroke="#ea580c" strokeWidth={1.5} /></>) },
      { key: "invernadero", label: "Invernadero", w: 260, h: 180, draw: () => (<><rect x={-130} y={-90} width={260} height={180} rx={8} fill="#dceef8" stroke="#1d4ed8" strokeWidth={3} /><path d="M-130 -20 L0 -90 L130 -20" fill="none" stroke="#2563eb" strokeWidth={3} /><rect x={-118} y={-10} width={90} height={95} fill="none" stroke="#3b82f6" strokeDasharray="5 4" /><rect x={28} y={-10} width={90} height={95} fill="none" stroke="#3b82f6" strokeDasharray="5 4" /><path d="M-110 -10 H-30 V-80 M30 -10 H110 V-80" fill="none" stroke="#93c5fd" strokeWidth={1.5} /></>) },
      { key: "porta-jardin", label: "Puerta jardín", w: 120, h: 10, draw: () => (<><rect x={-60} y={-5} width={120} height={10} rx={2} fill="#92400e" stroke="#78350f" /><path d="M-50 0 H50 M-40 -3 H40" fill="none" stroke="#c77b3c" strokeWidth={1.5} /><rect x={-62} y={-10} width={8} height={20} rx={2} fill="#78350f" stroke="#92400e" /><rect x={54} y={-10} width={8} height={20} rx={2} fill="#78350f" stroke="#92400e" /></>) },
      { key: "barandilla", label: "Barandilla", w: 200, h: 10, draw: () => (<><rect x={-100} y={-5} width={200} height={10} rx={2} fill="#faf9f7" stroke="#6b7280" /><path d="M-94 -5 V5 M-78 -5 V5 M-62 -5 V5 M-46 -5 V5 M-30 -5 V5 M-14 -5 V5 M2 -5 V5 M18 -5 V5 M34 -5 V5 M50 -5 V5 M66 -5 V5 M82 -5 V5 M98 -5 V5" fill="none" stroke="#94a3b8" strokeWidth={1.5} /></>) },
      { key: "cesped", label: "Cesped", w: 200, h: 150, draw: () => (<><rect x={-100} y={-75} width={200} height={150} rx={8} fill="#3f6212" stroke="#14532d" strokeDasharray="6 5" /><path d="M-92 -65 H92 M-92 -40 H92 M-92 -15 H92 M-92 10 H92 M-92 35 H92 M-92 60 H92" fill="none" stroke="#65a30d" strokeWidth={1.5} /><path d="M-85 -70 V65 M-60 -70 V65 M-35 -70 V65 M-10 -70 V65 M15 -70 V65 M40 -70 V65 M65 -70 V65 M90 -70 V65" fill="none" stroke="#84cc16" strokeOpacity={0.65} strokeWidth={1} /></>) },
      { key: "armario-ext", label: "Armario exterior", w: 160, h: 70, draw: () => (<><rect x={-80} y={-35} width={160} height={70} rx={6} fill="#faf9f7" stroke="#1c1f24" /><rect x={-72} y={-26} width={144} height={52} rx={4} fill="none" stroke="#6b7280" /><path d="M-10 -26 V26" fill="none" stroke="#92400e" strokeWidth={2} /><circle cx={-4} cy={0} r={4} fill="#f6821f" /><circle cx={4} cy={0} r={4} fill="#f6821f" /></>) },
      { key: "cajon-patio", label: "Cajon patio", w: 120, h: 45, draw: () => (<><rect x={-60} y={-22} width={120} height={45} rx={6} fill="#faf9f7" stroke="#6b7280" /><path d="M-52 -14 H52 M-52 -4 H52 M-52 6 H52 M-52 16 H52" fill="none" stroke="#94a3b8" strokeWidth={2} /></>) },
      { key: "leniero", label: "Leniero", w: 100, h: 45, draw: () => (<><rect x={-50} y={-22} width={100} height={45} rx={4} fill="#92400e" stroke="#78350f" /><path d="M-40 -15 V15 M-25 -15 V15 M-10 -15 V15 M5 -15 V15 M20 -15 V15 M35 -15 V15" fill="none" stroke="#c77b3c" strokeWidth={3} /></>) },
      { key: "armario-bajo", label: "Armario bajo", w: 100, h: 50, draw: () => (<><rect x={-50} y={-25} width={100} height={50} rx={5} fill="#faf9f7" stroke="#6b7280" /><path d="M-50 0 H50" fill="none" stroke="#94a3b8" strokeWidth={1.5} /><circle cx={-8} cy={-12} r={2.5} fill="#f6821f" /><circle cx={8} cy={-12} r={2.5} fill="#f6821f" /><circle cx={-8} cy={12} r={2.5} fill="#f6821f" /><circle cx={8} cy={12} r={2.5} fill="#f6821f" /></>) },
      { key: "maceta-grande", label: "Maceta grande", w: 70, h: 70, draw: () => (<><circle cx={0} cy={0} r={34} fill="#faf9f7" stroke="#78350f" /><rect x={-18} y={-8} width={36} height={16} rx={4} fill="#92400e" stroke="#78350f" /><path d="M-28 18 H28" fill="none" stroke="#92400e" strokeWidth={3} /></>) },
      { key: "bancada-ext", label: "Bancada exterior", w: 180, h: 45, draw: () => (<><rect x={-90} y={-22} width={180} height={45} rx={8} fill="#faf9f7" stroke="#1c1f24" /><path d="M-78 -12 H78 M-78 0 H78 M-78 12 H78" fill="none" stroke="#78350f" strokeWidth={2.5} /><rect x={-84} y={-17} width={168} height={12} rx={4} fill="#92400e" opacity={0.35} /></>) },
      { key: "cepillo-patio", label: "Cesto patio", w: 45, h: 35, draw: () => (<><rect x={-22} y={-17} width={44} height={35} rx={6} fill="#faf9f7" stroke="#6b7280" /><path d="M-16 0 H16 M-18 5 H18" fill="none" stroke="#94a3b8" strokeWidth={1.5} /></>) },
      { key: "silla-ext", label: "Silla exterior", w: 55, h: 55, draw: () => (<><rect x={-22} y={-22} width={44} height={44} rx={8} fill="#faf9f7" stroke="#1c1f24" /><rect x={-14} y={-14} width={28} height={28} rx={5} fill="#bfdbfe" stroke="#2563eb" /><path d="M-18 -18 H18 M-18 0 H18 M-18 18 H18" fill="none" stroke="#6b7280" strokeWidth={1.5} /></>) },
      { key: "mesa-ext", label: "Mesa terraza", w: 120, h: 70, draw: () => (<><rect x={-60} y={-35} width={120} height={70} rx={10} fill="#faf9f7" stroke="#1c1f24" /><rect x={-50} y={-25} width={100} height={50} rx={8} fill="none" stroke="#6b7280" /><path d="M-40 0 H40 M0 -20 V20" fill="none" stroke="#6b7280" strokeWidth={2} /></>) },
      { key: "tumbona", label: "Tumbona", w: 70, h: 190, draw: () => (<><rect x={-35} y={-95} width={70} height={190} rx={10} /><path d="M-35 -55 H35" fill="none" /><rect x={-28} y={-88} width={56} height={22} rx={6} /></>) },
      { key: "hamaca", label: "Hamaca", w: 260, h: 110, draw: () => (<><path d="M-120 -40 V52 M120 -40 V52" fill="none" strokeWidth={5} /><path d="M-120 -34 Q0 52 120 -34" fill="none" strokeWidth={4} /><path d="M-120 -18 Q0 68 120 -18" fill="none" /></>) },
      { key: "pozo-agua", label: "Pozo de agua", w: 100, h: 100, draw: () => (<><circle cx={0} cy={0} r={48} fill="#dceef8" stroke="#1c1f24" strokeWidth={3} /><circle cx={0} cy={0} r={34} fill="#1e40af" stroke="#1d4ed8" strokeWidth={2} /><rect x={-52} y={-18} width={104} height={14} rx={5} fill="#92400e" stroke="#78350f" strokeWidth={2} /><circle cx={-44} cy={-18} r={6} fill="#6b4a32" stroke="#78350f" strokeWidth={2} /><circle cx={44} cy={-18} r={6} fill="#6b4a32" stroke="#78350f" strokeWidth={2} /><line x1={0} y1={-18} x2={0} y2={-10} stroke="#6b7280" strokeWidth={2} /><ellipse cx={0} cy={-7} rx={8} ry={4} fill="#374151" /></>) },
      { key: "pergola-bioclimatica", label: "Pérgola bioclimática", w: 300, h: 200, draw: () => (<><rect x={-150} y={-100} width={300} height={200} rx={6} fill="none" stroke="#1c1f24" strokeWidth={3} /><rect x={-150} y={-100} width={300} height={18} rx={3} fill="#374151" stroke="#1c1f24" strokeWidth={2} />{[-110,-70,-30,10,50,90,130].map((x,i) => (<rect key={i} x={x} y={-100} width={18} height={200} rx={3} fill="#6b7280" opacity={0.5} />))}<circle cx={-144} cy={-94} r={6} fill="#6b7280" stroke="#374151" strokeWidth={2} /><circle cx={144} cy={-94} r={6} fill="#6b7280" stroke="#374151" strokeWidth={2} /><circle cx={-144} cy={94} r={6} fill="#6b7280" stroke="#374151" strokeWidth={2} /><circle cx={144} cy={94} r={6} fill="#6b7280" stroke="#374151" strokeWidth={2} /></>) },
    ],
  },
  {
    id: "climatizacion",
    label: "Climatización (A/A)",
    items: [
      { key: "conducto-recto", label: "Conducto", w: 100, h: 20, draw: () => (<><rect x={-50} y={-10} width={100} height={20} rx={2} /><path d="M-40 -10 V10 M-20 -10 V10 M0 -10 V10 M20 -10 V10 M40 -10 V10" fill="none" /><path d="M-45 0 H40 M 40 0 L 36 -3 M 40 0 L 36 3" fill="none" /></>) },
      { key: "rejilla-salida", label: "Rejilla A/A", w: 40, h: 30, draw: () => (<><rect x={-20} y={-15} width={40} height={30} rx={2} /><path d="M-16 -11 V11 M-12 -11 V11 M-8 -11 V11 M-4 -11 V11 M0 -11 V11 M4 -11 V11 M8 -11 V11 M12 -11 V11 M16 -11 V11" fill="none" /><path d="M-20 5 H20" fill="none" /></>) },
      { key: "split-ac", label: "Split interior", w: 80, h: 24, draw: () => (<><rect x={-40} y={-12} width={80} height={24} rx={4} /><path d="M-30 -5 H30 M-30 0 H30 M-30 5 H30" fill="none" /><path d="M-20 12 L-30 16 M-10 12 L-20 16 M0 12 L-10 16 M10 12 L0 16 M20 12 L10 16 M30 12 L20 16" fill="none" /></>) },
      { key: "compresor-ext", label: "Compresor", w: 50, h: 50, draw: () => (<><rect x={-25} y={-25} width={50} height={50} rx={6} fill={WALL} stroke={WALL} /><circle cx={0} cy={-2} r={18} fill="#e8e8e8" stroke="#1c1f24" strokeWidth={2} /><path d="M0 -12 V8 M-10 -2 H10" fill="none" stroke="#1c1f24" strokeWidth={2} /></>) },
      { key: "fancoil", label: "Fancoil", w: 70, h: 30, draw: () => (<><rect x={-35} y={-15} width={70} height={30} rx={4} /><path d="M-25 -8 H25 M-25 -4 H25 M-25 0 H25 M-25 4 H25" fill="none" /><circle cx={20} cy={0} r={4} fill="none" /></>) },
    ],
  },
  {
    id: "vehiculos",
    label: "Vehículos y ocio",
    items: [
      {
        key: "coche",
        label: "Coche",
        w: 200,
        h: 450,
        draw: () => (
          <>
            {/* Carrocería principal */}
            <rect x={-100} y={-225} width={200} height={450} rx={30} fill="#d1d5db" stroke={WALL} strokeWidth={4} />
            {/* Techo (zona central más oscura) */}
            <rect x={-72} y={-130} width={144} height={180} rx={18} fill="#9ca3af" stroke={WALL} strokeWidth={2} />
            {/* Parabrisas delantero */}
            <rect x={-65} y={-125} width={130} height={55} rx={10} fill="#bfdbfe" stroke="#4a5568" strokeWidth={1.5} />
            {/* Luneta trasera */}
            <rect x={-65} y={45} width={130} height={55} rx={10} fill="#bfdbfe" stroke="#4a5568" strokeWidth={1.5} />
            {/* Rueda delantera izquierda */}
            <rect x={-110} y={-175} width={30} height={70} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            {/* Rueda delantera derecha */}
            <rect x={80} y={-175} width={30} height={70} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            {/* Rueda trasera izquierda */}
            <rect x={-110} y={105} width={30} height={70} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            {/* Rueda trasera derecha */}
            <rect x={80} y={105} width={30} height={70} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            {/* Faros delanteros */}
            <rect x={-88} y={-215} width={40} height={16} rx={4} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5} />
            <rect x={48} y={-215} width={40} height={16} rx={4} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5} />
            {/* Pilotos traseros */}
            <rect x={-88} y={199} width={40} height={16} rx={4} fill="#fecaca" stroke="#dc2626" strokeWidth={1.5} />
            <rect x={48} y={199} width={40} height={16} rx={4} fill="#fecaca" stroke="#dc2626" strokeWidth={1.5} />
          </>
        ),
      },
      {
        key: "moto",
        label: "Motocicleta",
        w: 90,
        h: 220,
        draw: () => (
          <>
            {/* Rueda delantera */}
            <ellipse cx={0} cy={-85} rx={28} ry={28} fill="none" stroke={WALL} strokeWidth={6} />
            <ellipse cx={0} cy={-85} rx={12} ry={12} fill="#374151" stroke={WALL} strokeWidth={2} />
            {/* Rueda trasera */}
            <ellipse cx={0} cy={85} rx={28} ry={28} fill="none" stroke={WALL} strokeWidth={6} />
            <ellipse cx={0} cy={85} rx={12} ry={12} fill="#374151" stroke={WALL} strokeWidth={2} />
            {/* Chasis / cuerpo */}
            <rect x={-14} y={-60} width={28} height={120} rx={8} fill="#374151" stroke={WALL} strokeWidth={3} />
            {/* Depósito */}
            <rect x={-18} y={-30} width={36} height={50} rx={10} fill="#6b7280" stroke={WALL} strokeWidth={2} />
            {/* Manillar */}
            <rect x={-30} y={-70} width={60} height={10} rx={4} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            {/* Asiento */}
            <rect x={-14} y={12} width={28} height={28} rx={6} fill="#111827" stroke={WALL} strokeWidth={1.5} />
          </>
        ),
      },
      {
        key: "bicicleta",
        label: "Bicicleta",
        w: 80,
        h: 200,
        draw: () => (
          <>
            {/* Rueda delantera */}
            <circle cx={0} cy={-72} r={28} fill="none" stroke={WALL} strokeWidth={5} />
            <circle cx={0} cy={-72} r={8} fill="#374151" />
            {/* Rueda trasera */}
            <circle cx={0} cy={72} r={28} fill="none" stroke={WALL} strokeWidth={5} />
            <circle cx={0} cy={72} r={8} fill="#374151" />
            {/* Cuadro */}
            <line x1={0} y1={-72} x2={0} y2={72} stroke={WALL} strokeWidth={4} />
            <line x1={0} y1={-72} x2={-16} y2={10} stroke={WALL} strokeWidth={4} />
            <line x1={0} y1={72} x2={-16} y2={10} stroke={WALL} strokeWidth={4} />
            <line x1={0} y1={-72} x2={16} y2={10} stroke={WALL} strokeWidth={3} />
            {/* Manillar */}
            <rect x={-22} y={-80} width={44} height={9} rx={4} fill={WALL} />
            {/* Sillín */}
            <rect x={-14} y={3} width={28} height={9} rx={4} fill={WALL} />
            {/* Pedales */}
            <circle cx={0} cy={10} r={6} fill="#6b7280" stroke={WALL} strokeWidth={2} />
          </>
        ),
      },
      {
        key: "garaje",
        label: "Garaje",
        w: 400,
        h: 550,
        draw: () => (
          <>
            {/* Estructura garaje */}
            <rect x={-200} y={-275} width={400} height={550} rx={8} fill="#f3f4f6" stroke={WALL} strokeWidth={5} />
            {/* Puerta de garaje (seccional) */}
            <rect x={-160} y={-275} width={320} height={180} rx={4} fill="#e5e7eb" stroke={WALL} strokeWidth={3} />
            {/* Paneles de la puerta */}
            <line x1={-160} y1={-230} x2={160} y2={-230} stroke="#9ca3af" strokeWidth={2} />
            <line x1={-160} y1={-185} x2={160} y2={-185} stroke="#9ca3af" strokeWidth={2} />
            <line x1={-160} y1={-140} x2={160} y2={-140} stroke="#9ca3af" strokeWidth={2} />
            <line x1={0} y1={-275} x2={0} y2={-95} stroke="#9ca3af" strokeWidth={2} />
            {/* Tirador central */}
            <rect x={-14} y={-190} width={28} height={8} rx={4} fill="#6b7280" stroke={WALL} strokeWidth={1.5} />
            {/* Interior del garaje */}
            <rect x={-178} y={-85} width={356} height={350} rx={4} fill="#f9fafb" stroke="#d1d5db" strokeWidth={1.5} />
            {/* Silueta del coche dentro */}
            <rect x={-90} y={-60} width={180} height={310} rx={22} fill="#d1d5db" stroke="#9ca3af" strokeWidth={2.5} />
            <rect x={-65} y={-45} width={130} height={120} rx={14} fill="#9ca3af" />
            {/* Ruedas coche interior */}
            <rect x={-100} y={-30} width={22} height={52} rx={6} fill="#374151" />
            <rect x={78} y={-30} width={22} height={52} rx={6} fill="#374151" />
            <rect x={-100} y={180} width={22} height={52} rx={6} fill="#374151" />
            <rect x={78} y={180} width={22} height={52} rx={6} fill="#374151" />
          </>
        ),
      },
      {
        key: "columpio",
        label: "Columpio",
        w: 220,
        h: 220,
        draw: () => (
          <>
            {/* Pórtico: postes laterales */}
            <line x1={-100} y1={-100} x2={-80} y2={100} stroke={WALL} strokeWidth={8} strokeLinecap="round" />
            <line x1={100} y1={-100} x2={80} y2={100} stroke={WALL} strokeWidth={8} strokeLinecap="round" />
            {/* Travesaño superior */}
            <rect x={-104} y={-108} width={208} height={16} rx={6} fill={WALL} />
            {/* Cadenas */}
            <line x1={-40} y1={-92} x2={-30} y2={30} stroke="#6b7280" strokeWidth={3} strokeDasharray="6 4" />
            <line x1={40} y1={-92} x2={30} y2={30} stroke="#6b7280" strokeWidth={3} strokeDasharray="6 4" />
            {/* Asiento */}
            <rect x={-34} y={28} width={64} height={14} rx={5} fill="#92400e" stroke="#78350f" strokeWidth={2} />
          </>
        ),
      },
      {
        key: "caseta-perro",
        label: "Caseta perro",
        w: 160, h: 150,
        draw: () => (          <>
            {/* Cuerpo */}
            <rect x={-80} y={-20} width={160} height={95} rx={6} fill="#d2b48c" stroke={WALL} strokeWidth={3} />
            {/* Tejado (triángulo) */}
            <polygon points="0,-75 -92,-20 92,-20" fill="#92400e" stroke={WALL} strokeWidth={3} />
            {/* Entrada */}
            <ellipse cx={0} cy={25} rx={30} ry={38} fill="#78350f" stroke={WALL} strokeWidth={2} />
            <ellipse cx={0} cy={30} rx={22} ry={30} fill="#451a03" />
          </>
        ),
      },
      {
        key: "furgoneta",
        label: "Furgoneta",
        w: 220, h: 520,
        draw: () => (
          <>
            <rect x={-110} y={-260} width={220} height={520} rx={28} fill="#e5e7eb" stroke={WALL} strokeWidth={4} />
            {/* Cabina */}
            <rect x={-90} y={-110} width={180} height={130} rx={12} fill="#9ca3af" stroke={WALL} strokeWidth={2} />
            <rect x={-72} y={-100} width={144} height={60} rx={8} fill="#bfdbfe" stroke="#4a5568" strokeWidth={1.5} />
            {/* Ruedas */}
            {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sz],i) => (
              <rect key={i} x={sx*(110+2)-sx*24} y={sz*180-36} width={28} height={72} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            ))}
            {/* Puerta trasera */}
            <rect x={-80} y={40} width={160} height={180} rx={4} fill="#d1d5db" stroke="#9ca3af" strokeWidth={2} />
            <line x1={0} y1={40} x2={0} y2={220} stroke="#9ca3af" strokeWidth={2} />
            <rect x={-10} y={125} width={20} height={8} rx={4} fill="#6b7280" />
          </>
        ),
      },
      {
        key: "quad",
        label: "Quad",
        w: 160, h: 240,
        draw: () => (
          <>
            <rect x={-80} y={-120} width={160} height={240} rx={22} fill="#374151" stroke={WALL} strokeWidth={4} />
            {/* Carrocería */}
            <rect x={-60} y={-80} width={120} height={160} rx={14} fill="#f97316" stroke={WALL} strokeWidth={3} />
            {/* Ruedas grandes */}
            <rect x={-90} y={-100} width={36} height={68} rx={12} fill="#1f2937" stroke={WALL} strokeWidth={3} />
            <rect x={54} y={-100} width={36} height={68} rx={12} fill="#1f2937" stroke={WALL} strokeWidth={3} />
            <rect x={-90} y={32} width={36} height={68} rx={12} fill="#1f2937" stroke={WALL} strokeWidth={3} />
            <rect x={54} y={32} width={36} height={68} rx={12} fill="#1f2937" stroke={WALL} strokeWidth={3} />
            {/* Manillar */}
            <rect x={-55} y={-100} width={110} height={12} rx={5} fill="#6b7280" stroke={WALL} strokeWidth={2} />
            {/* Asiento */}
            <rect x={-30} y={-30} width={60} height={40} rx={8} fill="#1c1f24" stroke={WALL} strokeWidth={2} />
          </>
        ),
      },
      {
        key: "barco",
        label: "Barco/Velero",
        w: 180, h: 500,
        draw: () => (
          <>
            {/* Casco */}
            <ellipse cx={0} cy={80} rx={88} ry={170} fill="#1e40af" stroke={WALL} strokeWidth={4} />
            <ellipse cx={0} cy={80} rx={72} ry={152} fill="#2563eb" />
            {/* Cubierta */}
            <ellipse cx={0} cy={-50} rx={80} ry={80} fill="#dbeafe" stroke="#93c5fd" strokeWidth={2} />
            {/* Mástil */}
            <line x1={0} y1={-50} x2={0} y2={-240} stroke="#78350f" strokeWidth={6} strokeLinecap="round" />
            {/* Vela */}
            <path d="M0 -230 L80 -60 L0 -60 Z" fill="#faf9f7" stroke="#94a3b8" strokeWidth={2} opacity={0.9} />
            <path d="M0 -230 L-70 -80 L0 -80 Z" fill="#bfdbfe" stroke="#93c5fd" strokeWidth={2} opacity={0.8} />
            {/* Cabina */}
            <rect x={-30} y={-70} width={60} height={40} rx={6} fill="#1e3a5f" stroke={WALL} strokeWidth={2} />
          </>
        ),
      },
      {
        key: "kayak",
        label: "Kayak / Canoa",
        w: 80, h: 400,
        draw: () => (
          <>
            <ellipse cx={0} cy={0} rx={38} ry={198} fill="#f97316" stroke={WALL} strokeWidth={4} />
            <ellipse cx={0} cy={0} rx={28} ry={180} fill="#fb923c" />
            {/* Cockpit */}
            <ellipse cx={0} cy={20} rx={22} ry={35} fill="#1c1f24" stroke="#374151" strokeWidth={2} />
            {/* Remo */}
            <line x1={-80} y1={-30} x2={80} y2={30} stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
            <ellipse cx={-82} cy={-32} rx={18} ry={8} fill="#78350f" />
            <ellipse cx={82} cy={32} rx={18} ry={8} fill="#78350f" />
          </>
        ),
      },
      {
        key: "pickup",
        label: "Camioneta/Pickup",
        w: 230, h: 530,
        draw: () => (
          <>
            {/* Carrocería */}
            <rect x={-115} y={-265} width={230} height={530} rx={28} fill="#6b7280" stroke={WALL} strokeWidth={4} />
            {/* Cabina */}
            <rect x={-95} y={-150} width={190} height={160} rx={14} fill="#9ca3af" stroke={WALL} strokeWidth={2} />
            {/* Parabrisas */}
            <rect x={-78} y={-140} width={156} height={60} rx={10} fill="#bfdbfe" stroke="#4a5568" strokeWidth={1.5} />
            {/* Caja trasera */}
            <rect x={-100} y={30} width={200} height={220} rx={6} fill="#4b5563" stroke="#374151" strokeWidth={2} />
            <line x1={-100} y1={70} x2={100} y2={70} stroke="#374151" strokeWidth={2} />
            <line x1={-100} y1={120} x2={100} y2={120} stroke="#374151" strokeWidth={2} />
            <line x1={-100} y1={170} x2={100} y2={170} stroke="#374151" strokeWidth={2} />
            <line x1={-100} y1={220} x2={100} y2={220} stroke="#374151" strokeWidth={2} />
            {/* Ruedas */}
            <rect x={-120} y={-205} width={28} height={80} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            <rect x={92} y={-205} width={28} height={80} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            <rect x={-120} y={130} width={28} height={80} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            <rect x={92} y={130} width={28} height={80} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            {/* Faros */}
            <rect x={-100} y={-255} width={42} height={16} rx={4} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5} />
            <rect x={58} y={-255} width={42} height={16} rx={4} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5} />
            {/* Pilotos */}
            <rect x={-100} y={239} width={42} height={16} rx={4} fill="#fecaca" stroke="#dc2626" strokeWidth={1.5} />
            <rect x={58} y={239} width={42} height={16} rx={4} fill="#fecaca" stroke="#dc2626" strokeWidth={1.5} />
          </>
        ),
      },
      {
        key: "patinete",
        label: "Patinete eléctrico",
        w: 60, h: 180,
        draw: () => (
          <>
            {/* Rueda delantera */}
            <circle cx={0} cy={-72} r={16} fill="none" stroke={WALL} strokeWidth={5} />
            <circle cx={0} cy={-72} r={6} fill="#374151" />
            {/* Rueda trasera */}
            <circle cx={0} cy={72} r={16} fill="none" stroke={WALL} strokeWidth={5} />
            <circle cx={0} cy={72} r={6} fill="#374151" />
            {/* Tabla */}
            <rect x={-18} y={30} width={36} height={50} rx={8} fill="#1f2937" stroke={WALL} strokeWidth={3} />
            {/* Horquilla */}
            <rect x={-5} y={-72} width={10} height={110} rx={4} fill="#374151" stroke={WALL} strokeWidth={2} />
            {/* Manillar */}
            <rect x={-26} y={-80} width={52} height={10} rx={5} fill="#1f2937" stroke={WALL} strokeWidth={2} />
            {/* Poste */}
            <rect x={-5} y={-78} width={10} height={110} rx={4} fill="#6b7280" stroke={WALL} strokeWidth={2} />
            {/* Batería */}
            <rect x={-14} y={40} width={28} height={30} rx={4} fill="#22c55e" opacity={0.7} />
          </>
        ),
      },
      {
        key: "moto-agua",
        label: "Moto de agua",
        w: 160, h: 380,
        draw: () => (
          <>
            {/* Casco */}
            <ellipse cx={0} cy={30} rx={78} ry={158} fill="#2563eb" stroke={WALL} strokeWidth={4} />
            <ellipse cx={0} cy={30} rx={62} ry={140} fill="#3b82f6" />
            {/* Cubierta */}
            <ellipse cx={0} cy={-50} rx={68} ry={70} fill="#bfdbfe" stroke="#93c5fd" strokeWidth={2} />
            {/* Asiento */}
            <rect x={-28} y={-80} width={56} height={80} rx={12} fill="#1e3a5f" stroke={WALL} strokeWidth={2} />
            {/* Manillar */}
            <rect x={-40} y={-100} width={80} height={12} rx={6} fill="#374151" stroke={WALL} strokeWidth={2} />
            {/* Espejo */}
            <rect x={-50} y={-105} width={12} height={8} rx={2} fill="#6b7280" />
            <rect x={38} y={-105} width={12} height={8} rx={2} fill="#6b7280" />
          </>
        ),
      },
    ],
  },
  {
    id: "escaleras",
    label: "Escaleras",
    items: [
      {
        key: "escalera-planta-baja",
        label: "Escalera planta baja",
        w: 90,
        h: 240,
        draw: () => (
          <>
            <rect x={-45} y={-120} width={90} height={240} fill="#ffffff" stroke={WALL} strokeWidth={2} />
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M-45 ${-120 + (i + 1) * 30} H45`} fill="none" stroke={WALL} strokeWidth={2} />
            ))}
            {/* Flecha de subida */}
            <path d="M0 105 V-95" fill="none" stroke={WALL} strokeWidth={2} />
            <path d="M-12 -75 L0 -100 L12 -75" fill="none" stroke={WALL} strokeWidth={2} />
          </>
        ),
      },
      {
        key: "escalera-planta-superior",
        label: "Escalera planta superior",
        w: 90,
        h: 240,
        draw: () => (
          <>
            {/* Fondo gris para indicar que es planta superior */}
            <rect x={-45} y={-120} width={90} height={240} fill="#f1f5f9" stroke={WALL} strokeWidth={2} />
            {/* Peldaños con degradado visual (más oscuros = más arriba) */}
            {Array.from({ length: 7 }, (_, i) => (
              <rect
                key={i}
                x={-45}
                y={-120 + i * 30}
                width={90}
                height={30}
                fill={`rgba(100,116,139,${0.08 + i * 0.06})`}
                stroke={WALL}
                strokeWidth={i === 6 ? 0 : 1.5}
              />
            ))}
            {/* Línea de borde inferior (llegada) */}
            <rect x={-45} y={90} width={90} height={30} rx={0} fill="#94a3b8" stroke={WALL} strokeWidth={2} />
            {/* Flecha de bajada */}
            <path d="M0 -105 V85" fill="none" stroke={WALL} strokeWidth={2} />
            <path d="M-12 65 L0 90 L12 65" fill="none" stroke={WALL} strokeWidth={2} />
            {/* Etiqueta P.S. */}
            <rect x={-18} y={-14} width={36} height={18} rx={3} fill="#1e40af" />
            <text x={0} y={-2} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#ffffff">P.S.</text>
          </>
        ),
      },
      {
        key: "escalera-caracol",
        label: "Escalera caracol",
        w: 120,
        h: 120,
        draw: () => (
          <>
            <circle cx={0} cy={0} r={58} fill="#f8fafc" stroke={WALL} strokeWidth={3} />
            <circle cx={0} cy={0} r={16} fill="#e2e8f0" stroke={WALL} strokeWidth={2} />
            {/* Peldaños radiales */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * Math.PI * 2) / 8;
              const x2 = Math.cos(angle) * 55;
              const y2 = Math.sin(angle) * 55;
              return <line key={i} x1={Math.cos(angle) * 16} y1={Math.sin(angle) * 16} x2={x2} y2={y2} stroke={WALL} strokeWidth={2} />;
            })}
            {/* Flecha espiral */}
            <path d="M0 -40 A40 40 0 1 1 -28 28" fill="none" stroke="#f6821f" strokeWidth={2.5} />
            <path d="M-28 28 L-38 18 M-28 28 L-18 18" fill="none" stroke="#f6821f" strokeWidth={2.5} />
          </>
        ),
      },
    ],
  },
  {
    id: "ocio-premium",
    label: "Ocio Premium",
    items: [
      {
        key: "billar",
        label: "Mesa billar",
        w: 250, h: 140,
        draw: () => (
          <>
            <rect x={-125} y={-70} width={250} height={140} rx={8} fill="#166534" stroke={WALL} strokeWidth={5} />
            <rect x={-110} y={-55} width={220} height={110} rx={4} fill="#15803d" stroke="#14532d" strokeWidth={2} />
            {/* Troneras */}
            {[[-110,-55],[0,-55],[110,-55],[-110,55],[0,55],[110,55]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={9} fill="#1c1f24" />
            ))}
            {/* Bola blanca */}
            <circle cx={-40} cy={0} r={8} fill="#faf9f7" stroke="#94a3b8" strokeWidth={1.5} />
            {/* Triángulo de bolas */}
            {[[40,0],[52,-10],[52,10],[64,-20],[64,0],[64,20]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={7} fill={["#ef4444","#fbbf24","#3b82f6","#22c55e","#8b5cf6","#f97316"][i]} />
            ))}
          </>
        ),
      },
      {
        key: "ping-pong",
        label: "Mesa ping pong",
        w: 274, h: 152,
        draw: () => (
          <>
            <rect x={-137} y={-76} width={274} height={152} rx={4} fill="#1d4ed8" stroke={WALL} strokeWidth={4} />
            <rect x={-128} y={-68} width={256} height={136} rx={3} fill="#2563eb" stroke="#1e40af" strokeWidth={1.5} />
            {/* Línea central */}
            <line x1={0} y1={-68} x2={0} y2={68} stroke="#faf9f7" strokeWidth={3} />
            {/* Red */}
            <rect x={-6} y={-76} width={12} height={152} rx={2} fill="#94a3b8" />
            {/* Líneas laterales */}
            <rect x={-128} y={-68} width={256} height={6} rx={1} fill="#faf9f7" opacity={0.4} />
            <rect x={-128} y={62} width={256} height={6} rx={1} fill="#faf9f7" opacity={0.4} />
            {/* Pelotas */}
            <circle cx={-60} cy={25} r={8} fill="#fbbf24" stroke="#f59e0b" strokeWidth={1.5} />
            <circle cx={70} cy={-20} r={8} fill="#fbbf24" stroke="#f59e0b" strokeWidth={1.5} />
          </>
        ),
      },
      {
        key: "cine-casa",
        label: "Cine en casa",
        w: 350, h: 220,
        draw: () => (
          <>
            {/* Fondo sala oscura */}
            <rect x={-175} y={-110} width={350} height={220} rx={8} fill="#111827" stroke={WALL} strokeWidth={4} />
            {/* Pantalla */}
            <rect x={-150} y={-95} width={300} height={80} rx={4} fill="#f8fafc" stroke="#94a3b8" strokeWidth={2} />
            <rect x={-144} y={-90} width={288} height={70} rx={2} fill="#dbeafe" />
            {/* Sofás en U */}
            <rect x={-165} y={-5} width={330} height={50} rx={8} fill="#374151" stroke="#6b7280" strokeWidth={2} />
            <rect x={-165} y={-5} width={50} height={105} rx={8} fill="#374151" stroke="#6b7280" strokeWidth={2} />
            <rect x={115} y={-5} width={50} height={105} rx={8} fill="#374151" stroke="#6b7280" strokeWidth={2} />
            {/* Proyector */}
            <rect x={-18} y={-105} width={36} height={14} rx={4} fill="#6b7280" />
            <path d="M-8 -91 L-20 -75 M8 -91 L20 -75" fill="none" stroke="#fbbf24" strokeWidth={1.5} opacity={0.6} />
          </>
        ),
      },
      {
        key: "spa-exterior",
        label: "Spa exterior",
        w: 300, h: 300,
        draw: () => (
          <>
            {/* Plataforma de madera */}
            <rect x={-150} y={-150} width={300} height={300} rx={12} fill="#92400e" stroke="#78350f" strokeWidth={4} />
            {/* Tarima */}
            {[-120,-80,-40,0,40,80,120].map((y,i) => (
              <rect key={i} x={-140} y={y-5} width={280} height={10} rx={2} fill="#a16207" />
            ))}
            {/* Jacuzzi central */}
            <circle cx={0} cy={0} r={90} fill="#dbeafe" stroke="#3b82f6" strokeWidth={4} />
            <circle cx={0} cy={0} r={78} fill="#bfdbfe" stroke="#93c5fd" strokeWidth={2} />
            {/* Chorros */}
            {Array.from({length:8},(_,i)=>{const a=(i*Math.PI*2)/8;return <circle key={i} cx={Math.cos(a)*65} cy={Math.sin(a)*65} r={7} fill="#60a5fa" opacity={0.8} />})}
            {/* Vapor */}
            <path d="M-20 -30 Q-10 -50 0 -30 Q10 -50 20 -30" fill="none" stroke="#e2e8f0" strokeWidth={3} opacity={0.5} />
            {/* Escalones entrada */}
            <rect x={80} y={-14} width={70} height={28} rx={4} fill="#b45309" stroke="#92400e" strokeWidth={2} />
            <rect x={90} y={-10} width={50} height={20} rx={3} fill="#d97706" />
          </>
        ),
      },
      {
        key: "pista-padel",
        label: "Pista pádel",
        w: 1000, h: 500,
        draw: () => (
          <>
            <rect x={-500} y={-250} width={1000} height={500} rx={6} fill="#22c55e" stroke={WALL} strokeWidth={6} />
            {/* Suelo */}
            <rect x={-490} y={-240} width={980} height={480} rx={4} fill="#16a34a" />
            {/* Líneas de campo */}
            <rect x={-490} y={-240} width={980} height={480} rx={4} fill="none" stroke="#faf9f7" strokeWidth={3} />
            <line x1={0} y1={-240} x2={0} y2={240} stroke="#faf9f7" strokeWidth={3} />
            <line x1={-490} y1={0} x2={490} y2={0} stroke="#faf9f7" strokeWidth={3} />
            <line x1={-350} y1={-240} x2={-350} y2={240} stroke="#faf9f7" strokeWidth={2} />
            <line x1={350} y1={-240} x2={350} y2={240} stroke="#faf9f7" strokeWidth={2} />
            {/* Red */}
            <rect x={-10} y={-240} width={20} height={480} rx={4} fill="#94a3b8" />
            {/* Cristales laterales */}
            <rect x={-500} y={-250} width={10} height={500} rx={2} fill="#bfdbfe" opacity={0.6} />
            <rect x={490} y={-250} width={10} height={500} rx={2} fill="#bfdbfe" opacity={0.6} />
          </>
        ),
      },
      {
        key: "campo-futbol",
        label: "Campo fútbol",
        w: 1050, h: 680,
        draw: () => (
          <>
            <rect x={-525} y={-340} width={1050} height={680} rx={8} fill="#166534" stroke={WALL} strokeWidth={6} />
            <rect x={-500} y={-315} width={1000} height={630} rx={4} fill="#15803d" />
            {/* Líneas */}
            <rect x={-500} y={-315} width={1000} height={630} fill="none" stroke="#faf9f7" strokeWidth={3} />
            <line x1={0} y1={-315} x2={0} y2={315} stroke="#faf9f7" strokeWidth={3} />
            <circle cx={0} cy={0} r={91} fill="none" stroke="#faf9f7" strokeWidth={3} />
            <circle cx={0} cy={0} r={6} fill="#faf9f7" />
            {/* Áreas */}
            <rect x={-500} y={-110} width={165} height={220} rx={2} fill="none" stroke="#faf9f7" strokeWidth={3} />
            <rect x={335} y={-110} width={165} height={220} rx={2} fill="none" stroke="#faf9f7" strokeWidth={3} />
            {/* Porterías */}
            <rect x={-520} y={-37} width={20} height={74} rx={2} fill="#faf9f7" />
            <rect x={500} y={-37} width={20} height={74} rx={2} fill="#faf9f7" />
          </>
        ),
      },
      {
        key: "tobogan",
        label: "Tobogán",
        w: 160, h: 300,
        draw: () => (
          <>
            {/* Plataforma arriba */}
            <rect x={-50} y={-150} width={100} height={40} rx={6} fill="#6b7280" stroke={WALL} strokeWidth={3} />
            {/* Rampa */}
            <path d="M-30 -110 Q-20 0 50 140" fill="none" stroke="#f97316" strokeWidth={18} strokeLinecap="round" />
            <path d="M30 -110 Q40 0 110 140" fill="none" stroke="#f97316" strokeWidth={18} strokeLinecap="round" />
            {/* Barandillas plataforma */}
            <line x1={-50} y1={-150} x2={-50} y2={-110} stroke={WALL} strokeWidth={5} strokeLinecap="round" />
            <line x1={50} y1={-150} x2={50} y2={-110} stroke={WALL} strokeWidth={5} strokeLinecap="round" />
            {/* Escalera acceso */}
            <rect x={-50} y={-150} width={12} height={130} rx={3} fill="#374151" />
            {[-130,-110,-90,-70,-50,-30].map((y,i) => (
              <rect key={i} x={-50} y={y} width={28} height={8} rx={2} fill="#6b7280" />
            ))}
          </>
        ),
      },
      {
        key: "arenero",
        label: "Arenero",
        w: 180, h: 180,
        draw: () => (
          <>
            <rect x={-90} y={-90} width={180} height={180} rx={12} fill="#92400e" stroke="#78350f" strokeWidth={4} />
            <rect x={-80} y={-80} width={160} height={160} rx={10} fill="#fbbf24" />
            {/* Textura arena */}
            {[[-40,-40],[20,-50],[-20,10],[40,30],[-50,40],[10,-15],[-10,45],[50,-20]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={4} fill="#f59e0b" opacity={0.6} />
            ))}
            {/* Juguetes */}
            <rect x={-30} y={20} width={25} height={18} rx={3} fill="#ef4444" />
            <path d="M-30 20 L-17 8 L-5 20" fill="#dc2626" />
          </>
        ),
      },
      {
        key: "trampolin",
        label: "Trampolín",
        w: 300, h: 300,
        draw: () => (
          <>
            {/* Marco exterior */}
            <circle cx={0} cy={0} r={148} fill="none" stroke="#374151" strokeWidth={8} />
            {/* Superficie de salto */}
            <circle cx={0} cy={0} r={130} fill="#1e40af" stroke="#1d4ed8" strokeWidth={3} />
            {/* Red/malla */}
            {Array.from({length:8},(_,i)=>{const a=(i*Math.PI*2)/8;return <line key={i} x1={0} y1={0} x2={Math.cos(a)*128} y2={Math.sin(a)*128} stroke="#3b82f6" strokeWidth={1.5} opacity={0.6} />})}
            <circle cx={0} cy={0} r={65} fill="none" stroke="#60a5fa" strokeWidth={1.5} opacity={0.5} />
            {/* Patas (8) */}
            {Array.from({length:8},(_,i)=>{const a=(i*Math.PI*2)/8;return <circle key={i} cx={Math.cos(a)*148} cy={Math.sin(a)*148} r={8} fill="#6b7280" stroke={WALL} strokeWidth={2} />})}
            {/* Red seguridad */}
            <circle cx={0} cy={0} r={148} fill="none" stroke="#22c55e" strokeWidth={3} strokeDasharray="10 6" opacity={0.7} />
          </>
        ),
      },
      {
        key: "futbolin",
        label: "Futbolín",
        w: 130, h: 240,
        draw: () => (
          <>
            <rect x={-65} y={-120} width={130} height={240} rx={6} fill="#92400e" stroke={WALL} strokeWidth={4} />
            <rect x={-55} y={-108} width={110} height={216} rx={4} fill="#166534" />
            {/* Barras y jugadores */}
            {[-80,-50,-20,10,40,70].map((y,i) => (
              <g key={i}>
                <line x1={-65} y1={y} x2={65} y2={y} stroke="#374151" strokeWidth={5} />
                {[-30,0,30].map((x,j) => (
                  <rect key={j} x={x-6} y={y-10} width={12} height={20} rx={3}
                    fill={i%2===0?"#ef4444":"#3b82f6"} stroke={WALL} strokeWidth={1} />
                ))}
              </g>
            ))}
            {/* Pelota */}
            <circle cx={0} cy={-5} r={7} fill="#faf9f7" stroke="#94a3b8" strokeWidth={1.5} />
          </>
        ),
      },
      {
        key: "dardos",
        label: "Diana dardos",
        w: 60, h: 60,
        draw: () => (
          <>
            <circle cx={0} cy={0} r={28} fill="#1c1f24" stroke={WALL} strokeWidth={2} />
            <circle cx={0} cy={0} r={22} fill="#ef4444" />
            <circle cx={0} cy={0} r={16} fill="#1c1f24" />
            <circle cx={0} cy={0} r={10} fill="#22c55e" />
            <circle cx={0} cy={0} r={4} fill="#ef4444" />
            {/* Dardos */}
            <line x1={5} y1={-8} x2={18} y2={-22} stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" />
            <line x1={-6} y1={3} x2={-19} y2={16} stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" />
          </>
        ),
      },
      {
        key: "barra-bar",
        label: "Barra bar",
        w: 300, h: 60,
        draw: () => (
          <>
            <rect x={-150} y={-30} width={300} height={60} rx={8} fill="#78350f" stroke={WALL} strokeWidth={3} />
            <rect x={-140} y={-22} width={280} height={10} rx={4} fill="#92400e" />
            {/* Taburetes */}
            {[-100,-50,0,50,100].map((x,i) => (
              <circle key={i} cx={x} cy={40} r={14} fill="#6b4a32" stroke={WALL} strokeWidth={2} />
            ))}
            {/* Grifo cerveza */}
            <rect x={-6} y={-30} width={12} height={22} rx={3} fill="#fbbf24" stroke="#f59e0b" strokeWidth={1.5} />
          </>
        ),
      },
    ],
  },
  {
    id: "estaciones",
    label: "Estaciones / Festivos",
    items: [
      {
        key: "primavera",
        label: "Árbol primavera",
        w: 120, h: 120,
        draw: () => (
          <>
            <rect x={-6} y={-60} width={12} height={80} rx={4} fill="#92400e" />
            <circle cx={0} cy={-55} r={45} fill="#4ade80" stroke="#16a34a" strokeWidth={2} />
            {/* Flores rosas */}
            {[[-28,-70],[10,-85],[35,-55],[20,-35],[-30,-40]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={8} fill="#f9a8d4" stroke="#ec4899" strokeWidth={1.5} />
            ))}
          </>
        ),
      },
      {
        key: "verano",
        label: "Árbol verano",
        w: 120, h: 120,
        draw: () => (
          <>
            <rect x={-6} y={-60} width={12} height={80} rx={4} fill="#92400e" />
            <circle cx={0} cy={-55} r={48} fill="#16a34a" stroke="#166534" strokeWidth={2} />
            <circle cx={-18} cy={-70} r={22} fill="#22c55e" />
            <circle cx={20} cy={-68} r={20} fill="#22c55e" />
            {/* Sol de verano */}
            <circle cx={35} cy={-80} r={12} fill="#fbbf24" />
            <path d="M35 -95 V-100 M35 -60 V-65 M20 -80 H15 M50 -80 H55 M25 -90 L22 -94 M45 -70 L48 -67 M45 -90 L48 -94 M25 -70 L22 -67" fill="none" stroke="#fbbf24" strokeWidth={2} />
          </>
        ),
      },
      {
        key: "otoño",
        label: "Árbol otoño",
        w: 120, h: 120,
        draw: () => (
          <>
            <rect x={-6} y={-60} width={12} height={80} rx={4} fill="#78350f" />
            {/* Ramas */}
            <path d="M0 -40 L-30 -70 M0 -50 L25 -72 M0 -55 L-15 -85 M0 -45 L10 -75" fill="none" stroke="#78350f" strokeWidth={5} />
            {/* Hojas naranjas */}
            {[[-32,-72],[26,-74],[-16,-87],[10,-77],[-8,-65],[18,-58]].map(([cx,cy],i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={12} ry={9} fill={["#f97316","#fb923c","#f59e0b","#ef4444","#ea580c","#dc2626"][i]} />
            ))}
            {/* Hojas caídas */}
            {[[-40,15],[10,25],[-20,30],[30,10]].map(([cx,cy],i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={8} ry={6} fill={["#f97316","#f59e0b","#ea580c","#fb923c"][i]} opacity={0.7} />
            ))}
          </>
        ),
      },
      {
        key: "invierno",
        label: "Muñeco de nieve",
        w: 100, h: 160,
        draw: () => (
          <>
            {/* Cuerpo grande */}
            <circle cx={0} cy={35} r={40} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} />
            {/* Cabeza */}
            <circle cx={0} cy={-45} r={28} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} />
            {/* Ojos */}
            <circle cx={-10} cy={-52} r={4} fill="#1e293b" />
            <circle cx={10} cy={-52} r={4} fill="#1e293b" />
            {/* Nariz zanahoria */}
            <polygon points="0,-47 8,-44 0,-41" fill="#f97316" />
            {/* Boca */}
            <path d="M-10 -38 Q0 -32 10 -38" fill="none" stroke="#1e293b" strokeWidth={2} />
            {/* Sombrero */}
            <rect x={-18} y={-82} width={36} height={6} rx={3} fill="#1e293b" />
            <rect x={-12} y={-110} width={24} height={28} rx={3} fill="#1e293b" />
            {/* Bufanda */}
            <rect x={-26} y={-62} width={52} height={10} rx={4} fill="#ef4444" />
            {/* Botones */}
            <circle cx={0} cy={15} r={4} fill="#475569" />
            <circle cx={0} cy={35} r={4} fill="#475569" />
            <circle cx={0} cy={55} r={4} fill="#475569" />
            {/* Brazos */}
            <line x1={-40} y1={25} x2={-65} y2={5} stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
            <line x1={40} y1={25} x2={65} y2={5} stroke="#92400e" strokeWidth={5} strokeLinecap="round" />
            {/* Nieve en el suelo */}
            {[-50,-30,-10,10,30,50].map((x,i) => (
              <circle key={i} cx={x} cy={75} r={5} fill="#e2e8f0" />
            ))}
          </>
        ),
      },
      {
        key: "arbol-navidad",
        label: "Árbol Navidad",
        w: 130, h: 200,
        draw: () => (
          <>
            {/* Tronco */}
            <rect x={-10} y={70} width={20} height={30} rx={3} fill="#78350f" />
            {/* Tres capas del árbol */}
            <polygon points="0,-100 -55,-10 55,-10" fill="#15803d" stroke="#166534" strokeWidth={2} />
            <polygon points="0,-50 -65,30 65,30" fill="#16a34a" stroke="#166534" strokeWidth={2} />
            <polygon points="0,0 -70,70 70,70" fill="#22c55e" stroke="#166534" strokeWidth={2} />
            {/* Bolas de colores */}
            {[[-35,-2],[30,5],[-20,30],[45,28],[-50,52],[15,55],[35,55],[-25,52]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={7} fill={["#ef4444","#fbbf24","#3b82f6","#f97316","#ec4899","#ef4444","#fbbf24","#3b82f6"][i]} />
            ))}
            {/* Estrella */}
            <polygon points="0,-115 5,-102 18,-102 8,-94 12,-81 0,-89 -12,-81 -8,-94 -18,-102 -5,-102" fill="#fbbf24" stroke="#f59e0b" strokeWidth={1} />
          </>
        ),
      },
      {
        key: "halloween",
        label: "Halloween 🎃",
        w: 100, h: 120,
        draw: () => (
          <>
            {/* Calabaza */}
            <ellipse cx={0} cy={20} rx={42} ry={36} fill="#f97316" stroke="#c2410c" strokeWidth={2} />
            <ellipse cx={-20} cy={22} rx={14} ry={30} fill="#ea580c" />
            <ellipse cx={20} cy={22} rx={14} ry={30} fill="#ea580c" />
            {/* Tallo */}
            <rect x={-5} y={-20} width={10} height={18} rx={4} fill="#15803d" />
            <path d="M5 -15 Q20 -25 18 -35" fill="none" stroke="#15803d" strokeWidth={3} />
            {/* Cara */}
            <polygon points="-22,0 -14,-12 -6,0" fill="#1c1f24" />
            <polygon points="22,0 14,-12 6,0" fill="#1c1f24" />
            <path d="M-20 20 Q-10 30 0 22 Q10 30 20 20" fill="#1c1f24" />
            {/* Murciélagos */}
            <path d="M-50,-50 Q-40,-60 -30,-50 Q-25,-58 -20,-50" fill="#1c1f24" />
            <path d="M50,-50 Q40,-60 30,-50 Q25,-58 20,-50" fill="#1c1f24" />
          </>
        ),
      },
      {
        key: "arbol-navidad-nieve",
        label: "Árbol Navidad nieve",
        w: 130, h: 200,
        draw: () => (
          <>
            <rect x={-10} y={70} width={20} height={30} rx={3} fill="#78350f" />
            <polygon points="0,-100 -55,-10 55,-10" fill="#166534" />
            <polygon points="0,-100 -20,-10 20,-10" fill="#f1f5f9" opacity={0.7} />
            <polygon points="0,-50 -65,30 65,30" fill="#15803d" />
            <polygon points="0,-50 -25,30 25,30" fill="#f1f5f9" opacity={0.7} />
            <polygon points="0,0 -70,70 70,70" fill="#16a34a" />
            <polygon points="0,0 -30,70 30,70" fill="#f1f5f9" opacity={0.7} />
            <polygon points="0,-115 5,-102 18,-102 8,-94 12,-81 0,-89 -12,-81 -8,-94 -18,-102 -5,-102" fill="#fbbf24" />
          </>
        ),
      },
      {
        key: "monstruo",
        label: "Monstruo 👾",
        w: 100, h: 180,
        draw: () => (
          <>
            {/* Cuerpo */}
            <rect x={-40} y={-50} width={80} height={110} rx={12} fill="#2d5a27" stroke="#166534" strokeWidth={2} />
            {/* Barriga */}
            <ellipse cx={0} cy={15} rx={28} ry={36} fill="#6b8e23" />
            {/* Ojos */}
            <circle cx={-18} cy={-28} r={14} fill="#f8f9fa" stroke="#1c1f24" strokeWidth={2} />
            <circle cx={18} cy={-28} r={14} fill="#f8f9fa" stroke="#1c1f24" strokeWidth={2} />
            <circle cx={-18} cy={-28} r={7} fill="#1a1a1a" />
            <circle cx={18} cy={-28} r={7} fill="#1a1a1a" />
            {/* Boca */}
            <path d="M-20 10 Q0 25 20 10" fill="none" stroke="#1c1f24" strokeWidth={3} />
            {/* Brazos */}
            <rect x={-60} y={-20} width={22} height={50} rx={8} fill="#2d5a27" stroke="#166534" strokeWidth={2} />
            <rect x={38} y={-20} width={22} height={50} rx={8} fill="#2d5a27" stroke="#166534" strokeWidth={2} />
            {/* Patas */}
            <rect x={-30} y={58} width={22} height={32} rx={6} fill="#2d5a27" stroke="#166534" strokeWidth={2} />
            <rect x={8} y={58} width={22} height={32} rx={6} fill="#2d5a27" stroke="#166534" strokeWidth={2} />
          </>
        ),
      },
      {
        key: "reyes-magos",
        label: "Estrella Reyes",
        w: 120, h: 120,
        draw: () => (
          <>
            {/* Estrella de 6 puntas */}
            <polygon points="0,-58 14,-20 54,-20 22,4 34,42 0,18 -34,42 -22,4 -54,-20 -14,-20" fill="#fbbf24" stroke="#f59e0b" strokeWidth={2} />
            {/* Regalos */}
            <rect x={-50} y={30} width={30} height={28} rx={4} fill="#ef4444" stroke="#dc2626" strokeWidth={2} />
            <path d="M-35 30 V58 M-50 44 H-20" fill="none" stroke="#fbbf24" strokeWidth={2.5} />
            <rect x={20} y={35} width={28} height={22} rx={4} fill="#3b82f6" stroke="#2563eb" strokeWidth={2} />
            <path d="M34 35 V57 M20 46 H48" fill="none" stroke="#fbbf24" strokeWidth={2} />
            <rect x={-10} y={40} width={22} height={18} rx={3} fill="#22c55e" stroke="#16a34a" strokeWidth={2} />
          </>
        ),
      },
      {
        key: "san-valentin",
        label: "San Valentín ❤️",
        w: 110, h: 100,
        draw: () => (
          <>
            {/* Corazón grande */}
            <path d="M0,30 C0,30 -55,-10 -55,-40 C-55,-65 -28,-75 0,-50 C28,-75 55,-65 55,-40 C55,-10 0,30 0,30 Z" fill="#ef4444" stroke="#dc2626" strokeWidth={2} />
            {/* Corazones pequeños */}
            <path d="M-35,55 C-35,55 -52,42 -52,34 C-52,27 -43,24 -35,34 C-27,24 -18,27 -18,34 C-18,42 -35,55 -35,55 Z" fill="#f9a8d4" />
            <path d="M35,55 C35,55 18,42 18,34 C18,27 27,24 35,34 C43,24 52,27 52,34 C52,42 35,55 35,55 Z" fill="#f9a8d4" />
            {/* Flecha de Cupido */}
            <line x1={-55} y1={-55} x2={55} y2={30} stroke="#f97316" strokeWidth={3} strokeLinecap="round" />
            <polygon points="55,30 42,22 50,38" fill="#f97316" />
            <polygon points="-55,-55 -44,-42 -60,-44" fill="#f97316" />
          </>
        ),
      },
      {
        key: "pascua",
        label: "Pascua 🐣",
        w: 120, h: 130,
        draw: () => (
          <>
            {/* Hierba */}
            <ellipse cx={0} cy={55} rx={58} ry={15} fill="#22c55e" opacity={0.5} />
            {/* Huevos */}
            <ellipse cx={-32} cy={30} rx={18} ry={24} fill="#f97316" stroke="#ea580c" strokeWidth={2} />
            <path d="M-45,22 Q-32,16 -19,22" fill="none" stroke="#fbbf24" strokeWidth={2.5} />
            <ellipse cx={32} cy={28} rx={18} ry={24} fill="#8b5cf6" stroke="#7c3aed" strokeWidth={2} />
            <path d="M20,20 Q32,14 44,20 M20,32 Q32,26 44,32" fill="none" stroke="#faf9f7" strokeWidth={2} />
            {/* Conejito */}
            <ellipse cx={0} cy={-10} rx={22} ry={30} fill="#faf9f7" stroke="#94a3b8" strokeWidth={2} />
            <ellipse cx={-10} cy={-50} rx={8} ry={20} fill="#faf9f7" stroke="#94a3b8" strokeWidth={2} />
            <ellipse cx={10} cy={-50} rx={8} ry={20} fill="#faf9f7" stroke="#94a3b8" strokeWidth={2} />
            <ellipse cx={-10} cy={-50} rx={4} ry={14} fill="#f9a8d4" />
            <ellipse cx={10} cy={-50} rx={4} ry={14} fill="#f9a8d4" />
            <circle cx={-6} cy={-15} r={3} fill="#1c1f24" />
            <circle cx={6} cy={-15} r={3} fill="#1c1f24" />
            <circle cx={0} cy={-8} r={4} fill="#f9a8d4" />
          </>
        ),
      },
    ],
  },
  {
    id: "suelo",
    label: "Suelo",
    items: [
      { key: "madera", label: "Madera", w: 60, h: 30, draw: () => (<><rect x={-30} y={-15} width={60} height={30} rx={3} fill="#d2b48c" stroke="#1c1f24" /></>) },
      { key: "loza", label: "Loza/Cerámica", w: 60, h: 30, draw: () => (<><rect x={-30} y={-15} width={60} height={30} rx={3} fill="#f0f0f0" stroke="#1c1f24" /></>) },
      { key: "marmol", label: "Mármol", w: 60, h: 30, draw: () => (<><rect x={-30} y={-15} width={60} height={30} rx={3} fill="#e0e0e0" stroke="#1c1f24" /></>) },
    ],
  },

  {
    id: "iluminacion",
    label: "Iluminación",
    items: [
      { key: "lampara", label: "Lámpara techo", w: 30, h: 30, draw: () => (<><rect x={-15} y={-15} width={30} height={30} rx={4} fill="#faf9f7" stroke="#1c1f24" /><circle cx={0} cy={0} r={6} fill="none" stroke="#f6821f" /></>) },
      { key: "downlight", label: "Downlight", w: 20, h: 20, draw: () => (<><circle cx={0} cy={0} r={8} fill="#faf9f7" stroke="#1c1f24" /><circle cx={0} cy={0} r={3} fill="#f6821f" /></>) },
      { key: "aplique", label: "Aplique / pared", w: 40, h: 18, draw: () => (<><rect x={-20} y={-9} width={40} height={18} rx={4} fill="#faf9f7" stroke="#1c1f24" /><circle cx={0} cy={0} r={4} fill="#f6821f" /></>) },
      { key: "ventilador", label: "Ventilador techo", w: 60, h: 60, draw: () => (<><circle cx={0} cy={0} r={25} fill="none" stroke="#1c1f24" /><circle cx={0} cy={0} r={6} fill="#f6821f" /><path d="M-2 6 V25 M2 6 V25 M-6 4 V24 M6 4 V24" fill="none" stroke="#6b675f" /></>) },
    ],
  },
  {
    id: "fontaneria",
    label: "Fontanería",
    items: [
      { key: "grifo", label: "Grifo monomando", w: 18, h: 12, draw: () => (<><rect x={-9} y={-6} width={18} height={12} rx={3} fill="#faf9f7" stroke="#1c1f24" /><circle cx={0} cy={0} r={3} fill="#475569" /><path d="M-6 0 H6" fill="none" stroke="#1c1f24" strokeWidth={1.5} /></>) },
      { key: "grifo-bide", label: "Grifo bidé", w: 24, h: 12, draw: () => (<><rect x={-12} y={-6} width={24} height={12} rx={3} fill="#faf9f7" stroke="#1c1f24" /><circle cx={0} cy={0} r={4} fill="#475569" /><path d="M-8 0 H8" fill="none" stroke="#1c1f24" strokeWidth={1.5} /></>) },
      { key: "grifo-lavabo", label: "Grifo lavabo", w: 16, h: 10, draw: () => (<><rect x={-8} y={-5} width={16} height={10} rx={2} fill="#faf9f7" stroke="#1c1f24" /><circle cx={0} cy={0} r={2.5} fill="#475569" /></>) },
      { key: "manguera-ducha", label: "Manguera ducha", w: 50, h: 8, draw: () => (<><rect x={-25} y={-4} width={50} height={8} rx={4} fill="#faf9f7" stroke="#1c1f24" /><path d="M-20 0 H20" fill="none" stroke="#6b675f" strokeWidth={1.5} /><circle cx={-23} cy={0} r={2} fill="#f6821f" /><circle cx={23} cy={0} r={2} fill="#f6821f" /></>) },
      { key: "manguera-lavabo", label: "Manguera lavabo", w: 35, h: 6, draw: () => (<><rect x={-17} y={-3} width={35} height={6} rx={3} fill="#faf9f7" stroke="#1c1f24" /><path d="M-14 0 H12" fill="none" stroke="#6b675f" strokeWidth={1.5} /></>) },
      { key: "alicatado", label: "Alicatado Pared", w: 50, h: 30, draw: () => (<><rect x={-25} y={-15} width={50} height={30} rx={3} fill="#e0e0fa" stroke="#1c1f24" /><path d="M-20 -5 H20 M-15 -10 H15" stroke="#1c1f24" strokeWidth={1} fill="none" /></>) },
      { key: "azulejo", label: "Azulejo Pared", w: 50, h: 30, draw: () => (<><rect x={-25} y={-15} width={50} height={30} rx={3} fill="#f0f8ff" stroke="#1c1f24" /><path d="M-20 -5 H20 M-15 -10 H15" stroke="#1c1f24" strokeWidth={1} fill="none" /></>) },
    ],
  },
  {
    id: "urbanizacion",
    label: "Urbanización",
    items: [
      { key: "caminos-madera", label: "Camino Madera", w: 100, h: 30, draw: () => (<><rect x={-50} y={-15} width={100} height={30} rx={3} fill="#6b4a32" stroke="#1c1f24" /></>) },
      { key: "granito", label: "Piedra Granito", w: 100, h: 30, draw: () => (<><rect x={-50} y={-15} width={100} height={30} rx={3} fill="#2c3e50" stroke="#1c1f24" /></>) },
      { key: "antenna-tv", label: "Antena TV", w: 60, h: 50, draw: () => (<><rect x={-30} y={-25} width={60} height={30} rx={3} fill="#8b7355" stroke="#1c1f24" /><path d="M-15 -8 V8 M15 -8 V8 M0 -8 V8" stroke="#1c1f24" strokeWidth={2} /><line x1="-10" y1="-12" x2="10" y2="-12" stroke="#1c1f24" strokeWidth={2} /><line x1="-10" y1="-18" x2="10" y2="-18" stroke="#1c1f24" strokeWidth={2} /></>) },
      { key: "antenna-satelite", label: "Antena Satélite", w: 70, h: 55, draw: () => (<><circle cx={0} cy={0} r={30} fill="none" stroke="#3a3a3a" strokeWidth={2} /><line x1="0" y1="-35" x2="0" y2="-30" stroke="#8b7355" strokeWidth={2} /><line x1="-20" y1="-25" x2="20" y2="-25" stroke="#8b7355" strokeWidth={1} /></>) },
      { key: "pecera", label: "Pecera", w: 80, h: 50, draw: () => (<><rect x={-40} y={-25} width={80} height={30} rx={3} fill="#1e3a5f" stroke="#1c1f24" /><rect x={-10} y={-5} width={20} height={10} rx={2} fill="#4682b4" /></>) },
      { key: "canasta", label: "Canasta", w: 60, h: 40, draw: () => (<><rect x={-30} y={-20} width={60} height={20} rx={3} fill="#8b6e45" stroke="#1c1f24" /><path d="M-20 -5 H20 M0 -5 H0 M20 -5 H20" stroke="#1c1f24" strokeWidth={1} fill="none" /><path d="M-15 0 H15 M15 0 H15 M-15 0 H15" stroke="#1c1f24" strokeWidth={1} fill="none" /></>) },
      { key: "tenis", label: "Cancha Tenis", w: 110, h: 60, draw: () => (<><rect x={-55} y={-30} width={110} height={30} rx={2} fill="#8b8b8b" stroke="#1c1f24" /><path d="M-25 -3 V3 M0 -3 V3 M25 -3 V3 M50 -5 V5 M50 5 V-5" stroke="#1c1f24" strokeWidth={1} fill="none" /><line x1="-50" y1="-5" x2="50" y2="-5" stroke="#1c1f24" strokeWidth={1} /><line x1="-50" y1="5" x2="50" y2="5" stroke="#1c1f24" strokeWidth={1} /></>) },
      { key: "baloncesto", label: "Cancha Baloncesto", w: 120, h: 65, draw: () => (<><rect x={-60} y={-32.5} width={120} height={32.5} rx={2} fill="#212529" stroke="#1c1f24" /><circle cx={0} cy={0} r={14} fill="none" stroke="#fff8f0" strokeWidth={2} /><path d="M0 14 L0 -14 M12 6 L12 -6 M-12 6 L-12 -6 M6 10 L6 -10 M-6 10 L-6 -10" stroke="#fff8f0" strokeWidth={2} /></>) },
    ],
  },
  {
    id: "anotaciones",
    label: "Anotaciones",
    items: [
      { key: "nota", label: "Texto / Nota", w: 220, h: 40, draw: () => (<><rect x={-110} y={-20} width={220} height={40} rx={4} fill="#fff7ed" stroke="#f6821f" strokeDasharray="8 6" /><path d="M-95 -8 H95" fill="none" stroke="#f6821f" strokeWidth={1.5} /></>) },
    ],
  },
]

export const CAT_BY_KEY: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.flatMap((group) => group.items.map((item) => [item.key, item])),
);