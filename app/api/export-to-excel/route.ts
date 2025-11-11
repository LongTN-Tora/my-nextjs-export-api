
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const raw = await request.text(); 
    console.log("Raw body from Flow:", raw);

   
    let data;
    try {
      
      data = JSON.parse(JSON.parse(raw));
    } catch {
      data = JSON.parse(raw);
    }

    console.log("Parsed data:", data);

    return NextResponse.json({
      message: "Data received successfully",
      received: data,
    });
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json(
      { error: "Failed to parse request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "API is live" });
}
