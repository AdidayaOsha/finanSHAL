import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { transactions, users, categories } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const familyId = (session.user as { familyId?: string }).familyId;
  if (!familyId) {
    return NextResponse.json({ error: "No family group" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "xlsx";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const conditions = [eq(transactions.familyId, familyId)];
  if (from) conditions.push(gte(transactions.date, new Date(from)));
  if (to) conditions.push(lte(transactions.date, new Date(to)));

  const rows = await db
    .select({
      date: transactions.date,
      amount: transactions.amount,
      currency: transactions.currency,
      notes: transactions.notes,
      category: categories.name,
      member: users.name,
    })
    .from(transactions)
    .leftJoin(users, eq(transactions.userId, users.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(transactions.date);

  const data = rows.map((r) => ({
    Tanggal: r.date ? new Date(r.date).toLocaleDateString("id-ID") : "",
    Nominal: r.amount,
    Mata_Uang: r.currency,
    Catatan: r.notes ?? "",
    Kategori: r.category ?? "",
    Anggota: r.member ?? "",
  }));

  if (format === "csv") {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="finanshal-export.csv"`,
      },
    });
  }

  // Default: xlsx
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Transaksi");
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="finanshal-export.xlsx"`,
    },
  });
}
