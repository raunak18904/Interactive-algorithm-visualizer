/* =========================================================
   DFS GRAPH TRAVERSAL MODULE (Recursive)
   ========================================================= */

"use strict";

window.Vis.algorithms["dfs"] = async function runDFS() {
  const { state, els, delay, stepDelay, setStatus, toggleControls } = window.Vis;

  const myRun = state.runId;
  state.isRunning = true;
  toggleControls(true);
  setStatus("running");

  const isCancelled = () => myRun !== state.runId;

  // 1. Clear the canvas
  els.visualCanvas.innerHTML = "";
  els.visualCanvas.style.position = "relative";

  // 2. Generate the Symmetrical Tree Layout (same as BFS for comparison)
  const numNodes = 12;
  const nodes = [
    { id: 0, x: 50, y: 15 }, // Level 0 (Root)
    { id: 1, x: 25, y: 40 }, // Level 1
    { id: 2, x: 50, y: 40 },
    { id: 3, x: 75, y: 40 },
    { id: 4, x: 15, y: 65 }, // Level 2
    { id: 5, x: 35, y: 65 },
    { id: 6, x: 50, y: 65 },
    { id: 7, x: 65, y: 65 },
    { id: 8, x: 85, y: 65 },
    { id: 9, x: 25, y: 90 }, // Level 3
    { id: 10, x: 45, y: 90 },
    { id: 11, x: 65, y: 90 }
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3],       
    [1, 4], [1, 5],               
    [2, 6], [2, 7],               
    [3, 8],                       
    [5, 9], [5, 10],              
    [7, 11]                       
  ];

  const adj = Array.from({ length: numNodes }, () => []);
  edges.forEach(([u, v]) => {
    adj[u].push(v);
    adj[v].push(u);
  });

  // 3. Render SVG Edges
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.position = "absolute";
  svg.style.inset = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.zIndex = "1";
  els.visualCanvas.appendChild(svg);

  const edgeLines = {};
  edges.forEach(([u, v]) => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", `${nodes[u].x}%`);
    line.setAttribute("y1", `${nodes[u].y}%`);
    line.setAttribute("x2", `${nodes[v].x}%`);
    line.setAttribute("y2", `${nodes[v].y}%`);
    line.setAttribute("stroke", "var(--border)");
    line.setAttribute("stroke-width", "3");
    line.style.transition = "stroke 0.3s ease";
    svg.appendChild(line);
    edgeLines[`${u}-${v}`] = line;
    edgeLines[`${v}-${u}`] = line;
  });

  // 4. Render HTML Nodes
  const nodeElements = [];
  nodes.forEach((n) => {
    const nodeEl = document.createElement("div");
    nodeEl.style.position = "absolute";
    nodeEl.style.left = `${n.x}%`;
    nodeEl.style.top = `${n.y}%`;
    nodeEl.style.transform = "translate(-50%, -50%)";
    nodeEl.style.width = "32px";
    nodeEl.style.height = "32px";
    nodeEl.style.backgroundColor = "var(--surface-raised)";
    nodeEl.style.border = "2px solid var(--text-faint)";
    nodeEl.style.borderRadius = "50%";
    nodeEl.style.display = "flex";
    nodeEl.style.alignItems = "center";
    nodeEl.style.justifyContent = "center";
    nodeEl.style.color = "var(--text-primary)";
    nodeEl.style.fontWeight = "600";
    nodeEl.style.fontSize = "13px";
    nodeEl.style.zIndex = "2";
    nodeEl.style.transition = "all 0.3s ease";
    nodeEl.innerText = n.id;
    els.visualCanvas.appendChild(nodeEl);
    nodeElements.push(nodeEl);
  });

  // 5. Render Traversal Path UI
  const pathUI = document.createElement("div");
  pathUI.style.position = "absolute";
  pathUI.style.bottom = "15px";
  pathUI.style.left = "15px";
  pathUI.style.display = "flex";
  pathUI.style.gap = "6px";
  pathUI.style.zIndex = "3";
  pathUI.style.padding = "8px 12px";
  pathUI.style.background = "rgba(16, 21, 29, 0.9)";
  pathUI.style.border = "1px solid var(--border)";
  pathUI.style.borderRadius = "var(--radius-md)";
  pathUI.style.backdropFilter = "blur(4px)";
  pathUI.style.flexWrap = "wrap";
  pathUI.style.maxWidth = "80%";
  els.visualCanvas.appendChild(pathUI);

  const updatePathUI = (orderArray) => {
    pathUI.innerHTML = `<span style="color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; align-self: center; margin-right: 4px;">Traversal Path</span>`;
    
    orderArray.forEach((id) => {
      const item = document.createElement("div");
      item.style.width = "22px";
      item.style.height = "22px";
      item.style.backgroundColor = "var(--accent-violet-dim)";
      item.style.border = "1px solid var(--accent-violet)";
      item.style.color = "var(--accent-violet)";
      item.style.borderRadius = "4px";
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.justifyContent = "center";
      item.style.fontSize = "12px";
      item.style.fontWeight = "600";
      pathUI.appendChild(item);
      item.innerText = id;
    });
  };

  els.stageHint.textContent = `Graph of ${numNodes} nodes · tree layout generated`;
  await delay(800);
  if (isCancelled()) return;
  els.stageHint.textContent = `Graph of ${numNodes} nodes · DFS Traversal active`;

  const visited = new Set();
  const traversalOrder = [];

  // 6. The Recursive DFS Core
  async function performDFS(curr, parentEdge = null) {
    if (isCancelled()) return;

    // Mark as visited and add to our path UI
    visited.add(curr);
    traversalOrder.push(curr);
    updatePathUI(traversalOrder);

    // Active Processing Animation (Amber pulse)
    nodeElements[curr].style.backgroundColor = "var(--accent-amber)";
    nodeElements[curr].style.borderColor = "var(--accent-amber)";
    nodeElements[curr].style.color = "#000";
    nodeElements[curr].style.transform = "translate(-50%, -50%) scale(1.15)";
    if (parentEdge) parentEdge.setAttribute("stroke", "var(--accent-amber)");

    await delay(stepDelay());
    if (isCancelled()) return;

    // Node enters the recursive Call Stack (Violet)
    nodeElements[curr].style.backgroundColor = "var(--accent-violet-dim)";
    nodeElements[curr].style.borderColor = "var(--accent-violet)";
    nodeElements[curr].style.color = "var(--text-primary)";
    nodeElements[curr].style.transform = "translate(-50%, -50%) scale(1)";

    // Process neighbors left-to-right
    const sortedNeighbors = [...adj[curr]].sort((a, b) => a - b);
    for (const neighbor of sortedNeighbors) {
      if (isCancelled()) return;

      if (!visited.has(neighbor)) {
        const edge = edgeLines[`${curr}-${neighbor}`];
        if (edge) edge.setAttribute("stroke", "var(--accent-amber)");
        
        await delay(stepDelay() / 2);
        
        // RECURSE DEEPER
        await performDFS(neighbor, edge);
        
        if (isCancelled()) return;

        // BACKTRACKING ANIMATION
        // Briefly light up the current node again to show the recursion returned
        nodeElements[curr].style.backgroundColor = "var(--accent-amber)";
        nodeElements[curr].style.borderColor = "var(--accent-amber)";
        nodeElements[curr].style.color = "#000";
        if (edge) edge.setAttribute("stroke", "rgba(62, 207, 142, 0.4)"); // Lock edge as green
        
        await delay(stepDelay() / 2);
        
        // Return to Call Stack state
        nodeElements[curr].style.backgroundColor = "var(--accent-violet-dim)";
        nodeElements[curr].style.borderColor = "var(--accent-violet)";
        nodeElements[curr].style.color = "var(--text-primary)";
      }
    }

    // Node fully explored, exit Call Stack (Green)
    nodeElements[curr].style.backgroundColor = "var(--accent-green)";
    nodeElements[curr].style.borderColor = "var(--accent-green)";
    nodeElements[curr].style.color = "#000";
  }

  // Start the recursion from the root node (0)
  await performDFS(0);

  if (isCancelled()) return;

  setStatus("done");
  toggleControls(false);
  state.isRunning = false;
};