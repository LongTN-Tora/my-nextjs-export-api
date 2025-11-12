

import { NextResponse } from 'next/server';
import { insertPowerAppsRecord, parsePowerAppsPayload } from '@/lib/powerApps';

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    console.log('Raw body from Flow:', raw);

    const { records, transactionID } = parsePowerAppsPayload(raw);
    console.log('Parsed records count:', records.length);
    console.log('Transaction ID:', transactionID);

    if (!records || records.length === 0) {
      return NextResponse.json(
        { message: 'Không có dữ liệu để lưu.' },
        { status: 400 }
      );
    }

    const { saved } = await insertPowerAppsRecord(transactionID || null, records);

    return NextResponse.json({
      message: 'Nhận dữ liệu thành công.',
      saved,
      transactionID,
      recordsCount: records.length,
    });
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json(
      {
        error: 'Không thể xử lý yêu cầu.',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

