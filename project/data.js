// Room + level data for the interactive floor plan.
// Geometry is schematic — rooms positioned approximately within each level's
// 1000x640 SVG canvas. North is up; California Street is at the top, Mason at
// the right. Coordinates are [x, y, w, h] in SVG units.

const LEVELS = [
  { id: 'lobby',    label: 'Lobby',          ordinal: 1, blurb: 'Arrival. Restaurants, bar, services.' },
  { id: 'terrace',  label: 'Terrace',        ordinal: 2, blurb: 'Mid-size meeting + breakout rooms.' },
  { id: 'mezz',     label: 'Mezzanine',      ordinal: 3, blurb: 'Salons. The Diplomat Club tier.' },
  { id: 'ballroom', label: 'Grand Ballroom', ordinal: 4, blurb: 'The headline floor. One large room.' },
  { id: 'crown',    label: 'Crown',          ordinal: 5, blurb: 'Skybox meeting suites + lounge.' },
  { id: 'roof',     label: 'Roof Garden',    ordinal: 6, blurb: 'Open-air reception space.' },
];

// kind: 'event' | 'service' | 'circulation' | 'food'
// shape: rect [x,y,w,h] OR poly: 'M ... Z'
const ROOMS = {
  // ---------- LOBBY LEVEL ----------
  lobby: [
    { id: 'main-entrance', name: 'Main Entrance', kind: 'circulation', rect: [430, 580, 140, 40] },
    { id: 'concierge', name: 'Concierge / Bell Stand', kind: 'service', rect: [430, 510, 140, 60] },
    { id: 'main-lobby', name: 'Main Lobby', kind: 'circulation', rect: [340, 360, 320, 140],
      detail: 'The hotel\u2019s grand arrival hall — soaring ceilings, marble columns, seating clusters.' },
    { id: 'front-desk', name: 'Front Desk', kind: 'service', rect: [670, 360, 100, 140] },
    { id: 'main-elevators', name: 'Main Elevators', kind: 'circulation', rect: [220, 360, 110, 80] },
    { id: 'laurel-rest', name: 'Laurel Court Restaurant', kind: 'food', rect: [60, 200, 260, 200],
      capacity: { seated: 180 }, area: 4200,
      detail: 'Signature restaurant beneath a stained-glass dome.' },
    { id: 'laurel-bar', name: 'Laurel Court Bar', kind: 'food', rect: [60, 410, 150, 90],
      capacity: { seated: 60 }, area: 1100 },
    { id: 'tonga', name: 'Tonga Restaurant', kind: 'food', rect: [60, 60, 200, 130],
      capacity: { seated: 150 }, area: 3600,
      detail: 'Tiki-bar institution with a rain show over the lagoon.' },
    { id: 'health-club', name: 'Health Club & Spa', kind: 'service', rect: [280, 60, 200, 130], area: 3000 },
    { id: 'cirque', name: 'Cirque Room', kind: 'event', rect: [500, 60, 130, 100],
      capacity: { theater: 80, banquet: 60, reception: 100 }, area: 1450, ceiling: 11 },
    { id: 'french', name: 'French Room', kind: 'event', rect: [640, 60, 130, 100],
      capacity: { theater: 90, banquet: 70, reception: 120 }, area: 1620, ceiling: 11 },
    { id: 'garden', name: 'Garden Room', kind: 'event', rect: [780, 60, 150, 100],
      capacity: { theater: 110, banquet: 90, reception: 150 }, area: 1980, ceiling: 11,
      detail: 'Light-filled corner room overlooking the courtyard.' },
    { id: 'loggia', name: 'Loggia', kind: 'circulation', rect: [500, 170, 430, 30] },
    { id: 'green', name: 'Green Room', kind: 'event', rect: [780, 210, 150, 80],
      capacity: { theater: 50, banquet: 40, reception: 70 }, area: 980 },
    { id: 'empire', name: 'Empire Room', kind: 'event', rect: [780, 300, 150, 90],
      capacity: { theater: 70, banquet: 50, reception: 80 }, area: 1180 },
  ],

  // ---------- TERRACE LEVEL ----------
  terrace: [
    { id: 'terrace-room', name: 'Terrace Room', kind: 'event', rect: [60, 60, 380, 220],
      capacity: { theater: 350, banquet: 240, reception: 450, classroom: 180 }, area: 5400, ceiling: 14,
      detail: 'Wide pre-function-friendly room with twin entrances onto the foyer.' },
    { id: 'vanderbilt', name: 'Vanderbilt Room', kind: 'event', rect: [60, 300, 220, 160],
      capacity: { theater: 110, banquet: 80, reception: 140 }, area: 2100, ceiling: 12 },
    { id: 'cloak-t', name: 'Cloak Room', kind: 'service', rect: [300, 300, 140, 60] },
    { id: 'main-stairs', name: 'Main Stairs', kind: 'circulation', rect: [300, 380, 140, 80] },
    { id: 'foyer-t', name: 'Foyer', kind: 'circulation', rect: [60, 470, 600, 50] },
    { id: 'state-room', name: 'State Room', kind: 'event', rect: [480, 60, 220, 220],
      capacity: { theater: 180, banquet: 140, reception: 220 }, area: 3200, ceiling: 14 },
    { id: 'pavilion', name: 'Pavilion Room', kind: 'event', rect: [720, 60, 210, 220],
      capacity: { theater: 200, banquet: 160, reception: 260 }, area: 3600, ceiling: 14,
      detail: 'Adjacent to State Room — combinable for larger events.' },
    { id: 'biz-center', name: 'Executive Business Center', kind: 'service', rect: [480, 300, 200, 90] },
    { id: 'catering', name: 'Catering Office', kind: 'service', rect: [700, 300, 230, 90] },
    { id: 'main-elev-t', name: 'Main Elevators', kind: 'circulation', rect: [700, 410, 110, 80] },
    { id: 'tower-elev-t', name: 'Tower Elevators', kind: 'circulation', rect: [820, 410, 110, 80] },
  ],

  // ---------- MEZZANINE LEVEL ----------
  mezz: [
    { id: 'crystal', name: 'Crystal Room', kind: 'event', rect: [60, 60, 240, 200],
      capacity: { theater: 220, banquet: 160, reception: 280, classroom: 120 }, area: 3400, ceiling: 16,
      detail: 'Cut-crystal chandeliers, mirrored walls. The mezzanine\u2019s show salon.' },
    { id: 'venetian', name: 'Venetian Room', kind: 'event', rect: [320, 60, 280, 200],
      capacity: { theater: 320, banquet: 240, reception: 400 }, area: 4800, ceiling: 18,
      detail: 'Legendary supper-club room with raised stage.' },
    { id: 'gold', name: 'Gold Room', kind: 'event', rect: [620, 60, 240, 200],
      capacity: { theater: 220, banquet: 160, reception: 280 }, area: 3400, ceiling: 16 },
    { id: 'fountain', name: 'Fountain Room', kind: 'event', rect: [60, 290, 200, 130],
      capacity: { theater: 90, banquet: 70, reception: 120 }, area: 1600, ceiling: 12 },
    { id: 'diplomat-foyer', name: 'Diplomat Foyer', kind: 'circulation', rect: [280, 290, 320, 130] },
    { id: 'intersect', name: 'Intersect', kind: 'event', rect: [620, 290, 240, 130],
      capacity: { theater: 80, banquet: 60, reception: 110 }, area: 1500,
      detail: 'Flexible breakout / co-working salon.' },
    { id: 'mezz-elev', name: 'Main Elevators', kind: 'circulation', rect: [640, 440, 110, 80] },
  ],

  // ---------- GRAND BALLROOM LEVEL ----------
  ballroom: [
    { id: 'grand-ballroom', name: 'Grand Ballroom', kind: 'event', rect: [120, 60, 760, 320],
      capacity: { theater: 1400, banquet: 1000, reception: 2000, classroom: 700 }, area: 16800, ceiling: 24,
      detail: 'The headline space. Coffered ceilings, gilded plasterwork, full-stage capability.' },
    { id: 'lounge-b', name: 'Lounge', kind: 'event', rect: [120, 400, 380, 100],
      capacity: { reception: 200 }, area: 2400 },
    { id: 'vestibule', name: 'Entrance Vestibule', kind: 'circulation', rect: [520, 400, 220, 100] },
    { id: 'cloakroom-b', name: 'Cloakroom', kind: 'service', rect: [760, 400, 120, 100] },
    { id: 'tower-elev-b', name: 'Tower Elevators', kind: 'circulation', rect: [120, 520, 200, 60] },
    { id: 'main-elev-b', name: 'Main Elevators', kind: 'circulation', rect: [340, 520, 200, 60] },
    { id: 'mens-b', name: 'Men', kind: 'service', rect: [560, 520, 140, 60] },
    { id: 'womens-b', name: 'Women', kind: 'service', rect: [720, 520, 160, 60] },
  ],

  // ---------- CROWN LEVEL ----------
  crown: [
    { id: 'crown-room', name: 'The Crown Room', kind: 'event', rect: [60, 60, 460, 240],
      capacity: { theater: 200, banquet: 140, reception: 250 }, area: 3600, ceiling: 11,
      detail: 'Top-floor lounge — wraparound views of the city and bay.' },
    { id: 'international', name: 'International Room', kind: 'event', rect: [540, 60, 200, 110],
      capacity: { theater: 70, banquet: 50, reception: 90 }, area: 1080 },
    { id: 'far-east', name: 'Far East Room', kind: 'event', rect: [760, 60, 170, 110],
      capacity: { theater: 60, banquet: 40, reception: 75 }, area: 950 },
    { id: 'hunt', name: 'Hunt Room', kind: 'event', rect: [540, 190, 170, 110],
      capacity: { theater: 60, banquet: 40, reception: 75 }, area: 950 },
    { id: 'california-rm', name: 'California Room', kind: 'event', rect: [730, 190, 200, 110],
      capacity: { theater: 80, banquet: 60, reception: 100 }, area: 1180 },
    { id: 'registration', name: 'Registration Area', kind: 'service', rect: [60, 320, 460, 60] },
    { id: 'crown-elev', name: 'Tower Elevators', kind: 'circulation', rect: [540, 320, 200, 60] },
    { id: 'crown-stairs', name: 'Stairs / Escalator', kind: 'circulation', rect: [760, 320, 170, 60] },
  ],

  // ---------- ROOF GARDEN ----------
  roof: [
    { id: 'roof-lawn', name: 'Roof Garden Lawn', kind: 'event', rect: [80, 80, 600, 400],
      capacity: { reception: 600, banquet: 320 }, area: 12000,
      detail: 'Open-air ceremony + cocktail space. Skyline backdrop on three sides.' },
    { id: 'roof-pavilion', name: 'Garden Pavilion', kind: 'event', rect: [720, 80, 220, 240],
      capacity: { theater: 140, banquet: 100, reception: 180 }, area: 2400,
      detail: 'Tented covered space adjoining the lawn.' },
    { id: 'roof-bar', name: 'Garden Bar', kind: 'food', rect: [720, 340, 220, 90] },
    { id: 'roof-elev', name: 'Tower Elevators', kind: 'circulation', rect: [720, 450, 220, 60] },
  ],
};

if (typeof window !== 'undefined') {
  window.LEVELS = LEVELS;
  window.ROOMS = ROOMS;
}


