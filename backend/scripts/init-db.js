const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = Number(process.env.DB_PORT || 3306);
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';

const schemaPath = path.resolve(__dirname, '..', 'sql', 'schema.sql');
const seedPath = path.resolve(__dirname, '..', 'sql', 'seed.sql');

const run = async () => {
  const conn = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    multipleStatements: true,
  });

  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    await conn.query(schemaSql);
    await conn.query(seedSql);

    // eslint-disable-next-line no-console
    console.log('✅ Database dan seed berhasil dijalankan.');
  } finally {
    await conn.end();
  }
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('❌ Gagal inisialisasi database:', error.message);
  process.exit(1);
});
