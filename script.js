/* =========================================================
   ALGORITHM VISUALIZER — SCRIPT.JS
   NOTE: Algorithm logic is intentionally NOT implemented yet.
   This file wires up the UI shell: navigation, dataset
   generation, info panel content, and a placeholder
   animation hook where each algorithm's real logic will
   eventually be plugged in (see runPlaceholderAnimation).
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. ALGORITHM METADATA
     Central place to add real logic later — each entry maps
     a data-algo key to the copy shown in the info panel.
  --------------------------------------------------------- */
  const ALGORITHMS = {
    "bubble-sort": {
      label: "Bubble Sort",
      tag: "BUBBLE SORT",
      type: "array",
      description:
        "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Each full pass 'bubbles' the largest remaining value to its correct position at the end of the array.",
      time: { best: "O(n)", average: "O(n\u00B2)", worst: "O(n\u00B2)" },
      space: "O(1)",
    },
    "merge-sort": {
      label: "Merge Sort",
      tag: "MERGE SORT",
      type: "array",
      description:
        "A divide-and-conquer algorithm that recursively splits the array into halves, sorts each half, and merges the sorted halves back together to produce the final ordered sequence.",
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      space: "O(n)",
    },
    "linear-search": {
      label: "Linear Search",
      tag: "LINEAR SEARCH",
      type: "array",
      description:
        "Scans the array from start to end, comparing each element against the target value until a match is found or the list is exhausted. Simple, but does not require the data to be sorted.",
      time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
      space: "O(1)",
    },
    "binary-search": {
      label: "Binary Search",
      tag: "BINARY SEARCH",
      type: "array",
      description:
        "Repeatedly divides a sorted array in half, comparing the target to the middle element to decide which half to search next, drastically reducing the search space each step.",
      time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
      space: "O(1)",
    },
    bfs: {
      label: "Breadth-First Search",
      tag: "BFS",
      type: "graph",
      description:
        "Explores a graph level by level, visiting every neighbor of a node before moving to the next depth using a queue. Guarantees the shortest path in unweighted graphs.",
      time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
      space: "O(V)",
    },
    dfs: {
      label: "Depth-First Search",
      tag: "DFS",
      type: "graph",
      description:
        "Explores a graph by diving as deep as possible along each branch using a stack (or recursion) before backtracking, useful for detecting cycles and exploring connected components.",
      time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
      space: "O(V)",
    },
  };

  /* ---------------------------------------------------------
     2. STATE
  --------------------------------------------------------- */
  const state = {
    currentAlgo: "bubble-sort",
    dataset: [],
    isRunning: false,
    speed: 5,
  };

  /* ---------------------------------------------------------
     3. DOM REFERENCES
  --------------------------------------------------------- */
  const els = {
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

    infoDescription: document.getElementById("infoDescription"),
    timeComplexity: document.getElementById("timeComplexity"),
    spaceComplexity: document.getElementById("spaceComplexity"),
  };

  /* ---------------------------------------------------------
     4. SIDEBAR (mobile off-canvas)
  --------------------------------------------------------- */
  function openSidebar() {
    els.sidebar.classList.add("open");
    els.sidebarScrim.classList.add("open");
  }

  function closeSidebar() {
    els.sidebar.classList.remove("open");
    els.sidebarScrim.classList.remove("open");
  }

  els.sidebarToggle.addEventListener("click", () => {
    els.sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });
  els.sidebarScrim.addEventListener("click", closeSidebar);

  /* ---------------------------------------------------------
     5. ALGORITHM SELECTION
  --------------------------------------------------------- */
  function selectAlgorithm(key) {
    if (!ALGORITHMS[key] || state.isRunning) return;

    state.currentAlgo = key;

    els.algoButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.algo === key);
    });

    updateInfoPanel(key);
    updateStageMeta(key);
    closeSidebar();
    setStatus("idle");
  }

  function updateInfoPanel(key) {
    const algo = ALGORITHMS[key];
    els.infoDescription.textContent = algo.description;

    const chips = els.timeComplexity.querySelectorAll(".chip-value");
    chips[0].textContent = algo.time.best;
    chips[1].textContent = algo.time.average;
    chips[2].textContent = algo.time.worst;

    els.spaceComplexity.textContent = algo.space;
  }

  function updateStageMeta(key) {
    const algo = ALGORITHMS[key];
    els.stageTag.textContent = algo.tag;

    if (algo.type === "graph") {
      els.stageHint.textContent = "Graph traversal view \u2014 generate a dataset to begin";
    } else {
      const count = state.dataset.length || 0;
      els.stageHint.textContent = count
        ? `Array of ${count} elements \u00B7 unsorted`
        : "No dataset yet \u2014 click \u201CGenerate Random\u201D";
    }
  }

  els.algoButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectAlgorithm(btn.dataset.algo));
  });

  /* ---------------------------------------------------------
     6. DATASET GENERATION + RENDERING
  --------------------------------------------------------- */
  function generateDataset(size = 30) {
    state.dataset = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 90) + 10
    );
    renderBars();
    updateStageMeta(state.currentAlgo);
    setStatus("idle");
  }

  function renderBars() {
    els.visualCanvas.innerHTML = "";
    els.visualCanvas.classList.toggle("empty", state.dataset.length === 0);

    const max = Math.max(...state.dataset, 1);

    state.dataset.forEach((value) => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${(value / max) * 100}%`;
      els.visualCanvas.appendChild(bar);
    });
  }

  function clearDataset() {
    state.dataset = [];
    renderBars();
    updateStageMeta(state.currentAlgo);
  }

  els.generateBtn.addEventListener("click", () => {
    if (state.isRunning) return;
    generateDataset();
  });

  /* ---------------------------------------------------------
     7. RESET
  --------------------------------------------------------- */
  function resetVisualization() {
    state.isRunning = false;
    toggleControls(false);
    document.querySelectorAll(".bar").forEach((bar) => {
      bar.classList.remove("compare", "sorted");
    });
    setStatus("idle");
  }

  els.resetBtn.addEventListener("click", resetVisualization);

  /* ---------------------------------------------------------
     8. SPEED SLIDER
  --------------------------------------------------------- */
  els.speedSlider.addEventListener("input", (e) => {
    state.speed = Number(e.target.value);
    els.speedValue.textContent = `${state.speed}x`;
  });

  /* ---------------------------------------------------------
     9. STATUS INDICATOR
  --------------------------------------------------------- */
  function setStatus(mode) {
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
  }

  function toggleControls(disabled) {
    els.generateBtn.disabled = disabled;
    els.startBtn.disabled = disabled;
    els.algoButtons.forEach((btn) => (btn.disabled = disabled));
  }

  /* ---------------------------------------------------------
     10. START VISUALIZATION (placeholder hook)
     Real sorting/searching/traversal logic will replace
     runPlaceholderAnimation() for each algorithm. For now it
     simply confirms the pipeline (dataset -> DOM -> status)
     works end to end, without performing any algorithm.
  --------------------------------------------------------- */
  function runPlaceholderAnimation() {
    const bars = Array.from(document.querySelectorAll(".bar"));
    if (bars.length === 0) return;

    state.isRunning = true;
    toggleControls(true);
    setStatus("running");

    const stepDelay = 260 - state.speed * 22; // faster on higher speed
    let i = 0;

    function step() {
      if (!state.isRunning) return; // stopped via reset

      bars.forEach((b) => b.classList.remove("compare"));

      if (i >= bars.length) {
        setStatus("done");
        toggleControls(false);
        state.isRunning = false;
        return;
      }

      bars[i].classList.add("compare");
      setTimeout(() => {
        bars[i].classList.remove("compare");
        bars[i].classList.add("sorted");
        i += 1;
        step();
      }, Math.max(stepDelay, 30));
    }

    step();
  }

  els.startBtn.addEventListener("click", () => {
    if (state.isRunning) return;
    if (state.dataset.length === 0) {
      generateDataset();
    }
    runPlaceholderAnimation();
  });

  /* ---------------------------------------------------------
     11. INIT
  --------------------------------------------------------- */
  function init() {
    els.speedValue.textContent = `${state.speed}x`;
    updateInfoPanel(state.currentAlgo);
    updateStageMeta(state.currentAlgo);
    generateDataset();
  }

  init();
})();