/* =========================================================
   MERGE SORT MODULE
   ========================================================= */

"use strict";

window.Vis.algorithms["merge-sort"] = async function runMergeSort() {
  const { state, els, delay, stepDelay, setStatus, toggleControls } = window.Vis;
  
  let bars = Array.from(els.visualCanvas.querySelectorAll(".bar"));
  const n = state.dataset.length;
  
  if (n === 0) return;

  const myRun = state.runId;
  state.isRunning = true;
  toggleControls(true);
  setStatus("running");

  // Helper to check if the user clicked Reset
  const isCancelled = () => myRun !== state.runId;
  
  // We need the maximum value to calculate the height percentages during overwrites
  const maxVal = Math.max(...state.dataset, 1);

  // --- Core Merge Logic ---
  async function merge(l, m, r) {
    if (isCancelled()) return;

    let n1 = m - l + 1;
    let n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);

    // Copy data to temp arrays
    for (let i = 0; i < n1; i++) L[i] = state.dataset[l + i];
    for (let j = 0; j < n2; j++) R[j] = state.dataset[m + 1 + j];

    let i = 0, j = 0, k = l;

    // Merge the temp arrays back into the main dataset
    while (i < n1 && j < n2) {
      if (isCancelled()) return;

      // Visually highlight the elements currently being compared
      bars[l + i].classList.add("compare");
      bars[m + 1 + j].classList.add("compare");
      await delay(stepDelay());
      if (isCancelled()) return;

      if (L[i] <= R[j]) {
        state.dataset[k] = L[i];
        bars[k].style.height = `${(L[i] / maxVal) * 100}%`;
        bars[k].dataset.value = L[i];
        i++;
      } else {
        state.dataset[k] = R[j];
        bars[k].style.height = `${(R[j] / maxVal) * 100}%`;
        bars[k].dataset.value = R[j];
        j++;
      }

      // Remove the highlight and temporarily mark the overwritten bar as sorted
      bars[l + (i > 0 ? i - 1 : 0)].classList.remove("compare");
      bars[m + 1 + (j > 0 ? j - 1 : 0)].classList.remove("compare");
      bars[k].classList.add("sorted"); 
      
      await delay(stepDelay() / 2);
      k++;
    }

    // Copy remaining elements of L[] if any
    while (i < n1) {
      if (isCancelled()) return;
      state.dataset[k] = L[i];
      bars[k].style.height = `${(L[i] / maxVal) * 100}%`;
      bars[k].dataset.value = L[i];
      bars[k].classList.add("sorted");
      await delay(stepDelay() / 2);
      i++;
      k++;
    }

    // Copy remaining elements of R[] if any
    while (j < n2) {
      if (isCancelled()) return;
      state.dataset[k] = R[j];
      bars[k].style.height = `${(R[j] / maxVal) * 100}%`;
      bars[k].dataset.value = R[j];
      bars[k].classList.add("sorted");
      await delay(stepDelay() / 2);
      j++;
      k++;
    }
    
    // Clear the temporary green highlight for this sub-array block,
    // unless this is the absolute final merge of the entire array.
    if (l !== 0 || r !== n - 1) {
      for(let idx = l; idx <= r; idx++) {
        bars[idx].classList.remove("sorted");
      }
    }
  }

  // --- Recursive Sorting Function ---
  async function mergeSort(l, r) {
    if (l >= r || isCancelled()) return;
    
    let m = l + Math.floor((r - l) / 2);
    
    // Await the recursive calls so the animation pauses correctly
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
  }

  // Trigger the recursion
  await mergeSort(0, n - 1);

  if (isCancelled()) return;

  // Final visual sweep to ensure every bar is locked in green
  bars.forEach(bar => bar.classList.add("sorted"));
  
  setStatus("done");
  toggleControls(false);
  state.isRunning = false;
};