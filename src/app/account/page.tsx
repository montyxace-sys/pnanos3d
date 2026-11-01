import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Gestiona tu cuenta de TusPlanos3D: planos guardados y sesión.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountClient />;
}
