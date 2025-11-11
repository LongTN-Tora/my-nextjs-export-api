// /pages/api/export-to-excel.ts

import { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Nhận dữ liệu từ Power Automate (dữ liệu sẽ được gửi dưới dạng JSON trong body)
      const { data } = req.body;  // Dữ liệu JSON từ Power Automate

      // Kiểm tra nếu dữ liệu không có
      if (!data) {
        return res.status(400).json({ error: 'No data received' });
      }

      // Xử lý dữ liệu và tạo file Excel từ JSON
      const ws = XLSX.utils.json_to_sheet(data);  // Chuyển dữ liệu JSON thành worksheet
      const wb = XLSX.utils.book_new();           // Tạo một workbook mới
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Thêm worksheet vào workbook
      const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });  // Chuyển workbook thành buffer

      // Trả về file Excel
      res.status(200)
        .setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .setHeader('Content-Disposition', `attachment; filename="export_${Date.now()}.xlsx"`)
        .send(excelBuffer);  // Gửi buffer của file Excel

    } catch (error) {
      console.error('Error generating Excel:', error);
      res.status(500).json({ error: 'Failed to generate Excel file' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });  // Chỉ cho phép phương thức POST
  }
}
