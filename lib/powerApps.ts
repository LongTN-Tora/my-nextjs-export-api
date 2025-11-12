import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getDbPool } from '@/lib/db';

export interface PowerAppRecord {
  area: string;
  forecastRatio: number | null;
  budget: number | null;
  actual: number | null;
  month: number | null;
  productName: string;
  outlook: number | null;
  customerName: string;
}

function safeTrim(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const sanitized = String(value).replace(/,/g, '').trim();
  if (!sanitized) {
    return null;
  }
  const parsed = Number(sanitized);
  return Number.isNaN(parsed) ? null : parsed;
}

function selectValue<T>(item: Record<string, any>, keys: string[], transform: (value: unknown) => T): T {
  for (const key of keys) {
    if (key in item) {
      return transform(item[key]);
    }
  }
  return transform(undefined);
}

function unwrapPossibleJson(value: any): any {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  try {
    const parsed = JSON.parse(trimmed);
    // Tiếp tục unwrap nếu kết quả vẫn là chuỗi JSON
    return unwrapPossibleJson(parsed);
  } catch {
    return value;
  }
}

function resolveRecords(node: any): any[] {
  const unwrapped = unwrapPossibleJson(node);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (unwrapped && typeof unwrapped === 'object') {
    if ('records' in unwrapped) {
      return resolveRecords(unwrapped.records);
    }
    if ('data' in unwrapped) {
      return resolveRecords(unwrapped.data);
    }
    if ('value' in unwrapped) {
      return resolveRecords(unwrapped.value);
    }
    if ('items' in unwrapped) {
      return resolveRecords(unwrapped.items);
    }
  }

  throw new Error('Không tìm thấy mảng dữ liệu records trong payload gửi lên.');
}

function normaliseRecord(raw: Record<string, any>): PowerAppRecord {
  return {
    area: selectValue(raw, ['エリア', 'area'], safeTrim),
    forecastRatio: selectValue(raw, ['予想比', 'forecast_ratio', 'forecastRatio'], toNumber),
    budget: selectValue(raw, ['予算', 'budget'], toNumber),
    actual: selectValue(raw, ['実績', 'actual'], toNumber),
    month: selectValue(raw, ['月', 'month'], toNumber),
    productName: selectValue(raw, ['製品名', 'product_name', 'productName'], safeTrim),
    outlook: selectValue(raw, ['見込', 'outlook'], toNumber),
    customerName: selectValue(raw, ['顧客名', 'customer_name', 'customerName'], safeTrim),
  };
}

export function parsePowerAppsPayload(raw: string): PowerAppRecord[] {
  const resolvedRecords = resolveRecords(raw);
  if (!Array.isArray(resolvedRecords)) {
    throw new Error('Payload không chứa danh sách records hợp lệ.');
  }

  return resolvedRecords.map((record) => normaliseRecord(record ?? {}));
}

export async function insertPowerAppsRecords(records: PowerAppRecord[], connection = getDbPool()): Promise<{ saved: number }> {
  if (!records.length) {
    return { saved: 0 };
  }

  const values = records.map((record) => [
    record.area || null,
    record.forecastRatio,
    record.budget,
    record.actual,
    record.month,
    record.productName || null,
    record.outlook,
    record.customerName || null,
  ]);

  const [result] = await connection.query<ResultSetHeader>(
    `INSERT INTO data_powerapp
      (area, forecast_ratio, budget, actual, month, product_name, outlook, customer_name)
      VALUES ?`,
    [values]
  );

  return { saved: result.affectedRows ?? records.length };
}

export async function fetchPowerAppsRecords() {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id,
            area,
            forecast_ratio,
            budget,
            actual,
            month,
            product_name,
            outlook,
            customer_name,
            created_at
       FROM data_powerapp
       ORDER BY created_at DESC`
  );

  return rows;
}
