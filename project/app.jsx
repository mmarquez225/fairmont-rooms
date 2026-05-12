// App — main shell. Wires level state, selection, filter, comparison, tweaks.
const { useState, useEffect, useMemo, useRef } = React;

const KIND_DEFS = [
  { id: 'event',        label: 'Event' },
  { id: 'food',         label: 'F & B' },
  { id: 'service',      label: 'Service' },
  { id: 'circulation',  label: 'Circulation' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "warm",
  "showCapacity": false,
  "showCompass": true,
  "density": "comfortable",
  "accent": "#9c7a3c"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeLevel, setActiveLevel] = useState('ballroom');
  const [selectedId, setSelectedId] = useState('grand-ballroom');
  const [hoverId, setHoverId] = useState(null);
  const [filter, setFilter] = useState({ kinds: new Set(), minTheater: 0, search: '' });
  const [compare, setCompare] = useState([]);
  const [transitioning, setTransitioning] = useState(false);

  // Cross-fade between floor SVGs when level changes
  const handleLevelChange = (id) => {
    if (id === activeLevel) return;
    setTransitioning(true);
    setSelectedId(null);
    setHoverId(null);
    setTimeout(() => {
      setActiveLevel(id);
      setTimeout(() => setTransitioning(false), 60);
    }, 220);
  };

  const level = LEVELS.find((l) => l.id === activeLevel);
  const rooms = ROOMS[activeLevel] || [];
  const selected = rooms.find((r) => r.id === selectedId) || null;

  const roomCounts = useMemo(() => {
    const out = {};
    LEVELS.forEach((lv) => {
      out[lv.id] = (ROOMS[lv.id] || []).filter((r) => r.kind === 'event').length;
    });
    return out;
  }, []);

  const totalEvent = rooms.filter((r) => r.kind === 'event').length;
  const matchEvent = rooms.filter((r) => {
    if (r.kind !== 'event') return false;
    if (filter.kinds.size && !filter.kinds.has(r.kind)) return false;
    if (filter.minTheater) {
      const cap = r.capacity?.theater || r.capacity?.reception || 0;
      if (cap < filter.minTheater) return false;
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      if (q && !r.name.toLowerCase().includes(q)) return false;
    }
    return true;
  }).length;

  const addCompare = (room) => {
    setCompare((prev) => {
      if (prev.find((r) => r.id === room.id)) return prev.filter((r) => r.id !== room.id);
      if (prev.length >= 4) return [...prev.slice(1), room];
      return [...prev, room];
    });
  };

  // Apply theme + density to root
  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    document.documentElement.dataset.density = tweaks.density;
    document.documentElement.style.setProperty('--accent-user', tweaks.accent);
  }, [tweaks.theme, tweaks.density, tweaks.accent]);

  // Keyboard nav across floors
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const i = LEVELS.findIndex((l) => l.id === activeLevel);
      if (e.key === 'ArrowUp' && i < LEVELS.length - 1) handleLevelChange(LEVELS[i + 1].id);
      if (e.key === 'ArrowDown' && i > 0) handleLevelChange(LEVELS[i - 1].id);
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeLevel]);

  return (
    <div className="app" data-screen-label="Floor Plan">
      <header className="topbar">
        <div className="topbar__brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><rect x="2" y="6" width="20" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1"/><line x1="12" y1="6" x2="12" y2="20" stroke="currentColor" strokeWidth="1"/></svg>
          </div>
          <div className="brand-text">
            <div className="brand-text__name">Atrium Hotel</div>
            <div className="brand-text__sub">Event Spaces · Floor Plan</div>
          </div>
        </div>
        <nav className="topbar__nav">
          <button className="topbar__link is-active">Floor plan</button>
          <button className="topbar__link">All rooms</button>
          <button className="topbar__link">Saved</button>
        </nav>
        <div className="topbar__cta">
          <button className="btn btn--small btn--ghost">Download PDF</button>
          <button className="btn btn--small btn--primary">Request quote</button>
        </div>
      </header>

      <main className="layout">
        <LevelSwitcher
          levels={LEVELS}
          activeId={activeLevel}
          onChange={handleLevelChange}
          roomCounts={roomCounts}
        />

        <section className="stage">
          <div className="stage__head">
            <div>
              <div className="eyebrow">Level {level.ordinal} of {LEVELS.length}</div>
              <h1 className="stage__title">{level.label}</h1>
              <p className="stage__blurb">{level.blurb}</p>
            </div>
            <div className="stage__head-meta">
              <span className="meta-pill">
                <span className="meta-pill__k">{rooms.filter(r=>r.kind==='event').length}</span> event rooms
              </span>
              <span className="meta-pill">
                <span className="meta-pill__k">
                  {rooms.filter(r=>r.kind==='event').reduce((s,r)=>s+(r.area||0),0).toLocaleString()}
                </span> sq ft total
              </span>
            </div>
          </div>

          <div className={`plan-frame ${transitioning ? 'is-fading' : ''}`}>
            <FloorPlan
              level={level}
              rooms={rooms}
              selectedId={selectedId}
              hoverId={hoverId}
              onSelect={setSelectedId}
              onHover={setHoverId}
              filter={filter}
              showCapacity={tweaks.showCapacity}
              showCompass={tweaks.showCompass}
            />
            <div className="plan-frame__corner plan-frame__corner--tl"/>
            <div className="plan-frame__corner plan-frame__corner--tr"/>
            <div className="plan-frame__corner plan-frame__corner--bl"/>
            <div className="plan-frame__corner plan-frame__corner--br"/>
          </div>

          <ComparisonTray
            items={compare}
            onRemove={(id) => setCompare((p) => p.filter((r) => r.id !== id))}
            onClear={() => setCompare([])}
            onSelect={(r) => {
              // jump to whichever level holds this room
              const lv = Object.entries(ROOMS).find(([, rs]) => rs.some((x) => x.id === r.id));
              if (lv && lv[0] !== activeLevel) handleLevelChange(lv[0]);
              setSelectedId(r.id);
            }}
          />
        </section>

        <div className="sidebar">
          <FilterPanel
            filter={filter}
            setFilter={setFilter}
            kinds={KIND_DEFS}
            totalEvent={totalEvent}
            matchEvent={matchEvent}
          />
          <DetailPanel
            room={selected}
            level={level}
            onClose={() => setSelectedId(null)}
            onAddCompare={addCompare}
            inCompare={!!compare.find((r) => r.id === selected?.id)}
          />
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakRadio
            label="Mood"
            value={tweaks.theme}
            onChange={(v) => setTweak('theme', v)}
            options={[
              { label: 'Warm', value: 'warm' },
              { label: 'Blueprint', value: 'blueprint' },
              { label: 'Night', value: 'night' },
            ]}
          />
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#9c7a3c', '#3a5a8a', '#7a3c3c', '#5b6b3a']}
          />
        </TweakSection>
        <TweakSection title="Plan">
          <TweakToggle
            label="Capacity overlay"
            value={tweaks.showCapacity}
            onChange={(v) => setTweak('showCapacity', v)}
          />
          <TweakToggle
            label="Compass"
            value={tweaks.showCompass}
            onChange={(v) => setTweak('showCompass', v)}
          />
          <TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { label: 'Compact', value: 'compact' },
              { label: 'Comfortable', value: 'comfortable' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
