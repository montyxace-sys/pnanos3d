"use client";

import { useEffect, useRef, useState } from "react";

type Room = { id: string; name: string; x: number; y: number; w: number; h: number; wallType?: string };
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
  const dimXRef = useRef<HTMLDivElement>(null);
  const dimZRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const ambientRef = useRef<any>(null);
  const sunRef = useRef<any>(null);
  const isNightRef = useRef<boolean>(false);
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
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambient);
      ambientRef.current = ambient;
      const dir = new THREE.DirectionalLight(0xffffff, 0.6);
      dir.position.set(8, 18, 6);
      scene.add(dir);
      sunRef.current = dir;

      const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8b8476, roughness: 0.9 });
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

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(Math.max(span + 8, 10), Math.max(span + 8, 10)),
        new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 1 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(cosX, 0, cosZ);
      scene.add(floor);

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
              ? new THREE.Mesh(new THREE.BoxGeometry(segLen, wallHeight, thick), wallMaterial)
              : new THREE.Mesh(new THREE.BoxGeometry(thick, wallHeight, segLen), wallMaterial);
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
            ? new THREE.Mesh(new THREE.BoxGeometry(segLen, wallHeight, thick), wallMaterial)
            : new THREE.Mesh(new THREE.BoxGeometry(thick, wallHeight, segLen), wallMaterial);
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
          } else {
            const panel = new THREE.Mesh(
              new THREE.BoxGeometry(horizontal ? width : 0.05, 0.06, horizontal ? 0.05 : width),
              windowMaterial,
            );
            if (horizontal && edge === "bottom") panel.position.set(x + center, wallHeight * 0.72, z + thick / 2);
            if (horizontal && edge === "top") panel.position.set(x + center, wallHeight * 0.72, z + h - thick / 2);
            if (!horizontal && edge === "left") panel.position.set(x + thick / 2, wallHeight * 0.72, z + center);
            if (!horizontal && edge === "right") panel.position.set(x + w - thick / 2, wallHeight * 0.72, z + center);
            model.add(panel);
          }
        });
      };

      const roomColors = [0xf5f0e6, 0xeaf0f8, 0xf6efe7, 0xf0f3e8, 0xf8f2ef];
      rooms.forEach((room, idx) => {
        const x = room.x / 100, z = room.y / 100, w = room.w / 100, h = room.h / 100;
        const color = roomColors[idx % roomColors.length];
        const rfloor = new THREE.Mesh(
          new THREE.PlaneGeometry(w - wallTypeThick(room.wallType) * 2, h - wallTypeThick(room.wallType) * 2),
          new THREE.MeshStandardMaterial({ color, roughness: 0.95 }),
        );
        rfloor.rotation.x = -Math.PI / 2;
        rfloor.position.set(x + w / 2, 0.015, z + h / 2);
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
          if (p.key === "nota") {
            const txt = p.text || "Texto";
            const fontPx = Math.max(12, Math.min(48, (p.textSize ?? 16) * 3));
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext("2d");
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
          model.add(mesh);
        });

      const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x9e3e22, roughness: 0.85 });
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
      model.add(roof);
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(roofWidth, 0.12, 0.18), new THREE.MeshStandardMaterial({ color: 0x7f2f19, roughness: 0.8 }));
      ridge.position.set(cosX, wallHeight + rise + 0.06, cosZ);
      ridge.rotation.y = Math.PI / 2;
      model.add(ridge);
      const guideMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
      const guideX = new THREE.Mesh(new THREE.BoxGeometry((bounds.maxx-bounds.minx)+0.4, 0.03, 0.03), guideMat);
      guideX.position.set(cosX, 0.05, bounds.minz - 1.2);
      model.add(guideX);
      const guideZ = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, (bounds.maxz-bounds.minz)+0.4), guideMat);
      guideZ.position.set(bounds.minx - 1.2, 0.05, cosZ);
      model.add(guideZ);
      const measureGroup = new THREE.Group();
      model.add(measureGroup);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x2563eb });
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2563eb, linewidth: 2 });
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

      const handleMeasureClick = (event: MouseEvent) => {
        if (!measureMode.current) return;
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
        marker.position.copy(p);
        measureGroup.add(marker);
        measurePointsRef.current.push(p);
        if (measurePointsRef.current.length === 2) {
          const p0 = measurePointsRef.current[0];
          const p1 = measurePointsRef.current[1];
          const geom = new THREE.BufferGeometry().setFromPoints([p0, p1]);
          const line = new THREE.Line(geom, lineMaterial);
          measureGroup.add(line);
          const distance = p0.distanceTo(p1);
          const canvas = document.createElement("canvas");
          canvas.width = 256;
          canvas.height = 64;
          const ctx = canvas.getContext("2d");
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

      centerRef.current = [cosX, 0.5, cosZ];


      camera.position.set(cosX + span * 0.8, span * 1.15, cosZ + span * 0.8);
      camera.lookAt(cosX, 0.5, cosZ);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(cosX, 0.5, cosZ);
      controls.enableDamping = true;
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
        updateLabels();
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
        Modelo arquitectónico extruido a 2,5 m con paredes huecas, puertas y ventanas recortadas. Ratón/touch para orbitar.
      </p>
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
            const ambient = ambientRef.current;
            if (ambient) {
              ambient.intensity = night ? 0.2 : 0.8;
            }
            const sun = sunRef.current;
            if (sun) {
              sun.intensity = night ? 0.2 : 0.6;
              sun.color.setHex(night ? 0xfde68a : 0xffffff);
            }
          }}
          className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink hover:bg-paper-2"
        >
          Día / Noche
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
      </div>
    </div>
  );
}




