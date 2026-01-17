const draw3DIsoBox = (x: number, y: number, w: number, h: number, fill: string, stroke: string, label: string) => {
  // Increased font-size and adjusted centering for better visibility
  return `
  <g transform="translate(${x},${y})">
    <rect x="4" y="5" width="${w}" height="${h}" fill="rgba(0,0,0,0.15)" rx="4" />
    <rect x="0" y="0" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1.2" rx="4" />
    <text 
      x="${w / 2}" 
      y="${h / 2 + 5}" 
      text-anchor="middle" 
      font-weight="bold" 
      fill="white" 
      font-size="10" 
      font-family="Arial"
    >${label}</text>
  </g>`;
};

const COLORS = {
  corridor: "#fde047", admin: "#3b82f6", lab: "#10b981", classroom: "#a855f7", facility: "#f97316", service: "#64748b",
};

// ================= GROUND FLOOR (Correct) =================
const Floor0SVG = `
<svg viewBox="0 0 500 900">
  <rect width="500" height="900" fill="#f8fafc" />
  <rect x="230" y="20" width="40" height="850" fill="${COLORS.corridor}" />
  ${draw3DIsoBox(30, 20, 200, 100, COLORS.service, "#475569", "GENTS TOILET")}
  ${draw3DIsoBox(80, 130, 150, 40, COLORS.admin, "#2563eb", "HOD-1")}
  ${draw3DIsoBox(80, 175, 150, 40, COLORS.admin, "#2563eb", "HOD-2")}
  ${draw3DIsoBox(80, 220, 150, 40, COLORS.admin, "#2563eb", "HOD-3")}
  ${draw3DIsoBox(80, 265, 150, 40, COLORS.admin, "#2563eb", "HOD-4")}
  ${draw3DIsoBox(50, 315, 180, 90, COLORS.admin, "#2563eb", "PRINCIPAL")}
  ${draw3DIsoBox(50, 415, 180, 30, COLORS.lab, "#059669", "STORE-2")}
  ${draw3DIsoBox(50, 455, 180, 30, COLORS.lab, "#059669", "STORE-1")}
  ${draw3DIsoBox(30, 495, 200, 130, COLORS.lab, "#059669", "STORE (98sqm)")}
  ${draw3DIsoBox(30, 635, 200, 130, COLORS.lab, "#059669", "ANIMAL HOUSE")}
  ${draw3DIsoBox(30, 775, 200, 100, COLORS.service, "#475569", "LADIES TOILET")}
  ${draw3DIsoBox(270, 20, 200, 100, COLORS.service, "#475569", "STAIRS")}
  ${draw3DIsoBox(270, 130, 200, 140, COLORS.lab, "#059669", "INST. ROOM")}
  ${draw3DIsoBox(270, 280, 200, 120, COLORS.admin, "#2563eb", "OFFICE")}
  ${draw3DIsoBox(270, 410, 200, 70, COLORS.service, "#475569", "4 x LIFTS")}
  ${draw3DIsoBox(270, 490, 200, 130, COLORS.lab, "#059669", "MODEL PHARM")}
  ${draw3DIsoBox(270, 630, 200, 140, COLORS.lab, "#059669", "MACHINE RM")}
  ${draw3DIsoBox(270, 780, 200, 90, COLORS.service, "#475569", "STAIRS")}
</svg>`;

// ================= 1st FLOOR (Correct) =================
const Floor1SVG = `
<svg viewBox="0 0 500 900">
  <rect width="500" height="900" fill="#f8fafc" />
  <rect x="230" y="20" width="40" height="850" fill="${COLORS.corridor}" />
  ${draw3DIsoBox(30, 20, 200, 100, COLORS.service, "#475569", "GENTS TOILET")}
  ${draw3DIsoBox(30, 130, 200, 140, COLORS.classroom, "#7e22ce", "CLASSROOM-7")}
  ${draw3DIsoBox(30, 280, 200, 140, COLORS.classroom, "#7e22ce", "CLASSROOM-6")}
  ${draw3DIsoBox(30, 430, 200, 40, COLORS.facility, "#c2410c", "STORE")}
  ${draw3DIsoBox(30, 480, 200, 120, COLORS.classroom, "#7e22ce", "CLASSROOM-5")}
  ${draw3DIsoBox(30, 610, 200, 120, COLORS.facility, "#c2410c", "GIRLS COMMON")}
  ${draw3DIsoBox(30, 740, 200, 130, COLORS.service, "#475569", "LADIES TOILET")}
  ${draw3DIsoBox(270, 20, 200, 100, COLORS.service, "#475569", "STAIRS")}
  ${draw3DIsoBox(270, 130, 200, 140, COLORS.classroom, "#7e22ce", "CLASSROOM-1")}
  ${draw3DIsoBox(270, 280, 200, 140, COLORS.classroom, "#7e22ce", "CLASSROOM-2")}
  ${draw3DIsoBox(270, 430, 200, 70, COLORS.service, "#475569", "4 x LIFTS")}
  ${draw3DIsoBox(270, 510, 200, 140, COLORS.classroom, "#7e22ce", "CLASSROOM-3")}
  ${draw3DIsoBox(270, 660, 200, 140, COLORS.classroom, "#7e22ce", "CLASSROOM-4")}
  ${draw3DIsoBox(270, 810, 200, 60, COLORS.service, "#475569", "STAIRS")}
</svg>`;

// ================= 2nd FLOOR (Corrected based on image_5cd34c.jpg) =================
const Floor2SVG = `
<svg viewBox="0 0 500 1100">
  <rect width="500" height="1100" fill="#f8fafc" />
  <rect x="230" y="20" width="40" height="1050" fill="${COLORS.corridor}" />
  ${draw3DIsoBox(30, 20, 200, 80, COLORS.service, "#475569", "GENTS TOILET")}
  ${draw3DIsoBox(30, 110, 200, 400, COLORS.admin, "#2563eb", "FACULTY ROOMS")}
  ${draw3DIsoBox(30, 520, 200, 50, COLORS.service, "#475569", "STAFF M. TOILET")}
  ${draw3DIsoBox(30, 580, 200, 50, COLORS.service, "#475569", "STAFF F. TOILET")}
  ${draw3DIsoBox(30, 640, 200, 250, COLORS.admin, "#2563eb", "FACULTY ROOMS")}
  ${draw3DIsoBox(30, 900, 200, 80, COLORS.facility, "#c2410c", "PANTRY")}
  ${draw3DIsoBox(30, 990, 200, 80, COLORS.service, "#475569", "LADIES TOILET")}
  ${draw3DIsoBox(270, 20, 200, 80, COLORS.service, "#475569", "STAIRS")}
  ${draw3DIsoBox(270, 110, 200, 250, COLORS.classroom, "#7e22ce", "COMPUTER ROOM")}
  ${draw3DIsoBox(270, 370, 200, 50, COLORS.service, "#475569", "PREP ROOM")}
  ${draw3DIsoBox(270, 430, 200, 220, COLORS.lab, "#059669", "P-BIOTECH LAB-1")}
  ${draw3DIsoBox(270, 660, 200, 60, COLORS.service, "#475569", "LIFTS")}
  ${draw3DIsoBox(270, 730, 200, 60, COLORS.service, "#475569", "STORE")}
  ${draw3DIsoBox(270, 800, 200, 180, COLORS.admin, "#2563eb", "LIBRARY")}
  ${draw3DIsoBox(270, 990, 200, 80, COLORS.service, "#475569", "STAIRS")}
</svg>`;

// ================= 3rd FLOOR (Corrected based on Screenshot 2026-01-13 201239.png) =================
const Floor3SVG = `
<svg viewBox="0 0 500 1000">
  <rect width="500" height="1000" fill="#f8fafc" />
  <rect x="230" y="20" width="40" height="950" fill="${COLORS.corridor}" />
  ${draw3DIsoBox(30, 20, 200, 100, COLORS.service, "#475569", "GENTS TOILET")}
  ${draw3DIsoBox(30, 130, 200, 180, COLORS.lab, "#059669", "P-CEUTICS LAB-3")}
  ${draw3DIsoBox(30, 320, 200, 60, COLORS.service, "#475569", "PREP ROOM")}
  ${draw3DIsoBox(30, 390, 200, 180, COLORS.lab, "#059669", "P-CHEMISTRY LAB-1")}
  ${draw3DIsoBox(30, 580, 200, 130, COLORS.lab, "#059669", "P-CHEMISTRY LAB-2")}
  ${draw3DIsoBox(30, 720, 200, 60, COLORS.service, "#475569", "PREP ROOM")}
  ${draw3DIsoBox(30, 790, 200, 100, COLORS.lab, "#059669", "P-CHEMISTRY LAB-3")}
  ${draw3DIsoBox(30, 900, 200, 80, COLORS.service, "#475569", "LADIES TOILET")}
  ${draw3DIsoBox(270, 20, 200, 100, COLORS.service, "#475569", "STAIRS")}
  ${draw3DIsoBox(270, 130, 200, 180, COLORS.lab, "#059669", "P-ANALYSIS LAB-1")}
  ${draw3DIsoBox(330, 320, 140, 80, COLORS.service, "#475569", "PREP ROOM")}
  ${draw3DIsoBox(270, 410, 200, 130, COLORS.lab, "#059669", "P-COLOGY LAB-3")}
  ${draw3DIsoBox(270, 550, 200, 80, COLORS.service, "#475569", "4 x LIFTS")}
  ${draw3DIsoBox(270, 640, 200, 130, COLORS.lab, "#059669", "P-COLOGY LAB-2")}
  ${draw3DIsoBox(330, 780, 140, 80, COLORS.service, "#475569", "PREP ROOM")}
  ${draw3DIsoBox(270, 870, 200, 100, COLORS.lab, "#059669", "P-COLOGY LAB-1")}
</svg>`;

// ================= 4th FLOOR (Corrected based on Screenshot 2026-01-13 195950.png) =================
const Floor4SVG = `
<svg viewBox="0 0 500 1000">
  <rect width="500" height="1000" fill="#f8fafc" />
  <rect x="230" y="20" width="40" height="950" fill="${COLORS.corridor}" />
  ${draw3DIsoBox(30, 20, 200, 110, COLORS.service, "#475569", "GENTS TOILET")}
  ${draw3DIsoBox(30, 140, 200, 180, COLORS.lab, "#059669", "P-CEUTICS LAB-2")}
  ${draw3DIsoBox(30, 330, 200, 60, COLORS.service, "#475569", "PREP ROOM")}
  ${draw3DIsoBox(30, 400, 200, 130, COLORS.lab, "#059669", "P-CEUTICS LAB-1")}
  ${draw3DIsoBox(30, 540, 200, 50, COLORS.service, "#475569", "STAFF TOILET")}
  ${draw3DIsoBox(30, 600, 200, 220, COLORS.admin, "#2563eb", "FACULTY ROOMS")}
  ${draw3DIsoBox(30, 830, 200, 50, COLORS.facility, "#c2410c", "PANTRY")}
  ${draw3DIsoBox(30, 890, 200, 90, COLORS.service, "#475569", "LADIES TOILET")}
  ${draw3DIsoBox(270, 20, 200, 110, COLORS.service, "#475569", "STAIRS")}
  ${draw3DIsoBox(270, 140, 200, 250, COLORS.lab, "#059669", "P-COGNOSY")}
  ${draw3DIsoBox(270, 400, 200, 90, COLORS.facility, "#c2410c", "RECREATION")}
  ${draw3DIsoBox(270, 500, 200, 90, COLORS.service, "#475569", "4 x LIFTS")}
  ${draw3DIsoBox(270, 600, 200, 150, COLORS.facility, "#c2410c", "MUSEUM")}
  ${draw3DIsoBox(270, 760, 200, 130, COLORS.lab, "#059669", "P-COGNOSY LAB-1")}
  ${draw3DIsoBox(270, 900, 200, 80, COLORS.service, "#475569", "STAIRS")}
</svg>`;

const localFloorPlans: Record<number, string> = {
  0: Floor0SVG,
  1: Floor1SVG,
  2: Floor2SVG,
  3: Floor3SVG,
  4: Floor4SVG,
};

let remoteFloorPlans: Record<number, string> | null = null;

export const setRemoteFloorPlans = (plans: Record<number, string>) => {
  if (!Object.keys(plans).length) return;
  remoteFloorPlans = plans;
};

export const getLocalFloorPlans = () => localFloorPlans;

export const getFloorSVG = (floor: number) => {
  if (remoteFloorPlans && remoteFloorPlans[floor]) {
    return remoteFloorPlans[floor];
  }
  return localFloorPlans[floor] ?? localFloorPlans[0];
};
