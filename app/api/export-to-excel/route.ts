import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    let data;
    try {
      // Parse dữ liệu JSON từ Power Automate
      data = JSON.parse(JSON.parse(raw)); // Nếu gửi JSON lồng nhau từ Power Automate
    } catch {
      data = JSON.parse(raw); // Nếu gửi JSON đơn giản
    }

    // Chuyển JSON thành Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");

    // Xuất Excel ra binary buffer
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
    return NextResponse.json(
      { error: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
}
