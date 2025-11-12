import { NextResponse } from 'next/server';
import { fetchPowerAppsRecords } from '@/lib/powerApps';

export async function GET() {
  try {
    const rows = await fetchPowerAppsRecords();

    const formatted = rows.map((row) => ({
      id: row.id,
      エリア: row.area,
      予想比: row.forecast_ratio,
      予算: row.budget,
      実績: row.actual,
      月: row.month,
      製品名: row.product_name,
      見込: row.outlook,
      顧客名: row.customer_name,
      created_at: row.created_at,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching Power Apps data:', error);
    return NextResponse.json(
      {
        message: 'Không thể lấy dữ liệu.',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

