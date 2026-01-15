// src/db/database.ts
import * as SQLite from 'expo-sqlite';

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
      // --- GROUND FLOOR ---
      { name: "Principal", role: "Administration", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_principal" },
      { name: "HOD 1", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod1" },
      { name: "HOD 2", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod2" },
      { name: "HOD 3", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod3" },
      { name: "HOD 4", role: "Dept Head", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_hod4" },
      { name: "Main Office", role: "Admin", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_office" },
      { name: "Model Pharmacy", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_model_pharm" },
      { name: "Machine Room", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_machine" },
      { name: "Central Instrumental Room", role: "Lab", office: "Pharmacy Block", floor: 0, building: "Pharmacy Block", nodeId: "f0_instrumental" },

      // --- 1st FLOOR ---
      { name: "Classroom 1", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr1" },
      { name: "Classroom 2", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr2" },
      { name: "Classroom 3", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr3" },
      { name: "Classroom 4", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr4" },
      { name: "Classroom 5", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr5" },
      { name: "Classroom 6", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr6" },
      { name: "Classroom 7", role: "Lecture Hall", office: "Pharmacy Block", floor: 1, building: "Pharmacy Block", nodeId: "f1_cr7" },

      // --- 2nd FLOOR ---
      { name: "Library", role: "Facility", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_library" },
      { name: "Faculty Room 1", role: "Staff", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_fac1" },
      { name: "Faculty Room 2", role: "Staff", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_fac2" },
      { name: "Biotechnology Lab 1", role: "Lab", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_biotech" },
      { name: "Computer Room", role: "IT", office: "Pharmacy Block", floor: 2, building: "Pharmacy Block", nodeId: "f2_comp" },

      // --- 3rd FLOOR ---
      { name: "Pharmacology Lab 1", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pcol1" },
      { name: "Pharmacology Lab 2", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pcol2" },
      { name: "Pharmacology Lab 3", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pcol3" },
      { name: "Pharmaceutical Chemistry Lab 1", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pchem1" },
      { name: "Pharmaceutical Chemistry Lab 2", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pchem2" },
      { name: "Pharmaceutical Chemistry Lab 3", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_pchem3" },
      { name: "Analysis Lab 1", role: "Lab", office: "Pharmacy Block", floor: 3, building: "Pharmacy Block", nodeId: "f3_analysis" },

      // --- 4th FLOOR ---
      { name: "Pharmaceutics Lab 1", role: "Lab", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_pceutics1" },
      { name: "Pharmaceutics Lab 2", role: "Lab", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_pceutics2" },
      { name: "Pharmacognosy Lab 1", role: "Lab", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_pcognosy1" },
      { name: "Pharmacognosy Lab 2", role: "Lab", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_pcognosy2" },
      { name: "Museum", role: "Facility", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_museum" },
      { name: "Recreation Room", role: "Facility", office: "Pharmacy Block", floor: 4, building: "Pharmacy Block", nodeId: "f4_recreation" },
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

export const getAllPersonnel = (): Person[] => {
  return db.getAllSync<Person>('SELECT * FROM personnel');
};

export const getPersonByName = (name: string): Person | null => {
  return db.getFirstSync<Person>(
    'SELECT * FROM personnel WHERE name LIKE ? LIMIT 1', 
    [`%${name}%`]
  );
};