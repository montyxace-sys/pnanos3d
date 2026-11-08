import type * as THREE_NS from "three";

/**
 * Mobiliario 3D procedural del visor.
 * Cada constructor recibe el ancho (eje X) y el fondo (eje Z) de la pieza en
 * metros, con el centro en el origen y la base a y = 0.
 */

type ThreeNS = typeof THREE_NS;

const woodCache = new WeakMap<object, THREE_NS.CanvasTexture>();

function woodTexture(T: ThreeNS): THREE_NS.CanvasTexture {
  const cached = woodCache.get(T);
  if (cached) return cached;

  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D no disponible");

  const rows = 4;
  const rowH = 256 / rows;
  ctx.fillStyle = "#8a5b34";
  ctx.fillRect(0, 0, 256, 256);
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : 64;
    for (let x = -offset; x < 256; x += 128) {
      ctx.fillStyle = rand() > 0.45 ? "#b9855a" : "#c99a6c";
      ctx.fillRect(x + 1, row * rowH + 1, 126, rowH - 2);
      ctx.strokeStyle = "rgba(80,48,22,0.18)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const y = row * rowH + 6 + rand() * (rowH - 12);
        ctx.beginPath();
        ctx.moveTo(x + 4, y);
        ctx.bezierCurveTo(x + 40, y + rand() * 6 - 3, x + 80, y + rand() * 6 - 3, x + 124, y);
        ctx.stroke();
      }
    }
  }

  const texture = new T.CanvasTexture(c);
  texture.wrapS = T.RepeatWrapping;
  texture.wrapT = T.RepeatWrapping;
  texture.colorSpace = T.SRGBColorSpace;
  texture.repeat.set(1.5, 1.5);
  woodCache.set(T, texture);
  return texture;
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

const fabricCache = new WeakMap<object, THREE_NS.CanvasTexture>();

function fabricTexture(T: ThreeNS): THREE_NS.CanvasTexture {
  const cached = fabricCache.get(T);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D no disponible");
  ctx.fillStyle = "#c3c6ca";
  ctx.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 3) {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(0, y, 128, 1);
  }
  for (let x = 0; x < 128; x += 3) {
    ctx.fillStyle = "rgba(44,48,54,0.1)";
    ctx.fillRect(x, 0, 1, 128);
  }
  const rand = rng(101);
  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle = `rgba(${rand() > 0.5 ? 255 : 30},${rand() > 0.5 ? 255 : 30},${rand() > 0.5 ? 255 : 30},${0.02 + rand() * 0.05})`;
    ctx.fillRect(rand() * 128, rand() * 128, 1, 1);
  }
  const texture = new T.CanvasTexture(c);
  texture.wrapS = T.RepeatWrapping;
  texture.wrapT = T.RepeatWrapping;
  texture.colorSpace = T.SRGBColorSpace;
  texture.repeat.set(3, 3);
  fabricCache.set(T, texture);
  return texture;
}

export function buildPiece(T: ThreeNS, key: string, w: number, d: number): THREE_NS.Group | null {
  if (key === "puerta" || key === "ventana") return null;

  const g = new T.Group();
  const tex = woodTexture(T);
  const fabricTex = fabricTexture(T);
  const mat = (color: number, roughness = 0.85, metalness = 0) =>
    new T.MeshStandardMaterial({ color, roughness, metalness });
  const wood = new T.MeshStandardMaterial({ map: tex, color: 0xffffff, roughness: 0.7 });
  const woodDark = new T.MeshStandardMaterial({ map: tex, color: 0xa87f5c, roughness: 0.72 });
  const fabric = new T.MeshStandardMaterial({ map: fabricTex, color: 0x8e99a7, roughness: 0.97 });
  const fabricLight = new T.MeshStandardMaterial({ map: fabricTex, color: 0xb3bfcb, roughness: 0.97 });
  const white = mat(0xf1efe9, 0.8);
  const whiteCab = mat(0xe9e5dc, 0.72);
  const ceramic = mat(0xf7f6f3, 0.28);
  const stone = mat(0x3c4147, 0.38);
  const steel = mat(0xc2c7cd, 0.32, 0.72);
  const steelDark = mat(0x6f767e, 0.4, 0.6);
  const darkMetal = mat(0x353a40, 0.5, 0.55);
  const chrome = mat(0xd8dde2, 0.18, 0.9);
  const mattress = new T.MeshStandardMaterial({ map: fabricTex, color: 0xfaf7f0, roughness: 1 });
  const duvet = new T.MeshStandardMaterial({ map: fabricTex, color: 0xd6e1ec, roughness: 1 });
  const pillow = new T.MeshStandardMaterial({ map: fabricTex, color: 0xffffff, roughness: 1 });
  const towel = mat(0xdde3e8, 1);
  const leaf = mat(0x4f7a45, 0.95);
  const leafDark = mat(0x3d6236, 0.95);
  const terracotta = mat(0xa96b4c, 0.9);
  const blackGlass = mat(0x14171b, 0.15, 0.3);
  const screen = mat(0x0f1318, 0.22, 0.25);
  const mirror = mat(0xcfd8de, 0.06, 1);
  const rug = new T.MeshStandardMaterial({ map: fabricTex, color: 0xd8c4aa, roughness: 1 });
  const rugBorder = mat(0xa8927a, 1);
  const teak = new T.MeshStandardMaterial({ map: tex, color: 0xcf9f6e, roughness: 0.68 });
  const teakDark = new T.MeshStandardMaterial({ map: tex, color: 0x94663a, roughness: 0.72 });
  const outdoorFabric = new T.MeshStandardMaterial({ map: fabricTex, color: 0xefe6d3, roughness: 0.97 });
  const foliage = mat(0x5c8a41, 0.96);
  const foliageDark = mat(0x426b30, 0.98);
  const water = new T.MeshPhysicalMaterial({
    color: 0x3d9fc2,
    roughness: 0.06,
    metalness: 0.05,
    transparent: true,
    opacity: 0.85,
  });
  const stoneLight = mat(0xcfc9bd, 0.85);
  const soil = mat(0x4a3828, 1);
  const lampWarm = new T.MeshStandardMaterial({
    color: 0xfff4dc,
    emissive: 0xffd79a,
    emissiveIntensity: 1.1,
    roughness: 0.5,
  });
  const shade = mat(0xf3e9d6, 0.75);
  const glass = new T.MeshPhysicalMaterial({
    color: 0xbfe3ee,
    transparent: true,
    opacity: 0.26,
    roughness: 0.05,
    metalness: 0,
    side: T.DoubleSide,
  });

  const add = (mesh: THREE_NS.Mesh, x = 0, y = 0, z = 0) => {
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  };
  const box = (
    bw: number,
    bh: number,
    bd: number,
    material: THREE_NS.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => add(new T.Mesh(new T.BoxGeometry(Math.max(bw, 0.005), Math.max(bh, 0.005), Math.max(bd, 0.005)), material), x, y, z);
  const cyl = (
    rt: number,
    rb: number,
    h: number,
    material: THREE_NS.Material,
    x = 0,
    y = 0,
    z = 0,
    seg = 20,
  ) => add(new T.Mesh(new T.CylinderGeometry(Math.max(rt, 0.003), Math.max(rb, 0.003), Math.max(h, 0.004), seg), material), x, y, z);
  const sphere = (r: number, material: THREE_NS.Material, x = 0, y = 0, z = 0, seg = 16) =>
    add(new T.Mesh(new T.SphereGeometry(r, seg, seg), material), x, y, z);
  const torus = (
    r: number,
    tube: number,
    material: THREE_NS.Material,
    x = 0,
    y = 0,
    z = 0,
    rotateX = false,
  ) => {
    const mesh = add(new T.Mesh(new T.TorusGeometry(r, tube, 10, 26), material), x, y, z);
    if (rotateX) mesh.rotation.x = Math.PI / 2;
    return mesh;
  };

  const sofa = (seats: number) => {
    const arm = Math.min(0.18, w * 0.13);
    box(w, 0.26, d, fabric, 0, 0.15, 0);
    box(w, 0.55, 0.18, fabric, 0, 0.45, -d / 2 + 0.09);
    box(arm, 0.44, d, fabric, -w / 2 + arm / 2, 0.38, 0);
    box(arm, 0.44, d, fabric, w / 2 - arm / 2, 0.38, 0);
    const inner = Math.max(w - arm * 2, 0.2);
    const cw = inner / seats;
    for (let i = 0; i < seats; i++) {
      box(cw - 0.04, 0.12, d - 0.26, fabricLight, -inner / 2 + cw * (i + 0.5), 0.34, 0.04);
      box(cw - 0.12, 0.32, 0.12, fabricLight, -inner / 2 + cw * (i + 0.5), 0.58, -d / 2 + 0.2);
    }
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        cyl(0.025, 0.025, 0.09, woodDark, sx * (w / 2 - 0.08), 0.045, sz * (d / 2 - 0.08));
      }
    }
  };

  const diningTable = (legInset: number) => {
    box(w, 0.05, d, wood, 0, 0.75, 0);
    box(Math.max(w - 0.14, 0.1), 0.08, Math.max(d - 0.14, 0.1), woodDark, 0, 0.68, 0);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        box(0.06, 0.72, 0.06, woodDark, sx * (w / 2 - legInset), 0.36, sz * (d / 2 - legInset));
      }
    }
  };

  const chair = () => {
    const sh = 0.46;
    box(w * 0.98, 0.05, d * 0.98, wood, 0, sh, 0);
    box(w * 0.98, 0.42, 0.05, wood, 0, sh + 0.22, -d / 2 + 0.04);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        box(0.04, sh, 0.04, woodDark, sx * (w / 2 - 0.04), sh / 2, sz * (d / 2 - 0.04));
      }
    }
  };

  const shelf = (height: number) => {
    const side = 0.025;
    box(w, height, 0.02, woodDark, 0, height / 2, -d / 2 + 0.01);
    box(side, height, d, wood, -w / 2 + side / 2, height / 2, 0);
    box(side, height, d, wood, w / 2 - side / 2, height / 2, 0);
    box(w, 0.03, d, wood, 0, height, 0);
    box(w, 0.06, d * 0.98, woodDark, 0, 0.03, 0);
    const levels = 5;
    for (let s = 1; s < levels; s++) {
      box(w - side * 2, 0.025, d - 0.02, wood, 0, (height / levels) * s, 0.005);
    }
    const bookColors = [0x8e4b3f, 0x3f5c78, 0x556b46, 0xb08a4a, 0x6a4a6d, 0x2f4858];
    const rand = rng(Math.round(w * 1000) + Math.round(height * 100));
    for (let s = 0; s < levels; s++) {
      const baseY = (height / levels) * s + 0.03;
      let x = -w / 2 + side + 0.02;
      while (x < w / 2 - side - 0.05) {
        const bw = 0.022 + rand() * 0.022;
        const bh = 0.15 + rand() * 0.1;
        if (x + bw > w / 2 - side - 0.02) break;
        const material = mat(bookColors[Math.floor(rand() * bookColors.length)], 0.9);
        box(bw, bh, d * 0.68, material, x + bw / 2, baseY + bh / 2, 0.02);
        x += bw + 0.006;
      }
    }
  };

  const bed = (pillows: number) => {
    box(w, 0.3, d - 0.06, woodDark, 0, 0.15, 0);
    box(w - 0.06, 0.24, d - 0.16, mattress, 0, 0.42, 0.02);
    box(w + 0.04, 0.95, 0.08, wood, 0, 0.55, -d / 2 + 0.04);
    const duvetLen = d * 0.62;
    box(w - 0.04, 0.07, duvetLen, duvet, 0, 0.565, d / 2 - duvetLen / 2 + 0.02);
    box(w - 0.04, 0.02, 0.12, pillow, 0, 0.6, d / 2 - duvetLen + 0.04);
    const pw = (w - 0.2) / pillows - 0.06;
    for (let i = 0; i < pillows; i++) {
      box(pw, 0.12, 0.3, pillow, -w / 2 + 0.1 + (pw + 0.06) * (i + 0.5), 0.58, -d / 2 + 0.3);
    }
  };

  const nightstand = () => {
    box(w, 0.48, d, wood, 0, 0.26, 0);
    box(w + 0.02, 0.03, d + 0.02, woodDark, 0, 0.515, 0);
    box(w - 0.06, 0.012, 0.012, woodDark, 0, 0.36, d / 2 + 0.004);
    box(0.1, 0.02, 0.02, chrome, 0, 0.36, d / 2 + 0.02);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        box(0.04, 0.06, 0.04, woodDark, sx * (w / 2 - 0.05), 0.03, sz * (d / 2 - 0.05));
      }
    }
  };

  const wardrobe = () => {
    const h = 2.1;
    box(w, h - 0.06, d, wood, 0, h / 2 + 0.03, 0);
    box(w * 0.49, h - 0.14, 0.02, woodDark, -w * 0.25, h / 2, d / 2 + 0.01);
    box(w * 0.49, h - 0.14, 0.02, woodDark, w * 0.25, h / 2, d / 2 + 0.01);
    box(0.02, 0.16, 0.02, chrome, -w * 0.06, 1.15, d / 2 + 0.04);
    box(0.02, 0.16, 0.02, chrome, w * 0.06, 1.15, d / 2 + 0.04);
    box(w + 0.03, 0.05, d + 0.03, woodDark, 0, h + 0.03, 0);
    box(w, 0.06, d - 0.04, woodDark, 0, 0.03, 0);
  };

  const counter = () => {
    const h = 0.86;
    box(w, 0.08, d - 0.06, darkMetal, 0, 0.04, 0);
    box(w, h - 0.11, d, whiteCab, 0, 0.08 + (h - 0.11) / 2, 0);
    box(w + 0.03, 0.05, d + 0.02, stone, 0, h + 0.025, 0);
    const doors = Math.max(1, Math.round(w / 0.6));
    for (let i = 1; i < doors; i++) {
      box(0.008, h - 0.18, 0.014, darkMetal, -w / 2 + (w / doors) * i, 0.47, d / 2 + 0.004);
    }
    for (let i = 0; i < doors; i++) {
      box(0.16, 0.02, 0.02, chrome, -w / 2 + (w / doors) * (i + 0.5), 0.7, d / 2 + 0.02);
    }
  };

  const toilet = () => {
    const tankD = Math.min(0.22, d * 0.32);
    box(w, 0.42, tankD, ceramic, 0, 0.6, -d / 2 + tankD / 2);
    box(w * 0.96, 0.05, tankD * 0.92, ceramic, 0, 0.83, -d / 2 + tankD / 2);
    const bowl = cyl(w * 0.44, w * 0.34, 0.4, ceramic, 0, 0.2, d * 0.12);
    bowl.scale.z = 1.25;
    const ring = torus(w * 0.34, 0.028, ceramic, 0, 0.41, d * 0.12, true);
    ring.scale.z = 1.25;
    box(w * 0.68, 0.03, d * 0.24, ceramic, 0, 0.43, d * 0.06);
  };

  const gardenTable = () => {
    const topH = 0.72;
    const slats = 7;
    for (let i = 0; i < slats; i++) {
      box(w, 0.035, d / slats - 0.012, teak, 0, topH, -d / 2 + (d / slats) * (i + 0.5));
    }
    const inset = Math.min(0.1, w * 0.1);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        box(0.05, topH, 0.05, darkMetal, sx * (w / 2 - inset), topH / 2, sz * (d / 2 - inset));
      }
    }
    for (const sz of [-1, 1]) {
      box(w - inset * 2, 0.04, 0.04, darkMetal, 0, topH - 0.1, sz * (d / 2 - inset));
    }
  };

  const gardenChair = () => {
    const sh = 0.42;
    box(w * 0.92, 0.05, d * 0.72, teakDark, 0, sh - 0.03, d * 0.08);
    box(w * 0.84, 0.09, d * 0.62, outdoorFabric, 0, sh + 0.035, d * 0.08);
    const back = box(w * 0.92, 0.05, 0.46, teakDark, 0, sh + 0.25, -d / 2 + 0.14);
    back.rotation.x = -0.16;
    const backCushion = box(w * 0.8, 0.08, 0.4, outdoorFabric, 0, sh + 0.3, -d / 2 + 0.2);
    backCushion.rotation.x = -0.16;
    for (const sx of [-1, 1]) {
      box(0.05, sh, 0.05, teakDark, sx * (w / 2 - 0.05), sh / 2, d / 2 - 0.07);
      box(0.05, sh, 0.05, teakDark, sx * (w / 2 - 0.05), sh / 2, -d / 2 + 0.12);
      box(0.055, 0.05, d * 0.8, teak, sx * (w / 2 - 0.05), 0.63, 0);
    }
  };

  const lounger = () => {
    const seatH = 0.34;
    const back = box(w * 0.9, 0.06, d * 0.46, teak, 0, seatH + 0.27, -d * 0.16);
    back.rotation.x = 0.6;
    box(w * 0.9, 0.06, d * 0.6, teak, 0, seatH, d * 0.19);
    box(w * 0.82, 0.07, d * 0.54, outdoorFabric, 0, seatH + 0.065, d * 0.2);
    const backCushion = box(w * 0.82, 0.07, d * 0.42, outdoorFabric, 0, seatH + 0.34, -d * 0.17);
    backCushion.rotation.x = 0.6;
    const pillow = box(w * 0.5, 0.09, 0.26, towel, 0, seatH + 0.55, -d * 0.31);
    pillow.rotation.x = 0.6;
    for (const sx of [-1, 1]) {
      box(0.055, seatH, 0.055, teakDark, sx * (w / 2 - 0.06), seatH / 2, d / 2 - 0.1);
      box(0.055, seatH, 0.055, teakDark, sx * (w / 2 - 0.06), seatH / 2, -d / 2 + 0.16);
      const wheel = cyl(0.11, 0.11, 0.03, darkMetal, sx * (w / 2 + 0.02), 0.12, -d / 2 + 0.45, 16);
      wheel.rotation.z = Math.PI / 2;
    }
  };

  const hammock = () => {
    const postH = 1.75;
    for (const sx of [-1, 1]) {
      cyl(0.055, 0.07, postH, teakDark, sx * (w / 2 - 0.08), postH / 2, 0, 12);
      box(0.22, 0.05, 0.22, stoneLight, sx * (w / 2 - 0.08), 0.025, 0);
    }
    const len = Math.max(w - 0.5, 0.6);
    const cloth = new T.Mesh(
      (() => {
        const geo = new T.PlaneGeometry(len, Math.min(d, 0.85), 18, 4);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const t = (pos.getX(i) + len / 2) / len;
          pos.setZ(i, -Math.sin(Math.PI * t) * 0.34);
        }
        geo.computeVertexNormals();
        return geo;
      })(),
      new T.MeshStandardMaterial({ map: fabricTex, color: 0xefe6d3, roughness: 0.97, side: T.DoubleSide }),
    );
    add(cloth, 0, postH - 0.14, 0).rotation.x = -Math.PI / 2;
    for (const sx of [-1, 1]) {
      box(0.22, 0.022, 0.022, chrome, sx * (w / 2 - 0.19), postH - 0.03, 0);
    }
  };

  const parasol = () => {
    const height = 2.3;
    const radius = Math.max(0.55, Math.min(w, d) * 0.74);
    box(0.5, 0.09, 0.5, stoneLight, 0, 0.045, 0);
    cyl(0.032, 0.032, height, chrome, 0, height / 2, 0, 12);
    const canopyMat = new T.MeshStandardMaterial({
      map: fabricTex,
      color: 0xf2e8d2,
      roughness: 0.95,
      side: T.DoubleSide,
    });
    const canopy = add(new T.Mesh(new T.ConeGeometry(radius, 0.52, 10, 1, true), canopyMat), 0, height - 0.26, 0);
    canopy.rotation.y = Math.PI / 10;
    const rim = torus(radius * 0.98, 0.012, teakDark, 0, height - 0.515, 0, true);
    rim.scale.z = 1;
    sphere(0.045, teakDark, 0, height + 0.03, 0);
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2) / 10 + Math.PI / 10;
      const rib = box(radius * 0.9, 0.014, 0.014, teakDark, Math.cos(a) * radius * 0.45, height - 0.35, Math.sin(a) * radius * 0.45);
      rib.rotation.y = -a;
      rib.rotation.z = 0.28;
    }
  };

  const barbecue = () => {
    const bowlY = 0.8;
    const r = Math.max(0.22, Math.min(w, d) * 0.42);
    const bowl = sphere(r, mat(0x3f444a, 0.55, 0.35), 0, bowlY, 0, 18);
    bowl.scale.y = 0.58;
    const lidMat = mat(0x33383e, 0.45, 0.45);
    const lid = sphere(r * 0.94, lidMat, 0, bowlY + r * 0.24, -r * 0.08, 18);
    lid.scale.y = 0.32;
    lid.rotation.x = 0.18;
    const handle = box(r * 1.1, 0.028, 0.028, chrome, 0, bowlY + r * 0.42, -r * 0.08);
    handle.rotation.x = 0.18;
    for (let i = 0; i < 5; i++) {
      box(w * 0.6, 0.012, 0.012, steelDark, 0, bowlY + r * 0.22, -r * 0.45 + (r * 0.9 * i) / 4);
    }
    box(0.16, 0.025, 0.025, chrome, 0, bowlY + 0.02, r * 0.98);
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3 + 0.4;
      const leg = box(0.05, bowlY, 0.05, darkMetal, Math.cos(a) * r * 0.6, bowlY / 2, Math.sin(a) * r * 0.6);
      leg.rotation.z = -Math.cos(a) * 0.18;
      leg.rotation.x = Math.sin(a) * 0.18;
    }
    box(w * 0.4, 0.035, 0.26, teak, w / 2 + w * 0.12, 0.62, 0);
    box(0.035, 0.62, 0.035, darkMetal, w / 2 + w * 0.18, 0.31, -0.1);
    box(0.035, 0.62, 0.035, darkMetal, w / 2 + w * 0.18, 0.31, 0.1);
  };

  const planter = () => {
    const h = Math.max(0.36, Math.min(0.72, d * 0.7));
    box(w, h, d, terracotta, 0, h / 2, 0);
    box(w + 0.03, 0.05, d + 0.03, mat(0x8e5a3f, 0.9), 0, h - 0.01, 0);
    box(w - 0.07, 0.03, d - 0.07, soil, 0, h + 0.02, 0);
    const n = Math.max(2, Math.round(w / 0.38));
    for (let i = 0; i < n; i++) {
      const x = -w / 2 + (w / n) * (i + 0.5);
      const rad = Math.min(0.24, (w / n) * 0.42);
      const bush = sphere(rad, i % 2 ? foliage : foliageDark, x, h + rad * 0.55, 0, 12);
      bush.scale.y = 0.82;
      if (i % 3 === 1) sphere(rad * 0.38, mat(0xd8788a, 0.8), x + rad * 0.3, h + rad * 0.9, rad * 0.2, 8);
    }
  };

  const tree = () => {
    const canopyR = Math.max(0.55, Math.min(w, d) * 0.46);
    const trunkH = Math.max(1.5, canopyR * 2.1);
    const bark = mat(0x6b4a32, 0.95);
    cyl(0.09, 0.16, trunkH, bark, 0, trunkH / 2, 0, 10);
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3 + 0.5;
      const branch = cyl(0.035, 0.07, canopyR * 0.9, bark, Math.cos(a) * canopyR * 0.3, trunkH * 0.78, Math.sin(a) * canopyR * 0.3, 8);
      branch.rotation.z = -Math.cos(a) * 0.5;
      branch.rotation.x = Math.sin(a) * 0.5;
    }
    sphere(canopyR, foliage, 0, trunkH + canopyR * 0.45, 0, 18);
    sphere(canopyR * 0.7, foliageDark, canopyR * 0.55, trunkH + canopyR * 0.28, canopyR * 0.2, 16);
    sphere(canopyR * 0.68, foliage, -canopyR * 0.5, trunkH + canopyR * 0.34, -canopyR * 0.28, 16);
    sphere(canopyR * 0.6, foliageDark, -canopyR * 0.16, trunkH + canopyR * 0.92, 0.16, 16);
    sphere(canopyR * 0.55, foliage, canopyR * 0.2, trunkH + canopyR * 0.72, -canopyR * 0.48, 16);
  };

  const hedge = () => {
    const h = 1.1;
    box(w, h, d, foliageDark, 0, h / 2, 0);
    const n = Math.max(2, Math.round(w / 0.42));
    for (let i = 0; i < n; i++) {
      const x = -w / 2 + (w / n) * (i + 0.5);
      const bump = sphere(Math.min(d * 0.62, (w / n) * 0.66), foliage, x, h - 0.02, 0, 10);
      bump.scale.y = 0.7;
    }
  };

  const pool = () => {
    const rim = Math.min(0.18, Math.min(w, d) * 0.08);
    const innerW = Math.max(w - rim * 2, 0.2);
    const innerD = Math.max(d - rim * 2, 0.2);
    box(innerW, 0.02, innerD, mat(0x1f5c72, 0.45), 0, 0.01, 0);
    box(w, 0.13, rim, stoneLight, 0, 0.065, -d / 2 + rim / 2);
    box(w, 0.13, rim, stoneLight, 0, 0.065, d / 2 - rim / 2);
    box(rim, 0.13, innerD, stoneLight, -w / 2 + rim / 2, 0.065, 0);
    box(rim, 0.13, innerD, stoneLight, w / 2 - rim / 2, 0.065, 0);
    box(innerW, 0.09, 0.03, mat(0x9fd7e4, 0.4), 0, 0.045, -innerD / 2 + 0.015);
    box(innerW, 0.09, 0.03, mat(0x9fd7e4, 0.4), 0, 0.045, innerD / 2 - 0.015);
    box(0.03, 0.09, innerD, mat(0x9fd7e4, 0.4), -innerW / 2 + 0.015, 0.045, 0);
    box(0.03, 0.09, innerD, mat(0x9fd7e4, 0.4), innerW / 2 - 0.015, 0.045, 0);
    box(innerW, 0.016, innerD, water, 0, 0.09, 0);
    for (let i = 0; i < 3; i++) {
      box(0.3, 0.02 + i * 0.03, 0.22, stoneLight, -innerW / 2 + 0.2, 0.085 + i * 0.028, -innerD / 2 + 0.24 + i * 0.24);
    }
    for (let i = 0; i < 3; i++) {
      sphere(0.012, mat(0xe6f4f7, 0.2), -innerW * 0.25, 0.1, innerD * (i - 1) * 0.22, 6);
    }
  };

  const lampPost = () => {
    cyl(0.05, 0.075, 2.2, darkMetal, 0, 1.1, 0, 12);
    box(0.24, 0.055, 0.24, darkMetal, 0, 0.03, 0);
    box(0.22, 0.28, 0.22, glass, 0, 2.3, 0);
    sphere(0.085, lampWarm, 0, 2.3, 0);
    box(0.27, 0.03, 0.27, darkMetal, 0, 2.45, 0);
    add(new T.Mesh(new T.ConeGeometry(0.22, 0.16, 4), darkMetal), 0, 2.54, 0);
  };

  switch (key) {
    case "sofa3":
      sofa(3);
      break;
    case "sofa2":
      sofa(2);
      break;
    case "butaca":
      sofa(1);
      break;
    case "mesa-aux":
      box(w, 0.045, d, wood, 0, 0.52, 0);
      box(w * 0.82, 0.03, d * 0.82, woodDark, 0, 0.14, 0);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          cyl(0.02, 0.02, 0.52, woodDark, sx * (w / 2 - 0.05), 0.26, sz * (d / 2 - 0.05));
        }
      }
      break;
    case "tv": {
      box(w, 0.4, d, woodDark, 0, 0.2, 0);
      box(w * 0.97, 0.02, d * 0.97, wood, 0, 0.405, 0);
      const sw = w * 0.85;
      const sh = Math.min(0.62, sw * 0.56);
      box(sw, sh, 0.04, screen, 0, 0.46 + sh / 2, -d / 2 + 0.06);
      box(0.08, 0.05, 0.1, darkMetal, 0, 0.43, -d / 2 + 0.1);
      break;
    }
    case "estanteria":
    case "librero":
    case "estanteria-libros":
      shelf(1.9);
      break;
    case "mesa4":
      diningTable(0.07);
      break;
    case "mesa6":
      diningTable(0.09);
      break;
    case "mesa-ronda": {
      const r = Math.min(w, d) / 2;
      cyl(r, r, 0.05, wood, 0, 0.74, 0, 40);
      cyl(0.06, 0.09, 0.7, woodDark, 0, 0.37, 0);
      cyl(r * 0.42, r * 0.5, 0.04, woodDark, 0, 0.02, 0, 30);
      break;
    }
    case "silla":
      chair();
      break;
    case "cama150":
      bed(2);
      break;
    case "cama90":
      bed(1);
      break;
    case "mesita":
      nightstand();
      break;
    case "armario":
    case "ropero":
      wardrobe();
      break;
    case "comoda": {
      const h = 0.85;
      box(w, h - 0.06, d, wood, 0, 0.06 + (h - 0.06) / 2, 0);
      box(w + 0.03, 0.03, d + 0.03, woodDark, 0, h, 0);
      for (let i = 0; i < 3; i++) {
        box(w - 0.06, 0.22, 0.02, woodDark, 0, 0.19 + i * 0.26, d / 2 + 0.01);
        box(0.16, 0.02, 0.02, chrome, 0, 0.19 + i * 0.26, d / 2 + 0.04);
      }
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          box(0.05, 0.06, 0.05, woodDark, sx * (w / 2 - 0.06), 0.03, sz * (d / 2 - 0.06));
        }
      }
      break;
    }
    case "encimera":
      counter();
      break;
    case "fregadero": {
      const h = 0.86;
      box(w, 0.08, d - 0.04, darkMetal, 0, 0.04, 0);
      box(w, h - 0.11, d, whiteCab, 0, 0.08 + (h - 0.11) / 2, 0);
      box(w + 0.03, 0.05, d + 0.02, stone, 0, h + 0.025, 0);
      box(w * 0.62, 0.015, d * 0.6, steelDark, 0, h + 0.052, 0.02);
      box(w * 0.5, 0.012, d * 0.46, mat(0x7c848c, 0.4, 0.6), 0, h + 0.055, 0.02);
      cyl(0.014, 0.014, 0.3, chrome, 0, h + 0.2, -d / 2 + 0.09);
      const spout = box(0.14, 0.02, 0.02, chrome, 0.06, h + 0.34, -d / 2 + 0.09);
      spout.rotation.z = 0.08;
      break;
    }
    case "campana":
      box(w, 0.1, d, steel, 0, 1.68, 0);
      box(w * 0.55, 0.72, d * 0.6, steel, 0, 2.1, -d * 0.12);
      box(w * 0.86, 0.02, d * 0.74, lampWarm, 0, 1.62, 0);
      break;
    case "placa": {
      const h = 0.86;
      box(w, 0.08, d - 0.04, darkMetal, 0, 0.04, 0);
      box(w, h - 0.11, d, whiteCab, 0, 0.08 + (h - 0.11) / 2, 0);
      box(w + 0.03, 0.05, d + 0.02, stone, 0, h + 0.025, 0);
      box(w * 0.88, 0.014, d * 0.82, blackGlass, 0, h + 0.06, 0);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          torus(Math.min(w, d) * 0.11, 0.006, chrome, sx * w * 0.22, h + 0.07, sz * d * 0.2, true);
        }
      }
      break;
    }
    case "frigorifico": {
      const h = 1.9;
      box(w, h, d, steel, 0, h / 2, 0);
      box(w + 0.012, 0.014, 0.02, darkMetal, 0, 1.3, d / 2 + 0.006);
      box(0.02, 0.5, 0.025, chrome, -w / 2 + 0.07, 1.55, d / 2 + 0.03);
      box(0.02, 0.3, 0.025, chrome, -w / 2 + 0.07, 1.02, d / 2 + 0.03);
      break;
    }
    case "isla": {
      const h = 0.86;
      box(w, 0.08, d - 0.08, darkMetal, 0, 0.04, 0);
      box(w, h - 0.11, d, whiteCab, 0, 0.08 + (h - 0.11) / 2, 0);
      box(w + 0.08, 0.06, d + 0.08, stone, 0, h + 0.03, 0);
      const doors = Math.max(1, Math.round(w / 0.6));
      for (let i = 1; i < doors; i++) {
        box(0.008, h - 0.18, 0.014, darkMetal, -w / 2 + (w / doors) * i, 0.47, d / 2 + 0.004);
      }
      break;
    }
    case "inodoro":
      toilet();
      break;
    case "bide": {
      const bowl = cyl(w * 0.42, w * 0.34, 0.38, ceramic, 0, 0.19, 0);
      bowl.scale.z = 1.2;
      const ring = torus(w * 0.33, 0.025, ceramic, 0, 0.4, 0, true);
      ring.scale.z = 1.2;
      cyl(0.013, 0.013, 0.26, chrome, 0, 0.5, -d / 2 + 0.1);
      box(0.12, 0.018, 0.018, chrome, 0.05, 0.62, -d / 2 + 0.1);
      break;
    }
    case "lavabo": {
      const h = 0.8;
      box(w, h, d, wood, 0, h / 2, 0);
      box(w + 0.02, 0.03, d + 0.02, stone, 0, h + 0.015, 0);
      cyl(w * 0.3, w * 0.26, 0.14, ceramic, 0, h + 0.085, d * 0.05);
      cyl(0.012, 0.012, 0.22, chrome, 0, h + 0.2, -d / 2 + 0.1);
      box(0.12, 0.018, 0.018, chrome, 0.05, h + 0.3, -d / 2 + 0.1);
      break;
    }
    case "ducha": {
      const gh = 1.95;
      box(w, 0.08, d, ceramic, 0, 0.04, 0);
      box(0.02, gh, d, glass, w / 2 - 0.01, gh / 2 + 0.08, 0);
      box(w, gh, 0.02, glass, 0, gh / 2 + 0.08, d / 2 - 0.01);
      box(0.04, gh, 0.04, chrome, w / 2 - 0.02, gh / 2 + 0.08, d / 2 - 0.02);
      cyl(0.018, 0.018, 2, chrome, -w / 2 + 0.12, 1, -d / 2 + 0.06);
      cyl(0.09, 0.09, 0.02, chrome, -w / 2 + 0.12, 2, d * 0.12);
      box(0.12, 0.02, 0.02, chrome, -w / 2 + 0.2, 1.6, d / 2 - 0.02);
      cyl(0.05, 0.05, 0.006, chrome, 0, 0.085, 0);
      break;
    }
    case "banera": {
      box(w, 0.56, d, ceramic, 0, 0.28, 0);
      box(w - 0.16, 0.02, d - 0.16, mat(0xcfe4ea, 0.2), 0, 0.5, 0);
      box(w - 0.08, 0.05, 0.06, ceramic, 0, 0.55, -d / 2 + 0.05);
      box(w - 0.08, 0.05, 0.06, ceramic, 0, 0.55, d / 2 - 0.05);
      box(0.06, 0.05, d - 0.1, ceramic, -w / 2 + 0.05, 0.55, 0);
      box(0.06, 0.05, d - 0.1, ceramic, w / 2 - 0.05, 0.55, 0);
      cyl(0.014, 0.014, 0.3, chrome, -w / 2 + 0.24, 0.65, 0);
      box(0.16, 0.02, 0.02, chrome, -w / 2 + 0.32, 0.8, 0);
      break;
    }
    case "espejo":
      box(w, 1.15, 0.03, chrome, 0, 1.55, -d / 2 + 0.02);
      box(w - 0.05, 1.1, 0.02, mirror, 0, 1.55, -d / 2 + 0.045);
      break;
    case "toallero":
      for (const sx of [-1, 1]) {
        box(0.03, 0.03, 0.12, chrome, sx * (w / 2 - 0.05), 1.14, -d / 2 + 0.06);
      }
      box(w, 0.02, 0.02, chrome, 0, 1.14, 0.02);
      box(w * 0.42, 0.5, 0.03, towel, -w * 0.16, 0.9, 0.05);
      box(w * 0.3, 0.38, 0.03, mat(0xf2f4f6, 1), w * 0.22, 0.96, 0.03);
      break;
    case "calefactor": {
      const h = 0.6;
      for (let i = 0; i < 8; i++) {
        box(0.035, h, 0.07, white, -w / 2 + 0.04 + (i * (w - 0.08)) / 7, 1.05, 0.02);
      }
      box(w, 0.04, 0.09, white, 0, 0.76, 0.02);
      box(w, 0.04, 0.09, white, 0, 1.34, 0.02);
      box(0.02, 0.18, 0.02, chrome, -w / 2 + 0.05, 1.05, 0.08);
      box(0.02, 0.18, 0.02, chrome, w / 2 - 0.05, 1.05, 0.08);
      break;
    }
    case "tabique":
    case "portero": {
      const wallMat = mat(0xe8e2d8, 0.95);
      box(w, 2.5, Math.max(d, 0.1), wallMat, 0, 1.25, 0);
      if (key === "portero") {
        box(0.18, 0.24, 0.05, darkMetal, 0, 1.5, d / 2 + 0.025);
        sphere(0.015, lampWarm, 0, 1.56, d / 2 + 0.055);
        box(0.09, 0.012, 0.02, mat(0x9aa1a8, 0.6), 0, 1.46, d / 2 + 0.055);
        box(0.09, 0.012, 0.02, mat(0x9aa1a8, 0.6), 0, 1.43, d / 2 + 0.055);
      }
      break;
    }
    case "columna":
      box(w, 2.5, d, mat(0xece7de, 0.9), 0, 1.25, 0);
      break;
    case "escalera": {
      const steps = Math.max(6, Math.min(20, Math.round(d / 0.18)));
      const total = Math.min(2.5, steps * 0.18);
      for (let i = 0; i < steps; i++) {
        const h = ((i + 1) * total) / steps;
        box(w, h, d / steps - 0.004, wood, 0, h / 2, -d / 2 + (d / steps) * (i + 0.5));
      }
      for (const sx of [-1, 1]) {
        cyl(0.018, 0.018, 0.95, woodDark, sx * (w / 2 - 0.04), 0.47, d / 2 - 0.1);
      }
      break;
    }
    case "alfombra":
      box(w, 0.012, d, rug, 0, 0.006, 0);
      box(w - 0.1, 0.014, 0.07, rugBorder, 0, 0.007, -d / 2 + 0.08);
      box(w - 0.1, 0.014, 0.07, rugBorder, 0, 0.007, d / 2 - 0.08);
      box(0.07, 0.014, d - 0.1, rugBorder, -w / 2 + 0.08, 0.007, 0);
      box(0.07, 0.014, d - 0.1, rugBorder, w / 2 - 0.08, 0.007, 0);
      break;
    case "planta":
      cyl(0.16, 0.12, 0.3, terracotta, 0, 0.15, 0);
      cyl(0.02, 0.026, 0.45, woodDark, 0, 0.5, 0);
      sphere(0.27, leaf, 0, 0.86, 0);
      sphere(0.2, leafDark, 0.14, 0.74, 0.09);
      sphere(0.18, leaf, -0.13, 0.7, -0.1);
      sphere(0.15, leaf, 0.03, 1.06, 0.02);
      break;
    case "mesa-centro":
      box(w, 0.05, d, wood, 0, 0.42, 0);
      box(w * 0.9, 0.03, d * 0.9, woodDark, 0, 0.16, 0);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          box(0.04, 0.42, 0.04, woodDark, sx * (w / 2 - 0.06), 0.21, sz * (d / 2 - 0.06));
        }
      }
      break;
    case "lampara-pie":
      cyl(0.14, 0.16, 0.04, darkMetal, 0, 0.02, 0);
      cyl(0.014, 0.014, 1.45, chrome, 0, 0.75, 0);
      cyl(0.1, 0.24, 0.3, shade, 0, 1.55, 0, 24);
      sphere(0.05, lampWarm, 0, 1.5, 0);
      break;
    case "tv-mueble":
      box(w, 0.42, d, wood, 0, 0.23, 0);
      box(w + 0.02, 0.03, d + 0.02, woodDark, 0, 0.455, 0);
      box(0.008, 0.3, 0.012, woodDark, 0, 0.24, d / 2 + 0.004);
      box(0.14, 0.02, 0.02, chrome, -w * 0.25, 0.3, d / 2 + 0.02);
      box(0.14, 0.02, 0.02, chrome, w * 0.25, 0.3, d / 2 + 0.02);
      break;
    case "escritorio":
      box(w, 0.05, d, wood, 0, 0.74, 0);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          box(0.05, 0.72, 0.05, woodDark, sx * (w / 2 - 0.06), 0.36, sz * (d / 2 - 0.06));
        }
      }
      box(0.38, 0.52, d * 0.72, whiteCab, w / 2 - 0.24, 0.34, 0);
      box(0.3, 0.02, 0.02, chrome, w / 2 - 0.24, 0.56, d * 0.36 + 0.02);
      break;
    case "silla-oficina": {
      box(0.46, 0.08, 0.46, fabric, 0, 0.46, 0);
      box(0.44, 0.5, 0.06, fabric, 0, 0.75, -0.22);
      cyl(0.028, 0.028, 0.36, darkMetal, 0, 0.26, 0);
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const leg = box(0.3, 0.035, 0.05, darkMetal, Math.cos(angle) * 0.15, 0.09, Math.sin(angle) * 0.15);
        leg.rotation.y = -angle;
      }
      sphere(0.035, darkMetal, 0, 0.04, 0);
      break;
    }
    case "archivador":
      box(w, 1.2, d, steel, 0, 0.6, 0);
      for (let i = 0; i < 3; i++) {
        box(w - 0.06, 0.3, 0.02, mat(0xd3d7db, 0.42, 0.5), 0, 0.24 + i * 0.38, d / 2 + 0.01);
        box(0.12, 0.02, 0.02, chrome, 0, 0.3 + i * 0.38, d / 2 + 0.04);
      }
      break;
    case "lavadora":
    case "secadora": {
      box(w, 0.85, d, mat(0xf1f2f2, 0.5), 0, 0.425, 0);
      box(w - 0.08, 0.14, 0.02, mat(0xdadcdd, 0.5), 0, 0.73, d / 2 + 0.006);
      torus(w * 0.28, 0.03, chrome, 0, 0.38, d / 2 + 0.02);
      const porthole = cyl(w * 0.26, w * 0.26, 0.02, blackGlass, 0, 0.38, d / 2 + 0.012);
      porthole.rotation.x = Math.PI / 2;
      if (key === "secadora") {
        box(w * 0.5, 0.015, 0.02, chrome, 0, 0.38, d / 2 + 0.03);
        box(0.015, w * 0.5, 0.02, chrome, 0, 0.38, d / 2 + 0.03);
      }
      cyl(0.035, 0.035, 0.03, darkMetal, w / 2 - 0.1, 0.73, d / 2 + 0.02);
      break;
    }
    case "tendedero": {
      const h = 1;
      for (const sx of [-1, 1]) {
        box(0.04, h, 0.04, chrome, sx * (w / 2 - 0.03), h / 2, 0);
        box(0.04, 0.04, d, chrome, sx * (w / 2 - 0.03), 0.04, 0);
      }
      for (let i = 0; i < 4; i++) {
        box(w - 0.08, 0.018, 0.018, chrome, 0, 0.56 + i * 0.14, -d / 2 + 0.08 + (i * (d - 0.16)) / 3);
      }
      box(w * 0.35, 0.4, 0.02, towel, -w * 0.16, 0.78, 0.02);
      break;
    }
    case "cuna": {
      const h = 0.92;
      box(w, 0.14, d, wood, 0, 0.34, 0);
      box(w - 0.06, 0.12, d - 0.06, mattress, 0, 0.47, 0);
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          box(0.05, h, 0.05, wood, sx * (w / 2 - 0.03), h / 2, sz * (d / 2 - 0.03));
        }
      }
      for (const sz of [-1, 1]) {
        box(w - 0.06, 0.045, 0.035, wood, 0, h - 0.02, sz * (d / 2 - 0.03));
        for (let x = -w / 2 + 0.08; x <= w / 2 - 0.06; x += 0.08) {
          cyl(0.007, 0.007, h - 0.12, wood, x, h / 2 - 0.02, sz * (d / 2 - 0.03));
        }
      }
      box(w * 0.7, 0.14, 0.24, pillow, 0, 0.6, -d / 2 + 0.18);
      break;
    }
    case "tocador":
      box(w, 0.78, d, wood, 0, 0.39, 0);
      box(w + 0.02, 0.03, d + 0.02, stone, 0, 0.795, 0);
      for (let i = 0; i < 2; i++) {
        box(w - 0.08, 0.2, 0.02, woodDark, 0, 0.26 + i * 0.26, d / 2 + 0.01);
      }
      box(w * 0.55, 0.62, 0.02, chrome, 0, 1.4, -d / 2 + 0.02);
      box(w * 0.51, 0.58, 0.02, mirror, 0, 1.4, -d / 2 + 0.045);
      break;
    case "conducto-recto":
      box(w, 0.2, d, steel, 0, 2.22, 0);
      for (let i = 1; i < 5; i++) {
        box(0.012, 0.21, d + 0.005, darkMetal, -w / 2 + (w / 5) * i, 2.22, 0);
      }
      break;
    case "rejilla-salida":
      box(w, 0.02, d, white, 0, 2.47, 0);
      for (let i = 0; i < 7; i++) {
        box(0.01, 0.025, d - 0.02, darkMetal, -w / 2 + 0.03 + (i * (w - 0.06)) / 6, 2.462, 0);
      }
      break;
    case "split-ac": {
      box(w, 0.28, d, white, 0, 2.14, 0);
      box(w * 0.9, 0.02, 0.02, darkMetal, 0, 2.04, d / 2 + 0.006);
      const flap = box(w * 0.86, 0.09, 0.014, white, 0, 2.0, d / 2 + 0.03);
      flap.rotation.x = -0.35;
      sphere(0.008, lampWarm, w / 2 - 0.06, 2.14, d / 2 + 0.01);
      break;
    }
    case "compresor-ext": {
      box(w, 0.62, d, mat(0xe3e4e4, 0.55), 0, 0.31, 0);
      const fan = torus(w * 0.3, 0.016, darkMetal, 0, 0.34, d / 2 + 0.012);
      fan.rotation.z = 0;
      const fanPlate = cyl(w * 0.3, w * 0.3, 0.01, darkMetal, 0, 0.34, d / 2 + 0.006);
      fanPlate.rotation.x = Math.PI / 2;
      for (let i = 0; i < 3; i++) {
        box(w * 0.56, 0.012, 0.012, mat(0x9aa1a8, 0.6), 0, 0.34 + (i - 1) * w * 0.13, d / 2 + 0.02);
      }
      box(w * 0.9, 0.02, 0.02, mat(0x9aa1a8, 0.6), 0, 0.16, d / 2 + 0.012);
      break;
    }
    case "fancoil":
      box(w, 0.3, d, white, 0, 2.22, 0);
      for (let i = 0; i < 5; i++) {
        box(w * 0.84, 0.012, 0.02, darkMetal, 0, 2.12 + i * 0.035, d / 2 + 0.006);
      }
      break;
    case "lampara":
      cyl(0.06, 0.06, 0.02, darkMetal, 0, 2.49, 0);
      cyl(0.008, 0.008, 0.25, darkMetal, 0, 2.36, 0);
      cyl(0.1, 0.22, 0.22, shade, 0, 2.14, 0, 24);
      sphere(0.07, lampWarm, 0, 2.1, 0);
      break;
    case "downlight":
      cyl(w / 2, w / 2, 0.015, white, 0, 2.49, 0);
      cyl((w / 2) * 0.68, (w / 2) * 0.68, 0.017, lampWarm, 0, 2.485, 0);
      break;
    case "aplique":
      box(w, 0.16, 0.06, white, 0, 1.86, -d / 2 + 0.03);
      sphere(0.045, lampWarm, 0, 1.86, -d / 2 + 0.085);
      break;
    case "ventilador": {
      cyl(0.02, 0.02, 0.22, darkMetal, 0, 2.39, 0);
      cyl(0.11, 0.11, 0.06, darkMetal, 0, 2.25, 0);
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const blade = box(w * 0.42, 0.015, 0.1, white, Math.cos(angle) * w * 0.25, 2.22, Math.sin(angle) * w * 0.25);
        blade.rotation.y = -angle;
      }
      sphere(0.03, lampWarm, 0, 2.2, 0);
      break;
    }
    case "grifo":
    case "grifo-bide":
    case "grifo-lavabo": {
      const big = key === "grifo" ? 1 : key === "grifo-bide" ? 0.9 : 0.7;
      const base = 0.9;
      cyl(0.025 * big, 0.032 * big, 0.04, chrome, 0, base + 0.02, 0);
      cyl(0.011 * big, 0.011 * big, 0.2 * big, chrome, 0, base + 0.12 * big, 0);
      box(0.12 * big, 0.018, 0.018, chrome, 0.055 * big, base + 0.21 * big, 0);
      const lever = box(0.07 * big, 0.014, 0.018, chrome, -0.02 * big, base + 0.06, 0);
      lever.rotation.z = 0.3;
      break;
    }
    case "manguera-ducha": {
      const hose = torus(0.09, 0.012, chrome, 0, 1.2, 0);
      hose.scale.z = 0.6;
      cyl(0.018, 0.018, 0.22, chrome, 0.1, 1.3, 0);
      cyl(0.035, 0.028, 0.1, chrome, 0.1, 1.42, 0, 14);
      break;
    }
    case "manguera-lavabo":
      cyl(0.01, 0.01, 0.18, chrome, 0, 0.9, 0);
      const bend = torus(0.045, 0.01, chrome, 0.04, 1.0, 0);
      bend.rotation.y = Math.PI / 2;
      break;
    case "mesa-ext":
    case "mesa-jardin":
      gardenTable();
      break;
    case "silla-ext":
    case "silla-jardin":
      gardenChair();
      break;
    case "tumbona":
      lounger();
      break;
    case "hamaca":
      hammock();
      break;
    case "parasol":
    case "sombrilla":
      parasol();
      break;
    case "barbacoa":
      barbecue();
      break;
    case "jardinera":
      planter();
      break;
    case "arbol":
      tree();
      break;
    case "seto":
      hedge();
      break;
    case "piscina":
      pool();
      break;
    case "farol":
      lampPost();
      break;
    default:
      return null;
  }

  return g;
}
