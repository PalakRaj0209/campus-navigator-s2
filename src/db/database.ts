import * as SQLite from 'expo-sqlite';

// Open the database (sync)
const db = SQLite.openDatabaseSync('campus_v2.db');

export interface Person {
  id: number;
  name: string;
  role: string;
  office: string;
  floor: number;  // 0, 1, 2, 3
  building: string;
  nodeId: string; // CRITICAL: Links to the graph node
}

// Initialize the Table
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

// Seed with robust Indian Data (4 Floors)
export const seedDB = () => {
  const check = db.getFirstSync('SELECT count(*) as count FROM personnel');
  // @ts-ignore
  if (check.count > 0) return; // Don't re-seed if data exists

  const personnelData = [
    // --- FLOOR 0: Admin & Directors ---
    { name: "Dr. Rajeshwar Rao", role: "Director", office: "Director's Office", floor: 0, building: "Admin Block", nodeId: "f0_dir" },
    { name: "Dr. Amit Sharma", role: "Dean Academics", office: "Room 002", floor: 0, building: "Admin Block", nodeId: "f0_r002" },
    { name: "Ms. Priya Singh", role: "Registrar", office: "Room 003", floor: 0, building: "Admin Block", nodeId: "f0_r003" },
    { name: "Mr. Suresh Gupta", role: "Security Chief", office: "Security Room", floor: 0, building: "Admin Block", nodeId: "f0_sec" },
    { name: "Reception Desk", role: "Help Desk", office: "Lobby", floor: 0, building: "Admin Block", nodeId: "f0_lobby" },

    // --- FLOOR 1: Computer Science & Labs ---
    { name: "Dr. V. Kamakoti", role: "HOD CSE", office: "Room 101", floor: 1, building: "Academic Block", nodeId: "f1_r101" },
    { name: "Prof. Anjali Verma", role: "Professor AI", office: "Room 102", floor: 1, building: "Academic Block", nodeId: "f1_r102" },
    { name: "Dr. Rahul Nair", role: "Asst. Professor", office: "Room 103", floor: 1, building: "Academic Block", nodeId: "f1_r103" },
    { name: "AI Robotics Lab", role: "Laboratory", office: "Lab 1A", floor: 1, building: "Academic Block", nodeId: "f1_lab1" },
    { name: "Server Room", role: "Facility", office: "Room 105", floor: 1, building: "Academic Block", nodeId: "f1_srv" },

    // --- FLOOR 2: Electrical & Mechanical ---
    { name: "Dr. Arjun Mehta", role: "HOD EEE", office: "Room 201", floor: 2, building: "Academic Block", nodeId: "f2_r201" },
    { name: "Prof. Sneha Kapoor", role: "Professor Mech", office: "Room 202", floor: 2, building: "Academic Block", nodeId: "f2_r202" },
    { name: "Circuits Lab", role: "Laboratory", office: "Lab 2B", floor: 2, building: "Academic Block", nodeId: "f2_lab2" },
    { name: "Dr. Vikram Malhotra", role: "Assoc. Professor", office: "Room 204", floor: 2, building: "Academic Block", nodeId: "f2_r204" },
    { name: "Conference Hall", role: "Common Room", office: "Room 210", floor: 2, building: "Academic Block", nodeId: "f2_conf" },

    // --- FLOOR 3: Library & Common Areas ---
    { name: "Central Library", role: "Facility", office: "Main Hall", floor: 3, building: "Library Block", nodeId: "f3_lib_main" },
    { name: "Mrs. Kavita Das", role: "Librarian", office: "Lib Office", floor: 3, building: "Library Block", nodeId: "f3_lib_off" },
    { name: "Study Room A", role: "Student Area", office: "Quiet Zone", floor: 3, building: "Library Block", nodeId: "f3_study" },
    { name: "Cafeteria", role: "Canteen", office: "Roof Top", floor: 3, building: "Common Area", nodeId: "f3_cafe" },
  ];

  db.withTransactionSync(() => {
    personnelData.forEach(p => {
      db.runSync(
        `INSERT INTO personnel (name, role, office, floor, building, nodeId) VALUES (?, ?, ?, ?, ?, ?)`,
        [p.name, p.role, p.office, p.floor, p.building, p.nodeId]
      );
    });
  });
  console.log('✅ Seeded 20+ Indian records across 4 floors');
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
