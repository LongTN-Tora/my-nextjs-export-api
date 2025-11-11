import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: Request) {
  try {
    // Đọc dữ liệu JSON từ Power Apps gửi lên
    const raw = await request.text();
    
    let data;
    try {
      // Giải mã JSON từ Power Apps (có thể là JSON lồng nhau)
      data = JSON.parse(JSON.parse(raw));
    } catch {
      // Nếu không phải JSON lồng nhau, chỉ cần parse một lần
      data = JSON.parse(raw);
    }

    // Tạo workbook từ dữ liệu JSON
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");

    // Chuyển workbook thành buffer (binary)
    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Trả về file Excel dưới dạng binary
    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="export_${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error generating Excel:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
}
