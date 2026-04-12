import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginButton from "@/components/auth/LoginButton";
import { MessageCircle, BarChart3, Users, Shield } from "lucide-react";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo & Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">
            fINAn-SHAl
          </h1>
          <p className="text-lg text-slate-600">
            Catat pengeluaran keluarga semudah kirim pesan WhatsApp
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-4 text-left">
          {[
            {
              icon: MessageCircle,
              title: "WhatsApp First",
              desc: "Catat langsung dari WA, tanpa buka aplikasi",
            },
            {
              icon: BarChart3,
              title: "Dasbor Bersama",
              desc: "Semua anggota keluarga bisa lihat tren pengeluaran",
            },
            {
              icon: Users,
              title: "Multi-anggota",
              desc: "Undang suami, istri, atau anggota keluarga lain",
            },
            {
              icon: Shield,
              title: "Aman & Mudah",
              desc: "Login pakai Google — tidak perlu password baru",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
            >
              <Icon className="h-5 w-5 text-indigo-500 mb-2" />
              <p className="font-semibold text-sm text-slate-800">{title}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-4">
          <p className="text-sm text-slate-600">
            Masuk untuk mulai melacak keuangan keluarga Anda
          </p>
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
