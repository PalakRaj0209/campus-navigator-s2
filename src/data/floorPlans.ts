// --- Helper to draw isometric box with INLINE styles (No CSS classes) ---
const drawIsoBox = (x: number, y: number, w: number, h: number, fill: string, stroke: string, label: string) => `
  <g transform="translate(${x},${y})">
    <!-- Top Face (Roof) -->
    <path d="M0,0 L${w},0 L${w},${h} L0,${h} Z" fill="${fill}" stroke="${stroke}" stroke-width="1" />
    
    <!-- Side Face (3D Depth) -->
    <path d="M0,${h} L${w},${h} L${w},${h+15} L0,${h+15} Z" fill="${stroke}" fill-opacity="0.6" />
    
    <!-- Label -->
    <text x="${w/2}" y="${h/2 + 5}" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="white" font-size="14">${label}</text>
  </g>
`;

// Colors Palette
const COLORS = {
  floor: "#f1f5f9",
  corridor: "#fef08a",
  corridorStroke: "#eab308",
  blueFill: "#3b82f6", blueStroke: "#1d4ed8",
  greenFill: "#22c55e", greenStroke: "#15803d",
  purpleFill: "#a855f7", purpleStroke: "#7e22ce"
};

export const Floor0SVG = `
<svg viewBox="0 0 400 600" width="400" height="600">
  <!-- Base Floor -->
  <rect width="400" height="600" fill="${COLORS.floor}" />
  
  <!-- Central Corridor -->
  <path d="M 180 580 L 220 580 L 220 180 L 180 180 Z" fill="${COLORS.corridor}" stroke="${COLORS.corridorStroke}" stroke-width="1" />

  <!-- Left Block (Blue) -->
  ${drawIsoBox(20, 160, 150, 80, COLORS.blueFill, COLORS.blueStroke, "Director")}
  ${drawIsoBox(20, 360, 150, 80, COLORS.blueFill, COLORS.blueStroke, "Security")}

  <!-- Right Block (Green) -->
  ${drawIsoBox(230, 160, 150, 80, COLORS.greenFill, COLORS.greenStroke, "Dean Acad")}
  ${drawIsoBox(230, 300, 150, 140, COLORS.greenFill, COLORS.greenStroke, "Staff Area")}

  <!-- Entrance Marker -->
  <circle cx="200" cy="560" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
  <text x="200" y="590" text-anchor="middle" font-size="10" fill="#64748b">ENTRANCE</text>
</svg>
`;

export const Floor1SVG = `
<svg viewBox="0 0 400 600" width="400" height="600">
  <rect width="400" height="600" fill="${COLORS.floor}" />
  
  <!-- Corridor -->
  <path d="M 180 350 L 220 350 L 220 100 L 180 100 Z" fill="${COLORS.corridor}" stroke="${COLORS.corridorStroke}" stroke-width="1" />
  
  <!-- Top Labs (Purple) -->
  ${drawIsoBox(20, 100, 150, 100, COLORS.purpleFill, COLORS.purpleStroke, "AI Lab")}
  ${drawIsoBox(230, 100, 150, 100, COLORS.purpleFill, COLORS.purpleStroke, "Robotics")}

  <!-- Bottom Offices (Blue) -->
  ${drawIsoBox(20, 260, 150, 80, COLORS.blueFill, COLORS.blueStroke, "HOD CSE")}
</svg>
`;

export const Floor2SVG = `
<svg viewBox="0 0 400 600" width="400" height="600">
  <rect width="400" height="600" fill="${COLORS.floor}" />
  <!-- Corridor -->
  <path d="M 180 350 L 220 350 L 220 60 L 180 60 Z" fill="${COLORS.corridor}" stroke="${COLORS.corridorStroke}" stroke-width="1" />
  
  ${drawIsoBox(20, 260, 150, 80, COLORS.greenFill, COLORS.greenStroke, "HOD EEE")}
  ${drawIsoBox(80, 80, 80, 80, COLORS.purpleFill, COLORS.purpleStroke, "Conf Hall")}
</svg>
`;

export const Floor3SVG = `
<svg viewBox="0 0 400 600" width="400" height="600">
  <rect width="400" height="600" fill="${COLORS.floor}" />
  <!-- Big Library Block -->
  ${drawIsoBox(20, 50, 360, 180, COLORS.blueFill, COLORS.blueStroke, "LIBRARY MAIN")}
  ${drawIsoBox(20, 260, 150, 80, COLORS.purpleFill, COLORS.purpleStroke, "Cafeteria")}
</svg>
`;

export const getFloorSVG = (floor: number) => {
  switch(floor) {
    case 0: return Floor0SVG;
    case 1: return Floor1SVG;
    case 2: return Floor2SVG;
    case 3: return Floor3SVG;
    default: return Floor0SVG;
  }
};
