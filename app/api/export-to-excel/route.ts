import { NextResponse } from 'next/server';
import { insertPowerAppsRecords, parsePowerAppsPayload } from '@/lib/powerApps';

export async function POST(request: Request) {
  console.log('aaaaaaaaaaaaaaaa', request);
  try {
    const raw = await request.text();
    console.log('Raw body from Flow:', raw);

    const records = parsePowerAppsPayload(raw);
    console.log('Parsed records count:', records.length);

    if (!records.length) {
      return NextResponse.json(
        { message: 'Không có dữ liệu để lưu.' },
        { status: 400 }
      );
    }

    const { saved } = await insertPowerAppsRecords(records);

    return NextResponse.json({
      message: 'Nhận dữ liệu thành công.',
      saved,
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

// export async function GET() {
//   return NextResponse.json({ message: 'API is live' });
// }
