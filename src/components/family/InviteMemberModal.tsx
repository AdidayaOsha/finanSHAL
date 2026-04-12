"use client";

import { useState, useTransition } from "react";
import { UserPlus, X, Copy, Check } from "lucide-react";

interface InviteMemberModalProps {
  familyId: string;
}

export default function InviteMemberModal({ familyId }: InviteMemberModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const res = await fetch("/api/family/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined }),
      });
      const data = await res.json();
      setInviteUrl(data.inviteUrl ?? "");
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <UserPlus className="h-4 w-4" />
        Undang Anggota
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800">
                Undang Anggota Keluarga
              </h2>
              <button
                onClick={() => {
                  setOpen(false);
                  setInviteUrl("");
                  setEmail("");
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email (opsional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anggota@email.com"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Kosongkan untuk membuat link undangan umum
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isPending}
                className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 text-sm"
              >
                {isPending ? "Membuat link..." : "Buat Link Undangan"}
              </button>

              {inviteUrl && (
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Link undangan (berlaku 7 hari):
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={inviteUrl}
                      className="flex-1 text-xs bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-700 truncate"
                    />
                    <button
                      onClick={handleCopy}
                      className="shrink-0 p-1.5 text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    Bagikan link ini ke anggota keluarga Anda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
