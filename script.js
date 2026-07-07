/* =========================================================
   ALGORITHM VISUALIZER — MAIN ORCHESTRATOR
   Handles UI, dataset generation, and state. 
   Delegates actual algorithm logic to the algorithms/ folder.
   ========================================================= */

"use strict";

// 1. Create a Global Namespace to share with algorithm files
window.Vis = {
  state: {
    currentAlgo: "bubble-sort",
    dataset: [],
    isRunning: false,
    speed: 5,
    runId: 0,
  },
  
  els: {}, // Populated below
  
  algorithms: {}, // Algorithms will register themselves here

  // Shared Helper Functions
  delay: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  stepDelay: () => Math.max(650 - window.Vis.state.speed * 60, 60),

  setStatus: (mode) => {
    const { els } = window.Vis;
    els.statusDot.classList.remove("running", "done");
    if (mode === "running") {
      els.statusDot.classList.add("running");
      els.statusLabel.textContent = "Running";
    } else if (mode === "done") {
      els.statusDot.classList.add("done");
      els.statusLabel.textContent = "Complete";
    } else {
      els.statusLabel.textContent = "Idle";
    }
  },

  toggleControls: (disabled) => {
    const { els } = window.Vis;
    els.generateBtn.disabled = disabled;
    els.startBtn.disabled = disabled;
    els.algoButtons.forEach((btn) => (btn.disabled = disabled));
  }
};

/* ---------------------------------------------------------
   2. ALGORITHM METADATA & DOM SETUP
--------------------------------------------------------- */
const ALGORITHMS = {
  "bubble-sort": { tag: "BUBBLE SORT", type: "array" },
  "merge-sort": { tag: "MERGE SORT", type: "array" },
  "linear-search": { tag: "LINEAR SEARCH", type: "array" },
  "binary-search": { tag: "BINARY SEARCH", type: "array" },
  "bfs": { tag: "BFS", type: "graph" },
  "dfs": { tag: "DFS", type: "graph" },
};

// Bind DOM Elements
window.Vis.els = {
  sidebarToggle: document.getElementById("sidebarToggle"),
  sidebar: document.getElementById("sidebar"),
  sidebarScrim: document.getElementById("sidebarScrim"),
  algoButtons: document.querySelectorAll(".algo-btn"),
  generateBtn: document.getElementById("generateBtn"),
  startBtn: document.getElementById("startBtn"),
  resetBtn: document.getElementById("resetBtn"),
  speedSlider: document.getElementById("speedSlider"),
  speedValue: document.getElementById("speedValue"),
  visualCanvas: document.getElementById("visualCanvas"),
  stageTag: document.getElementById("stageTag"),
  stageHint: document.getElementById("stageHint"),
  statusDot: document.getElementById("statusDot"),
  statusLabel: document.getElementById("statusLabel"),
};

const { state, els, setStatus, toggleControls } = window.Vis;

/* ---------------------------------------------------------
   3. UI CONTROLS & EVENT LISTENERS
--------------------------------------------------------- */
function updateStageMeta(key) {
  const algo = ALGORITHMS[key];
  els.stageTag.textContent = algo.tag;
  if (algo.type === "graph") {
    els.stageHint.textContent = "Graph traversal view — generate a dataset to begin";
  } else {
    const count = state.dataset.length || 0;
    els.stageHint.textContent = count ? `Array of ${count} elements · unsorted` : "No dataset yet";
  }
}

// Sidebar logic
function closeSidebar() {
  els.sidebar.classList.remove("open");
  els.sidebarScrim.classList.remove("open");
}
els.sidebarToggle.addEventListener("click", () => {
  els.sidebar.classList.contains("open") ? closeSidebar() : els.sidebar.classList.add("open");
});
els.sidebarScrim.addEventListener("click", closeSidebar);

// Algorithm Selection
els.algoButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (state.isRunning) return;
    const key = btn.dataset.algo;
    state.currentAlgo = key;
    els.algoButtons.forEach(b => b.classList.toggle("active", b.dataset.algo === key));
    updateStageMeta(key);
    closeSidebar();
    setStatus("idle");
  });
});

// Speed Control
els.speedSlider.addEventListener("input", (e) => {
  state.speed = Number(e.target.value);
  els.speedValue.textContent = `${state.speed}x`;
});

/* ---------------------------------------------------------
   4. DATASET & EXECUTION
--------------------------------------------------------- */
function renderBars() {
  els.visualCanvas.innerHTML = "";
  els.visualCanvas.classList.toggle("empty", state.dataset.length === 0);
  const max = Math.max(...state.dataset, 1);

  state.dataset.forEach((value) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / max) * 100}%`;
    bar.dataset.value = value;
    els.visualCanvas.appendChild(bar);
  });
}

els.generateBtn.addEventListener("click", () => {
  if (state.isRunning) return;
  state.dataset = Array.from({ length: 30 }, () => Math.floor(Math.random() * 90) + 10);
  renderBars();
  updateStageMeta(state.currentAlgo);
  setStatus("idle");
});

els.resetBtn.addEventListener("click", () => {
  state.isRunning = false;
  state.runId += 1; 
  toggleControls(false);
  document.querySelectorAll(".bar").forEach((bar) => {
    bar.classList.remove("compare", "sorted");
    bar.style.transform = "";
  });
  setStatus("idle");
  updateStageMeta(state.currentAlgo);
});

// The Start Button routing
els.startBtn.addEventListener("click", () => {
  if (state.isRunning) return;
  if (state.dataset.length === 0) els.generateBtn.click();

  document.querySelectorAll(".bar").forEach(bar => bar.classList.remove("compare", "sorted"));

  // Check if the algorithm exists in our registry and run it
  const algorithmRunner = window.Vis.algorithms[state.currentAlgo];
  
  if (algorithmRunner) {
    algorithmRunner(); 
  } else {
    console.warn(`Algorithm ${state.currentAlgo} is not implemented yet!`);
    // Optional: You could run a placeholder animation here if you want
  }
});

// Init
els.speedValue.textContent = `${state.speed}x`;
updateStageMeta(state.currentAlgo);
els.generateBtn.click();