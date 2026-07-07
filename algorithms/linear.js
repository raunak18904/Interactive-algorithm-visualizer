/* =========================================================
   LINEAR SEARCH MODULE
   ========================================================= */

"use strict";

window.Vis.algorithms["linear-search"] = async function runLinearSearch() {
  const { state, els, delay, stepDelay, setStatus, toggleControls } = window.Vis;
  
  let bars = Array.from(els.visualCanvas.querySelectorAll(".bar"));
  const n = state.dataset.length;
  
  if (n === 0) return;

  const myRun = state.runId;
  state.isRunning = true;
  toggleControls(true);
  setStatus("running");

  const isCancelled = () => myRun !== state.runId;

  // Pick a random target from the array to search for
  const targetIndex = Math.floor(Math.random() * n);
  const target = state.dataset[targetIndex];
  
  // Update the UI hint to show what we are looking for
  els.stageHint.textContent = `Searching for value: ${target}`;

  for (let i = 0; i < n; i++) {
    if (isCancelled()) return;

    // Highlight current element being compared
    bars[i].classList.add("compare");
    await delay(stepDelay());
    if (isCancelled()) return;

    if (state.dataset[i] === target) {
      // Target found
      bars[i].classList.remove("compare");
      bars[i].classList.add("sorted");
      break; 
    } else {
      // Target not found, dim the bar to show it was checked
      bars[i].classList.remove("compare");
      bars[i].style.opacity = "0.3"; 
    }
  }

  if (isCancelled()) return;
  
  setStatus("done");
  toggleControls(false);
  state.isRunning = false;
};