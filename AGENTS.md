# Project Context (Campus Navigator S2)

## Overview
- Expo React Native app for indoor campus navigation.
- Entry point: `App.tsx` initializes SQLite (seed + init) and mounts `AppNavigator`.
- Navigation: Stack + bottom tabs in `src/navigation/AppNavigator.tsx`.

## Run / Develop
- Install: `npm install`
- Start: `npm run start`
- Platforms: `npm run android`, `npm run ios`, `npm run web`

## Key Paths
- Screens: `src/screens/*.tsx`
- Navigation: `src/navigation/AppNavigator.tsx`
- Data: `src/data/graph.ts`, `src/data/floorPlans.ts`
- Routing helpers: `src/services/routing.ts`, `src/services/navigationEngine.ts`
- Sensors: `src/services/stepSensor.ts`, `src/services/position.ts`
- State store: `src/stores/appStore.ts`
- DB: `src/db/database.ts`
- Config: `src/config.ts` (Firebase + LLM proxy)
- App config: `app.json` (permissions/plugins)

## Data Model Notes
- `src/data/graph.ts` only defines nodes for floors 0-1.
- `src/data/floorPlans.ts` defines SVGs for floors 0-4.
- Keep graph nodes, seed data, and People/Home lists in sync when adding rooms.

## Navigation Flow
- Stack: `BuildingSelector` -> `Main` tabs -> `FloorMap`, `RouteView`, `Chatbot`.
- Tabs: `HomeScreen` (Navigate), `PeopleScreen`, `SafetyScreen`.

## Database Behavior
- SQLite uses synchronous API (expo-sqlite).
- `getPersonByName` returns `Person | null` synchronously (not a Promise).
- `seedDB` clears and repopulates `personnel` on app start.
- `syncPersonnelFromCloud` can upsert Firestore data into SQLite (optional).

## Routing + Position
- `routing.ts` builds corridor polyline using `CORRIDOR_X` and node coordinates.
- `stepSensor.ts` uses pedometer first, falls back to accelerometer.
- `position.ts` uses magnetometer to rotate the user arrow.

## Cloud + LLM (Optional)
- Firebase config lives in `src/config.ts` (leave empty to disable sync).
- Gemini API key and model live in `src/config.ts` for direct calls (hackathon setup).
- Map data (graph + floor plans) can sync via Firestore using `src/services/mapSync.ts`.

## Permissions / Runtime
- Camera permission is requested at runtime via `expo-camera` (`HomeScreen` modal + `QRScannerScreen`).
- Android permissions in `app.json` include `ACTIVITY_RECOGNITION` and `ACCESS_FINE_LOCATION`.
- `expo-sqlite` and `expo-barcode-scanner` plugins are enabled in `app.json`.

## Screen Notes
- `HomeScreen` includes an inline QR scanner modal and a floating action button (FAB).
- `QRScannerScreen` exists but is not wired into the navigator by default.

## Known Pitfalls (Fix Before Using)
- `src/screens/ReadyScreen.tsx` has merge conflict markers.
- `src/services/routingService.ts` imports `graph`/`Node` that do not exist.
- `src/utils/dijkstra.ts` imports `GraphData` that is not defined in `graph.ts`.

## Repo Layout Warning
- There is a duplicate nested folder `campus-navigator-s2/campus-navigator-s2`.
- Prefer the top-level project unless explicitly told otherwise.
