

import { NextResponse } from 'next/server';
import { insertPowerAppsRecord, parsePowerAppsPayload } from '@/lib/powerApps';
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    const { records, transactionID } = parsePowerAppsPayload(raw);

    if (!records || records.length === 0) {
      return NextResponse.json(
        { message: 'No data to save.' },
        { status: 400 }
      );
    }

    const { saved } = await insertPowerAppsRecord(transactionID || null, records);

    return NextResponse.json({
      message: 'Receive data successfully.',
      saved,
      transactionID,
      recordsCount: records.length,
    });
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json(
      {
        error: 'Cannot process request.',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

