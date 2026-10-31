import type { Metadata } from "next";
import ClimatizacionClient from "./ClimatizacionClient";

export const metadata: Metadata = {
  title: "Climatizacion minima",
  description: "Calcula la potencia de climatizacion recomendada segun superficie y condiciones.",
};

export default function Page() {
  return <ClimatizacionClient />;
}
