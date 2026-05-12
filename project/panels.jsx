// FilterPanel + DetailPanel + LevelSwitcher + ComparisonTray
const { useState, useEffect, useMemo } = React;

function LevelSwitcher({ levels, activeId, onChange, roomCounts }) {
  return (
    <nav className="level-switcher" aria-label="Floor level">
      <div className="level-switcher__rail">
        {[...levels].reverse().map((lv) => {
          const active = lv.id === activeId;
          return (
            <button
              key={lv.id}
              className={`level-tick ${active ? 'is-active' : ''}`}
              onClick={() => onChange(lv.id)}
              aria-pressed={active}
            >
              <span className="level-tick__num">L{lv.ordinal}</span>
              <span className="level-tick__label">{lv.label}</span>
              <span className="level-tick__count">{roomCounts[lv.id] ?? 0} rooms</span>
              <span className="level-tick__dot" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function FilterPanel({ filter, setFilter, kinds, totalEvent, matchEvent }) {
  const toggleKind = (k) => {
    const next = new Set(filter.kinds);
    if (next.has(k)) next.delete(k); else next.add(k);
    setFilter({ ...filter, kinds: next });
  };
  const sizeStops = [0, 50, 100, 200, 400, 800];
  return (
    <aside className="filter-panel">
      <header className="filter-panel__head">
        <span className="eyebrow">Filter</span>
        <span className="filter-panel__count">
          <strong>{matchEvent}</strong> / {totalEvent} event rooms
        </span>
      </header>

      <label className="filter-search">
        <span className="vh">Search</span>
        <input
          type="text"
          placeholder="Search rooms…"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
      </label>

      <div className="filter-block">
        <div className="filter-label">Min. theater capacity</div>
        <div className="cap-stops">
          {sizeStops.map((n) => (
            <button
              key={n}
              className={`cap-stop ${filter.minTheater === n ? 'is-active' : ''}`}
              onClick={() => setFilter({ ...filter, minTheater: n })}
            >
              {n === 0 ? 'Any' : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-label">Show types</div>
        <div className="kind-chips">
          {kinds.map((k) => {
            const on = filter.kinds.has(k.id);
            return (
              <button
                key={k.id}
                className={`kind-chip kind-chip--${k.id} ${on ? 'is-on' : ''}`}
                onClick={() => toggleKind(k.id)}
              >
                <span className="kind-chip__dot" />
                {k.label}
              </button>
            );
          })}
        </div>
      </div>

      {(filter.kinds.size > 0 || filter.minTheater > 0 || filter.search) && (
        <button
          className="filter-clear"
          onClick={() => setFilter({ kinds: new Set(), minTheater: 0, search: '' })}
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}

function CapacityBar({ label, n, max }) {
  if (!n) return null;
  const pct = Math.min(100, (n / max) * 100);
  return (
    <div className="cap-bar">
      <div className="cap-bar__row">
        <span className="cap-bar__label">{label}</span>
        <span className="cap-bar__n">{n.toLocaleString()}</span>
      </div>
      <div className="cap-bar__track"><div className="cap-bar__fill" style={{ width: pct + '%' }} /></div>
    </div>
  );
}

function DetailPanel({ room, level, onClose, onAddCompare, inCompare }) {
  if (!room) {
    return (
      <aside className="detail-panel detail-panel--empty">
        <div className="detail-empty">
          <span className="eyebrow">Select a room</span>
          <p>Tap any room on the plan to see capacity, dimensions, and suggested layouts.</p>
          <ul className="detail-legend">
            <li><span className="kind-dot kind-dot--event" /> Event space</li>
            <li><span className="kind-dot kind-dot--food" /> Food &amp; beverage</li>
            <li><span className="kind-dot kind-dot--service" /> Services</li>
            <li><span className="kind-dot kind-dot--circulation" /> Circulation</li>
          </ul>
        </div>
      </aside>
    );
  }
  const cap = room.capacity || {};
  const max = Math.max(cap.theater || 0, cap.reception || 0, cap.banquet || 0, cap.classroom || 0, cap.seated || 0, 1);
  return (
    <aside className="detail-panel">
      <button className="detail-close" onClick={onClose} aria-label="Close">×</button>
      <span className="eyebrow">{level.label} · L{level.ordinal}</span>
      <h2 className="detail-title">{room.name}</h2>
      {room.detail && <p className="detail-blurb">{room.detail}</p>}

      <div className="detail-stats">
        {room.area && (
          <div className="detail-stat">
            <span className="detail-stat__label">Area</span>
            <span className="detail-stat__value">{room.area.toLocaleString()}<small> sq ft</small></span>
          </div>
        )}
        {room.ceiling && (
          <div className="detail-stat">
            <span className="detail-stat__label">Ceiling</span>
            <span className="detail-stat__value">{room.ceiling}<small> ft</small></span>
          </div>
        )}
        <div className="detail-stat">
          <span className="detail-stat__label">Type</span>
          <span className="detail-stat__value detail-stat__value--text">{room.kind}</span>
        </div>
      </div>

      {/* Photo slot */}
      <div className="detail-photo" role="img" aria-label="Room photo placeholder">
        <span className="detail-photo__chip">Photo · {room.name}</span>
      </div>

      {Object.keys(cap).length > 0 && (
        <div className="detail-section">
          <div className="detail-section__head">
            <span className="eyebrow">Capacity by layout</span>
          </div>
          <div className="cap-bars">
            <CapacityBar label="Theater" n={cap.theater} max={max} />
            <CapacityBar label="Reception" n={cap.reception} max={max} />
            <CapacityBar label="Banquet" n={cap.banquet} max={max} />
            <CapacityBar label="Classroom" n={cap.classroom} max={max} />
            <CapacityBar label="Seated" n={cap.seated} max={max} />
          </div>
        </div>
      )}

      <div className="detail-actions">
        <button className="btn btn--primary">Request this room</button>
        <button
          className={`btn btn--ghost ${inCompare ? 'is-on' : ''}`}
          onClick={() => onAddCompare(room)}
        >
          {inCompare ? '✓ In compare' : '+ Compare'}
        </button>
      </div>
    </aside>
  );
}

function ComparisonTray({ items, onRemove, onClear, onSelect }) {
  if (!items.length) return null;
  return (
    <div className="compare-tray">
      <div className="compare-tray__head">
        <span className="eyebrow">Comparing {items.length}</span>
        <button className="compare-tray__clear" onClick={onClear}>Clear</button>
      </div>
      <div className="compare-tray__items">
        {items.map((r) => (
          <div key={r.id} className="compare-card">
            <button className="compare-card__x" onClick={() => onRemove(r.id)} aria-label="Remove">×</button>
            <button className="compare-card__main" onClick={() => onSelect(r)}>
              <div className="compare-card__name">{r.name}</div>
              <div className="compare-card__stat">{r.area ? `${r.area.toLocaleString()} sf` : '—'}</div>
              <div className="compare-card__stat">{r.capacity?.theater ? `${r.capacity.theater} theater` : ''}</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { LevelSwitcher, FilterPanel, DetailPanel, ComparisonTray });
