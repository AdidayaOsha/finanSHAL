import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginButton from "@/components/auth/LoginButton";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">fINAn-SHAl</h1>
          <p className="text-slate-500 text-sm mt-1">Masuk ke akun Anda</p>
        </div>
        <LoginButton />
        <p className="text-xs text-slate-400">
          Dengan masuk, Anda menyetujui penggunaan data untuk keperluan pelacakan
          keuangan keluarga.
        </p>
      </div>
    </main>
  );
}
