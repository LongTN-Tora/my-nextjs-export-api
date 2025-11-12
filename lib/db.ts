import mysql from 'mysql2/promise';

type Pool = mysql.Pool;

let pool: Pool | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDbPool(): Pool {
  if (pool) {
    return pool;
  }

  const host = requireEnv('MYSQL_HOST');
  const user = process.env.MYSQL_USER ?? process.env.MYSQL_USERNAME ?? requireEnv('MYSQL_USER');
  const password = process.env.MYSQL_PASSWORD ?? process.env.MYSQL_ROOT_PASSWORD ?? requireEnv('MYSQL_PASSWORD');
  const database = requireEnv('MYSQL_DATABASE');
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306;

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4_general_ci',
  });

  return pool;
}
