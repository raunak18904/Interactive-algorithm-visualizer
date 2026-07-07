/* =========================================================
   ALGORITHM VISUALIZER — BUBBLE.JS
   Drop-in replacement for script.js.
   Bubble Sort is now fully implemented and animated.
   All other algorithms keep the same placeholder sweep as
   before (real logic for them will come later) — the UI,
   IDs, classes, and markup are all untouched.
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. ALGORITHM METADATA
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
    runId: 0, // bumped on reset so an in-flight sort loop stops cleanly
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
      bar.dataset.value = value;
      els.visualCanvas.appendChild(bar);
    });
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
    state.runId += 1; // invalidates any pending steps of a running sort
    toggleControls(false);
    document.querySelectorAll(".bar").forEach((bar) => {
      bar.classList.remove("compare", "sorted");
      bar.style.transform = "";
    });
    setStatus("idle");
    updateStageMeta(state.currentAlgo);
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
     10. TIMING HELPERS
     Speed slider is 1 (slow) - 10 (fast). Higher speed => a
     shorter pause between animation steps.
  --------------------------------------------------------- */
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function stepDelay() {
    // 1x -> ~650ms per step, 10x -> ~60ms per step
    return Math.max(650 - state.speed * 60, 60);
  }

  /* ---------------------------------------------------------
     11. BUBBLE SORT — real implementation + animation
     - Every comparison is animated: both bars pulse amber.
     - If a swap is needed, the two bars are lifted (transform)
       and their heights + dataset values are swapped.
     - Once an element reaches its final resting spot for a
       pass, it is locked in and turned green ("sorted").
  --------------------------------------------------------- */
  async function runBubbleSort() {
    const bars = Array.from(els.visualCanvas.querySelectorAll(".bar"));
    const n = bars.length;
    if (n === 0) return;

    const myRun = state.runId;
    state.isRunning = true;
    toggleControls(true);
    setStatus("running");

    const isCancelled = () => myRun !== state.runId;

    for (let i = 0; i < n - 1 && !isCancelled(); i++) {
      let swappedInPass = false;

      for (let j = 0; j < n - 1 - i && !isCancelled(); j++) {
        const barA = bars[j];
        const barB = bars[j + 1];

        // --- animate the comparison ---
        barA.classList.add("compare");
        barB.classList.add("compare");
        await delay(stepDelay());
        if (isCancelled()) return;

        const valA = Number(barA.dataset.value);
        const valB = Number(barB.dataset.value);

        if (valA > valB) {
          swappedInPass = true;

          // --- highlight the swap with a lift effect ---
          barA.style.transform = "translateY(-14px)";
          barB.style.transform = "translateY(-14px)";
          await delay(stepDelay());
          if (isCancelled()) return;

          // swap heights + stored values in the DOM
          const heightA = barA.style.height;
          const heightB = barB.style.height;

          barA.style.height = heightB;
          barB.style.height = heightA;
          barA.dataset.value = valB;
          barB.dataset.value = valA;

          await delay(stepDelay());
          if (isCancelled()) return;

          barA.style.transform = "";
          barB.style.transform = "";
        }

        barA.classList.remove("compare");
        barB.classList.remove("compare");
      }

      if (isCancelled()) return;

      // the last element of this pass is now in its final spot
      bars[n - 1 - i].classList.add("sorted");

      // early exit: array already sorted, nothing swapped this pass
      if (!swappedInPass) {
        for (let k = 0; k <= n - 2 - i; k++) bars[k].classList.add("sorted");
        break;
      }
    }

    if (isCancelled()) return;

    // make sure every bar ends up marked sorted
    bars.forEach((bar) => bar.classList.add("sorted"));

    // reflect the final order back into state.dataset
    state.dataset = bars.map((bar) => Number(bar.dataset.value));

    setStatus("done");
    toggleControls(false);
    state.isRunning = false;
  }

  /* ---------------------------------------------------------
     12. PLACEHOLDER (for algorithms not yet implemented)
  --------------------------------------------------------- */
  async function runPlaceholderAnimation() {
    const bars = Array.from(document.querySelectorAll(".bar"));
    if (bars.length === 0) return;

    const myRun = state.runId;
    state.isRunning = true;
    toggleControls(true);
    setStatus("running");

    for (let i = 0; i < bars.length; i++) {
      if (myRun !== state.runId) return;
      bars[i].classList.add("compare");
      await delay(stepDelay());
      if (myRun !== state.runId) return;
      bars[i].classList.remove("compare");
      bars[i].classList.add("sorted");
    }

    if (myRun !== state.runId) return;
    setStatus("done");
    toggleControls(false);
    state.isRunning = false;
  }

  /* ---------------------------------------------------------
     13. START VISUALIZATION
  --------------------------------------------------------- */
  els.startBtn.addEventListener("click", () => {
    if (state.isRunning) return;
    if (state.dataset.length === 0) {
      generateDataset();
    }

    document.querySelectorAll(".bar").forEach((bar) => {
      bar.classList.remove("compare", "sorted");
    });

    if (state.currentAlgo === "bubble-sort") {
      runBubbleSort();
    } else {
      runPlaceholderAnimation();
    }
  });

  /* ---------------------------------------------------------
     14. INIT
  --------------------------------------------------------- */
  function init() {
    els.speedValue.textContent = `${state.speed}x`;
    updateInfoPanel(state.currentAlgo);
    updateStageMeta(state.currentAlgo);
    generateDataset();
  }

  init();
})();