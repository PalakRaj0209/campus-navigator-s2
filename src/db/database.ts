// // src/db/database.ts
// import * as SQLite from 'expo-sqlite';

// const db = SQLite.openDatabaseSync('campus_v2.db');

// export interface Person {
//   id: number;
//   name: string;
//   role: string;
//   office: string;
//   floor: number;  
//   building: string;
//   nodeId: string; 
// }

// export const initDB = () => {
//   try {
//     db.execSync(`
//       PRAGMA journal_mode = WAL;
//       CREATE TABLE IF NOT EXISTS personnel (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         role TEXT,
//         office TEXT,
//         floor INTEGER,
//         building TEXT,
//         nodeId TEXT
//       );
//     `);
//     console.log('✅ Database initialized successfully');
//   } catch (error) {
//     console.error('❌ Database init error:', error);
//   }
// };

// export const seedDB = () => {
//   try {
//     // 1. Completely clear the table to remove duplicates and old formatting
//     db.execSync('DELETE FROM personnel;');
//     console.log('🗑️ Database cleared for final card formatting');

//     const personnelData = [
//       // --- GROUND FLOOR ---
//       { name: "Principal", role: "Administration", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_principal" },
//       { name: "HOD 1", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod1" },
//       { name: "HOD 2", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod2" },
//       { name: "HOD 3", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod3" },
//       { name: "HOD 4", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod4" },
//       { name: "Main Office", role: "Admin", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_office" },
//       { name: "Model Pharmacy", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_model_pharm" },
//       { name: "Machine Room", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_machine" },
//       { name: "Central Instrumental Room", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_instrumental" },

//       // --- 1st FLOOR ---
//       { name: "Classroom 1", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr1" },
//       { name: "Classroom 2", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr2" },
//       { name: "Classroom 3", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr3" },
//       { name: "Classroom 4", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr4" },
//       { name: "Classroom 5", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr5" },
//       { name: "Classroom 6", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr6" },
//       { name: "Classroom 7", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr7" },

//       // --- 2nd FLOOR ---
//       { name: "Library", role: "Facility", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_library" },
//       { name: "Faculty Room 1", role: "Staff", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_fac1" },
//       { name: "Faculty Room 2", role: "Staff", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_fac2" },
//       { name: "Biotechnology Lab 1", role: "Lab", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_biotech" },
//       { name: "Computer Room", role: "IT", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_comp" },

//       // --- 3rd FLOOR ---
//       { name: "Pharmacology Lab 1", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pcol1" },
//       { name: "Pharmacology Lab 2", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pcol2" },
//       { name: "Pharmacology Lab 3", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pcol3" },
//       { name: "Pharmaceutical Chemistry Lab 1", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pchem1" },
//       { name: "Pharmaceutical Chemistry Lab 2", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pchem2" },
//       { name: "Pharmaceutical Chemistry Lab 3", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pchem3" },
//       { name: "Analysis Lab 1", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_analysis" },

//       // --- 4th FLOOR ---
//       { name: "Pharmaceutics Lab 1", role: "Lab", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_pceutics1" },
//       { name: "Pharmaceutics Lab 2", role: "Lab", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_pceutics2" },
//       { name: "Pharmacognosy Lab 1", role: "Lab", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_pcognosy1" },
//       { name: "Pharmacognosy Lab 2", role: "Lab", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_pcognosy2" },
//       { name: "Museum", role: "Facility", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_museum" },
//       { name: "Recreation Room", role: "Facility", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_recreation" },
//     ];

//     db.withTransactionSync(() => {
//       personnelData.forEach(p => {
//         db.runSync(
//           `INSERT INTO personnel (name, role, office, floor, building, nodeId) VALUES (?, ?, ?, ?, ?, ?)`,
//           [p.name, p.role, p.office, p.floor, p.building, p.nodeId]
//         );
//       });
//     });
//     console.log('✅ Seeded clean data: No repetitions in card display.');
//   } catch (error) {
//     console.error('❌ Seeding error:', error);
//   }
// };

// export const getAllPersonnel = (): Person[] => {
//   return db.getAllSync<Person>('SELECT * FROM personnel');
// };

// export const getPersonByName = (name: string): Person | null => {
//   return db.getFirstSync<Person>(
//     'SELECT * FROM personnel WHERE name LIKE ? LIMIT 1', 
//     [`%${name}%`]
//   );
// };

// src/db/database.ts
import * as SQLite from 'expo-sqlite';

// ✅ Ensure db is declared and exported for use within this module
const db = SQLite.openDatabaseSync('campus_v2.db');

export interface Person {
  id: number;
  name: string;
  role: string;
  office: string;
  floor: number;  
  building: string;
  nodeId: string; 
}

export type PersonInput = Omit<Person, 'id'>;

export const initDB = () => {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS personnel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT,
        office TEXT,
        floor INTEGER,
        building TEXT,
        nodeId TEXT
      );
    `);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database init error:', error);
  }
};

export const seedDB = () => {
  try {
    // 1. Completely clear the table to remove duplicates and old formatting
    db.execSync('DELETE FROM personnel;');
    console.log('🗑️ Database cleared for final card formatting');

    const personnelData = [
      // =========================
      // FLOOR 0 (GROUND FLOOR)
      // =========================
      { name: "Principal", role: "Administration", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_principal" },
      { name: "HOD 1", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod_1" },
      { name: "HOD 2", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod_2" },
      { name: "HOD 3", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod_3" },
      { name: "HOD 4", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod_4" },
      { name: "Main Office", role: "Admin", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_main_office" },
      { name: "Model Pharmacy", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_model_pharmacy" },
      { name: "Machine Room", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_machine_room" },
      { name: "Central Instrumental Room", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_instrument_room" },
      { name: "Animal House", role: "Facility", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_animal_house" },
      { name: "Store Big", role: "Storage", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_store_big" },
      { name: "Gents Toilet", role: "Facility", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_gents_toilet" },
      { name: "Ladies Toilet", role: "Facility", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_ladies_toilet" },

      // =========================
      // FLOOR 1 (FIRST FLOOR)
      // =========================
      { name: "Classroom 1", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_classroom_1" },
      { name: "Classroom 2", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_classroom_2" },
      { name: "Classroom 3", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_classroom_3" },
      { name: "Classroom 4", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_classroom_4" },
      { name: "Classroom 5", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_classroom_5" },
      { name: "Classroom 6", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_classroom_6" },
      { name: "Classroom 7", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_classroom_7" },
      { name: "Girls Common Room", role: "Facility", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_girls_common" },
      { name: "First Floor Store", role: "Storage", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_store" },
      { name: "Gents Toilet F1", role: "Facility", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_gents_toilet" },
      { name: "Ladies Toilet F1", role: "Facility", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_ladies_toilet" },
    ];

    db.withTransactionSync(() => {
      personnelData.forEach(p => {
        db.runSync(
          `INSERT INTO personnel (name, role, office, floor, building, nodeId) VALUES (?, ?, ?, ?, ?, ?)`,
          [p.name, p.role, p.office, p.floor, p.building, p.nodeId]
        );
      });
    });
    console.log('✅ Seeded clean data: No repetitions in card display.');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

//  Exporting getAllPersonnel to resolve HomeScreen.tsx error
export const getAllPersonnel = (): Person[] => {
  return db.getAllSync<Person>('SELECT * FROM personnel');
};

export const upsertPersonnel = (people: PersonInput[]) => {
  if (!people.length) return;

  try {
    db.withTransactionSync(() => {
      people.forEach((person) => {
        db.runSync('DELETE FROM personnel WHERE nodeId = ?', [person.nodeId]);
        db.runSync(
          'INSERT INTO personnel (name, role, office, floor, building, nodeId) VALUES (?, ?, ?, ?, ?, ?)',
          [
            person.name,
            person.role,
            person.office,
            person.floor,
            person.building,
            person.nodeId,
          ]
        );
      });
    });
  } catch (error) {
    console.error('? Upsert error:', error);
  }
};

export const getPersonByName = (name: string): Person | null => {
  return db.getFirstSync<Person>(
    'SELECT * FROM personnel WHERE name LIKE ? LIMIT 1', 
    [`%${name}%`]
  );
};
