import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Lấy raw body từ request
    const raw = await request.text();
    console.log("Raw body from Flow:", raw);

    let data;
    try {
      // Thử parse JSON nếu dữ liệu là JSON
      data = JSON.parse(JSON.parse(raw));
    } catch {
      // Nếu không thể parse, thử parse trực tiếp raw body
      data = JSON.parse(raw);
    }

    console.log("Parsed data:", data);

    // Trả về dữ liệu nhận được dưới dạng JSON
    return NextResponse.json({
      message: "Data received successfully",
      received: data,
    });
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json({
      error: "Failed to parse request",
    });
  }
}
