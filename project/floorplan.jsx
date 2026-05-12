// FloorPlan — renders the SVG schematic for the active level.
// Rooms are clickable, hoverable, and respond to filter/highlight state.

const PLAN_W = 1000;
const PLAN_H = 640;

function FloorPlan({
  level,
  rooms,
  selectedId,
  hoverId,
  onSelect,
  onHover,
  filter,           // { minTheater, kinds: Set, search }
  showCapacity,     // bool — overlay capacity numbers on event rooms
  showCompass,      // bool
}) {
  // Determine which rooms pass the filter
  const matchesFilter = (r) => {
    if (!filter) return true;
    if (filter.kinds && filter.kinds.size && !filter.kinds.has(r.kind)) return false;
    if (filter.minTheater) {
      const cap = r.capacity?.theater || r.capacity?.reception || 0;
      if (cap < filter.minTheater) return false;
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      if (q && !r.name.toLowerCase().includes(q)) return false;
    }
    return true;
  };

  const labelFor = (r) => r.name.replace(/ Room$/i, '');

  return (
    <svg
      viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
      className="floorplan-svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${level.label} floor plan`}
    >
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-30)" strokeWidth="1"/>
        </pattern>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Building footprint outline */}
      <rect x="20" y="20" width={PLAN_W - 40} height={PLAN_H - 40}
            fill="none" stroke="var(--ink-20)" strokeWidth="1" strokeDasharray="2 4" rx="4" />

      {/* Street labels */}
      <g className="street-labels" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-50)" letterSpacing="2">
        <text x={PLAN_W/2} y="14" textAnchor="middle">CALIFORNIA STREET</text>
        <text x={PLAN_W/2} y={PLAN_H - 4} textAnchor="middle">SACRAMENTO STREET</text>
        <text x="14" y={PLAN_H/2} textAnchor="middle" transform={`rotate(-90 14 ${PLAN_H/2})`}>POWELL ST</text>
        <text x={PLAN_W - 14} y={PLAN_H/2} textAnchor="middle" transform={`rotate(90 ${PLAN_W - 14} ${PLAN_H/2})`}>MASON STREET</text>
      </g>

      {/* Rooms */}
      {rooms.map((r) => {
        const [x, y, w, h] = r.rect;
        const isSelected = selectedId === r.id;
        const isHover = hoverId === r.id;
        const passes = matchesFilter(r);
        const dim = filter && (filter.kinds?.size || filter.minTheater || filter.search) && !passes;
        const isClickable = r.kind === 'event' || r.kind === 'food';

        return (
          <g
            key={r.id}
            className={[
              'room',
              `room--${r.kind}`,
              isSelected && 'is-selected',
              isHover && 'is-hover',
              dim && 'is-dim',
              isClickable && 'is-clickable',
            ].filter(Boolean).join(' ')}
            onMouseEnter={() => onHover(r.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => isClickable && onSelect(r.id)}
          >
            <rect
              x={x} y={y} width={w} height={h}
              rx="2"
              className="room-rect"
            />
            {/* hatch overlay for service / circulation */}
            {(r.kind === 'circulation') && (
              <rect x={x} y={y} width={w} height={h} fill="url(#hatch)" opacity="0.35" pointerEvents="none" rx="2"/>
            )}
            {/* selection corner ticks */}
            {(isSelected || isHover) && (
              <g className="room-ticks" pointerEvents="none">
                {[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([cx,cy], i) => {
                  const dx = i%2 === 0 ? 1 : -1;
                  const dy = i < 2 ? 1 : -1;
                  return (
                    <g key={i}>
                      <line x1={cx} y1={cy} x2={cx + dx*10} y2={cy} />
                      <line x1={cx} y1={cy} x2={cx} y2={cy + dy*10} />
                    </g>
                  );
                })}
              </g>
            )}

            {/* Label */}
            <text
              x={x + w/2} y={y + h/2 - (showCapacity && r.capacity ? 6 : 0)}
              textAnchor="middle" dominantBaseline="middle"
              className="room-label"
              fontSize={Math.min(15, Math.max(10, w/14))}
            >
              {labelFor(r)}
            </text>
            {/* Capacity overlay */}
            {showCapacity && r.capacity && (
              <text
                x={x + w/2} y={y + h/2 + 12}
                textAnchor="middle" dominantBaseline="middle"
                className="room-cap"
                fontSize="10"
              >
                {r.capacity.theater ? `${r.capacity.theater} theater` :
                 r.capacity.reception ? `${r.capacity.reception} reception` :
                 r.capacity.seated ? `${r.capacity.seated} seated` : ''}
              </text>
            )}
          </g>
        );
      })}

      {/* Compass */}
      {showCompass && (
        <g transform={`translate(${PLAN_W - 60}, 50)`} className="compass">
          <circle r="22" fill="var(--paper)" stroke="var(--ink-30)" />
          <line x1="0" y1="-18" x2="0" y2="18" stroke="var(--ink-50)" strokeWidth="1"/>
          <polygon points="0,-18 -4,-8 4,-8" fill="var(--accent)" />
          <text y="-26" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--ink-70)" letterSpacing="2">N</text>
        </g>
      )}
    </svg>
  );
}

window.FloorPlan = FloorPlan;
