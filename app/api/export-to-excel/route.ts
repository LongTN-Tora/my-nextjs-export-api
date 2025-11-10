import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "GET request works!" });
}

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({ message: "Data received!", received: data });
}
