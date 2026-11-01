import PlanEditor from "@/components/plano/PlanEditor";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6">
      <header className="mb-6 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/logo.svg"
          alt="TusPlanos3D"
          width={205}
          height={50}
          className="h-10 w-auto brightness-125 contrast-125"
        />
        <h1 className="text-xl font-bold text-orange-400">Generador de Planos</h1>
      </header>
      <PlanEditor />
    </main>
  );
}
