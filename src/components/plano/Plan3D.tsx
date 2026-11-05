"use client";

import { useEffect, useRef, useState } from "react";

type Room = { id: string; name: string; x: number; y: number; w: number; h: number; wallType?: string };
type Piece = { id: string; key: string; x: number; y: number; w: number; h: number; rot: number };
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
const wallThick = 0.2;

function wallTypeThick(t?: string): number {
  if (t === "tabique" || t === "pladur") return 0.12;
  if (t === "aluminio") return 0.15;
  return 0.25;
}

export default function Plan3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PlanDoc>(loadDoc);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDoc(loadDoc());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!mountRef.current) return;
    let rafId = 0;
    const container = mountRef.current;
    // Lazy load three to avoid SSR issues
    let THREE: typeof import("three");
    let OrbitControls: any;
    let renderer: any;
    let scene: any;
    let camera: any;
    let controls: any;
    const groups: any[] = [];

    (async () => {
      THREE = await import("three");
      const OrbitModule = await import("three/examples/jsm/controls/OrbitControls.js");
      OrbitControls = OrbitModule.OrbitControls;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0ede6);
      camera = new THREE.PerspectiveCamera(60, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      // lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.45);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 1);
      dir.position.set(8, 18, 6);
      scene.add(dir);

      // materials
      const floorMat = new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 0.9 });
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x5e5a52, roughness: 0.85 });
      const pieceMat = new THREE.MeshStandardMaterial({ color: 0xf6821f, roughness: 0.7 });

      // compute bounds
      const rooms = doc.rooms || [];
      const bounds = {
        minx: 0,
        minz: 0,
        maxx: 0,
        maxz: 0,
        initialized: false,
      };
      rooms.forEach((r) => {
        const x = r.x / 100, z = r.y / 100, w = r.w / 100, h = r.h / 100;
        if (!bounds.initialized) { bounds.minx=x; bounds.maxx=x+w; bounds.minz=z; bounds.maxz=z+h; bounds.initialized=true; }
        bounds.minx = Math.min(bounds.minx, x); bounds.maxx = Math.max(bounds.maxx, x+w);
        bounds.minz = Math.min(bounds.minz, z); bounds.maxz = Math.max(bounds.maxz, z+h);
      });
      if (!bounds.initialized) { bounds.minx=-2; bounds.maxx=2; bounds.minz=-2; bounds.maxz=2;bounds.initialized=true; }
      const pad = 1;
      const cx = (bounds.minx + bounds.maxx) / 2;
      const cz = (bounds.minz + bounds.maxz) / 2;
      const span = Math.max(bounds.maxx - bounds.minx, bounds.maxz - bounds.minz) + pad * 2;

      // ground
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(span + 4, span + 4), new THREE.MeshStandardMaterial({ color: 0xebe4d7, roughness: 1 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(cx, 0, cz);
      scene.add(floor);

      // walls per room
      const THICK = (room: Room) => (room.wallType === "tabique" || room.wallType === "pladur" ? 0.12 : 0.25) * (1 / 1); // meters
      rooms.forEach((r) => {
        const x = r.x / 100, z = r.y / 100, w = r.w / 100, h = r.h / 100;
        const thick = wallTypeThick(r.wallType);
        // bottom wall
        const bw = new THREE.Mesh(new THREE.BoxGeometry(w, wallHeight, thick), wallMat);
        bw.position.set(x + w/2, wallHeight/2, z + thick/2);
        scene.add(bw);
        // top wall
        const tw = new THREE.Mesh(new THREE.BoxGeometry(w, wallHeight, thick), wallMat);
        tw.position.set(x + w/2, wallHeight/2, z + h - thick/2);
        scene.add(tw);
        // left
        const lw = new THREE.Mesh(new THREE.BoxGeometry(thick, wallHeight, h - thick*2), wallMat);
        lw.position.set(x + thick/2, wallHeight/2, z + h/2);
        scene.add(lw);
        // right
        const rw = new THREE.Mesh(new THREE.BoxGeometry(thick, wallHeight, h - thick*2), wallMat);
        rw.position.set(x + w - thick/2, wallHeight/2, z + h/2);
        scene.add(rw);
      });

      // piece blockers: doors/windows cut? Render as thin panels in walls
      doc.pieces?.forEach((p) => {
        const px = p.x / 100, pz = p.y / 100;
        const w = p.w/100, h = p.h/100;
        const angle = (p.rot * Math.PI) / 180;
        const isDoor = p.key === "puerta";
        const isWindow = p.key === "ventana";
        // door fill
        if (isDoor) {
          const dm = new THREE.Group();
          const one = new THREE.Mesh(new THREE.BoxGeometry(0.03, wallHeight*0.8, Math.max(0.03,w)), pieceMat);
          one.position.set(0, wallHeight*0.4, 0);
          dm.add(one);
          dm.position.set(px, 0, pz);
          dm.rotation.y = angle;
          dm.position.y = 0;
          scene.add(dm);
        } else if (isWindow) {
          const gm = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.05, w), 0.05, Math.max(0.05, h)), new THREE.MeshStandardMaterial({ color: 0x4fa3db, opacity:0.5, transparent: true }));
          gm.position.set(px, wallHeight*0.7, pz);
          gm.rotation.y = angle;
          scene.add(gm);
        } else {
          // furniture prism
          const g = new THREE.Group();
          const hh = 0.9;
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, hh, h), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }));
          mesh.position.set(-w/2, hh/2, -h/2);
          g.add(mesh);
          g.position.set(px, 0, pz);
          g.rotation.y = angle;
          scene.add(g);
        }
      });

      // camera fit
      camera.position.set(cx + span*0.8, span*1.3, cz + span*0.8);
      camera.lookAt(cx, 0.5, cz);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(cx, 0.5, cz);
      controls.enableDamping = true;

      const onResize = () => {
        if (!container) return;
        const ncw = container.clientWidth, nch = container.clientHeight;
        camera.aspect = ncw / Math.max(nch, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(ncw, nch);
      };
      window.addEventListener("resize", onResize);

      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };
      animate();

      // cleanup attach via mutable object
      (container as any).__threeCleanup__ = () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(rafId);
        controls?.dispose();
        renderer?.dispose();
        if (renderer?.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
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
        Vista simplificada del plano guardado en el navegador (extruido 2,5 m + muebles). Sólo crea o carga un plano desde el
        generador y aquí se verá en 3D.
      </p>
      <div ref={mountRef} className="relative mb-10 h-[70vh] min-h-[420px] w-full overflow-hidden border border-line bg-paper-2">
        {!ready && <div className="absolute inset-0 flex items-center justify-center text-muted">Cargando motor 3D...</div>}
      </div>
    </div>
  );
}