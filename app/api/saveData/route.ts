import { NextResponse } from 'next/server';
import { insertPowerAppsRecords, parsePowerAppsPayload } from '@/lib/powerApps';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const records = parsePowerAppsPayload(rawBody);

    if (!records.length) {
      return NextResponse.json(
        { message: 'Không có dữ liệu nào để lưu.' },
        { status: 400 }
      );
    }

    const { saved } = await insertPowerAppsRecords(records);

    return NextResponse.json({
      message: 'Lưu dữ liệu thành công.',
      saved,
    });
  } catch (error) {
    console.error('Error saving Power Apps data:', error);
    return NextResponse.json(
      {
        message: 'Không thể lưu dữ liệu.',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

