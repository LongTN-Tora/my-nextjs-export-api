import { NextResponse } from 'next/server';
import { fetchPowerAppsRecords } from '@/lib/powerApps';

export async function GET(request: Request) {
  try {
    // Lấy query parameter transactionID từ URL
    const { searchParams } = new URL(request.url);
    const transactionIDParam = searchParams.get('transactionID');
    const transactionID = transactionIDParam || null;

    const rows = await fetchPowerAppsRecords(transactionID);

    // Format lại với tên trường tiếng Nhật
    const formatted = rows.map((row: any) => ({
      id: row.id,
      transactionID: row.transactionID,
      エリア: row['エリア'] || row.area || '',
      予想比: row['予想比'] || row.forecast_ratio || 0,
      予算: row['予算'] || row.budget || 0,
      実績: row['実績'] || row.actual || 0,
      月: row['月'] || row.month || 0,
      製品名: row['製品名'] || row.product_name || '',
      見込: row['見込'] || row.outlook || 0,
      顧客名: row['顧客名'] || row.customer_name || '',
      createdAt: row.createdAt,
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

