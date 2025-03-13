import sql from './db.js';

async function testDatabase() {
  try {
    // Test a simple query
    const profiles = await sql`SELECT * FROM profiles LIMIT 5`;
    console.log('Profiles:', profiles);

    // Test a query with parameters
    const musicians = await sql`SELECT * FROM musicians WHERE genre_id IS NOT NULL LIMIT 3`;
    console.log('Musicians:', musicians);

    // Test a join query
    const musicianProfiles = await sql`
      SELECT m.name as musician_name, p.full_name, p.username
      FROM musicians m
      JOIN profiles p ON m.user_id = p.id
      LIMIT 3
    `;
    console.log('Musician Profiles:', musicianProfiles);

    console.log('Database tests completed successfully');
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    // Close the database connection
    sql.end();
  }
}

testDatabase();
