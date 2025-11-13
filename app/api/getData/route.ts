import { NextResponse } from 'next/server';
import { fetchPowerAppsRecords } from '@/lib/powerApps';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionIDParam = searchParams.get('transactionID');
    const transactionID = transactionIDParam || null;
    const rows = await fetchPowerAppsRecords(transactionID);
    const formatted = rows.map((row) => ({
      id: row.id,
      transactionID: row.transactionID,
      エリア: (row['エリア'] as string) || (row.area as string) || '',
      予想比: (row['予想比'] as number) || (row.forecast_ratio as number) || 0,
      予算: (row['予算'] as number) || (row.budget as number) || 0,
      実績: (row['実績'] as number) || (row.actual as number) || 0,
      月: (row['月'] as number) || (row.month as number) || 0,
      製品名: (row['製品名'] as string) || (row.product_name as string) || '',
      見込: (row['見込'] as number) || (row.outlook as number) || 0,
      顧客名: (row['顧客名'] as string) || (row.customer_name as string) || '',
      createdAt: row.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching Power Apps data:', error);
    return NextResponse.json(
      {
        message: 'Cannot get data.',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

