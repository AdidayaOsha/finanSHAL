import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "fINAn-SHAl — Family Finance Tracker",
  description:
    "Catat pengeluaran keluarga semudah kirim pesan WhatsApp. Dasbor bersama, anggaran, dan laporan keuangan keluarga.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
