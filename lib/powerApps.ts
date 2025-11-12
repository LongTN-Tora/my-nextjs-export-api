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

function resolveRecords(node: any): { records: any[]; transactionID?: number } {
  const unwrapped = unwrapPossibleJson(node);

  // Nếu là object có data.records và transactionID
  if (unwrapped && typeof unwrapped === 'object') {
    if ('data' in unwrapped && unwrapped.data) {
      const data = unwrapPossibleJson(unwrapped.data);
      if (data && typeof data === 'object' && 'records' in data) {
        return {
          records: Array.isArray(data.records) ? data.records : [],
          transactionID: unwrapped.transactionID || data.transactionID,
        };
      }
    }
    if ('records' in unwrapped) {
      return {
        records: Array.isArray(unwrapped.records) ? unwrapped.records : [],
        transactionID: unwrapped.transactionID,
      };
    }
    if ('value' in unwrapped) {
      return resolveRecords(unwrapped.value);
    }
    if ('items' in unwrapped) {
      return {
        records: Array.isArray(unwrapped.items) ? unwrapped.items : [],
        transactionID: unwrapped.transactionID,
      };
    }
  }

  // Nếu là array trực tiếp
  if (Array.isArray(unwrapped)) {
    return { records: unwrapped };
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

export function parsePowerAppsPayload(raw: string): { records: any[]; transactionID?: number } {
  const resolved = resolveRecords(raw);
  if (!Array.isArray(resolved.records)) {
    throw new Error('Payload không chứa danh sách records hợp lệ.');
  }

  return {
    records: resolved.records,
    transactionID: resolved.transactionID,
  };
}

export async function insertPowerAppsRecord(
  transactionID: number | null,
  records: any[],
  connection = getDbPool()
): Promise<{ saved: number }> {
  if (!records || records.length === 0) {
    return { saved: 0 };
  }

  // Lưu transactionID và body (JSON chứa records array)
  const [result] = await connection.query<ResultSetHeader>(
    `INSERT INTO data_powerapp (transactionID, body, createdAt)
     VALUES (?, ?, NOW())`,
    [transactionID || null, JSON.stringify(records)]
  );

  return { saved: result.affectedRows ?? 1 };
}

export async function fetchPowerAppsRecords(transactionID?: string | null) {
  const pool = getDbPool();
  
  // Nếu có transactionID, filter theo transactionID
  let query = `SELECT id,
                      transactionID,
                      body,
                      createdAt
                 FROM data_powerapp`;
  
  const queryParams: any[] = [];
  
  if (transactionID !== null && transactionID !== undefined) {
    query += ` WHERE transactionID = ?`;
    // Dùng string trực tiếp, MySQL sẽ tự động convert khi so sánh với BIGINT
    queryParams.push(transactionID);
  }
  
  query += ` ORDER BY createdAt DESC`;

  const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);

  // Parse JSON body và flatten records
  const allRecords: any[] = [];
  rows.forEach((row) => {
    try {
      const body = typeof row.body === 'string' ? JSON.parse(row.body) : row.body;
      if (Array.isArray(body)) {
        body.forEach((record) => {
          allRecords.push({
            id: row.id,
            transactionID: row.transactionID,
            ...record,
            createdAt: row.createdAt,
          });
        });
      }
    } catch (error) {
      console.error('Error parsing body JSON:', error);
    }
  });

  return allRecords;
}
