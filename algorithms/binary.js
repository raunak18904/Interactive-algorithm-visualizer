/* =========================================================
   BINARY SEARCH MODULE
   ========================================================= */

"use strict";

window.Vis.algorithms["binary-search"] = async function runBinarySearch() {
  const { state, els, delay, stepDelay, setStatus, toggleControls } = window.Vis;
  
  let bars = Array.from(els.visualCanvas.querySelectorAll(".bar"));
  const n = state.dataset.length;
  
  if (n === 0) return;

  const myRun = state.runId;
  state.isRunning = true;
  toggleControls(true);
  setStatus("running");

  const isCancelled = () => myRun !== state.runId;

  // 1. Binary Search requires a sorted array. Sort it instantly.
  state.dataset.sort((a, b) => a - b);
  const maxVal = Math.max(...state.dataset, 1);
  
  for (let i = 0; i < n; i++) {
    bars[i].style.height = `${(state.dataset[i] / maxVal) * 100}%`;
    bars[i].dataset.value = state.dataset[i];
    bars[i].style.transition = "none"; // Snap to sorted instantly
  }
  
  // Force a reflow to apply the transition snap, then restore transitions
  void els.visualCanvas.offsetHeight; 
  bars.forEach(bar => bar.style.transition = "");

  // 2. Pick a random target to find
  const targetIndex = Math.floor(Math.random() * n);
  const target = state.dataset[targetIndex];
  els.stageHint.textContent = `Array sorted. Searching for value: ${target}`;

  await delay(800); // Brief pause so the user registers the instant sort

  let l = 0;
  let r = n - 1;

  while (l <= r) {
    if (isCancelled()) return;

    // Reset visual pointers
    bars.forEach(b => b.style.boxShadow = "none");

    // Dim elements outside the current search bounds
    for (let i = 0; i < n; i++) {
      if (i < l || i > r) {
        bars[i].style.opacity = "0.15";
      } else {
        bars[i].style.opacity = "1";
      }
    }

    let mid = Math.floor((l + r) / 2);
    
    // Visually denote Left and Right pointers using inline styles
    bars[l].style.boxShadow = "inset 0 -8px 0 var(--accent-violet)";
    bars[r].style.boxShadow = "inset 0 -8px 0 var(--accent-violet)";
    
    // Highlight Mid pointer
    bars[mid].classList.add("compare");
    
    // Give it a slightly longer delay so the user can process the jump
    await delay(stepDelay() * 1.5); 
    if (isCancelled()) return;

    if (state.dataset[mid] === target) {
      // Found it
      bars[mid].classList.remove("compare");
      bars[mid].classList.add("sorted");
      bars[mid].style.boxShadow = "none";
      break; 
    } else {
      // Not found, adjust bounds
      bars[mid].classList.remove("compare");
      
      if (state.dataset[mid] < target) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }

  if (isCancelled()) return;
  
  // Clean up inline styles
  bars.forEach(b => b.style.boxShadow = "none");
  
  setStatus("done");
  toggleControls(false);
  state.isRunning = false;
};