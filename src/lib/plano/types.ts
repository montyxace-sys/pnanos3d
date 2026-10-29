/**
 * Modelo de datos del generador de planos.
 * Todas las medidas están en centímetros (cm) en el estado interno;
 * se convierten a metros para mostrarlas e imprimir.
 */

/** Estancia (habitación) definida por su esquina superior izquierda. */
export type Room = {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Pieza colocada sobre el plano (mobiliario o elemento de construcción). */
export type Piece = {
  id: string;
  /** Clave del catálogo (p. ej. "sofa3", "puerta"). */
  key: string;
  /** Centro de la pieza en cm. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Rotación en grados. */
  rot: number;
};

/** Documento completo del proyecto. */
export type PlanDoc = {
  title: string;
  rooms: Room[];
  pieces: Piece[];
};

export type Selection =
  | { kind: "room"; id: string }
  | { kind: "piece"; id: string }
  | null;

export type Bounds = { x: number; y: number; w: number; h: number };
