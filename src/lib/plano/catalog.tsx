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
      { key: "mesa-aux", label: "Mesa aux.", w: 60, h: 45, draw: () => (<><rect x={-30} y={-22} width={60} height={45} rx={6} /><circle cx={0} cy={0} r={9} fill="none" /></>) },
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
      { key: "placa", label: "Placa", w: 60, h: 60, draw: () => (<><rect x={-30} y={-30} width={60} height={60} rx={4} /><circle cx={-15} cy={-15} r={9} fill="none" /><circle cx={15} cy={-15} r={9} fill="none" /><circle cx={-15} cy={15} r={9} fill="none" /><circle cx={15} cy={15} r={9} fill="none" /></>) },
      { key: "frigorifico", label: "Frigorífico", w: 60, h: 65, draw: () => (<><rect x={-30} y={-32} width={60} height={65} rx={4} /><path d="M-30 -12 H30" fill="none" /><path d="M20 -28 V-16 M20 -8 V4" fill="none" /></>) },
      { key: "isla", label: "Isla", w: 120, h: 80, draw: () => (<><rect x={-60} y={-40} width={120} height={80} rx={4} /><rect x={-48} y={-29} width={96} height={58} rx={3} fill="none" /></>) },
    ],
  },
  {
    id: "banio",
    label: "Baño",
    items: [
      { key: "inodoro", label: "Inodoro", w: 40, h: 70, draw: () => (<><rect x={-20} y={-35} width={40} height={18} rx={4} /><rect x={-17} y={-17} width={34} height={52} rx={14} /><circle cx={0} cy={6} r={9} fill="none" /></>) },
      { key: "lavabo", label: "Lavabo", w: 55, h: 45, draw: () => (<><rect x={-27} y={-22} width={55} height={45} rx={8} /><ellipse cx={0} cy={3} rx={17} ry={12} fill="none" /><circle cx={0} cy={-14} r={4} fill="none" /></>) },
      { key: "ducha", label: "Ducha", w: 90, h: 90, draw: () => (<><rect x={-45} y={-45} width={90} height={90} rx={5} /><path d="M-45 -45 L45 45" fill="none" /><circle cx={0} cy={0} r={6} fill="none" /></>) },
      { key: "banera", label: "Bañera", w: 170, h: 75, draw: () => (<><rect x={-85} y={-37} width={170} height={75} rx={16} /><rect x={-74} y={-27} width={148} height={55} rx={12} fill="none" /><circle cx={62} cy={0} r={5} fill="none" /></>) },
    ],
  },
  {
    id: "construccion",
    label: "Construcción",
    items: [
      { key: "tabique", label: "Tabique", w: 200, h: 12, draw: () => (<rect x={-100} y={-6} width={200} height={12} fill={WALL} stroke={WALL} />) },
      { key: "puerta", label: "Puerta", w: 90, h: 90, draw: () => (<><path d="M-45 -45 A 90 90 0 0 1 45 45" fill="none" strokeDasharray="10 8" strokeWidth={2} /><rect x={-45} y={-45} width={9} height={90} fill={WALL} stroke={WALL} strokeWidth={1.5} /><circle cx={-45} cy={45} r={5} fill={WALL} stroke="none" /></>) },
      { key: "ventana", label: "Ventana", w: 120, h: 15, draw: () => (<><rect x={-60} y={-7} width={120} height={15} fill="#ffffff" /><path d="M-60 0 H60" fill="none" strokeWidth={2} /></>) },
      { key: "columna", label: "Columna", w: 30, h: 30, draw: () => (<rect x={-15} y={-15} width={30} height={30} fill={WALL} stroke={WALL} />) },
      { key: "escalera", label: "Escalera", w: 90, h: 240, draw: () => (<><rect x={-45} y={-120} width={90} height={240} fill="#ffffff" />{Array.from({ length: 7 }, (_, i) => (<path key={i} d={`M-45 ${-120 + (i + 1) * 30} H45`} fill="none" strokeWidth={2} />))}<path d="M0 105 V-95" fill="none" strokeWidth={2} /><path d="M-12 -75 L0 -100 L12 -75" fill="none" strokeWidth={2} /></>) },
    ],
  },
  {
    id: "varios",
    label: "Varios",
    items: [
      { key: "alfombra", label: "Alfombra", w: 200, h: 140, draw: () => (<><rect x={-100} y={-70} width={200} height={140} rx={6} strokeDasharray="12 9" fill="none" /><rect x={-86} y={-56} width={172} height={112} rx={5} strokeDasharray="8 7" fill="none" /></>) },
      { key: "planta", label: "Planta", w: 60, h: 60, draw: () => (<><circle cx={0} cy={0} r={28} /><circle cx={0} cy={0} r={15} fill="none" /></>) },
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
];

export const CAT_BY_KEY: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.flatMap((group) => group.items.map((item) => [item.key, item])),
);