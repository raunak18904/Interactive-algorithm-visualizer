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
  "bubble-sort": {
    label: "Bubble Sort",
    tag: "BUBBLE SORT",
    type: "array",
    description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Each full pass 'bubbles' the largest remaining value to its correct position at the end of the array.",
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
  },
  "merge-sort": {
    label: "Merge Sort",
    tag: "MERGE SORT",
    type: "array",
    description: "A divide-and-conquer algorithm that recursively splits the array into halves, sorts each half, and merges the sorted halves back together to produce the final ordered sequence.",
    time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    space: "O(n)",
  },
  "linear-search": {
    label: "Linear Search",
    tag: "LINEAR SEARCH",
    type: "array",
    description: "Scans the array from start to end, comparing each element against the target value until a match is found or the list is exhausted. Simple, but does not require the data to be sorted.",
    time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    space: "O(1)",
  },
  "binary-search": {
    label: "Binary Search",
    tag: "BINARY SEARCH",
    type: "array",
    description: "Repeatedly divides a sorted array in half, comparing the target to the middle element to decide which half to search next, drastically reducing the search space each step.",
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
  },
  "bfs": {
    label: "Breadth-First Search",
    tag: "BFS",
    type: "graph",
    description: "Explores a graph level by level, visiting every neighbor of a node before moving to the next depth using a queue. Guarantees the shortest path in unweighted graphs.",
    time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    space: "O(V)",
  },
  "dfs": {
    label: "Depth-First Search",
    tag: "DFS",
    type: "graph",
    description: "Explores a graph by diving as deep as possible along each branch using a stack (or recursion) before backtracking, useful for detecting cycles and exploring connected components.",
    time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    space: "O(V)",
  },
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
  
  // Info Panel Elements
  infoDescription: document.getElementById("infoDescription"),
  timeComplexity: document.getElementById("timeComplexity"),
  spaceComplexity: document.getElementById("spaceComplexity"),
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

function updateInfoPanel(key) {
  const algo = ALGORITHMS[key];
  
  // Update description
  if (els.infoDescription) {
    els.infoDescription.textContent = algo.description;
  }

  // Update Time Complexity
  if (els.timeComplexity) {
    const chips = els.timeComplexity.querySelectorAll(".chip-value");
    if (chips.length >= 3) {
      chips[0].textContent = algo.time.best;
      chips[1].textContent = algo.time.average;
      chips[2].textContent = algo.time.worst;
    }
  }

  // Update Space Complexity
  if (els.spaceComplexity) {
    els.spaceComplexity.textContent = algo.space;
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
    
    // Update the UI
    updateInfoPanel(key);
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
  els.visualCanvas.style.position = ""; // Reset from absolute positioning if coming from graph
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
  
  // If we are looking at an array algorithm, render the bars immediately
  if (ALGORITHMS[state.currentAlgo].type === 'array') {
    renderBars();
  }
  
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
  
  // Safety check: ensure array has data before running an array algorithm
  if (state.dataset.length === 0 && ALGORITHMS[state.currentAlgo].type === 'array') {
    els.generateBtn.click();
  }

  document.querySelectorAll(".bar").forEach(bar => bar.classList.remove("compare", "sorted"));

  // Check if the algorithm exists in our registry and run it
  const algorithmRunner = window.Vis.algorithms[state.currentAlgo];
  
  if (algorithmRunner) {
    algorithmRunner(); 
  } else {
    console.warn(`Algorithm ${state.currentAlgo} is not implemented yet!`);
  }
});

/* ---------------------------------------------------------
   5. INIT
--------------------------------------------------------- */
function init() {
  els.speedValue.textContent = `${state.speed}x`;
  updateInfoPanel(state.currentAlgo);
  updateStageMeta(state.currentAlgo);
  
  // Auto-generate initial dataset if we are on an array view
  if (ALGORITHMS[state.currentAlgo].type === 'array') {
    els.generateBtn.click();
  }
}

init();