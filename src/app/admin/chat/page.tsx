"use client";

import AdminChat from "@/components/AdminChat";

export default function AdminChatPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-ink">
      <h1 className="text-3xl font-bold mb-6">Chat de soporte (admin)</h1>
      <AdminChat />
    </div>
  );
}