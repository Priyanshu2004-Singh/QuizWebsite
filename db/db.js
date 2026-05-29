import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import { newDb } from 'pg-mem';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
dotenv.config();

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const connectionTimeoutMillis = process.env.PG_CONNECTION_TIMEOUT_MS
  ? parseInt(process.env.PG_CONNECTION_TIMEOUT_MS, 10)
  : 1500;

const clientConfig = hasDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis,
    }
  : {
      user: process.env.DB_USER || 'quizuser',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'quizdb',
      password: process.env.DB_PASSWORD || 'yourpassword',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      connectionTimeoutMillis,
    };

let postgresClient = new Client(clientConfig);

let backend = 'postgres';
let memoryPool = null;
let isConnected = false;
let connectPromise = null;

const dbFilePath = fileURLToPath(import.meta.url);
const dbDirectory = path.dirname(dbFilePath);
const schemaPath = path.join(dbDirectory, 'schema.sql');

async function initializeMemoryBackend() {
  if (memoryPool) {
    return memoryPool;
  }

  const mem = newDb({ autoCreateForeignKeyIndices: true });
  const schemaSql = await readFile(schemaPath, 'utf8');
  mem.public.none(schemaSql);

  const { Pool } = mem.adapters.createPg();
  memoryPool = new Pool();
  backend = 'memory';
  return memoryPool;
}

const db = {
  async query(text, params) {
    if (backend === 'memory') {
      const pool = await initializeMemoryBackend();
      return pool.query(text, params);
    }

    if (!isConnected) {
      await this.connect();
    }

    if (backend === 'memory') {
      const pool = await initializeMemoryBackend();
      return pool.query(text, params);
    }

    return postgresClient.query(text, params);
  },
  async connect() {
    if (backend === 'memory') {
      return initializeMemoryBackend();
    }

    if (isConnected) {
      return postgresClient;
    }

    if (connectPromise) {
      return connectPromise;
    }

    connectPromise = (async () => {
      try {
        await postgresClient.connect();
        isConnected = true;
        return postgresClient;
      } catch (error) {
        console.warn('PostgreSQL connection failed, using in-memory SQL fallback:', error.message);
        postgresClient = null;
        isConnected = false;
        backend = 'memory';
        return initializeMemoryBackend();
      } finally {
        connectPromise = null;
      }
    })();

    return connectPromise;
  },
  async end() {
    if (backend === 'memory') {
      if (memoryPool) {
        await memoryPool.end();
      }
      memoryPool = null;
      backend = 'postgres';
      return;
    }

    if (!isConnected) {
      return;
    }

    await postgresClient.end();
    isConnected = false;
  }
};

export default db;
