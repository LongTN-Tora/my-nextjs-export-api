import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Lấy raw body từ request
    const raw = await request.text();
    console.log("Raw body from Flow:", raw);

    let data;
    try {
      // Thử parse JSON nếu dữ liệu là JSON
      data = JSON.parse(raw);
    } catch (error: unknown) {
      // Kiểm tra xem lỗi có phải là Error không
      if (error instanceof Error) {
        console.error("Error parsing JSON:", error.message);
        return NextResponse.json({
          message: "Failed to parse JSON",
          error: error.message,
        }, { status: 400 });
      }
      // Nếu lỗi không phải là Error
      return NextResponse.json({
        message: "Unknown error occurred",
      }, { status: 500 });
    }

    console.log("Parsed data:", data);

    // Trả về dữ liệu nhận được dưới dạng JSON
    return NextResponse.json({
      message: "Data received successfully",
      received: data,
    });
  } catch (error: unknown) {
    // Kiểm tra xem lỗi có phải là Error không
    if (error instanceof Error) {
      console.error("Error parsing request:", error.message);
      return NextResponse.json({
        message: "An error occurred while processing the request",
        error: error.message,
      }, { status: 500 });
    }
    // Nếu lỗi không phải là Error
    return NextResponse.json({
      message: "Unknown error occurred",
    }, { status: 500 });
  }
}
