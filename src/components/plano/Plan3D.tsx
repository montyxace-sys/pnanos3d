"use client";

import { useEffect, useRef, useState } from "react";
import { buildPiece } from "@/lib/plano/furniture3d";
import {
  FLOOR_TILE_METERS,
  GRASS_TILE_METERS,
  makeFloorTexture,
  makeGrassTexture,
  resolveFloor,
} from "@/lib/plano/finishes";

type Room = { id: string; name: string; x: number; y: number; w: number; h: number; wallType?: string; floor?: 'concrete' | 'tile' | 'wood' | 'carpet' };
type Piece = { id: string; key: string; x: number; y: number; w: number; h: number; rot: number; text?: string; textColor?: string; textSize?: number };
type PlanDoc = { title?: string; rooms: Room[]; pieces: Piece[] };

function loadDoc(): PlanDoc {
  try {
    const raw = localStorage.getItem("tusplanos3d:plano:v1");
    if (!raw) return { title: "Vivienda", rooms: [], pieces: [] };
    const d = JSON.parse(raw) as PlanDoc;
    return { title: d.title, rooms: d.rooms ?? [], pieces: d.pieces ?? [] };
  } catch {
    return { title: "Vivienda", rooms: [], pieces: [] };
  }
}

const TEMPLATES: Record<string, PlanDoc> = {
  "casa-adosada": {
    title: "Casa Adosada 3 Habitaciones",
    rooms: [
      { id: "1", name: "Sala", x: 0, y: 0, w: 800, h: 600, wallType: "tabique" },
      { id: "2", name: "Cocina", x: 800, y: 0, w: 800, h: 600, wallType: "tabique" },
      { id: "3", name: "Dormitorio 1", x: 1600, y: 0, w: 800, h: 600, wallType: "tabique" },
    ],
    pieces: [
      { id: "p1", key: "cama150", x: 100, y: 100, w: 400, h: 200, rot: 0 },
      { id: "p2", key: "mesita", x: 100, y: 500, w: 200, h: 100, rot: 0 },
      { id: "p3", key: "sofa2", x: 500, y: 300, w: 200, h: 90, rot: 0 },
      { id: "p4", key: "mesa-centro", x: 700, y: 350, w: 80, h: 80, rot: 0 },
      { id: "p5", key: "ventana", x: 100, y: 100, w: 200, h: 100, rot: 0 },
      { id: "p6", key: "puerta", x: 100, y: 300, w: 100, h: 200, rot: 0 },
    ],
  },
  "chalet": {
    title: "Chalet Unifamiliar con Jardín",
    rooms: [
      { id: "1", name: "Planta Principal", x: 0, y: 0, w: 1000, h: 800, wallType: "paredes" },
    ],
    pieces: [
      { id: "p1", key: "palma", x: 200, y: 200, w: 50, h: 100, rot: 0 },
      { id: "p2", key: "sillón", x: 100, y: 700, w: 150, h: 100, rot: 0 },
      { id: "p3", key: "jacuzzi", x: 800, y: 600, w: 300, h: 100, rot: 0 },
    ],
  },
  "piso-estudio": {
    title: "Piso Estudio Moderno",
    rooms: [
      { id: "1", name: "Estudio", x: 0, y: 0, w: 600, h: 400, wallType: "tabique" },
    ],
    pieces: [
      { id: "p1", key: "escritorio", x: 50, y: 50, w: 150, h: 80, rot: 0 },
      { id: "p2", key: "sofa2", x: 50, y: 300, w: 200, h: 90, rot: 0 },
      { id: "p3", key: "lampara-pie", x: 300, y: 300, w: 50, h: 200, rot: 0 },
    ],
  },
};

const wallHeight = 2.5;

function wallTypeThick(t?: string): number {
  if (t === "tabique" || t === "pladur") return 0.12;
  if (t === "aluminio") return 0.15;
  return 0.3;
}

export default function Plan3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PlanDoc>(loadDoc);
  const [ready, setReady] = useState(false);
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const centerRef = useRef<[number, number, number]>([0, 0.5, 0]);
  const rendererRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const doorHingesRef = useRef<any[]>([]);
  const doorsOpenRef = useRef<boolean>(false);
  const roomLabelsRef = useRef<HTMLDivElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);
  const selected3DRef = useRef<any>(null);
  const selection3DRef = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<{walls:boolean; roof:boolean; furniture:boolean; notes:boolean; dimensions:boolean; measure:boolean; floor:boolean}>({walls:true, roof:true, furniture:true, notes:true, dimensions:true, measure:true, floor:true });
  const layersStateRef = useRef(layers);
  const [season, setSeason] = useState(6); // 0=Todo, 1=Primavera, 2=Verano, 3=Otoño, 4=Invierno, 5=Halloween, 6=Fecha actual

  // Detectar estación automáticamente basado en la fecha actual
  useEffect(() => {
    const month = new Date().getMonth(); // 0=Enero, 11=Diciembre
    let detectedSeason = 6; // Default: Fecha actual
    
    // Norte: Invierno ene-feb-mar, Primavera abr-may-jun, Verano jul-ago-set, Otoño oct-nov-dic
    if (month >= 0 && month <= 2) detectedSeason = 4; // Invierno
    else if (month >= 3 && month <= 5) detectedSeason = 1; // Primavera
    else if (month >= 6 && month <= 8) detectedSeason = 2; // Verano
    else if (month >= 9 && month <= 11) detectedSeason = 3; // Otoño
    
    // Special: Halloween is October 31st
    if (month === 9 && new Date().getDate() >= 31) detectedSeason = 5; // Halloween
    
    setSeason(detectedSeason);
  }, []);

// Helper to get season name
  const seasonNames: Record<number, string> = {
    0: "Todo",
    1: "Primavera",
    2: "Verano", 
    3: "Otoño",
    4: "Invierno",
    5: "Halloween",
    6: "Fecha actual"
  };

  const dimXRef = useRef<HTMLDivElement>(null);
  const dimZRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const ambientRef = useRef<any>(null);
  const sunRef = useRef<any>(null);
  const isNightRef = useRef<boolean>(false);
  const autoRotateRef = useRef<boolean>(false);
  const [autoRotateOn, setAutoRotateOn] = useState<boolean>(false);
  const measureMode = useRef<boolean>(false);
  const [measureOn, setMeasureOn] = useState<boolean>(false);
  const measurePointsRef = useRef<any[]>([]);
  const clearMeasureRef = useRef<() => void>(() => {});

  useEffect(() => {
    setDoc(loadDoc());
    setReady(true);
    doorHingesRef.current = [];
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!mountRef.current) return;
    const container = mountRef.current;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      const OrbitModule = await import("three/examples/jsm/controls/OrbitControls.js");
      const OrbitControls = OrbitModule.OrbitControls;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xeeeadf);
      const model = new THREE.Group();
      scene.add(model);
      modelRef.current = model;
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / Math.max(container.clientHeight, 1),
        0.1,
        1000,
      );

      const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.92;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.4;
      pmrem.dispose();

      const ambient = new THREE.AmbientLight(0xffffff, 0.25);
      scene.add(ambient);
      ambientRef.current = ambient;
      const dir = new THREE.DirectionalLight(0xfff1dc, 1.2);
      scene.add(dir);
      sunRef.current = dir;

      const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8b8476, roughness: 0.9 });
      const makeWallCanvas = (kind?: string): HTMLCanvasElement => {
        const canvas = document.createElement("canvas"); canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext("2d")!;
        const palette: any = { carga: "#7a7366", tabique: "#b0a694", pladur: "#f3f0ea", aluminio: "#9ca3af" };
        ctx.fillStyle = palette[kind ?? "carga"]; ctx.fillRect(0, 0, 256, 256);
        if (kind === "carga" || !kind) {
          ctx.strokeStyle = "#5c5448"; ctx.lineWidth = 2;
          for (let y = 0; y < 256; y += 24) for (let x = 0; x < 256; x += 36) {
            ctx.strokeRect(x + (Math.floor(y / 24) % 2 ? 18 : 0) - 1, y - 1, 34, 22);
            if (Math.random() > 0.8) ctx.fillStyle = "rgba(0,0,0,0.04)", ctx.fillRect(x + (Math.floor(y / 24) % 2 ? 18 : 0), y, 34, 22);
          }
        } else if (kind === "tabique" || kind === "pladur") {
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          for (let x = 0; x < 256; x += 18) ctx.fillRect(x, 0, 2, 256);
        } else if (kind === "aluminio") {
          ctx.strokeStyle = "rgba(148,163,184,.8)"; ctx.lineWidth = 1;
          for (let y = 0; y < 256; y += 12) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke(); }
        }
        return canvas;
      };
      const wallTexFor = (kind?: string): any => {
        const canvas = makeWallCanvas(kind);
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2.4, 1.8);
        return new THREE.MeshStandardMaterial({ map: tex, color: 0xffffff, roughness: kind === "pladur" ? 0.85 : 0.92 });
      };
      const wallMatFor = (t?: string) => wallTexFor(t);
      const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x1e4f87, roughness: 0.5 });
      const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x53a8db, opacity: 0.7, transparent: true, roughness: 0.2 });
      const furnitureMaterial = new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.82 });

      const rooms = doc.rooms || [];

      const bounds = { minx: 0, minz: 0, maxx: 0, maxz: 0, initialized: false };
      rooms.forEach((r) => {
        const x = r.x / 100, z = r.y / 100, w = r.w / 100, h = r.h / 100;
        if (!bounds.initialized) { bounds.minx = x; bounds.maxx = x + w; bounds.minz = z; bounds.maxz = z + h; bounds.initialized = true; }
        bounds.minx = Math.min(bounds.minx, x);
        bounds.maxx = Math.max(bounds.maxx, x + w);
        bounds.minz = Math.min(bounds.minz, z);
        bounds.maxz = Math.max(bounds.maxz, z + h);
      });
      if (!bounds.initialized) { bounds.minx = -4; bounds.maxx = 4; bounds.minz = -4; bounds.maxz = 4; bounds.initialized = true; }
      const cosX = (bounds.minx + bounds.maxx) / 2;
      const cosZ = (bounds.minz + bounds.maxz) / 2;
      const span = Math.max(bounds.maxx - bounds.minx, bounds.maxz - bounds.minz, 3);

      const house = rooms.length
        ? {
            minx: rooms.reduce((min, r) => Math.min(min, r.x / 100), Infinity),
            maxx: rooms.reduce((max, r) => Math.max(max, r.x / 100 + r.w / 100), -Infinity),
            minz: rooms.reduce((min, r) => Math.min(min, r.y / 100), Infinity),
            maxz: rooms.reduce((max, r) => Math.max(max, r.y / 100 + r.h / 100), -Infinity),
          }
        : { minx: bounds.minx, maxx: bounds.maxx, minz: bounds.minz, maxz: bounds.maxz };

      dir.position.set(cosX + span * 0.55, span * 1.6, cosZ + span * 0.6);
      dir.castShadow = true;
      dir.shadow.mapSize.set(2048, 2048);
      dir.shadow.camera.left = -span;
      dir.shadow.camera.right = span;
      dir.shadow.camera.top = span;
      dir.shadow.camera.bottom = -span;
      dir.shadow.camera.near = 0.5;
      dir.shadow.camera.far = span * 4.5;
      dir.shadow.bias = -0.0005;
      dir.shadow.normalBias = 0.02;
      dir.target.position.set(cosX, 0, cosZ);
      scene.add(dir.target);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xc7bda9, 0.45));

      const groundSize = span * 10;
      const grassTexture = makeGrassTexture(THREE);
      grassTexture.repeat.set(groundSize / GRASS_TILE_METERS, groundSize / GRASS_TILE_METERS);
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(groundSize, groundSize),
        new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 0.96 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(cosX, -0.03, cosZ);
      ground.receiveShadow = true;
      ground.userData = { type: "floor" };
      model.add(ground);

      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(house.maxx - house.minx + 0.4, 0.12, house.maxz - house.minz + 0.4),
        new THREE.MeshStandardMaterial({ color: 0xcfc8ba, roughness: 1 }),
      );
      slab.position.set((house.minx + house.maxx) / 2, -0.06, (house.minz + house.maxz) / 2);
      slab.receiveShadow = true;
      model.add(slab);

      const buildWallSide = (edge: "bottom" | "top" | "left" | "right", room: Room) => {
        const x = room.x / 100, z = room.y / 100, w = room.w / 100, h = room.h / 100;
        const thick = wallTypeThick(room.wallType);
        const horizontal = edge === "bottom" || edge === "top";
        const len = horizontal ? w : h;
        const openings = (doc.pieces || [])
          .filter((p) => p.key === "puerta" || p.key === "ventana")
          .map((p) => {
            const px = p.x / 100, pz = p.y / 100;
            const pw = p.w / 100, ph = p.h / 100;
            const localStart = horizontal ? px - pw / 2 - x : pz - ph / 2 - z;
            const localEnd = horizontal ? px + pw / 2 - x : pz + ph / 2 - z;
            if (horizontal && edge === "bottom" && Math.abs(pz - z) < 0.2 && px >= x && px <= x + w) {
              return { s: Math.max(0, localStart), e: Math.min(len, localEnd), piece: p };
            }
            if (horizontal && edge === "top" && Math.abs(pz - (z + h)) < 0.2 && px >= x && px <= x + w) {
              return { s: Math.max(0, localStart), e: Math.min(len, localEnd), piece: p };
            }
            if (!horizontal && edge === "left" && Math.abs(px - x) < 0.2 && pz >= z && pz <= z + h) {
              return { s: Math.max(0, localStart), e: Math.min(len, localEnd), piece: p };
            }
            if (!horizontal && edge === "right" && Math.abs(px - (x + w)) < 0.2 && pz >= z && pz <= z + h) {
              return { s: Math.max(0, localStart), e: Math.min(len, localEnd), piece: p };
            }
            return null;
          })
          .filter(Boolean) as Array<{ s: number; e: number; piece: Piece }>;

        openings.sort((a, b) => a.s - b.s);
        const merged: Array<{ s: number; e: number; piece: Piece }> = [];
        openings.forEach((o) => {
          if (merged.length && o.s <= merged[merged.length - 1].e + 0.02) {
            const last = merged[merged.length - 1];
            merged[merged.length - 1] = { ...last, s: Math.min(last.s, o.s), e: Math.max(last.e, o.e), piece: last.piece };
          } else {
            merged.push(o);
          }
        });

        let cursor = 0;
        merged.forEach((o) => {
          if (o.s > cursor + 0.02) {
            const segLen = o.s - cursor;
            const seg = horizontal
              ? new THREE.Mesh(new THREE.BoxGeometry(segLen, wallHeight, thick), wallMatFor(room.wallType))
              : new THREE.Mesh(new THREE.BoxGeometry(thick, wallHeight, segLen), wallMatFor(room.wallType));
            if (edge === "bottom") seg.position.set(x + cursor + segLen / 2, wallHeight / 2, z + thick / 2);
            if (edge === "top") seg.position.set(x + cursor + segLen / 2, wallHeight / 2, z + h - thick / 2);
            if (edge === "left") seg.position.set(x + thick / 2, wallHeight / 2, z + cursor + segLen / 2);
            if (edge === "right") seg.position.set(x + w - thick / 2, wallHeight / 2, z + cursor + segLen / 2);
            model.add(seg);
          }
          cursor = Math.max(cursor, o.e);
        });
        if (cursor < len - 0.02) {
          const segLen = len - cursor;
          const seg = horizontal
            ? new THREE.Mesh(new THREE.BoxGeometry(segLen, wallHeight, thick), wallMatFor(room.wallType))
            : new THREE.Mesh(new THREE.BoxGeometry(thick, wallHeight, segLen), wallMatFor(room.wallType));
          if (edge === "bottom") seg.position.set(x + cursor + segLen / 2, wallHeight / 2, z + thick / 2);
          if (edge === "top") seg.position.set(x + cursor + segLen / 2, wallHeight / 2, z + h - thick / 2);
          if (edge === "left") seg.position.set(x + thick / 2, wallHeight / 2, z + cursor + segLen / 2);
          if (edge === "right") seg.position.set(x + w - thick / 2, wallHeight / 2, z + cursor + segLen / 2);
          model.add(seg);
        }

        merged.forEach((o) => {
          const center = (o.s + o.e) / 2;
          const width = Math.max(o.e - o.s, 0.04);
          const isDoor = o.piece.key === "puerta";
          if (isDoor) {
            const hinge = new THREE.Group();
            const leafWidth = Math.max(width * 0.94, 0.45);
            const leafHeight = Math.min(wallHeight * 0.9, 2.15);
            const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafWidth, leafHeight, 0.05), doorMaterial);
            leaf.position.set(leafWidth / 2, leafHeight / 2, 0);
            hinge.add(leaf);
            const baseYaw = horizontal ? 0 : Math.PI / 2;
            hinge.rotation.y = baseYaw;
            if (edge === "bottom") hinge.position.set(x + o.s, 0, z + thick / 2);
            if (edge === "top") hinge.position.set(x + o.s, 0, z + h - thick / 2);
            if (edge === "left") hinge.position.set(x + thick / 2, 0, z + o.s);
            if (edge === "right") hinge.position.set(x + w - thick / 2, 0, z + o.s);
            model.add(hinge);
            doorHinges.push({ hinge, baseYaw, dir: (edge === "top" || edge === "right") ? -1 : 1 });
          } else if (o.piece.key === "puerta-doble") {
            const hingeBase = horizontal ? 0 : Math.PI / 2;
            const leafW = Math.max((width / 2) * 0.96, 0.45);
            const leafH = Math.min(wallHeight * 0.9, 2.15);
            const leftHinge = new THREE.Group();
            const leftLeaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.045), doorMaterial);
            leftLeaf.position.set(leafW / 2, leafH / 2, 0);
            leftHinge.add(leftLeaf);
            leftHinge.rotation.y = hingeBase;
            if (horizontal && edge === "bottom") leftHinge.position.set(x + o.s, 0, z + thick / 2);
            if (horizontal && edge === "top") leftHinge.position.set(x + o.s, 0, z + h - thick / 2);
            if (!horizontal && edge === "left") leftHinge.position.set(x + thick / 2, 0, z + o.s);
            if (!horizontal && edge === "right") leftHinge.position.set(x + w - thick / 2, 0, z + o.s);
            model.add(leftHinge);
            doorHinges.push({ hinge: leftHinge, baseYaw: hingeBase, dir: (edge === "top" || edge === "right") ? -1 : 1 });

            const rightHinge = new THREE.Group();
            const rightLeaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.045), doorMaterial);
            rightLeaf.position.set(leafW / 2, leafH / 2, 0);
            rightHinge.add(rightLeaf);
            const rightYaw = hingeBase + Math.PI;
            rightHinge.rotation.y = rightYaw;
            if (horizontal && edge === "bottom") rightHinge.position.set(x + o.e, 0, z + thick / 2);
            if (horizontal && edge === "top") rightHinge.position.set(x + o.e, 0, z + h - thick / 2);
            if (!horizontal && edge === "left") rightHinge.position.set(x + thick / 2, 0, z + o.e);
            if (!horizontal && edge === "right") rightHinge.position.set(x + w - thick / 2, 0, z + o.e);
            model.add(rightHinge);
            doorHinges.push({ hinge: rightHinge, baseYaw: rightYaw, dir: (edge === "top" || edge === "left") ? 1 : -1 });
          } else {
            const paneW = Math.max(width * 0.92, 0.35);
            const paneH = 0.75;
            const pane = new THREE.Mesh(
              new THREE.BoxGeometry(horizontal ? paneW : 0.04, paneH, horizontal ? 0.04 : paneW),
              windowMaterial,
            );
            const paneY = 0.95;
            if (horizontal && edge === "bottom") pane.position.set(x + center, paneY, z + thick / 2);
            if (horizontal && edge === "top") pane.position.set(x + center, paneY, z + h - thick / 2);
            if (!horizontal && edge === "left") pane.position.set(x + thick / 2, paneY, z + center);
            if (!horizontal && edge === "right") pane.position.set(x + w - thick / 2, paneY, z + center);
            pane.rotation.x = horizontal ? 0 : 0;
            pane.rotation.y = horizontal ? 0 : 0;
            // Marco
            const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 });
            const frameThickness = 0.03;
            if (horizontal) {
              const topFrame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.1, frameThickness, thick + 0.08), frameMat);
              topFrame.position.set(x + center, paneY + paneH / 2 + frameThickness / 2, (edge === "bottom" ? z + thick / 2 : z + h - thick / 2));
              model.add(topFrame);
              const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.1, frameThickness, thick + 0.08), frameMat);
              bottomFrame.position.set(x + center, paneY - paneH / 2 - frameThickness / 2, (edge === "bottom" ? z + thick / 2 : z + h - thick / 2));
              model.add(bottomFrame);
              const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, paneH, thick + 0.08), frameMat);
              leftFrame.position.set(x + center - width / 2 - frameThickness / 4, paneY, (edge === "bottom" ? z + thick / 2 : z + h - thick / 2));
              model.add(leftFrame);
              const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, paneH, thick + 0.08), frameMat);
              rightFrame.position.set(x + center + width / 2 + frameThickness / 4, paneY, (edge === "bottom" ? z + thick / 2 : z + h - thick / 2));
              model.add(rightFrame);
              // Montante central
              const cross = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, paneH, thick + 0.08), frameMat);
              cross.position.set(x + center, paneY, (edge === "bottom" ? z + thick / 2 : z + h - thick / 2));
              model.add(cross);
            } else {
              const topFrame = new THREE.Mesh(new THREE.BoxGeometry(thick + 0.08, frameThickness, width + 0.1), frameMat);
              topFrame.position.set((edge === "left" ? x + thick / 2 : x + w - thick / 2), paneY + paneH / 2 + frameThickness / 2, z + center);
              model.add(topFrame);
              const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(thick + 0.08, frameThickness, width + 0.1), frameMat);
              bottomFrame.position.set((edge === "left" ? x + thick / 2 : x + w - thick / 2), paneY - paneH / 2 - frameThickness / 2, z + center);
              model.add(bottomFrame);
              const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(thick + 0.08, paneH, frameThickness), frameMat);
              leftFrame.position.set((edge === "left" ? x + thick / 2 : x + w - thick / 2), paneY, z + center - width / 2 - frameThickness / 4);
              model.add(leftFrame);
              const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(thick + 0.08, paneH, frameThickness), frameMat);
              rightFrame.position.set((edge === "left" ? x + thick / 2 : x + w - thick / 2), paneY, z + center + width / 2 + frameThickness / 4);
              model.add(rightFrame);
              const cross = new THREE.Mesh(new THREE.BoxGeometry(thick + 0.08, paneH, frameThickness), frameMat);
              cross.position.set((edge === "left" ? x + thick / 2 : x + w - thick / 2), paneY, z + center);
              model.add(cross);
            }
            model.add(pane);
          }
        });
      };

      const floorBase = new Map<string, any>();
      const finishForRoom = (room: Room): "parquet" | "roble" | "porcelanico" | "marmol" | "cemento" => {
        if (room.floor === "wood") return "roble";
        if (room.floor === "tile") return "porcelanico";
        if (room.floor === "concrete") return "cemento";
        if (room.floor === "carpet") return "parquet";
        return resolveFloor(room.name, "auto");
      };
      rooms.forEach((room) => {
        const x = room.x / 100, z = room.y / 100, w = room.w / 100, h = room.h / 100;
        const finish = finishForRoom(room);
        if (!floorBase.has(finish)) floorBase.set(finish, makeFloorTexture(THREE, finish));
        const map = floorBase.get(finish).clone();
        map.needsUpdate = true;
        map.repeat.set(Math.max(w, 0.5) / FLOOR_TILE_METERS, Math.max(h, 0.5) / FLOOR_TILE_METERS);
        const rfloor = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshStandardMaterial({
            map,
            roughness: finish === "porcelanico" || finish === "marmol" ? 0.55 : 0.94,
            metalness: finish === "marmol" ? 0.05 : 0,
            envMapIntensity: 0.3,
          }),
        );
        rfloor.rotation.x = -Math.PI / 2;
        rfloor.position.set(x + w / 2, 0.03, z + h / 2);
        rfloor.receiveShadow = true;
        rfloor.userData = { type: "floor" };
        model.add(rfloor);
      });
      const doorHinges: any[] = [];
      const edges: Array<"bottom" | "top" | "left" | "right"> = ["bottom", "top", "left", "right"];
      rooms.forEach((room) => edges.forEach((edge) => buildWallSide(edge, room)));
      doorHingesRef.current = doorHinges;

      (doc.pieces || [])
        .filter((p) => p.key !== "puerta" && p.key !== "ventana")
        .forEach((p) => {
          const px = p.x / 100, pz = p.y / 100;
          const w = p.w / 100, h = p.h / 100;
          const angle = (p.rot * Math.PI) / 180;
          const custom = buildPiece(THREE, p.key, w, h);
          if (custom) {
            custom.position.set(px, 0, pz);
            custom.rotation.y = (-p.rot * Math.PI) / 180;
            custom.userData = { type: "furniture", kind: "piece", title: p.key };
            custom.traverse((m: any) => {
              if (m.isMesh) {
                m.castShadow = true;
                m.receiveShadow = true;
                m.userData = { ...(m.userData || {}), type: "furniture" };
              }
            });
            model.add(custom);
            return;
          }
          if (p.key === "piscina") {
            const w = p.w / 100, h = p.h / 100;
            const waterMat = new THREE.MeshStandardMaterial({ color: 0x5faadb, opacity: 0.86, transparent: true, roughness: 0.2 });
            const water = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.15, h - 0.15), waterMat);
            water.rotation.x = -Math.PI / 2;
            water.position.set(px, 0.035, pz);
            model.add(water);
            const rim = new THREE.MeshStandardMaterial({ color: 0xd4d0c8, roughness: 0.75 });
            const segments = [
              { g: new THREE.BoxGeometry(w, 0.05, 0.08), x: px, z: pz - h / 2 },
              { g: new THREE.BoxGeometry(w, 0.05, 0.08), x: px, z: pz + h / 2 },
              { g: new THREE.BoxGeometry(0.08, 0.05, h - 0.16), x: px - w / 2, z: pz },
              { g: new THREE.BoxGeometry(0.08, 0.05, h - 0.16), x: px + w / 2, z: pz },
            ];
            for (const seg of segments) {
              const m = new THREE.Mesh(seg.g, rim);
              m.position.set(seg.x, 0.055, seg.z);
              model.add(m);
            }
            return;
          }
          if (p.key === "piscina" || p.key === "fuente" || p.key === "maceta" || p.key === "maceta-grande" || p.key === "jardinera" || p.key === "parasol" || p.key === "arbol" || p.key === "arbusto" || p.key === "cesped") {
            const g = new THREE.Group();
            if (p.key === "piscina") {
              const waterMat = new THREE.MeshStandardMaterial({ color: 0x5faadb, opacity: 0.85, transparent: true, roughness: 0.2 });
              const water = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.15, h - 0.15), waterMat);
              water.rotation.x = -Math.PI / 2;
              water.position.set(0, 0.035, 0);
              g.add(water);
              const rim = new THREE.MeshStandardMaterial({ color: 0xd4d0c8, roughness: 0.75 });
              const segs = [
                { g: new THREE.BoxGeometry(w, 0.05, 0.08), x: 0, z: -h / 2 },
                { g: new THREE.BoxGeometry(w, 0.05, 0.08), x: 0, z: h / 2 },
                { g: new THREE.BoxGeometry(0.08, 0.05, h - 0.16), x: -w / 2, z: 0 },
                { g: new THREE.BoxGeometry(0.08, 0.05, h - 0.16), x: w / 2, z: 0 },
              ];
              for (const seg of segs) {
                const m = new THREE.Mesh(seg.g, rim);
                m.position.set(seg.x, 0.055, seg.z);
                g.add(m);
              }
            } else if (p.key === "fuente") {
              const basin = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(w, h) * 0.45, Math.max(w, h) * 0.4, 0.08, 32), new THREE.MeshStandardMaterial({ color: 0xdcecf8, roughness: 0.25 }));
              basin.position.y = 0.04;
              g.add(basin);
              const col = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 16), new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.45 }));
              col.position.y = 0.38;
              g.add(col);
            } else if (p.key === "maceta" || p.key === "maceta-grande" || p.key === "jardinera") {
              const radius = Math.min(w, h) * 0.4;
              const pot = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.82, 0.25, 32), new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 }));
              pot.position.y = 0.125;
              g.add(pot);
              const soil = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, 0.04, 32), new THREE.MeshStandardMaterial({ color: 0x56633b, roughness: 1 }));
              soil.position.y = 0.25;
              g.add(soil);
            } else if (p.key === "maceta-flor") {
              const radius = Math.min(w, h) * 0.4;
              const pot = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.82, 0.25, 32), new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 }));
              pot.position.y = 0.125;
              g.add(pot);
              // Add flowers (roses/geraniums) - red/pink colors
              const flowerColor = new THREE.MeshStandardMaterial({ color: 0xeb4d4b, roughness: 0.7, metalness: 0.2 });
              for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI * 2) / 6;
                const flower = new THREE.Mesh(
                  new THREE.SphereGeometry(radius * 0.3, 12, 12),
                  flowerColor
                );
                flower.position.set(
                  Math.cos(angle) * radius * 0.5,
                  0.4,
                  Math.sin(angle) * radius * 0.5
                );
                flower.scale.y = 0.8;
                g.add(flower);
              }
              // Add green leaves
              const leafColor = new THREE.MeshStandardMaterial({ color: 0x1e8449, roughness: 0.8, metalness: 0.1 });
              for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI * 2) / 4;
                const leaf = new THREE.Mesh(
                  new THREE.PlaneGeometry(radius * 0.4, radius * 0.2, 8, 4),
                  leafColor
                );
                leaf.position.set(
                  Math.cos(angle) * radius * 0.5,
                  0.35,
                  Math.sin(angle) * radius * 0.5);
                leaf.rotation.z = angle + Math.PI / 2;
                leaf.scale.y = 0.5;
                g.add(leaf);
            } else if (p.key === "parasol") {
              const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.85, 8), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 }));
              mast.position.y = 0.425;
              g.add(mast);
              const canopy = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, h) * 0.48, 0.04, 8), new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.65 }));
              canopy.position.y = 0.85;
              g.add(canopy);
            } else if (p.key === "monstruo") {
              const g = new THREE.Group();
              const bodyH = 1.5;
              const bodyW = 0.8;
              const bodyD = 0.8;
              const darkGreen = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.8, metalness: 0.3 });
              const lightGreen = new THREE.MeshStandardMaterial({ color: 0x6b8e23, roughness: 0.4, metalness: 0.7 });
              const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.9, metalness: 0.2 });
              const eyeBlack = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.2 });
              const mouthBrown = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7, metalness: 0.4 });
              // Main body
              box(bodyW, bodyH, bodyD, darkGreen, 0, bodyH / 2, 0);
              // Stomach patch
              box(bodyW * 0.6, bodyH * 0.3, bodyD * 0.4, lightGreen, 0, bodyH * 0.45, 0);
              // Two arms
              for (const sx of [-1, 1]) {
                cyl(0.08, 0.08, bodyH * 0.4, darkGreen, sx * bodyW / 2 - 0.1, bodyH * 0.35, 0);
                box(0.15, 0.15, 0.15, lightGreen, sx * bodyW / 2 - 0.1, bodyH * 0.65, 0);
              }
              // Two legs
              for (const sx of [-1, 1]) {
                cyl(0.08, 0.08, bodyH * 0.45, darkGreen, sx * bodyW * 0.2, -bodyH / 2 + 0.05, 0);
                box(0.12, 0.12, 0.2, darkGreen, sx * bodyW * 0.2, -bodyH / 2 + 0.15, 0);
              }
              // Left eye socket
              box(0.12, 0.18, 0.12, eyeWhite, -bodyW / 4, bodyH / 2 - 0.15, 0);
              // Right eye socket
              box(0.12, 0.18, 0.12, eyeWhite, bodyW / 4, bodyH / 2 - 0.15, 0);
              // Left pupil
              sphere(0.05, eyeBlack, 0, bodyH / 2 - 0.25, -bodyW / 4, 8);
              // Right pupil
              sphere(0.05, eyeBlack, 0, bodyH / 2 - 0.25, bodyW / 4, 8);
              // Mouth (smile)
              const mouthX = 0;
              const mouthY = -bodyH / 3;
              const mouthWd = bodyW * 0.4;
              const mouthHt = 0.08;
              box(mouthWd, mouthHt, bodyD * 0.2, mouthBrown, mouthX, mouthY, 0);
              // Smile curve (approximated with small spheres)
              for (let i = 0; i <= 4; i++) {
                const angle = (i * Math.PI) / 4;
                const sx = Math.cos(angle) * mouthWd / 3;
                const sy = Math.sin(angle) * mouthWd / 3;
                sphere(0.03, mouthBrown, 0, mouthY + 0.02, sx, 8);
              }
              g.position.set(px, 0, pz);
              g.rotation.y = angle;
              model.add(g);
              return;
            } else if (p.key === "primavera") {
              if (season === 0 || season === 1) spring();
              else if (season === 6) spring(); // Mostrar si es "fecha actual" y es primavera
              g.position.set(px, 0, pz);
              g.rotation.y = angle;
              model.add(g);
              return;
            } else if (p.key === "verano") {
              if (season === 0 || season === 2) summer();
              else if (season === 6) summer();
              g.position.set(px, 0, pz);
              g.rotation.y = angle;
              model.add(g);
              return;
            } else if (p.key === "otoño") {
              if (season === 0 || season === 3) autumn();
              else if (season === 6) autumn();
              g.position.set(px, 0, pz);
              g.rotation.y = angle;
              model.add(g);
              return;
            } else if (p.key === "invierno") {
              if (season === 0 || season === 4) winter();
              else if (season === 6) winter();
              g.position.set(px, 0, pz);
              g.rotation.y = angle;
              model.add(g);
              return;
            } else if (p.key === "halloween") {
              if (season === 0 || season === 5) halloween();
              else if (season === 6) halloween();
              g.position.set(px, 0, pz);
              g.rotation.y = angle;
              model.add(g);
              return;
            } else if (p.key === "arbol") {
              const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.45, 10), new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 }));
              trunk.position.y = 0.225;
              g.add(trunk);
              const canopy = new THREE.Mesh(new THREE.SphereGeometry(Math.max(w, h) * 0.4, 16, 16), new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9 }));
              canopy.position.y = 0.7;
              g.add(canopy);
            } else if (p.key === "arbusto") {
              const bush = new THREE.Mesh(new THREE.SphereGeometry(Math.max(w, h) * 0.35, 12, 12), new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 1 }));
              bush.position.y = 0.22;
              g.add(bush);
            } else if (p.key === "cesped") {
              const g2 = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.95 }));
              g2.rotation.x = -Math.PI / 2;
              g2.position.y = 0.015;
              g.add(g2);
              return;
            }
            g.position.set(px, 0, pz);
            g.rotation.y = angle;
            model.add(g);
            return;
          }
          if (p.key === "curva90" || p.key === "curva180") {
            const theta = p.key === "curva180" ? Math.PI : Math.PI / 2;
            const radius = Math.max(0.65, Math.max(w, h) * 0.38);
            const geom = new THREE.TorusGeometry(radius * 0.88, 0.09, 8, 64, theta);
            const mesh = new THREE.Mesh(geom, wallMatFor("carga"));
            mesh.scale.y = wallHeight / 0.18;
            mesh.position.set(px, wallHeight / 2, pz);
            mesh.rotation.x = Math.PI / 2;
            mesh.rotation.y = angle;
            mesh.userData = { kind: "piece", title: p.key === "curva180" ? "Curva 180°" : "Curva 90°", size: `${Math.round(w * 100)} x ${Math.round(h * 100)} cm`, type: "furniture" };
            model.add(mesh);
            return;
          }
          if (p.key === "nota") {
            const txt = p.text || "Texto";
            const fontPx = Math.max(12, Math.min(48, (p.textSize ?? 16) * 3));
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext("2d")!;
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.globalAlpha = 1;
              ctx.font = `600 ${fontPx}px "Segoe UI", sans-serif`;
              ctx.fillStyle = p.textColor ?? "#1c1f24";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate((p.rot * Math.PI) / 180);
              ctx.fillText(txt, 0, 0, canvas.width - 32);
            }
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true });
            const sprite = new THREE.Sprite(material);
            sprite.position.set(px, 0.45, pz);
            sprite.scale.set(w || 1.7, h || 0.35, 1);
            model.add(sprite);
            return;
          }
          const height = 0.85;
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, height, h), furnitureMaterial);
          mesh.position.set(px, height / 2, pz);
          mesh.rotation.y = angle;
          mesh.userData = { kind: "piece", title: p.text || p.key, size: `${Math.round(w * 100)} x ${Math.round(h * 100)} cm`, type: "furniture" };
          model.add(mesh);
        });

      const roofCanvas = document.createElement("canvas"); roofCanvas.width = 256; roofCanvas.height = 256; const rc = roofCanvas.getContext("2d")!; rc.fillStyle = "#9e3e22"; rc.fillRect(0,0,256,256); rc.strokeStyle = "#7f2f19"; rc.lineWidth = 2; for(let y=0;y<256;y+=14){rc.beginPath();rc.moveTo(0,y);rc.lineTo(256,y);rc.stroke();} rc.strokeStyle="rgba(0,0,0,0.15)"; for(let x=0;x<256;x+=28){rc.beginPath();rc.moveTo(x,0);rc.lineTo(x,256);rc.stroke();}
      const roofTexture = new THREE.CanvasTexture(roofCanvas); roofTexture.wrapS=THREE.RepeatWrapping; roofTexture.wrapT=THREE.RepeatWrapping; roofTexture.repeat.set(4,2);
      const roofMaterial = new THREE.MeshStandardMaterial({ map: roofTexture, color: 0xffffff, roughness: 0.85 });
      const roofDepth = Math.max(span, 3);
      const roofWidth = Math.max((bounds.maxx - bounds.minx) + 0.8, 3);
      const rise = roofDepth * 0.35;
      const roofShape = new THREE.Shape();
      roofShape.moveTo(-roofDepth / 2, 0);
      roofShape.lineTo(0, rise);
      roofShape.lineTo(roofDepth / 2, 0);
      roofShape.closePath();
      const roofGeometry = new THREE.ExtrudeGeometry(roofShape, { depth: roofWidth, bevelEnabled: false });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.set(cosX, wallHeight, cosZ);
      roof.rotation.y = -Math.PI / 2;
      roof.userData = { type: "roof" };
      model.add(roof);
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(roofWidth, 0.12, 0.18), new THREE.MeshStandardMaterial({ color: 0x7f2f19, roughness: 0.8 }));
      ridge.position.set(cosX, wallHeight + rise + 0.06, cosZ);
      ridge.rotation.y = Math.PI / 2;
      ridge.userData = { type: "roof" };
      model.add(ridge);
      const guideMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
      const guideX = new THREE.Mesh(new THREE.BoxGeometry((bounds.maxx-bounds.minx)+0.4, 0.03, 0.03), guideMat);
      guideX.position.set(cosX, 0.05, bounds.minz - 1.2);
      guideX.userData = { type: "dimension" };
      model.add(guideX);
      const guideZ = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, (bounds.maxz-bounds.minz)+0.4), guideMat);
      guideZ.position.set(bounds.minx - 1.2, 0.05, cosZ);
      guideZ.userData = { type: "dimension" };
      model.add(guideZ);
      const measureGroup = new THREE.Group();
      model.add(measureGroup);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x2563eb });
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2563eb, linewidth: 2 });
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

      const handleMeasureClick = (event: MouseEvent) => {
        if (!measureMode.current) {
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const hits = raycaster.intersectObjects(model.children, true);
          const hit = hits.find((h) => h.object?.userData?.kind === "piece");
          const cur = selected3DRef.current;
          if (cur && cur.material && cur.material.emissive) {
            cur.material.emissive.set(cur.userData?._origEmissive ?? 0);
          }
          if (!hit) {
            selected3DRef.current = null;
            if (selection3DRef.current) selection3DRef.current.style.opacity = "0";
            return;
          }
          const obj = hit.object;
          if (selected3DRef.current === obj) return;
          if (!obj.userData._origSaved) {
            obj.userData._origEmissive = (obj as any).material?.emissive ? (obj as any).material.emissive.getHex() : 0;
            obj.userData._origSaved = true;
          }
          if ((obj as any).material?.emissive) (obj as any).material.emissive.set(0xf6821f);
          selected3DRef.current = obj;
          const card = selection3DRef.current;
          if (card) {
            card.textContent = `${obj.userData.title ?? "Pieza"} · ${obj.userData.size ?? ""}`;
            card.style.opacity = "1";
          }
          return;
        }
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = new THREE.Vector3();
        if (!raycaster.ray.intersectPlane(floorPlane, hit)) return;
        const p = new THREE.Vector3(
          Math.round(hit.x * 10) / 10,
          0.05,
          Math.round(hit.z * 10) / 10,
        );
        if (measurePointsRef.current.length === 2) {
          clearMeasureRef.current();
        }
        const marker = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), markerMaterial);
        marker.userData = { type: "measure" };
        marker.position.copy(p);
        measureGroup.add(marker);
        measurePointsRef.current.push(p);
        if (measurePointsRef.current.length === 2) {
          const p0 = measurePointsRef.current[0];
          const p1 = measurePointsRef.current[1];
          const geom = new THREE.BufferGeometry().setFromPoints([p0, p1]);
          const line = new THREE.Line(geom, lineMaterial);
          line.userData = { type: "measure" };
          measureGroup.add(line);
          const distance = p0.distanceTo(p1);
          const canvas = document.createElement("canvas");
          canvas.width = 256;
          canvas.height = 64;
          const ctx = canvas.getContext("2d")!;
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "bold 24px sans-serif";
            ctx.fillStyle = "#1d4ed8";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${distance.toFixed(2).replace(".", ",")} m`, canvas.width / 2, canvas.height / 2);
          }
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: false }));
          sprite.userData = { type: "measure" };
          sprite.position.copy(p0.clone().add(p1).multiplyScalar(0.5));
          sprite.position.y = 0.4;
          sprite.scale.set(0.9, 0.22, 1);
          measureGroup.add(sprite);
        }
      };
      renderer.domElement.addEventListener("click", handleMeasureClick);

      clearMeasureRef.current = () => {
        const group = measureGroup;
        while (group.children.length > 0) {
          const child = group.children.pop();
          (child as any)?.geometry?.dispose?.();
          (child as any)?.material?.dispose?.();
        }
        measurePointsRef.current = [];
      };

      model.traverse((child: any) => {
        if (child && child.isMesh && !child.userData?._noShadow) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x2c2720, opacity: 0.3, transparent: true });
      model.traverse((child: any) => {
        if (!child || !child.isMesh) return;
        if (!(child.userData?.type === "wall" || child.userData?.type === "opening" || child.userData?.type === "roof" || child.userData?.type === "furniture")) return;
        const edges = new THREE.EdgesGeometry(child.geometry, 25);
        const line = new THREE.LineSegments(edges, edgeMat);
        line.position.copy(child.position);
        line.rotation.copy(child.rotation);
        line.scale.copy(child.scale);
        model.add(line);
      });
      centerRef.current = [cosX, 0.5, cosZ];


      camera.position.set(cosX + span * 0.8, span * 1.15, cosZ + span * 0.8);
      camera.lookAt(cosX, 0.5, cosZ);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(cosX, 0.5, cosZ);
      controls.enableDamping = true;
controls.autoRotate = false;
      cameraRef.current = camera;
      controlsRef.current = controls;

      const onResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", onResize);

      let raf = 0;
      const labelElements = roomLabelsRef.current;

      // Función para exportar el plano actual como imagen PNG
      function exportarPlano() {
        if (!rendererRef.current || !mountRef.current) return;
        
        // Crear un renderer temporal para capturar la escena
        const tempRenderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          preserveDrawingBuffer: true 
        });
        tempRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        tempRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        tempRenderer.background = new THREE.Color(0xffffff);
        tempRenderer.shadowMap.enabled = true;
        tempRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Copiar la escena actual
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        
        // Renderizar la escena al buffer temporal
        tempRenderer.render(scene, camera);
        
        // Convertir a data URL de imagen PNG
        const imageData = tempRenderer.domElement.toDataURL('image/png');
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = imageData.replace('image/png', 'image/octet-stream'); // Forzar descarga
        link.download = `plano-tusplanos3d-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar renderer temporal
        tempRenderer.dispose();
      }

      const updateLabels = () => {
        labelElements.forEach((label, index) => {
          const room = doc.rooms[index];
          if (!label || !room) return;
          const v = new THREE.Vector3((room.x + room.w / 2) / 100, 0.35, (room.y + room.h / 2) / 100);
          v.project(camera);
          if (v.z > 1) { label.style.opacity = "0"; return; }
          label.style.opacity = "1";
          label.style.left = `${(v.x * 0.5 + 0.5) * container.clientWidth}px`;
          label.style.top = `${(v.y * -0.5 + 0.5) * container.clientHeight}px`;
        });
        const dx = dimXRef.current;
        if (dx) {
          const vv = new THREE.Vector3(cosX, 0.08, bounds.minz - 1.2);
          vv.project(camera);
          if (vv.z < 1) {
            dx.style.opacity = "1";
            dx.style.left = `${(vv.x * 0.5 + 0.5) * container.clientWidth}px`;
            dx.style.top = `${(vv.y * -0.5 + 0.5) * container.clientHeight}px`;
            dx.textContent = `${(bounds.maxx-bounds.minx).toFixed(2).replace(".", ",")} m`;
          } else {
            dx.style.opacity = "0";
          }
        }
        const dz = dimZRef.current;
        if (dz) {
          const vv = new THREE.Vector3(bounds.minx - 1.2, 0.08, cosZ);
          vv.project(camera);
          if (vv.z < 1) {
            dz.style.opacity = "1";
            dz.style.left = `${(vv.x * 0.5 + 0.5) * container.clientWidth}px`;
            dz.style.top = `${(vv.y * -0.5 + 0.5) * container.clientHeight}px`;
            dz.textContent = `${(bounds.maxz-bounds.minz).toFixed(2).replace(".", ",")} m`;
          } else {
            dz.style.opacity = "0";
          }
        }
      };
      const animate = () => {
        controls.update();
        const sel = selected3DRef.current;
        const selCard = selection3DRef.current;
        if (sel && selCard) {
          const v = new THREE.Vector3();
          sel.getWorldPosition(v);
          v.project(camera);
          if (v.z < 1) {
            selCard.style.opacity = "1";
            selCard.style.left = `${(v.x * 0.5 + 0.5) * container.clientWidth}px`;
            selCard.style.top = `${(v.y * -0.5 + 0.5) * container.clientHeight}px`;
          } else {
            selCard.style.opacity = "0";
          }
        } else if (selCard) {
          selCard.style.opacity = "0";
        }
        updateLabels();
        const compass = compassRef.current;
        if (compass) {
          const c = centerRef.current;
          const camX = camera.position.x - c[0];
          const camZ = camera.position.z - c[2];
          const angle = Math.atan2(camX, camZ) * 180 / Math.PI;
          compass.style.transform = `rotate(${-angle}deg)`;
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        renderer.domElement.removeEventListener("click", handleMeasureClick);
        cancelAnimationFrame(raf);
        controls?.dispose();
        renderer?.dispose();
        if (renderer?.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
      (container as any).__threeCleanup__ = cleanup;
    })();

    return () => {
      if (container && (container as any).__threeCleanup__) (container as any).__threeCleanup__();
    };
  }, [ready, doc]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 text-ink">
      <header className="mb-4 flex items-center gap-3">
        <a href="/" aria-label="Volver al inicio" className="flex items-center gap-2">
          <img src="/img/logo.svg" alt="tusplanos3d.es" width={205} height={50} className="h-8 w-auto" />
        </a>
        <h1 className="text-xl font-bold text-accent">Vista 3D del plano</h1>
      </header>
      <p className="mb-4 text-sm text-muted">
        El visor lee el plano guardado en tu navegador y lo extruye a 2,5 m con muros, puertas/ventanas, objetos y tejado. Usa "Cargar proyecto 2D" si actualizaste el plano.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setDoc(loadDoc())}
          className="rounded border border-accent bg-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-paper hover:bg-accent/90"
        >
          Cargar proyecto actual (2D)
        </button>
        <button
          onClick={() => setDoc(TEMPLATES["casa-adosada"])}
          className="rounded border bg-green-100 px-3 py-1.5 text-xs font-medium text-green-900 hover:bg-green-200"
        >
          Casa Adosada
        </button>
        <button
          onClick={() => setDoc(TEMPLATES["chalet"])}
          className="rounded border bg-green-100 px-3 py-1.5 text-xs font-medium text-green-900 hover:bg-green-200"
        >
          Chalet
        </button>
        <button
          onClick={() => setDoc(TEMPLATES["piso-estudio"])}
          className="rounded border bg-green-100 px-3 py-1.5 text-xs font-medium text-green-900 hover:bg-green-200"
        >
          Piso Estudio
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            const [cx, , cz] = centerRef.current;
            cameraRef.current?.position.set(cx + 2.4, 2.2, cz + 2.4);
            controlsRef.current?.target.set(cx, 0.5, cz);
            controlsRef.current?.update();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Isométrico
        </button>
        <button
          onClick={() => {
            const [cx, , cz] = centerRef.current;
            cameraRef.current?.position.set(cx, 9, cz);
            controlsRef.current?.target.set(cx, 0.15, cz);
            controlsRef.current?.update();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Planta
        </button>
        <button
          onClick={() => {
            const [cx, , cz] = centerRef.current;
            cameraRef.current?.position.set(cx, 1.5, cz + 3.5);
            controlsRef.current?.target.set(cx, 0.6, cz);
            controlsRef.current?.update();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Frontal
        </button>
        <button
          onClick={() => {
            const [cx, , cz] = centerRef.current;
            cameraRef.current?.position.set(cx + 1.8, 2.2, cz + 1.8);
            controlsRef.current?.target.set(cx, 0.5, cz);
            controlsRef.current?.update();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Personado
        </button>

        <button
          onClick={() => {
            const next = !measureOn;
            measureMode.current = next;
            setMeasureOn(next);
            if (!next) clearMeasureRef.current();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          {measureOn ? "Medir (on)" : "Medir 3D"}
        </button>

        <button
          onClick={() => {
            const night = !isNightRef.current;
            isNightRef.current = night;
            const scen = sceneRef.current;
            if (scen) {
              scen.background.setHex(night ? 0x101828 : 0xeeeadf);
            }
            modelRef.current?.traverse((m: any) => {
              if (m?.material?.color?.getHex?.() === 0x53a8db) {
                if (!m.userData?._origEmissiveWindow) {
                  m.userData = { ...(m.userData || {}), _origEmissiveWindow: m.material.emissive ? m.material.emissive.getHex() : 0 };
                }
                if (m.material.emissive) {
                  m.material.emissive.setHex(night ? 0x53a8db : 0x000000);
                }
              }
            });
            const ambient = ambientRef.current;
            if (ambient) {
              ambient.intensity = night ? 0.12 : 0.25;
            }
            const sun = sunRef.current;
            if (sun) {
              sun.intensity = night ? 0.25 : 1.2;
              sun.color.setHex(night ? 0xfde68a : 0xfff1dc);
            }
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Día / Noche
        </button>
        <button
          onClick={() => exportarPlano()}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Descargar Plano
        </button>

        <button
          onClick={() => {
            const next = !layers.walls;
            setLayers((prev) => ({ ...prev, walls: next }));
            layersStateRef.current = { ...layersStateRef.current, walls: next };
            const types = ["wall", "opening"];
            modelRef.current?.traverse((m: any) => {
              if (types.includes(m.userData?.type)) m.visible = next;
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Muros
        </button>
        <button
          onClick={() => {
            const next = !layers.roof;
            setLayers((prev) => ({ ...prev, roof: next }));
            layersStateRef.current = { ...layersStateRef.current, roof: next };
            modelRef.current?.traverse((m: any) => {
              if (m.userData?.type === "roof") m.visible = next;
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Tejado
        </button>
        <button
          onClick={() => {
            const next = !layers.furniture;
            setLayers((prev) => ({ ...prev, furniture: next }));
            layersStateRef.current = { ...layersStateRef.current, furniture: next };
            modelRef.current?.traverse((m: any) => {
              if (m.userData?.type === "furniture") m.visible = next;
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Muebles
        </button>
        <button
          onClick={() => {
            const next = !layers.notes;
            setLayers((prev) => ({ ...prev, notes: next }));
            layersStateRef.current = { ...layersStateRef.current, notes: next };
            modelRef.current?.traverse((m: any) => {
              if (m.userData?.type === "note") m.visible = next;
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Notas
        </button>
        <button
          onClick={() => {
            const next = !layers.floor;
            setLayers((prev) => ({ ...prev, floor: next }));
            layersStateRef.current = { ...layersStateRef.current, floor: next };
            modelRef.current?.traverse((m: any) => {
              if (m.userData?.type === "floor") m.visible = next;
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Suelos
        </button>
        <button
          onClick={() => {
            const next = !layers.dimensions;
            setLayers((prev) => ({ ...prev, dimensions: next }));
            layersStateRef.current = { ...layersStateRef.current, dimensions: next };
            const cardX = dimXRef.current; const cardZ = dimZRef.current;
            if (cardX) cardX.style.opacity = next ? "1" : "0";
            if (cardZ) cardZ.style.opacity = next ? "1" : "0";
            modelRef.current?.traverse((m: any) => {
              if (m.userData?.type === "dimension") m.visible = next;
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Cotas
        </button>
        <button
          onClick={() => {
            const next = !layers.measure;
            setLayers((prev) => ({ ...prev, measure: next }));
            layersStateRef.current = { ...layersStateRef.current, measure: next };
            modelRef.current?.traverse((m: any) => {
              if (m.userData?.type === "measure") m.visible = next;
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Medidas
        </button>
        <button
          onClick={() => {
            const [cx, , cz] = centerRef.current;
            cameraRef.current?.position.set(cx, wallHeight * 0.6, cz + 6);
            controlsRef.current?.target.set(cx, wallHeight / 2, cz);
            controlsRef.current?.update();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Fachada N
        </button>
        <button
          onClick={() => {
            const [cx, , cz] = centerRef.current;
            cameraRef.current?.position.set(cx, wallHeight * 0.6, cz - 6);
            controlsRef.current?.target.set(cx, wallHeight / 2, cz);
            controlsRef.current?.update();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Fachada S
        </button>
        <button
          onClick={() => {
            const [cx, , cz] = centerRef.current;
            cameraRef.current?.position.set(cx + 6, wallHeight * 0.6, cz);
            controlsRef.current?.target.set(cx, wallHeight / 2, cz);
            controlsRef.current?.update();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Fachada E
        </button>
        <button
          onClick={() => {
            const [cx, , cz] = centerRef.current;
            cameraRef.current?.position.set(cx - 6, wallHeight * 0.6, cz);
            controlsRef.current?.target.set(cx, wallHeight / 2, cz);
            controlsRef.current?.update();
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Fachada W
        </button>
        <button
          onClick={() => {
            const next = !autoRotateOn;
            autoRotateRef.current = next;
            setAutoRotateOn(next);
            const controls = controlsRef.current;
            if (controls) {
              controls.autoRotate = next;
              controls.autoRotateSpeed = 2.2;
            }
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          {autoRotateOn ? "Recorrido (on)" : "Recorrido automático"}
        </button>
        <button
          onClick={() => {
            setSeason((prev) => {
              const next = (prev + 1) % 7; // Cycle through 0-6
              return next;
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Estaciones: {seasonNames[season]}
        </button>
        <button
          onClick={() => {
            setSeason(6); // Reset to "Fecha actual"
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
          title="Resetear a fecha actual">
          Actualizar
        </button>
        <button
          onClick={() => {
            const next = (window as any).__xray__ !== true;
            (window as any).__xray__ = next;
            modelRef.current?.traverse((m: any) => {
              if (m?.material) {
                if (Array.isArray(m.material)) {
                  m.material.forEach((x: any) => { x.transparent = true; x.opacity = next ? 0.5 : 1; });
                } else {
                  m.material.transparent = true;
                  m.material.opacity = next ? 0.5 : 1;
                }
              }
            });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Modo transparente
        </button>
        <button
          onClick={() => {
            const r = rendererRef.current;
            if (!r) return;
            const url = r.domElement.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = "tusplanos3d-vista-3d.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Exportar PNG
        </button>
        <button
          onClick={() => {
            const next = !doorsOpenRef.current;
            doorHingesRef.current.forEach((entry: any) => {
              entry.hinge.rotation.y = doorsOpenRef.current ? entry.baseYaw : entry.baseYaw + entry.dir * (Math.PI / 2);
            });
            doorsOpenRef.current = next;
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Puertas: abrir/cerrar
        </button>
        <button
          onClick={async () => {
            const group = modelRef.current;
            if (!group) return;
            const mod = await import("three/examples/jsm/exporters/GLTFExporter.js");
            const exporter = new mod.GLTFExporter();
            exporter.parse(group, (result: any) => {
              const payload = JSON.stringify(result, null, 2);
              const blob = new Blob([payload], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "tusplanos3d-vista-3d.gltf";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, null, { binary: false });
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Exportar GLTF
        </button>
      </div>
      <div ref={mountRef} className="relative h-[78vh] min-h-[420px] w-full overflow-hidden border border-line bg-paper-2">
        {!ready && <div className="absolute inset-0 flex items-center justify-center text-muted">Cargando motor 3D...</div>}
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-10">
          {doc.rooms.map((room, index) => (
            <div
              key={room.id}
              ref={(node) => { if (node) roomLabelsRef.current[index] = node; }}
              className="absolute rounded bg-black/55 px-2 py-1 text-xs font-semibold text-white shadow backdrop-blur-sm"
              style={{ transform: "translate(-50%, -50%)", left: 0, top: 0, opacity: 0 }}
            >
              {room.name || "Estancia"}{" "}
              <span className="opacity-80">{Math.round(Math.abs(room.w * room.h) / 10000)} m²</span>
            </div>
          ))}
        </div>
        <div ref={dimXRef} className="absolute rounded bg-blue-600/80 px-2 py-1 text-xs font-bold text-white shadow" style={{ transform: "translate(-50%, -50%)", left: 0, top: 0, opacity: 0 }}>m</div>
        <div ref={dimZRef} className="absolute rounded bg-blue-600/80 px-2 py-1 text-xs font-bold text-white shadow" style={{ transform: "translate(-50%, -50%)", left: 0, top: 0, opacity: 0 }}>m</div>
        <div className="pointer-events-none absolute left-3 bottom-3 rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-xs text-white shadow backdrop-blur-md">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/85">HUD modelo</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <span>Área total</span><span className="text-right font-bold">{(doc.rooms.reduce((a, r) => a + (r.w * r.h) / 10000, 0)).toFixed(1)} m²</span>
            <span>Estancias</span><span className="text-right font-bold">{doc.rooms.length}</span>
            <span>Puertas</span><span className="text-right font-bold">{doc.pieces.filter((p) => p.key === "puerta").length}</span>
            <span>Ventanas</span><span className="text-right font-bold">{doc.pieces.filter((p) => p.key === "ventana").length}</span>
            <span>Mobiliario</span><span className="text-right font-bold">{doc.pieces.filter((p) => p.key !== "puerta" && p.key !== "ventana" && p.key !== "nota").length}</span>
            <span>Anotaciones</span><span className="text-right font-bold">{doc.pieces.filter((p) => p.key === "nota").length}</span>
          </div>
        </div>
        <div ref={selection3DRef} className="absolute rounded bg-black/75 px-3 py-1.5 text-xs font-semibold text-white shadow backdrop-blur-sm" style={{ transform: "translate(-50%, -125%)", left: 0, top: 0, opacity: 0 }}>Pieza</div>
        <div className="pointer-events-none absolute right-3 top-3 h-20 w-20 rounded-full border border-line bg-paper/85 shadow backdrop-blur-sm">
          <div ref={compassRef} className="relative h-full w-full transition-transform duration-75">
            <span className="absolute left-1/2 top-1 text-[10px] font-bold text-ink" style={{ transform: "translateX(-50%)" }}>N</span>
            <span className="absolute right-2 top-1/2 text-[10px] font-bold text-ink" style={{ transform: "translateY(-50%)" }}>E</span>
            <span className="absolute left-1/2 bottom-1 text-[10px] font-bold text-ink" style={{ transform: "translateX(-50%)" }}>S</span>
            <span className="absolute left-2 top-1/2 text-[10px] font-bold text-ink" style={{ transform: "translateY(-50%)" }}>O</span>
            <span className="absolute left-1/2 top-1/2 h-8 w-0.5 bg-orange-500" style={{ transform: "translate(-50%, -100%)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}




