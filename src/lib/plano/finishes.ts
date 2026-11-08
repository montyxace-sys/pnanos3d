import type * as THREE_NS from "three";

/**
 * Acabados procedurales del visor 3D: suelos, alicatados y césped.
 * Se dibujan en canvas en alta resolución para no depender de imágenes externas.
 */

type ThreeNS = typeof THREE_NS;

export type FloorFinish = "auto" | "parquet" | "roble" | "porcelanico" | "marmol" | "cemento";

export const FLOOR_OPTIONS: Array<{ value: FloorFinish; label: string }> = [
  { value: "auto", label: "Automático (según estancia)" },
  { value: "parquet", label: "Parquet claro" },
  { value: "roble", label: "Roble oscuro" },
  { value: "porcelanico", label: "Porcelánico" },
  { value: "marmol", label: "Mármol" },
  { value: "cemento", label: "Cemento pulido" },
];

/** Metros de suelo que cubre una repetición de cada textura. */
export const FLOOR_TILE_METERS = 1.2;

/** Metros de césped que cubre una repetición de la textura. */
export const GRASS_TILE_METERS = 2.4;

function norm(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isWetRoom(name: string): boolean {
  return /cocina|bano|aseo|lavadero|lavanderia/.test(norm(name));
}

/** Altura del alicatado: salpicadero en cocina y pared completa en baños. */
export function wetWallHeight(name: string): number {
  return /cocina/.test(norm(name)) ? 1 : 2.05;
}

export function resolveFloor(name: string, finish: FloorFinish): Exclude<FloorFinish, "auto"> {
  if (finish !== "auto") return finish;
  const n = norm(name);
  if (/cocina|bano|aseo|lavadero|lavanderia/.test(n)) return "porcelanico";
  if (/dormitorio|habitacion|despacho|estudio/.test(n)) return "roble";
  return "parquet";
}

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(size = 1024): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D no disponible");
  return [c, ctx];
}

function rgb(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function shade(color: [number, number, number], amount: number): string {
  return rgb(color[0] + amount, color[1] + amount, color[2] + amount);
}

function drawParquet(
  ctx: CanvasRenderingContext2D,
  palette: { base: [number, number, number]; light: [number, number, number]; dark: [number, number, number] },
  seed: number,
) {
  const size = 1024;
  const rows = 10;
  const rowH = size / rows;
  const rand = rng(seed);
  ctx.fillStyle = shade(palette.dark, -18);
  ctx.fillRect(0, 0, size, size);

  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : size / 4;
    for (let x = -offset; x < size; x += size / 2) {
      const tone = rand();
      const toneColor = tone > 0.62 ? palette.light : tone > 0.22 ? palette.base : palette.dark;
      const shift = Math.round((rand() - 0.5) * 18);
      const plankY = row * rowH;
      const plankH = rowH - 3;

      const grad = ctx.createLinearGradient(x, plankY, x, plankY + plankH);
      grad.addColorStop(0, shade(toneColor, 12 + shift));
      grad.addColorStop(0.45, shade(toneColor, shift));
      grad.addColorStop(1, shade(toneColor, -12 + shift));
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1.5, plankY + 1.5, size / 2 - 3, plankH);

      ctx.strokeStyle = "rgba(58,34,14,0.22)";
      ctx.lineWidth = 1.4;
      for (let gLine = 0; gLine < 5; gLine++) {
        const y = plankY + 8 + rand() * (plankH - 16);
        ctx.beginPath();
        ctx.moveTo(x + 6, y);
        ctx.bezierCurveTo(
          x + size / 8,
          y + rand() * 8 - 4,
          x + size / 4,
          y + rand() * 8 - 4,
          x + size / 2 - 6,
          y + rand() * 5 - 2.5,
        );
        ctx.stroke();
      }
      if (rand() > 0.72) {
        const kx = x + 40 + rand() * (size / 2 - 80);
        const ky = plankY + 14 + rand() * (plankH - 28);
        const kr = 3 + rand() * 5;
        ctx.strokeStyle = "rgba(55,32,12,0.35)";
        ctx.lineWidth = 1.1;
        for (let k = 1; k <= 3; k++) {
          ctx.beginPath();
          ctx.ellipse(kx, ky, kr * k * 0.8, kr * k * 0.4, 0.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "rgba(255,246,232,0.16)";
      ctx.fillRect(x + 2, plankY + 2, size / 2 - 4, 2);
      ctx.fillStyle = "rgba(48,28,12,0.3)";
      ctx.fillRect(x + 2, plankY + plankH - 1, size / 2 - 4, 2);
    }
  }

  ctx.fillStyle = "rgba(38,22,10,0.18)";
  for (let i = 0; i < 60; i++) {
    ctx.fillRect(rand() * size, rand() * size, 1 + rand() * 2, 1 + rand() * 2);
  }
}

function drawPorcelanico(ctx: CanvasRenderingContext2D) {
  const size = 1024;
  const rand = rng(11);
  const tile = size / 2;
  ctx.fillStyle = "#b7b3ab";
  ctx.fillRect(0, 0, size, size);
  for (let ty = 0; ty < 2; ty++) {
    for (let tx = 0; tx < 2; tx++) {
      const shadeBase = 213 + Math.round(rand() * 16);
      const grad = ctx.createLinearGradient(tx * tile, ty * tile, tx * tile + tile, ty * tile + tile);
      grad.addColorStop(0, rgb(shadeBase + 6, shadeBase + 4, shadeBase - 1));
      grad.addColorStop(0.55, rgb(shadeBase, shadeBase - 2, shadeBase - 6));
      grad.addColorStop(1, rgb(shadeBase - 7, shadeBase - 9, shadeBase - 12));
      ctx.fillStyle = grad;
      ctx.fillRect(tx * tile + 3, ty * tile + 3, tile - 6, tile - 6);

      for (let i = 0; i < 900; i++) {
        const v = rand();
        ctx.fillStyle =
          v > 0.55 ? `rgba(255,255,255,${0.04 + rand() * 0.07})` : `rgba(110,106,98,${0.03 + rand() * 0.06})`;
        const r = 0.7 + rand() * 2.2;
        ctx.fillRect(tx * tile + 8 + rand() * (tile - 16), ty * tile + 8 + rand() * (tile - 16), r, r);
      }

      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(tx * tile + 5.5, ty * tile + 5.5, tile - 11, tile - 11);
      ctx.strokeStyle = "rgba(96,92,84,0.25)";
      ctx.strokeRect(tx * tile + 3.5, ty * tile + 3.5, tile - 7, tile - 7);
    }
  }
}

function drawMarmol(ctx: CanvasRenderingContext2D) {
  const size = 1024;
  const rand = rng(23);
  const tile = size / 2;
  ctx.fillStyle = "#c9c4bb";
  ctx.fillRect(0, 0, size, size);
  for (let ty = 0; ty < 2; ty++) {
    for (let tx = 0; tx < 2; tx++) {
      const base = 232 + Math.round(rand() * 10);
      const grad = ctx.createLinearGradient(tx * tile, ty * tile, (tx + 1) * tile, (ty + 1) * tile);
      grad.addColorStop(0, rgb(base + 4, base + 3, base));
      grad.addColorStop(0.5, rgb(base, base - 1, base - 4));
      grad.addColorStop(1, rgb(base - 6, base - 7, base - 10));
      ctx.fillStyle = grad;
      ctx.fillRect(tx * tile + 3, ty * tile + 3, tile - 6, tile - 6);

      ctx.save();
      ctx.beginPath();
      ctx.rect(tx * tile + 6, ty * tile + 6, tile - 12, tile - 12);
      ctx.clip();
      for (let v = 0; v < 7; v++) {
        const startY = ty * tile + rand() * tile;
        ctx.beginPath();
        ctx.moveTo(tx * tile - 10, startY);
        let cy = startY;
        for (let x = 0; x <= tile + 20; x += 56) {
          cy += rand() * 46 - 23;
          ctx.quadraticCurveTo(tx * tile + x + 28, cy + rand() * 34 - 17, tx * tile + x + 56, cy);
        }
        ctx.strokeStyle = v % 3 === 0 ? "rgba(132,128,120,0.4)" : "rgba(170,166,157,0.24)";
        ctx.lineWidth = v % 3 === 0 ? 2.4 : 1.1;
        ctx.stroke();
      }
      for (let i = 0; i < 20; i++) {
        const x1 = tx * tile + rand() * tile;
        const y1 = ty * tile + rand() * tile;
        ctx.strokeStyle = `rgba(255,255,255,${0.18 + rand() * 0.28})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + rand() * 120 - 60, y1 + rand() * 40 - 20);
        ctx.stroke();
      }
      ctx.restore();

      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(tx * tile + 4.5, ty * tile + 4.5, tile - 9, tile - 9);
    }
  }
}

function drawCemento(ctx: CanvasRenderingContext2D) {
  const size = 1024;
  const rand = rng(37);
  ctx.fillStyle = "#b4afa5";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 30; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 60 + rand() * 200;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    const light = rand() > 0.5;
    grad.addColorStop(0, light ? "rgba(255,255,255,0.07)" : "rgba(60,56,50,0.06)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 16000; i++) {
    const v = rand() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${0.015 + rand() * 0.04})`;
    const r = 0.6 + rand() * 1.8;
    ctx.fillRect(rand() * size, rand() * size, r, r);
  }
  for (let i = 0; i < 18; i++) {
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 2 + rand() * 5;
    ctx.beginPath();
    const y = rand() * size;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(size * 0.3, y + rand() * 50 - 25, size * 0.7, y + rand() * 50 - 25, size, y + rand() * 40 - 20);
    ctx.stroke();
  }
}

function drawGrass(ctx: CanvasRenderingContext2D) {
  const size = 512;
  const rand = rng(73);
  ctx.fillStyle = "#4a6f30";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 14; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 40 + rand() * 90;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, rand() > 0.5 ? "rgba(120,155,70,0.14)" : "rgba(30,55,22,0.16)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  for (let i = 0; i < 9000; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const len = 3 + rand() * 8;
    const lean = (rand() - 0.5) * 3.5;
    const tone = rand();
    ctx.strokeStyle =
      tone > 0.82
        ? `rgba(150,168,90,${0.25 + rand() * 0.3})`
        : tone > 0.35
          ? `rgba(88,124,54,${0.3 + rand() * 0.35})`
          : `rgba(48,82,34,${0.3 + rand() * 0.35})`;
    ctx.lineWidth = 0.8 + rand() * 0.7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + lean * 0.5, y - len * 0.6, x + lean, y - len);
    ctx.stroke();
  }
}

function finishTexture(T: ThreeNS, c: HTMLCanvasElement): THREE_NS.CanvasTexture {
  const texture = new T.CanvasTexture(c);
  texture.wrapS = T.RepeatWrapping;
  texture.wrapT = T.RepeatWrapping;
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

export function makeFloorTexture(T: ThreeNS, finish: Exclude<FloorFinish, "auto">): THREE_NS.CanvasTexture {
  const [c, ctx] = canvas();
  if (finish === "parquet") {
    drawParquet(
      ctx,
      {
        base: [198, 158, 112],
        light: [216, 178, 132],
        dark: [164, 122, 80],
      },
      5,
    );
  } else if (finish === "roble") {
    drawParquet(
      ctx,
      {
        base: [122, 82, 50],
        light: [146, 102, 64],
        dark: [86, 54, 30],
      },
      9,
    );
  } else if (finish === "porcelanico") {
    drawPorcelanico(ctx);
  } else if (finish === "marmol") {
    drawMarmol(ctx);
  } else {
    drawCemento(ctx);
  }
  return finishTexture(T, c);
}

/** Alicatado tipo metro (30 × 10 cm) sobre una base de 0,6 × 0,6 m. */
export function makeTileTexture(T: ThreeNS): THREE_NS.CanvasTexture {
  const size = 1024;
  const [c, ctx] = canvas(size);
  const tileW = 512;
  const tileH = 170;
  ctx.fillStyle = "#b6b2a9";
  ctx.fillRect(0, 0, size, size);
  const rand = rng(51);
  for (let row = 0; row < 6; row++) {
    const offset = row % 2 === 0 ? 0 : tileW / 2;
    for (let x = -offset; x < size; x += tileW) {
      const tone = 238 + Math.round(rand() * 12);
      const grad = ctx.createLinearGradient(0, row * tileH, 0, row * tileH + tileH);
      grad.addColorStop(0, rgb(tone + 6, tone + 6, tone + 2));
      grad.addColorStop(0.5, rgb(tone, tone, tone - 3));
      grad.addColorStop(1, rgb(tone - 10, tone - 10, tone - 12));
      ctx.fillStyle = grad;
      ctx.fillRect(x + 4, row * tileH + 4, tileW - 8, tileH - 8);

      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillRect(x + 5, row * tileH + 5, tileW - 10, 3);
      ctx.fillStyle = "rgba(90,86,80,0.25)";
      ctx.fillRect(x + 5, row * tileH + tileH - 7, tileW - 10, 3);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x + 5, row * tileH + 5, 2, tileH - 10);

      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(120,118,112,${0.02 + rand() * 0.04})`;
        ctx.fillRect(x + 10 + rand() * (tileW - 20), row * tileH + 10 + rand() * (tileH - 20), 1.2, 1.2);
      }
    }
  }
  return finishTexture(T, c);
}

/** Césped procedural para el terreno exterior. */
export function makeGrassTexture(T: ThreeNS): THREE_NS.CanvasTexture {
  const [c, ctx] = canvas(512);
  drawGrass(ctx);
  const texture = finishTexture(T, c);
  texture.repeat.set(1 / GRASS_TILE_METERS, 1 / GRASS_TILE_METERS);
  return texture;
}

export const TILE_SIZE_METERS = 0.6;
