import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de TusPlanos3D con Google para guardar y recuperar tus planos.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
