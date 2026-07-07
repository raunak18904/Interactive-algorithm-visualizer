/* =========================================================
   BUBBLE SORT MODULE
   ========================================================= */

"use strict";

// Register this algorithm with the main orchestrator
window.Vis.algorithms["bubble-sort"] = async function runBubbleSort() {
  
  // Destructure what we need from the global Vis object
  const { state, els, delay, stepDelay, setStatus, toggleControls } = window.Vis;

  let bars = Array.from(els.visualCanvas.querySelectorAll(".bar"));
  const n = state.dataset.length;
  
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

      barA.classList.add("compare");
      barB.classList.add("compare");
      await delay(stepDelay());
      if (isCancelled()) return;

      if (state.dataset[j] > state.dataset[j + 1]) {
        swappedInPass = true;

        barA.style.transform = "translateY(-14px)";
        barB.style.transform = "translateY(-14px)";
        await delay(stepDelay());
        if (isCancelled()) return;

        let tempValue = state.dataset[j];
        state.dataset[j] = state.dataset[j + 1];
        state.dataset[j + 1] = tempValue;

        els.visualCanvas.insertBefore(barB, barA);

        bars[j] = barB;
        bars[j + 1] = barA;

        await delay(stepDelay());
        if (isCancelled()) return;

        barA.style.transform = "";
        barB.style.transform = "";
      }

      barA.classList.remove("compare");
      barB.classList.remove("compare");
    }

    if (isCancelled()) return;
    bars[n - 1 - i].classList.add("sorted");

    if (!swappedInPass) {
      for (let k = 0; k <= n - 2 - i; k++) bars[k].classList.add("sorted");
      break;
    }
  }

  if (isCancelled()) return;

  bars.forEach((bar) => bar.classList.add("sorted"));
  setStatus("done");
  toggleControls(false);
  state.isRunning = false;
};