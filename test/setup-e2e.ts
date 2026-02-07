import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env before tests - use .env.local when NODE_ENV=local (local Supabase)
const envFile =
  process.env.NODE_ENV === 'local'
    ? '.env.local'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
