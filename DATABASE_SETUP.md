# Database Setup

This project now uses a local SQLite database instead of Supabase for development. This document explains the setup and how to use it.

## Overview

The original setup used Supabase with PostgreSQL, but we've switched to a local SQLite database for easier development. The database schema matches what was defined in the Supabase seed file, so all the same tables and relationships are maintained.

## Files

- `local.db`: The SQLite database file containing all tables and sample data
- `db.js`: Database connection module that provides a SQL tagged template interface
- `setup-sqlite.js`: Script that creates the database schema and inserts sample data

## Database Schema

The database includes the following tables:

- `profiles`: User profiles
- `genres`: Music genres
- `musicians`: Musician profiles
- `musician_genres`: Many-to-many relationship between musicians and genres
- `forum_topics`: Forum discussion topics
- `comments`: Comments on various content types
- `followers`: User follow relationships
- `collaborators`: Musician collaboration relationships
- `songs`: Music tracks
- `videos`: Video content
- `featured_content`: Content featured on musician profiles
- `notifications`: User notifications
- `nudges`: Direct messages between users
- `song_reactions`: User reactions to songs
- `linking_codes`: Codes for linking external accounts

## Using the Database

The `db.js` module provides a SQL tagged template interface similar to the original Postgres library:

```javascript
import sql from './db.js';

// Query example
const profiles = await sql`SELECT * FROM profiles WHERE username = ${'johndoe'}`;

// Insert example
await sql`INSERT INTO profiles (id, username, full_name) VALUES (${id}, ${username}, ${fullName})`;
```

## Recreating the Database

If you need to reset the database or recreate it from scratch:

```bash
node setup-sqlite.js
```

This will delete the existing database file (if any) and create a new one with all tables and sample data.

## Sample Data

The database comes pre-populated with sample data including:

- 5 user profiles (4 regular users + 1 admin)
- 7 music genres
- 3 musician profiles
- Forum topics and comments
- Sample songs and videos
- Relationships between users (followers, collaborators)
- Sample notifications and messages

## Migrating Back to Supabase

If you need to migrate back to Supabase in the future:

1. Create migration files in `supabase/migrations/` based on the schema in `setup-sqlite.js`
2. Update `db.js` to use the Postgres connection again
3. Run `npx supabase start` to initialize the Supabase database with your migrations
