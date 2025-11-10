import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    console.log("Raw body from PowerApps/Flow:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }

    console.log("Parsed data:", data);

    return NextResponse.json({
      message: "Data received successfully",
      received: data,
      file_url: "https://example.com/export.xlsx"
    });
  } catch (err) {
    console.error("Error parsing request:", err);
    return NextResponse.json({ error: "Failed to parse request" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "API is live" });
}
