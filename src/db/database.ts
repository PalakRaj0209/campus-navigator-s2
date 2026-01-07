import * as SQLite from 'expo-sqlite';

// FIX 1: Use openDatabaseAsync (modern async API) or legacy compat
// Simplest fix for now: Use legacy wrapper if your expo version allows, 
// OR simpler: Just cast it to 'any' to bypass strict TS check for hackathon speed.
// Better: Use correct modern API.

const db = SQLite.openDatabaseSync('campus.db'); // ✅ FIX: openDatabaseSync

export interface Person {
  id: number;
  firebase_id: string;
  name: string;
  role: string;
  office: string;
  floor: number;
  building: string;
  lat: number;
  lng: number;
}

export const initDB = () => {
  db.withTransactionSync(() => { // ✅ FIX: withTransactionSync
    db.execSync(`
      CREATE TABLE IF NOT EXISTS personnel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firebase_id TEXT UNIQUE,
        name TEXT NOT NULL,
        office TEXT,
        floor INTEGER,
        building TEXT,
        lat REAL,
        lng REAL
      );
    `);
  });
  console.log('✅ Personnel table ready');
};
// Add this function to your database.ts file
export const getAllPersonnel = (): Person[] => {
  try {
    // This fetches every row from the personnel table
    const allRows = db.getAllSync<Person>('SELECT * FROM personnel');
    return allRows;
  } catch (error) {
    console.error("Error fetching personnel:", error);
    return [];
  }
};
export const seedDB = () => {
  const demoData = [
    { firebase_id: "dean_001", name: "Dr. Aris", office: "Admin Block Room 101", floor: 1, building: "Main Building", lat: 23.344, lng: 85.309 },
    { firebase_id: "dir_001", name: "Dr. Rajeshwar Rao", office: "Director's Office", floor: 0, building: "Admin Block", lat: 23.34401, lng: 85.30901 },
    { firebase_id: "dean_acad", name: "Dr. Amit Sharma", office: "Dean Academic Affairs", floor: 0, building: "Admin Block", lat: 23.34405, lng: 85.30902 },
    // ... (Keep your other records if needed, short list for now to test)
    { firebase_id: "hod_cse", name: "Dr. V. Kamakoti", office: "HOD Computer Science", floor: 1, building: "Academic Block A", lat: 23.34501, lng: 85.31001 }
  ];

  db.withTransactionSync(() => {
    demoData.forEach(person => {
      // ✅ FIX: runSync for inserts
      db.runSync(
        `INSERT OR IGNORE INTO personnel (firebase_id, name, office, floor, building, lat, lng) 
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [person.firebase_id, person.name, person.office, person.floor, person.building, person.lat, person.lng]
      );
    });
  });
  console.log('✅ Seeded records');
};

export const getPersonByName = async (name: string): Promise<Person | null> => {
  // ✅ FIX: getFirstAsync for queries
  const result = await db.getFirstAsync<Person>(
    'SELECT * FROM personnel WHERE name LIKE ? LIMIT 1;',
    [`%${name}%`]
  );
  return result || null;
};
