import Database from 'better-sqlite3';
import path from 'path';

// Connect to the SQLite database
const dbPath = path.join(process.cwd(), 'local.db');
const db = new Database(dbPath, { readonly: false });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create a wrapper function to mimic the postgres library's tagged template functionality
const sql = (strings, ...values) => {
  // Convert the tagged template to a SQL string and parameters
  const sqlString = strings.reduce((acc, str, i) => {
    return acc + str + (i < values.length ? '?' : '');
  }, '');
  
  // Prepare and execute the statement
  try {
    const stmt = db.prepare(sqlString);
    
    // Check if it's a SELECT query
    if (sqlString.trim().toLowerCase().startsWith('select')) {
      return stmt.all(...values);
    } else {
      return stmt.run(...values);
    }
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
};

// Add a method to close the database connection
sql.end = () => {
  db.close();
};

export default sql;
