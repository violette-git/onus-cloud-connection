import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Try to connect to local PostgreSQL first
const localConnectionString = 'postgresql://postgres:postgres@localhost:5432/postgres';
console.log('Trying local connection string:', localConnectionString);

const sql = postgres(localConnectionString);

async function testConnection() {
  try {
    // Test the connection
    const result = await sql`SELECT 1 as connection_test`;
    console.log('Database connection successful:', result);
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

async function createTables() {
  try {
    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log('UUID extension enabled');

    // Create profiles table
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username TEXT UNIQUE NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        role TEXT DEFAULT 'user',
        visibility TEXT DEFAULT 'public',
        handle TEXT UNIQUE NOT NULL
      )
    `;
    console.log('Profiles table created');

    // Create other tables as needed...
    
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
}

async function main() {
  const connected = await testConnection();
  
  if (connected) {
    await createTables();
  }
  
  // Close the connection
  await sql.end();
}

main().catch(console.error);
