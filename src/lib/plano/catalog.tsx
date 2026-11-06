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
      { key: "campana", label: "Campana extractora", w: 60, h: 45, draw: () => (<><rect x={-30} y={-22} width={60} height={15} rx={4} /><rect x={-24} y={-7} width={48} height={29} rx={4} fill="none" /><path d="M-18 -22 V-30 M0 -22 V-30 M18 -22 V-30" fill="none" /></>) },
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
      { key: "bide", label: "Bidé", w: 40, h: 55, draw: () => (<><rect x={-20} y={-27} width={40} height={55} rx={14} /><rect x={-14} y={-15} width={28} height={30} rx={10} fill="none" /><circle cx={0} cy={-10} r={4} fill="none" /></>) },
      { key: "lavabo", label: "Lavabo", w: 55, h: 45, draw: () => (<><rect x={-27} y={-22} width={55} height={45} rx={8} /><ellipse cx={0} cy={3} rx={17} ry={12} fill="none" /><circle cx={0} cy={-14} r={4} fill="none" /></>) },
      { key: "ducha", label: "Ducha", w: 90, h: 90, draw: () => (<><rect x={-45} y={-45} width={90} height={90} rx={5} /><path d="M-45 -45 L45 45" fill="none" /><circle cx={0} cy={0} r={6} fill="none" /></>) },
      { key: "banera", label: "Bañera", w: 170, h: 75, draw: () => (<><rect x={-85} y={-37} width={170} height={75} rx={16} /><rect x={-74} y={-27} width={148} height={55} rx={12} fill="none" /><circle cx={62} cy={0} r={5} fill="none" /></>) },
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
      { key: "ventana", label: "Ventana", w: 120, h: 15, draw: () => (<><rect x={-60} y={-7} width={120} height={15} fill="#ffffff" /><path d="M-60 0 H60" fill="none" strokeWidth={2} /></>) },
      { key: "columna", label: "Columna", w: 30, h: 30, draw: () => (<rect x={-15} y={-15} width={30} height={30} fill={WALL} stroke={WALL} />) },
      { key: "escalera", label: "Escalera", w: 90, h: 240, draw: () => (<><rect x={-45} y={-120} width={90} height={240} fill="#ffffff" />{Array.from({ length: 7 }, (_, i) => (<path key={i} d={`M-45 ${-120 + (i + 1) * 30} H45`} fill="none" strokeWidth={2} />))}<path d="M0 105 V-95" fill="none" strokeWidth={2} /><path d="M-12 -75 L0 -100 L12 -75" fill="none" strokeWidth={2} /></>) },
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
    ],
  },
  {
    id: "exterior",
    label: "Exterior / Patio",
    items: [
      { key: "maceta", label: "Maceta", w: 45, h: 45, draw: () => (<><circle cx={0} cy={0} r={22} fill="#faf9f7" /><rect x={-14} y={-2} width={28} height={14} rx={3} fill="#92400e" stroke="#78350f" /><path d="M-20 16 H20" fill="none" stroke="#92400e" strokeWidth={2.5} /></>) },
      { key: "planta-ext", label: "Planta", w: 60, h: 60, draw: () => (<><circle cx={0} cy={0} r={22} fill="#22c55e" /><circle cx={0} cy={0} r={14} fill="#16a34a" /><path d="M0 0 V-8" fill="none" stroke="#166534" strokeWidth={2} /><circle cx={-8} cy={-2} r={3} fill="#166534" /><circle cx={10} cy={-5} r={3} fill="#166534" /></>) },
      { key: "fuente", label: "Fuente", w: 90, h: 90, draw: () => (<><circle cx={0} cy={0} r={45} fill="#dcecf8" stroke="#1c1f24" /><circle cx={0} cy={0} r={18} fill="#faf9f7" stroke="#1c1f24" /><circle cx={0} cy={0} r={6} fill="#f6821f" /><path d="M-18 -12 C-10 -24 10 -24 18 -12 M-12 12 C-4 4 4 4 12 12" fill="none" stroke="#4f96e6" strokeWidth={2.5} /></>) },
      { key: "barbacoa", label: "Barbacoa", w: 120, h: 60, draw: () => (<><rect x={-60} y={-30} width={120} height={60} rx={8} fill="#faf9f7" stroke="#1c1f24" /><rect x={-48} y={-18} width={96} height={24} rx={4} fill="#d1d5db" stroke="#6b7280" /><path d="M-36 -26 V-52 M-12 -26 V-52 M12 -26 V-52 M6 -26 V-52 M36 -26 V-52" fill="none" stroke="#6b7280" strokeWidth={3} /></>) },
      { key: "piscina", label: "Piscina", w: 300, h: 200, draw: () => (<><rect x={-150} y={-100} width={300} height={200} rx={18} fill="#dcecf8" stroke="#1c1f24" strokeWidth={4} /><rect x={-136} y={-86} width={272} height={172} rx={14} fill="none" stroke="#93c5fd" /><path d="M-120 -30 H120 M-110 30 H110" fill="none" stroke="#4f96e6" strokeWidth={2.5} strokeDasharray="14 10" /></>) },
      { key: "parasol", label: "Sombrilla/Parásol", w: 150, h: 150, draw: () => (<><circle cx={0} cy={0} r={10} fill="#faf9f7" stroke="#1c1f24" /><path d="M-70 0 A 70 70 0 0 1 75 0" fill="#fbbf24" stroke="#1c1f24" /><path d="M-70 0 A 70 70 0 0 0 75 0" fill="#fbbf24" stroke="#1c1f24" /><path d="M0 0 V-75" fill="none" stroke="#78350f" strokeWidth={3} /></>) },
      { key: "pergola", label: "Pérgola", w: 200, h: 150, draw: () => (<><rect x={-100} y={-65} width={200} height={130} rx={6} fill="none" stroke="#1c1f24" strokeDasharray="14 10" /><path d="M-90 -55 H90 M-90 -20 H90 M-90 15 H90 M-90 50 H90" fill="none" stroke="#22c55e" strokeWidth={2.5} /></>) },
      { key: "banco-ext", label: "Banco exterior", w: 120, h: 40, draw: () => (<><rect x={-60} y={-20} width={120} height={40} rx={6} fill="#faf9f7" stroke="#1c1f24" /><path d="M-48 -10 H48 M-48 0 H48 M-48 10 H48" fill="none" stroke="#92400e" strokeWidth={2} /></>) },
      { key: "celosia", label: "Celosía", w: 200, h: 12, draw: () => (<><rect x={-100} y={-6} width={200} height={12} rx={2} fill="#faf9f7" stroke="#92400e" /><path d="M-94 -6 L-82 6 M-78 -6 L-66 6 M-62 -6 L-50 6 M-46 -6 L-34 6 M-30 -6 L-18 6 M-14 -6 L-2 6 M2 -6 L14 6 M18 -6 L30 6 M34 -6 L46 6 M50 -6 L62 6 M66 -6 L78 6 M82 -6 L94 6" fill="none" stroke="#92400e" strokeWidth={1.5} /></>) },
      { key: "arbol", label: "Árbol", w: 90, h: 90, draw: () => (<><circle cx={0} cy={0} r={44} fill="#16a34a" stroke="#166534" /><circle cx={-12} cy={-8} r={14} fill="#22c55e" /><circle cx={18} cy={-4} r={16} fill="#22c55e" /><circle cx={0} cy={18} r={12} fill="#15803d" /><rect x={-4.5} y={42} width={9} height={18} rx={3} fill="#92400e" stroke="#78350f" /></>) },
      { key: "arbusto", label: "Arbusto", w: 60, h: 25, draw: () => (<><ellipse cx={0} cy={0} rx={30} ry={12} fill="#22c55e" stroke="#166534" /><circle cx={-12} cy={-3} r={7} fill="#4ade80" /><circle cx={8} cy={-2} r={8} fill="#4ade80" /><circle cx={20} cy={0} r={6} fill="#4ade80" /></>) },
      { key: "huerto", label: "Huerto / Bancales", w: 250, h: 140, draw: () => (<><rect x={-125} y={-70} width={250} height={140} rx={8} fill="#92400e" stroke="#78350f" /><rect x={-112} y={-56} width={224} height={112} rx={6} fill="#3f6212" stroke="#14532d" /><path d="M-112 -28 H112 M-112 -2 H112 M-112 24 H112 M-75 -56 V56 M-37 -56 V56 M1 -56 V56 M37 -56 V56 M75 -56 V56" fill="none" stroke="#65a30d" strokeWidth={1.5} /></>) },
      { key: "jardinera", label: "Jardinera", w: 120, h: 35, draw: () => (<><rect x={-60} y={-17} width={120} height={35} rx={6} fill="#92400e" stroke="#78350f" /><rect x={-52} y={-10} width={104} height={20} rx={4} fill="#3f6212" stroke="#14532d" /><circle cx={-30} cy={-2} r={5} fill="#22c55e" /><circle cx={-10} cy={-2} r={5} fill="#22c55e" /><circle cx={10} cy={-2} r={5} fill="#22c55e" /><circle cx={30} cy={-2} r={5} fill="#22c55e" /></>) },
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