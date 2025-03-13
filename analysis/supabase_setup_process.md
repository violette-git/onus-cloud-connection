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

#

### Application Connection to Supabase
- Environment variables in `.env`
- Supabase client configuration in `src/integrations/supabase/client.ts`:



3. **Local vs. Remote Development**:
   - The application appears to be configured to use a remote Supabase instance (based on the URLs)
   - We're also setting up a local Supabase instance
   - Need to clarify which one should be used for development


 **Testing the Connection**:
   - After Supabase is running, test the connection from the application
   - Verify that data can be retrieved and manipulated correctly
