import { NextResponse } from "next/server";

const allowedRoles = ["admin", "fiscal", "contracting"] as const;

type AllowedRole = (typeof allowedRoles)[number];

export async function POST(request: Request) {
  const body = (await request.json()) as { role?: string };

  if (!body.role || !allowedRoles.includes(body.role as AllowedRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, role: body.role });
}
