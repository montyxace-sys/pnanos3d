"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import type { PlanDoc } from "@/lib/plano/types";
import { exampleDoc, loadDoc } from "@/lib/plano/store";
import { buildPiece } from "@/lib/plano/furniture3d";
import {
  FLOOR_OPTIONS,
  FLOOR_TILE_METERS,
  GRASS_TILE_METERS,
  TILE_SIZE_METERS,
  isWetRoom,
  makeFloorTexture,
  makeGrassTexture,
  makeTileTexture,
  resolveFloor,
  wetWallHeight,
  type FloorFinish,
} from "@/lib/plano/finishes";

type Edge = "bottom" | "top" | "left" | "right";

const wallHeight = 2.5;

function wallTypeThick(t?: string): number {
  if (t === "tabique" || t === "pladur") return 0.12;
  if (t === "aluminio") return 0.15;
  return 0.3;
}

export default function Plan3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PlanDoc | null>(null);
  const [ready, setReady] = useState(false);
  const [floorFinish, setFloorFinish] = useState<FloorFinish>("auto");
  const [showTiles, setShowTiles] = useState(true);

  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const homeRef = useRef<{ p: [number, number, number]; c: [number, number, number] } | null>(null);
  const doorHingesRef = useRef<Array<{ hinge: any; baseYaw: number; swing: number }>>([]);
  const doorsOpenRef = useRef(false);
  const roomLabelsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    setDoc(loadDoc() ?? exampleDoc());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !doc || !mountRef.current) return;
    const container = mountRef.current;
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      const OrbitModule = await import("three/examples/jsm/controls/OrbitControls.js");
      const OrbitControls = OrbitModule.OrbitControls;
      if (cancelled) return;

      const scene = new THREE.Scene();
      const skyCanvas = document.createElement("canvas");
      skyCanvas.width = 16;
      skyCanvas.height = 256;
      const skyCtx = skyCanvas.getContext("2d");
      if (skyCtx) {
        const grad = skyCtx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, "#7fb4dc");
        grad.addColorStop(0.55, "#cfe2ef");
        grad.addColorStop(1, "#e9eff1");
        skyCtx.fillStyle = grad;
        skyCtx.fillRect(0, 0, 16, 256);
        const skyTexture = new THREE.CanvasTexture(skyCanvas);
        skyTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = skyTexture;
      } else {
        scene.background = new THREE.Color(0xece8df);
      }

      const camera = new THREE.PerspectiveCamera(
        55,
        container.clientWidth / Math.max(container.clientHeight, 1),
        0.1,
        400,
      );

      const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.92;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.4;
      pmrem.dispose();

      const model = new THREE.Group();
      scene.add(model);
      modelRef.current = model;

      const rooms = doc.rooms.length
        ? doc.rooms
        : [{ id: "demo", name: "Estancia", x: 0, y: 0, w: 420, h: 350, wallType: "carga" }];

      const bounds = { minx: 0, minz: 0, maxx: 0, maxz: 0, initialized: false };
      rooms.forEach((r) => {
        const x = r.x / 100;
        const z = r.y / 100;
        const w = r.w / 100;
        const h = r.h / 100;
        if (!bounds.initialized) {
          bounds.minx = x;
          bounds.maxx = x + w;
          bounds.minz = z;
          bounds.maxz = z + h;
          bounds.initialized = true;
        }
        bounds.minx = Math.min(bounds.minx, x);
        bounds.maxx = Math.max(bounds.maxx, x + w);
        bounds.minz = Math.min(bounds.minz, z);
        bounds.maxz = Math.max(bounds.maxz, z + h);
      });
      (doc.pieces || []).forEach((p) => {
        if (p.key === "puerta" || p.key === "ventana") return;
        const rad = (p.rot * Math.PI) / 180;
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        const halfW = ((p.w / 2) * cos + (p.h / 2) * sin) / 100;
        const halfH = ((p.w / 2) * sin + (p.h / 2) * cos) / 100;
        const px = p.x / 100;
        const pz = p.y / 100;
        bounds.minx = Math.min(bounds.minx, px - halfW);
        bounds.maxx = Math.max(bounds.maxx, px + halfW);
        bounds.minz = Math.min(bounds.minz, pz - halfH);
        bounds.maxz = Math.max(bounds.maxz, pz + halfH);
      });
      const house = {
        minx: rooms.reduce((min, r) => Math.min(min, r.x / 100), Infinity),
        maxx: rooms.reduce((max, r) => Math.max(max, r.x / 100 + r.w / 100), -Infinity),
        minz: rooms.reduce((min, r) => Math.min(min, r.y / 100), Infinity),
        maxz: rooms.reduce((max, r) => Math.max(max, r.y / 100 + r.h / 100), -Infinity),
      };
      const span = Math.max(bounds.maxx - bounds.minx, bounds.maxz - bounds.minz, 3);
      const cx = (bounds.minx + bounds.maxx) / 2;
      const cz = (bounds.minz + bounds.maxz) / 2;

      scene.fog = new THREE.Fog(0xe8eef0, span * 4.5, span * 11);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xc7bda9, 0.45));
      scene.add(new THREE.AmbientLight(0xffffff, 0.25));
      const sun = new THREE.DirectionalLight(0xfff1dc, 1.2);
      // El sol entra desde el mismo lado que la cámara para que los interiores no queden en sombra.
      sun.position.set(cx + span * 0.55, span * 1.6, cz + span * 0.6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -span;
      sun.shadow.camera.right = span;
      sun.shadow.camera.top = span;
      sun.shadow.camera.bottom = -span;
      sun.shadow.camera.near = 0.5;
      sun.shadow.camera.far = span * 4.5;
      sun.shadow.bias = -0.0005;
      sun.shadow.normalBias = 0.02;
      sun.target.position.set(cx, 0, cz);
      scene.add(sun);
      scene.add(sun.target);

      const groundSize = span * 10;
      const grassTexture = makeGrassTexture(THREE);
      grassTexture.repeat.set(groundSize / GRASS_TILE_METERS, groundSize / GRASS_TILE_METERS);
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(groundSize, groundSize),
        new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 0.96 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(cx, -0.03, cz);
      ground.receiveShadow = true;
      scene.add(ground);

      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(house.maxx - house.minx + 0.4, 0.12, house.maxz - house.minz + 0.4),
        new THREE.MeshStandardMaterial({ color: 0xcfc8ba, roughness: 1 }),
      );
      slab.position.set((house.minx + house.maxx) / 2, -0.06, (house.minz + house.maxz) / 2);
      slab.receiveShadow = true;
      model.add(slab);

      const plaster = new THREE.MeshStandardMaterial({ color: 0xefeae1, roughness: 0.95 });
      const skirtingMat = new THREE.MeshStandardMaterial({ color: 0xf7f5f0, roughness: 0.7 });
      const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0xe9e4da, roughness: 0.65 });
      const trimMat = new THREE.MeshStandardMaterial({ color: 0xd9d3c7, roughness: 0.7 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8dde2, roughness: 0.18, metalness: 0.9 });
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xbfe3ee,
        transparent: true,
        opacity: 0.3,
        roughness: 0.05,
        metalness: 0,
        side: THREE.DoubleSide,
      });

      const floorBase = new Map<string, any>();
      const tileBase = makeTileTexture(THREE);

      rooms.forEach((room) => {
        const finish = resolveFloor(room.name, floorFinish);
        if (!floorBase.has(finish)) floorBase.set(finish, makeFloorTexture(THREE, finish));
        const map = floorBase.get(finish).clone();
        map.needsUpdate = true;
        const w = room.w / 100;
        const d = room.h / 100;
        map.repeat.set(Math.max(w, 0.5) / FLOOR_TILE_METERS, Math.max(d, 0.5) / FLOOR_TILE_METERS);
        const floor = new THREE.Mesh(
          new THREE.PlaneGeometry(w, d),
          new THREE.MeshStandardMaterial({
            map,
            roughness: finish === "porcelanico" || finish === "marmol" ? 0.55 : 0.94,
            metalness: finish === "marmol" ? 0.05 : 0,
            envMapIntensity: 0.3,
          }),
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(room.x / 100 + w / 2, 0.03, room.y / 100 + d / 2);
        floor.receiveShadow = true;
        model.add(floor);
      });

      const openings = (doc.pieces || []).filter((p) => p.key === "puerta" || p.key === "ventana");
      const consumed = new Set<string>();
      const doorHinges: Array<{ hinge: any; baseYaw: number; swing: number }> = [];

      const buildWall = (
        room: { id: string; name: string; x: number; y: number; w: number; h: number; wallType?: string },
        edge: Edge,
      ) => {
        const x = room.x / 100;
        const z = room.y / 100;
        const w = room.w / 100;
        const h = room.h / 100;
        const thick = wallTypeThick(room.wallType);
        const horizontal = edge === "bottom" || edge === "top";
        const len = horizontal ? w : h;
        const wallZ = edge === "bottom" ? z : z + h;
        const wallX = edge === "left" ? x : x + w;
        const tileHeight = wetWallHeight(room.name);
        const wet = isWetRoom(room.name);

        const local = openings
          .map((p) => {
            const px = p.x / 100;
            const pz = p.y / 100;
            const rot = ((p.rot % 180) + 180) % 180;
            const pw = p.w / 100;
            const ph = p.h / 100;
            const along = horizontal
              ? rot > 45 && rot < 135
                ? ph
                : pw
              : rot > 45 && rot < 135
                ? pw
                : ph;
            if (horizontal) {
              if (Math.abs(pz - wallZ) > 0.3) return null;
              if (px < x - 0.05 || px > x + w + 0.05) return null;
              return { s: Math.max(0, px - along / 2 - x), e: Math.min(len, px + along / 2 - x), piece: p };
            }
            if (Math.abs(px - wallX) > 0.3) return null;
            if (pz < z - 0.05 || pz > z + h + 0.05) return null;
            return { s: Math.max(0, pz - along / 2 - z), e: Math.min(len, pz + along / 2 - z), piece: p };
          })
          .filter(Boolean) as Array<{ s: number; e: number; piece: (typeof openings)[number] }>;

        local.sort((a, b) => a.s - b.s);
        const merged: typeof local = [];
        local.forEach((o) => {
          if (o.e - o.s < 0.05) return;
          const last = merged[merged.length - 1];
          if (last && o.s <= last.e + 0.02) {
            last.s = Math.min(last.s, o.s);
            last.e = Math.max(last.e, o.e);
          } else {
            merged.push({ ...o });
          }
        });

        const centerAt = (from: number, to: number) => from + (to - from) / 2;

        const addWallBox = (
          from: number,
          to: number,
          y: number,
          height: number,
          depth: number,
          material: THREE_NS.Material,
        ) => {
          const seg = horizontal
            ? new THREE.Mesh(new THREE.BoxGeometry(to - from, height, depth), material)
            : new THREE.Mesh(new THREE.BoxGeometry(depth, height, to - from), material);
          const mid = centerAt(from, to);
          if (edge === "bottom") seg.position.set(x + mid, y, z + depth / 2);
          if (edge === "top") seg.position.set(x + mid, y, z + h - depth / 2);
          if (edge === "left") seg.position.set(x + depth / 2, y, z + mid);
          if (edge === "right") seg.position.set(x + w - depth / 2, y, z + mid);
          seg.castShadow = true;
          seg.receiveShadow = true;
          model.add(seg);
        };

        const addSurface = (
          from: number,
          to: number,
          material: THREE_NS.Material,
          height: number,
          offset: number,
          y: number,
        ) => {
          const seg = horizontal
            ? new THREE.Mesh(new THREE.BoxGeometry(to - from, height, 0.018), material)
            : new THREE.Mesh(new THREE.BoxGeometry(0.018, height, to - from), material);
          const mid = centerAt(from, to);
          if (edge === "bottom") seg.position.set(x + mid, y, z + thick + offset);
          if (edge === "top") seg.position.set(x + mid, y, z + h - thick - offset);
          if (edge === "left") seg.position.set(x + thick + offset, y, z + mid);
          if (edge === "right") seg.position.set(x + w - thick - offset, y, z + mid);
          seg.receiveShadow = true;
          model.add(seg);
        };

        const addTiles = (from: number, to: number) => {
          if (!showTiles || !wet || to - from < 0.1) return;
          const map = tileBase.clone();
          map.needsUpdate = true;
          map.repeat.set((to - from) / TILE_SIZE_METERS, tileHeight / TILE_SIZE_METERS);
          const material = new THREE.MeshStandardMaterial({ map, roughness: 0.3 });
          addSurface(from, to, material, tileHeight, 0.012, tileHeight / 2);
        };

        let cursor = 0;
        merged.forEach((o) => {
          if (o.s - cursor > 0.02) {
            addWallBox(cursor, o.s, wallHeight / 2, wallHeight, thick, plaster);
            addTiles(cursor, o.s);
            if (!wet) addSurface(cursor, o.s, skirtingMat, 0.075, 0.012, 0.038);
          }
          cursor = Math.max(cursor, o.e);
        });
        if (len - cursor > 0.02) {
          addWallBox(cursor, len, wallHeight / 2, wallHeight, thick, plaster);
          addTiles(cursor, len);
          if (!wet) addSurface(cursor, len, skirtingMat, 0.075, 0.012, 0.038);
        }

        merged.forEach((o) => {
          const width = o.e - o.s;
          const center = centerAt(o.s, o.e);
          // Un mismo hueco pertenece a dos estancias: solo la primera construye marco y hoja.
          const alreadyBuilt = !!o.piece.id && consumed.has(o.piece.id);
          if (o.piece.id) consumed.add(o.piece.id);
          const isDoor = o.piece.key === "puerta";
          const place = (obj: any, along: number, y: number, depthOffset: number) => {
            if (edge === "bottom") obj.position.set(x + along, y, z + depthOffset);
            if (edge === "top") obj.position.set(x + along, y, z + h - depthOffset);
            if (edge === "left") obj.position.set(x + depthOffset, y, z + along);
            if (edge === "right") obj.position.set(x + w - depthOffset, y, z + along);
          };

          if (isDoor) {
            addWallBox(o.s, o.e, (wallHeight + 2.08) / 2, wallHeight - 2.08, thick, plaster);
            if (alreadyBuilt) return;
            const jamb = 0.045;
            for (const at of [o.s + jamb / 2, o.e - jamb / 2]) {
              const frame = horizontal
                ? new THREE.Mesh(new THREE.BoxGeometry(jamb, 2.08, thick + 0.02), trimMat)
                : new THREE.Mesh(new THREE.BoxGeometry(thick + 0.02, 2.08, jamb), trimMat);
              place(frame, at, 1.04, thick / 2);
              frame.castShadow = true;
              model.add(frame);
            }
            const lintel = horizontal
              ? new THREE.Mesh(new THREE.BoxGeometry(width, 0.05, thick + 0.03), trimMat)
              : new THREE.Mesh(new THREE.BoxGeometry(thick + 0.03, 0.05, width), trimMat);
            place(lintel, center, 2.06, thick / 2);
            model.add(lintel);

            const hinge = new THREE.Group();
            const leafWidth = Math.max(width * 0.96, 0.35);
            const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafWidth, 2.05, 0.045), doorLeafMat);
            leaf.position.set(leafWidth / 2, 2.05 / 2, 0);
            leaf.castShadow = true;
            leaf.receiveShadow = true;
            hinge.add(leaf);
            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.028, 14, 14), chromeMat);
            knob.position.set(leafWidth - 0.08, 1.02, 0.05);
            knob.castShadow = true;
            hinge.add(knob);
            const baseYaw = horizontal ? 0 : -Math.PI / 2;
            const swing = edge === "bottom" || edge === "right" ? -Math.PI * 0.46 : Math.PI * 0.46;
            hinge.rotation.y = baseYaw;
            place(hinge, o.s, 0, thick / 2);
            model.add(hinge);
            doorHinges.push({ hinge, baseYaw, swing });
          } else {
            const sill = 0.9;
            const top = 2.2;
            addWallBox(o.s, o.e, sill / 2, sill, thick, plaster);
            addWallBox(o.s, o.e, (wallHeight + top) / 2, wallHeight - top, thick, plaster);
            if (alreadyBuilt) return;

            const glass = horizontal
              ? new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, top - sill, 0.02), glassMat)
              : new THREE.Mesh(new THREE.BoxGeometry(0.02, top - sill, width - 0.08), glassMat);
            place(glass, center, (sill + top) / 2, thick / 2);
            model.add(glass);

            const bar = 0.045;
            const parts: any[] = [];
            for (const at of [o.s + bar / 2, o.e - bar / 2]) {
              const frame = horizontal
                ? new THREE.Mesh(new THREE.BoxGeometry(bar, top - sill, 0.06), trimMat)
                : new THREE.Mesh(new THREE.BoxGeometry(0.06, top - sill, bar), trimMat);
              place(frame, at, (sill + top) / 2, thick / 2);
              parts.push(frame);
            }
            for (const y of [sill + bar / 2, top - bar / 2]) {
              const rail = horizontal
                ? new THREE.Mesh(new THREE.BoxGeometry(width - bar * 2, bar, 0.06), trimMat)
                : new THREE.Mesh(new THREE.BoxGeometry(0.06, bar, width - bar * 2), trimMat);
              place(rail, center, y, thick / 2);
              parts.push(rail);
            }
            const mullion = horizontal
              ? new THREE.Mesh(new THREE.BoxGeometry(0.03, top - sill, 0.05), trimMat)
              : new THREE.Mesh(new THREE.BoxGeometry(0.05, top - sill, 0.03), trimMat);
            place(mullion, center, (sill + top) / 2, thick / 2);
            parts.push(mullion);
            const board = horizontal
              ? new THREE.Mesh(new THREE.BoxGeometry(width + 0.06, 0.035, thick + 0.1), skirtingMat)
              : new THREE.Mesh(new THREE.BoxGeometry(thick + 0.1, 0.035, width + 0.06), skirtingMat);
            place(board, center, sill - 0.02, thick / 2);
            parts.push(board);
            parts.forEach((mesh) => {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              model.add(mesh);
            });
          }
        });
      };

      const edges: Edge[] = ["bottom", "top", "left", "right"];
      rooms.forEach((room) => edges.forEach((edge) => buildWall(room, edge)));

      const addLooseOpening = (p: (typeof openings)[number]) => {
        if (consumed.has(p.id)) return;
        const w = p.w / 100;
        const angle = (-p.rot * Math.PI) / 180;
        if (p.key === "puerta") {
          const leaf = new THREE.Mesh(new THREE.BoxGeometry(w, 2.05, 0.05), doorLeafMat);
          leaf.position.set(p.x / 100, 1.025, p.y / 100);
          leaf.rotation.y = angle;
          leaf.castShadow = true;
          leaf.receiveShadow = true;
          model.add(leaf);
        } else {
          const pane = new THREE.Mesh(new THREE.BoxGeometry(w, 1.25, 0.03), glassMat);
          pane.position.set(p.x / 100, 1.55, p.y / 100);
          pane.rotation.y = angle;
          model.add(pane);
        }
      };
      openings.forEach(addLooseOpening);

      (doc.pieces || []).forEach((p) => {
        if (p.key === "puerta" || p.key === "ventana") return;
        const piece = buildPiece(THREE, p.key, p.w / 100, p.h / 100);
        if (!piece) return;
        piece.position.set(p.x / 100, 0, p.y / 100);
        piece.rotation.y = (-p.rot * Math.PI) / 180;
        model.add(piece);
      });

      doorHingesRef.current = doorHinges;
      doorsOpenRef.current = false;

      const homePos: [number, number, number] = [cx + span * 0.78, span * 0.98 + 1.4, cz + span * 0.9];
      const homeTarget: [number, number, number] = [cx, 0.8, cz];
      homeRef.current = { p: homePos, c: homeTarget };
      camera.position.set(...homePos);
      camera.lookAt(...homeTarget);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(...homeTarget);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 1.2;
      controls.maxDistance = span * 3;
      controls.maxPolarAngle = Math.PI / 2.04;
      controls.update();
      cameraRef.current = camera;
      controlsRef.current = controls;

      const onResize = () => {
        camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", onResize);

      const labelElements = roomLabelsRef.current;
      const updateLabels = () => {
        const interiorView = camera.position.y < 2.3;
        labelElements.forEach((label, index) => {
          const room = doc.rooms[index];
          if (!label) return;
          if (!room || interiorView) {
            label.style.opacity = "0";
            return;
          }
          const v = new THREE.Vector3((room.x + room.w / 2) / 100, 0.4, (room.y + room.h / 2) / 100);
          v.project(camera);
          if (v.z > 1 || v.z < -1) {
            label.style.opacity = "0";
            return;
          }
          label.style.opacity = "1";
          label.style.left = `${(v.x * 0.5 + 0.5) * container.clientWidth}px`;
          label.style.top = `${(v.y * -0.5 + 0.5) * container.clientHeight}px`;
        });
      };

      let raf = 0;
      const animate = () => {
        controls.update();
        updateLabels();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      const cleanup = () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
      (container as any).__threeCleanup__ = cleanup;
    })();

    return () => {
      cancelled = true;
      if ((container as any).__threeCleanup__) {
        (container as any).__threeCleanup__();
        (container as any).__threeCleanup__ = null;
      }
    };
  }, [ready, doc, floorFinish, showTiles]);

  function moveCamera(position: [number, number, number], target: [number, number, number]) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.set(...position);
    controls.target.set(...target);
    controls.update();
  }

  function applyDoorState(open: boolean) {
    doorsOpenRef.current = open;
    doorHingesRef.current.forEach((entry) => {
      entry.hinge.rotation.y = open ? entry.baseYaw + entry.swing : entry.baseYaw;
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 text-ink">
      <header className="mb-3 flex items-center gap-3">
        <a href="/" aria-label="Volver al inicio" className="flex items-center gap-2">
          <img src="/img/logo.svg" alt="tusplanos3d.es" width={205} height={50} className="h-8 w-auto" />
        </a>
        <h1 className="text-xl font-bold text-accent">Vista 3D del plano</h1>
      </header>
      <p className="mb-4 text-sm text-muted">
        Interior y exterior: suelos, alicatados, césped, piscina, vegetación, puertas, ventanas y mobiliario. Arrastra para orbitar y usa la rueda para acercarte.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase text-ink">
          Suelo
          <select
            value={floorFinish}
            onChange={(e) => setFloorFinish(e.target.value as FloorFinish)}
            className="rounded border border-line bg-paper px-2 py-1.5 text-xs font-medium normal-case text-ink"
          >
            {FLOOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink">
          <input
            type="checkbox"
            checked={showTiles}
            onChange={(e) => setShowTiles(e.target.checked)}
            className="accent-orange-500"
          />
          Alicatado
        </label>
        <button
          onClick={() => {
            const home = homeRef.current;
            if (home) moveCamera(home.p, home.c);
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Isométrico
        </button>
        <button
          onClick={() => {
            const home = homeRef.current;
            if (!home) return;
            moveCamera([home.c[0], home.c[1] + Math.max(6, home.p[1] * 1.1), home.c[2] + 0.01], home.c);
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Planta
        </button>
        <button
          onClick={() => {
            const home = homeRef.current;
            if (!home) return;
            moveCamera(
              [home.c[0], 1.7, home.c[2] + Math.abs(home.p[2] - home.c[2]) * 1.25],
              [home.c[0], 1.0, home.c[2]],
            );
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Frontal
        </button>
        <button
          onClick={() => {
            const roomsList = doc?.rooms ?? [];
            if (!roomsList.length) return;
            const room = roomsList.reduce((a, b) => (a.w * a.h >= b.w * b.h ? a : b));
            const x = room.x / 100;
            const z = room.y / 100;
            const w = room.w / 100;
            const d = room.h / 100;
            const insetX = Math.min(0.7, w * 0.16);
            const insetZ = Math.min(0.7, d * 0.16);
            moveCamera([x + insetX, 1.62, z + d - insetZ], [x + w / 2, 1.1, z + d / 2]);
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Personado
        </button>
        <button
          onClick={() => applyDoorState(!doorsOpenRef.current)}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Puertas
        </button>
        <button
          onClick={() => {
            const renderer = rendererRef.current;
            if (!renderer) return;
            const url = renderer.domElement.toDataURL("image/png");
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
          onClick={async () => {
            const group = modelRef.current;
            if (!group) return;
            const mod = await import("three/examples/jsm/exporters/GLTFExporter.js");
            const exporter = new mod.GLTFExporter();
            exporter.parse(
              group,
              (result: any) => {
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
              },
              (error: any) => console.error(error),
              { binary: false },
            );
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Exportar GLTF
        </button>
      </div>

      <div ref={mountRef} className="relative h-[78vh] min-h-[420px] w-full overflow-hidden border border-line bg-paper-2">
        {!ready && <div className="absolute inset-0 flex items-center justify-center text-muted">Cargando motor 3D...</div>}
        <div className="pointer-events-none absolute inset-0 z-10">
          {(doc?.rooms ?? []).map((room, index) => (
            <div
              key={room.id}
              ref={(node) => {
                if (node) roomLabelsRef.current[index] = node;
              }}
              className="absolute rounded bg-black/55 px-2 py-1 text-xs font-semibold text-white shadow backdrop-blur-sm"
              style={{ transform: "translate(-50%, -50%)", left: 0, top: 0, opacity: 0 }}
            >
              {room.name || "Estancia"}{" "}
              <span className="opacity-80">{Math.round(Math.abs(room.w * room.h) / 10000)} m²</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
