import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { getFirestoreDb, isFirebaseConfigured } from './firebase';
import { getAllPersonnel, upsertPersonnel, PersonInput } from '../db/database';

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizePerson = (data: Record<string, unknown>): PersonInput | null => {
  const name = String(data.name ?? '').trim();
  const role = String(data.role ?? '').trim();
  const office = String(data.office ?? '').trim();
  const building = String(data.building ?? '').trim();
  const nodeId = String(data.nodeId ?? '').trim();
  const floor = toNumber(data.floor);

  if (!name || !office || !building || !nodeId || floor === null) return null;

  return {
    name,
    role,
    office,
    floor,
    building,
    nodeId,
  };
};

export const syncPersonnelFromCloud = async () => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured. Skipping cloud sync.');
    return { status: 'skipped', count: 0 };
  }

  const db = getFirestoreDb();
  if (!db) {
    console.log('Firebase not initialized. Skipping cloud sync.');
    return { status: 'skipped', count: 0 };
  }

  const snapshot = await getDocs(collection(db, 'personnel'));
  const people: PersonInput[] = [];

  snapshot.forEach((doc) => {
    const normalized = normalizePerson(doc.data());
    if (normalized) people.push(normalized);
  });

  if (people.length === 0) {
    console.log('No personnel records found in cloud.');
    return { status: 'empty', count: 0 };
  }

  upsertPersonnel(people);
  console.log(`Synced ${people.length} personnel records from cloud.`);
  return { status: 'synced', count: people.length };
};

export const uploadLocalPersonnelToCloud = async () => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured. Skipping cloud upload.');
    return { status: 'skipped', count: 0 };
  }

  const db = getFirestoreDb();
  if (!db) {
    console.log('Firebase not initialized. Skipping cloud upload.');
    return { status: 'skipped', count: 0 };
  }

  const localPeople = getAllPersonnel()
    .map(({ id, ...rest }) => rest)
    .filter((person) => person.nodeId);

  if (localPeople.length === 0) {
    console.log('No local personnel data to upload.');
    return { status: 'empty', count: 0 };
  }

  await Promise.all(
    localPeople.map((person) =>
      setDoc(doc(db, 'personnel', person.nodeId), person, { merge: true })
    )
  );

  console.log(`Uploaded ${localPeople.length} local personnel records to cloud.`);
  return { status: 'uploaded', count: localPeople.length };
};
