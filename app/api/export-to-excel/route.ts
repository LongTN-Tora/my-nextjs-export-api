import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Nhận JSON từ PowerApps
    const data = await request.json();

    console.log("Received data from PowerApps:", data);

    // Ở đây bạn có thể xử lý logic — ví dụ:
    // 1. Tạo file Excel từ dữ liệu
    // 2. Gửi file qua email / lưu S3 / trả về link tải

    // Ví dụ phản hồi đơn giản:
    return NextResponse.json({
      message: "Data received successfully!",
      received: data,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}
