# 📍 Campus Navigator - SBU 
**Indoor Navigation & Personnel Locator with AI Assistant**

An advanced React Native application designed for **Sarala Birla University** to solve indoor navigation challenges. The app features real-time pathfinding, QR-based "teleportation," and voice-guided directions across multiple floors.

---

## 🚀 Key Features

### 🔍 Intelligent Search & Directory
* Google-style search bar on the Home Tab to find rooms, departments, or specific personnel.
* Dynamic filtering for HODs, Principal, and specific labs.

### 📸 Smart QR Scanner
* Instant location pinpointing by scanning room-specific QR codes.
* **Smart Parsing:** Handles both raw strings (`f0_principal`) and professional JSON formats (`{"id": "f0_principal"}`).

### 🗺️ Multi-Floor Navigation Logic
* **Pathfinding:** Dijkstra-inspired routing that connects corridor nodes (CORRIDOR_X) to specific room entrances.
* **Floor Transitions:** Intelligent handling of transitions via Lifts ($Y \approx 445$) and Stairs ($Y \approx 70, 825$).
* **Teleportation:** QR codes act as a "You are here" marker to reset the navigation start point instantly.

### 🎙️ AI Voice & Sensor Integration
* **Pedometer:** Real-time movement tracking using the phone's physical step sensor.
* **Magnetometer:** Map rotation synced with the user's physical orientation (compass).
* **Voice Assistant:** Real-time instructions including "Turn ahead," "Go straight," and side-specific arrival alerts ("Turn Left, you have arrived").
* **Mute/Unmute:** Fully functional voice toggle for discreet navigation.

---

## 🛠 Technical Stack
* **Framework:** React Native (Expo)
* **Language:** TypeScript
* **Graphics:** SVG (Scalable Vector Graphics) for high-fidelity floor plans.
* **State Management:** Zustand (AppStore)
* **Sensors:** `expo-sensors` (Pedometer, Magnetometer)
* **Audio:** `expo-speech`

---

## 📂 Project Architecture



- **/src/screens/**: 
    - `HomeScreen.tsx`: Search and QR entry point.
    - `FloorMapScreen.tsx`: The core navigation engine.
    - `QRScannerScreen.tsx`: Camera interface.
- **/src/data/**: 
    - `graph.ts`: Defines coordinate mapping for all 30+ nodes in the Academic Block.
    - `floorPlans.ts`: SVG XML data for Ground and First Floor.
- **/src/services/**: 
    - `routing.ts`: Logic for drawing the dashed Polyline path.
    - `stepSensor.ts`: Calibrated pedometer logic.

---

## ⚙️ Advanced Logic (For Judges)

### 1. The "Start Floor" Handshake
Upon selecting a destination, the app triggers a **"Start Floor?"** popup. This ensures the coordinate system is calibrated to the user's current physical level before drawing the path.

### 2. Voice Guidance Cooldown
To prevent audio overlapping, we implemented a **3000ms cooldown** for repeated instructions. This prevents the "Turn Ahead" loop while the user is mid-turn.

### 3. Arrival Calibration
The app detects the room's X-position relative to the main corridor to announce if the room is on the **Left** or **Right** upon arrival.

---

## 🧪 Demo Instructions
1. **Search:** Search "Principal" and start navigation.
2. **QR Scan:** Scan the `f1_classroom_3` code to trigger a multi-floor "Travel via Lift" prompt.
3. **Calibrate:** Use the **+/- Speed** buttons to sync the arrow to your walking pace.
4. **End:** Tap the **End** button to reset the AppStore state.

---

## 👥 The Team
* **Palak:** Lead Developer (Mobile Architecture & Navigation Logic)
* **Rohit:** UI/UX & Component Integration
* **Kajal:** Data Entry & Graph/SVG Coordinate Mapping
* **Mentor:** Abhijeet Das Gupta

---
© 2026 Sarala Birla University Hackathon Project