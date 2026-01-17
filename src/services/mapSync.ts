import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { getFirestoreDb, isFirebaseConfigured } from './firebase';
import { getLocalGraphNodes, setRemoteGraphNodes } from '../data/graph';
import { getLocalFloorPlans, setRemoteFloorPlans } from '../data/floorPlans';

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeGraphNodes = (nodes: unknown[]) =>
  nodes
    .map((node) => {
      if (!node || typeof node !== 'object') return null;
      const record = node as Record<string, unknown>;
      const id = String(record.id ?? '').trim();
      const x = toNumber(record.x);
      const y = toNumber(record.y);
      const floor = toNumber(record.floor);

      if (!id || x === null || y === null || floor === null) return null;
      return { id, x, y, floor };
    })
    .filter((node): node is { id: string; x: number; y: number; floor: number } => !!node);

export const syncMapDataFromCloud = async () => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured. Skipping map sync.');
    return { status: 'skipped', graphCount: 0, floorCount: 0 };
  }

  const db = getFirestoreDb();
  if (!db) {
    console.log('Firebase not initialized. Skipping map sync.');
    return { status: 'skipped', graphCount: 0, floorCount: 0 };
  }

  let graphCount = 0;
  let floorCount = 0;

  const graphDoc = await getDoc(doc(db, 'mapData', 'graph'));
  if (graphDoc.exists()) {
    const data = graphDoc.data();
    const nodes = Array.isArray(data.nodes) ? normalizeGraphNodes(data.nodes) : [];
    if (nodes.length) {
      setRemoteGraphNodes(nodes);
      graphCount = nodes.length;
    }
  }

  const floorSnapshot = await getDocs(collection(db, 'floorPlans'));
  if (!floorSnapshot.empty) {
    const plans: Record<number, string> = {};
    floorSnapshot.forEach((floorDoc) => {
      const floor = toNumber(floorDoc.id);
      const data = floorDoc.data();
      const svg = typeof data.svg === 'string' ? data.svg : '';
      if (floor !== null && svg.trim().length > 0) {
        plans[floor] = svg;
      }
    });

    if (Object.keys(plans).length) {
      setRemoteFloorPlans(plans);
      floorCount = Object.keys(plans).length;
    }
  }

  if (graphCount === 0 && floorCount === 0) {
    return { status: 'empty', graphCount, floorCount };
  }

  console.log(`Synced map data. Nodes: ${graphCount}, Floors: ${floorCount}.`);
  return { status: 'synced', graphCount, floorCount };
};

export const uploadLocalMapDataToCloud = async () => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured. Skipping map upload.');
    return { status: 'skipped' };
  }

  const db = getFirestoreDb();
  if (!db) {
    console.log('Firebase not initialized. Skipping map upload.');
    return { status: 'skipped' };
  }

  const localNodes = getLocalGraphNodes();
  const localPlans = getLocalFloorPlans();

  await setDoc(doc(db, 'mapData', 'graph'), { nodes: localNodes }, { merge: true });

  await Promise.all(
    Object.entries(localPlans).map(([floor, svg]) =>
      setDoc(doc(db, 'floorPlans', floor), { svg }, { merge: true })
    )
  );

  console.log('Uploaded local graph and floor plans to cloud.');
  return { status: 'uploaded' };
};
