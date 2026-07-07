/* =========================================================
   ALGORITHM VISUALIZER — STYLESHEET
   Token system
   Color   : bg #0A0D12, surface #10151D, raised #161C26,
             border #232B38, text #E7ECF3, muted #8B95A7,
             teal #00D9C0 (primary accent / active state),
             violet #7C5CFF (secondary accent / graph),
             amber #FFB454 (comparing state),
             green #3ECF8E (sorted / found state)
   Type    : Display -> 'Space Grotesk', Body -> 'Inter',
             Data/Code -> 'JetBrains Mono'
   ========================================================= */

:root {
  --bg: #0a0d12;
  --surface: #10151d;
  --surface-raised: #161c26;
  --surface-hover: #1c2330;
  --border: #232b38;
  --border-soft: #1a212c;

  --text-primary: #e7ecf3;
  --text-secondary: #b7c0d1;
  --text-muted: #8b95a7;
  --text-faint: #576174;

  --accent-teal: #00d9c0;
  --accent-teal-dim: rgba(0, 217, 192, 0.14);
  --accent-violet: #7c5cff;
  --accent-violet-dim: rgba(124, 92, 255, 0.14);
  --accent-amber: #ffb454;
  --accent-amber-dim: rgba(255, 180, 84, 0.14);
  --accent-green: #3ecf8e;
  --accent-green-dim: rgba(62, 207, 142, 0.14);

  --font-display: "Space Grotesk", "Segoe UI", sans-serif;
  --font-body: "Inter", "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --navbar-h: 64px;
  --sidebar-w: 260px;
  --controls-h: 64px;

  --shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.35);
  --shadow-strong: 0 16px 40px rgba(0, 0, 0, 0.5);

  --transition-fast: 150ms ease;
  --transition-med: 260ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* =========================================================
   RESET
   ========================================================= */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.5;
  min-height: 100vh;
  overflow-x: hidden;
}

/* subtle ambient background wash */
body {
  background-image:
    radial-gradient(circle at 12% -10%, rgba(124, 92, 255, 0.08), transparent 40%),
    radial-gradient(circle at 90% 0%, rgba(0, 217, 192, 0.07), transparent 45%);
  background-attachment: fixed;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid var(--accent-teal);
  outline-offset: 2px;
}

::selection {
  background: var(--accent-teal-dim);
  color: var(--text-primary);
}

/* thin scrollbars for the mono aesthetic */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 8px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }

/* =========================================================
   NAVBAR
   ========================================================= */
.navbar {
  height: var(--navbar-h);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  background: rgba(16, 21, 29, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-soft);
  position: sticky;
  top: 0;
  z-index: 100;
}

.sidebar-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.sidebar-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--text-secondary);
  margin: 0 auto;
  transition: var(--transition-fast);
}

.sidebar-toggle:hover { background: var(--surface-hover); }

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand-mark {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 15px;
  color: var(--bg);
  background: linear-gradient(135deg, var(--accent-teal), var(--accent-violet));
  padding: 6px 9px;
  border-radius: var(--radius-sm);
  letter-spacing: -0.5px;
  flex-shrink: 0;
}

.brand-text h1 {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-text p {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar-status {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: 999px;
  flex-shrink: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-amber);
  box-shadow: 0 0 0 3px var(--accent-amber-dim);
  transition: var(--transition-fast);
}

.status-dot.running {
  background: var(--accent-teal);
  box-shadow: 0 0 0 3px var(--accent-teal-dim);
  animation: pulse 1.2s ease-in-out infinite;
}

.status-dot.done {
  background: var(--accent-green);
  box-shadow: 0 0 0 3px var(--accent-green-dim);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.35); }
}

/* =========================================================
   APP SHELL / LAYOUT
   ========================================================= */
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  min-height: calc(100vh - var(--navbar-h));
}

/* =========================================================
   SIDEBAR
   ========================================================= */
.sidebar {
  border-right: 1px solid var(--border-soft);
  background: var(--surface);
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: var(--navbar-h);
  height: calc(100vh - var(--navbar-h));
  overflow-y: auto;
  z-index: 90;
}

.algo-group {
  margin-bottom: 22px;
}

.algo-group-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--text-faint);
  padding: 0 10px;
  margin-bottom: 8px;
}

.algo-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 10px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  transition: var(--transition-fast);
  border: 1px solid transparent;
  margin-bottom: 4px;
}

.algo-index {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-faint);
  min-width: 20px;
  transition: var(--transition-fast);
}

.algo-btn:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.algo-btn.active {
  background: var(--accent-teal-dim);
  border-color: rgba(0, 217, 192, 0.35);
  color: var(--accent-teal);
}

.algo-btn.active .algo-index {
  color: var(--accent-teal);
}

.sidebar-footer {
  border-top: 1px solid var(--border-soft);
  padding: 14px 10px 4px;
}

.sidebar-footer p {
  font-size: 12px;
  color: var(--text-faint);
  line-height: 1.5;
}

.sidebar-scrim {
  display: none;
}

/* =========================================================
   MAIN CONTENT
   ========================================================= */
.main-content {
  padding: 20px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

/* --- Controls bar --- */
.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
}

.controls-left {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: 13.5px;
  font-weight: 600;
  transition: var(--transition-fast);
  border: 1px solid transparent;
  white-space: nowrap;
}

.btn svg { flex-shrink: 0; }

.btn-primary {
  background: linear-gradient(135deg, var(--accent-teal), #00b3a0);
  color: #06110f;
  box-shadow: 0 4px 14px rgba(0, 217, 192, 0.25);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 217, 192, 0.35);
}

.btn-primary:active { transform: translateY(0); }

.btn-secondary {
  background: var(--surface-raised);
  color: var(--text-primary);
  border-color: var(--border);
}

.btn-secondary:hover {
  background: var(--surface-hover);
  border-color: var(--accent-violet);
  color: var(--accent-violet);
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border-color: var(--border);
}

.btn-ghost:hover {
  color: var(--accent-amber);
  border-color: var(--accent-amber);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.controls-right {
  display: flex;
  align-items: center;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: 999px;
}

.speed-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.speed-value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent-teal);
  min-width: 26px;
  text-align: right;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 120px;
  height: 4px;
  background: var(--border);
  border-radius: 999px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--accent-teal);
  box-shadow: 0 0 0 4px var(--accent-teal-dim);
  cursor: pointer;
  transition: var(--transition-fast);
}

input[type="range"]::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px var(--accent-teal-dim);
}

input[type="range"]::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border: none;
  border-radius: 50%;
  background: var(--accent-teal);
  box-shadow: 0 0 0 4px var(--accent-teal-dim);
  cursor: pointer;
}

/* --- Visualization stage --- */
.visual-stage {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  min-height: 420px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

.stage-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(124, 92, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(124, 92, 255, 0.06) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  mask-image: radial-gradient(ellipse at center, black 55%, transparent 100%);
}

.stage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
}

.stage-tag {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--accent-teal);
  background: var(--accent-teal-dim);
  border: 1px solid rgba(0, 217, 192, 0.3);
  padding: 5px 12px;
  border-radius: 999px;
}

.stage-hint {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-faint);
}

.visual-canvas {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  min-height: 260px;
  padding: 10px 4px 0;
}

.visual-canvas.empty::before {
  content: "No data yet — click “Generate Random” to begin.";
  margin: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-faint);
}

.bar {
  flex: 1;
  max-width: 34px;
  min-width: 4px;
  background: linear-gradient(180deg, var(--accent-violet), rgba(124, 92, 255, 0.45));
  border-radius: 4px 4px 0 0;
  transition: height var(--transition-med), background var(--transition-fast), transform var(--transition-fast);
  position: relative;
}

.bar.compare { background: linear-gradient(180deg, var(--accent-amber), rgba(255, 180, 84, 0.5)); }
.bar.sorted { background: linear-gradient(180deg, var(--accent-green), rgba(62, 207, 142, 0.5)); }

.stage-legend {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-soft);
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-muted);
}

.stage-legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 3px;
  display: inline-block;
}

.dot-default { background: var(--accent-violet); }
.dot-compare { background: var(--accent-amber); }
.dot-sorted { background: var(--accent-green); }

/* --- Info panel --- */
.info-panel {
  display: grid;
  grid-template-columns: 1.6fr 1.2fr 0.9fr;
  gap: 16px;
}

.info-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
}

.info-card h2 {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.info-description p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.65;
}

.complexity-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.complexity-chip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  flex: 1;
  min-width: 78px;
}

.chip-wide { width: 100%; }

.chip-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-faint);
}

.chip-value {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--accent-teal);
}

.info-space .chip-value { color: var(--accent-violet); }

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width: 1080px) {
  .info-panel {
    grid-template-columns: 1fr 1fr;
  }
  .info-space { grid-column: span 2; }
}

@media (max-width: 860px) {
  :root { --sidebar-w: 240px; }

  .brand-text p { display: none; }

  .app-shell { grid-template-columns: 1fr; }

  .sidebar-toggle { display: flex; }

  .sidebar {
    position: fixed;
    top: var(--navbar-h);
    left: 0;
    width: var(--sidebar-w);
    height: calc(100vh - var(--navbar-h));
    transform: translateX(-100%);
    transition: transform var(--transition-med);
    box-shadow: var(--shadow-strong);
  }

  .sidebar.open { transform: translateX(0); }

  .sidebar-scrim {
    display: block;
    position: fixed;
    inset: var(--navbar-h) 0 0 0;
    background: rgba(5, 7, 10, 0.6);
    backdrop-filter: blur(2px);
    z-index: 80;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-med);
  }

  .sidebar-scrim.open {
    opacity: 1;
    pointer-events: auto;
  }

  .main-content { padding: 16px 16px 24px; }

  .info-panel { grid-template-columns: 1fr; }
  .info-space { grid-column: auto; }
}

@media (max-width: 560px) {
  .navbar { padding: 0 12px; gap: 10px; }
  .brand-mark { padding: 5px 8px; font-size: 13px; }
  .brand-text h1 { font-size: 15px; }
  .navbar-status span:not(.status-dot) { display: none; }

  .controls-bar { flex-direction: column; align-items: stretch; }
  .controls-left { justify-content: stretch; }
  .controls-left .btn { flex: 1; justify-content: center; }
  .controls-right { justify-content: center; }

  .visual-stage { min-height: 320px; padding: 14px; }
  .visual-canvas { min-height: 200px; }

  .stage-legend { gap: 12px; }
}