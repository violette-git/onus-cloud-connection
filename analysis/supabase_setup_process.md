# Supabase Setup Process for Onus Cloud Connection

## Prerequisites
1. Docker Desktop installed and running
   - Required for local Supabase development
   - Docker daemon should be exposed on tcp://localhost:2375 for analytics (currently showing a warning)

## Setup Process

### 1. Supabase Project Configuration
- **Project ID**: "onus-cloud-connection-new" (defined in supabase/config.toml)
- **Database Port**: 54322 (defined in supabase/config.toml)
- **API Port**: 54321 (defined in supabase/config.toml)
- **Studio Port**: 54323 (defined in supabase/config.toml)

### 2. Database Schema Setup
- Created migration file at `supabase/migrations/20250311000000_create_tables.sql`
- Migration file creates all necessary tables with proper relationships
- Schema paths configured in supabase/config.toml: `schema_paths = ["./migrations/*.sql"]`

### 3. Database Seed Data
- Created seed file at `supabase/seed.sql`
- Seed file populates tables with sample data
- Seed configuration in supabase/config.toml: `sql_paths = ["./seed.sql"]`

### 4. Application Connection to Supabase
- Environment variables in `.env`:
  - VITE_SUPABASE_URL=https://hfzdbtmmvlvnxtvcgxui.supabase.co
  - VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmemRidG1tdmx2bnh0dmNneHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NTI1MjEsImV4cCI6MjA1NzMyODUyMX0.T4n85VG-mfMHYK3mtDXs2-WLhBBuJuvMBCYLrgSRlPc
- Supabase client configuration in `src/integrations/supabase/client.ts`:
  - SUPABASE_URL=https://uticeouohtomjezepctd.supabase.co
  - SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0aWNlb3VvaHRvbWplemVwY3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NzY3NTAsImV4cCI6MjA0OTU1Mjc1MH0.2zbkCuhHiOcwo6SA31Qt1KgnBeN4KRNHtUQdtSUwv1A

## Potential Issues and Mismatches

1. **Different Supabase URLs and Keys**:
   - `.env` file has different Supabase URL and key than `src/integrations/supabase/client.ts`
   - This could cause the application to connect to the wrong Supabase project

2. **Docker Configuration**:
   - Warning about analytics requiring Docker daemon exposed on tcp://localhost:2375
   - This is a configuration issue with Docker, not with Supabase itself

3. **Local vs. Remote Development**:
   - The application appears to be configured to use a remote Supabase instance (based on the URLs)
   - We're also setting up a local Supabase instance
   - Need to clarify which one should be used for development

## Next Steps

1. **Resolve URL/Key Mismatch**:
   - Decide whether to use the local or remote Supabase instance
   - Update either the `.env` file or the `client.ts` file to use consistent URLs and keys

2. **Docker Configuration**:
   - If analytics is needed, configure Docker to expose the daemon on tcp://localhost:2375
   - Otherwise, this warning can be ignored

3. **Testing the Connection**:
   - After Supabase is running, test the connection from the application
   - Verify that data can be retrieved and manipulated correctly
