// app/api/export-to-excel/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();  // nhận dữ liệu JSON từ PowerApps
    console.log("Received data from PowerApps:", data);

    // TODO: xử lý xuất Excel ở đây, ví dụ trả về JSON tạm
    return NextResponse.json({
      message: "Data received successfully!",
      received: data,
    });
  } catch (err) {
    console.error("Error in API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Optional: GET để test trình duyệt
export async function GET() {
  return NextResponse.json({ message: "API is live" });
}
