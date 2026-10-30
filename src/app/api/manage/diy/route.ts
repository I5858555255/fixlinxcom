/* AUTO-STUB: API routes are unavailable in the GitHub Pages static export. */
import { NextResponse } from "next/server";
export const dynamic = "force-static";
export async function GET() {
  return NextResponse.json({ ok: false, error: "API routes are disabled on GitHub Pages static hosting" }, { status: 501 });
}
export async function POST() { return GET(); }
export async function DELETE() { return GET(); }
