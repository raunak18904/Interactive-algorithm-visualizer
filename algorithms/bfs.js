/* =========================================================
   BFS GRAPH TRAVERSAL MODULE (Tree Layout)
   ========================================================= */

"use strict";

window.Vis.algorithms["bfs"] = async function runBFS() {
  const { state, els, delay, stepDelay, setStatus, toggleControls } = window.Vis;

  const myRun = state.runId;
  state.isRunning = true;
  toggleControls(true);
  setStatus("running");

  const isCancelled = () => myRun !== state.runId;

  // 1. Clear the canvas
  els.visualCanvas.innerHTML = "";
  els.visualCanvas.style.position = "relative";

  // 2. Generate a perfectly symmetrical Tree Graph for visual clarity
  const numNodes = 12;
  
  // Explicitly defined coordinates (percentages) to build a beautiful tree
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
    [0, 1], [0, 2], [0, 3],       // Root to L1
    [1, 4], [1, 5],               // Node 1 children
    [2, 6], [2, 7],               // Node 2 children
    [3, 8],                       // Node 3 child
    [5, 9], [5, 10],              // Node 5 children
    [7, 11]                       // Node 7 child
  ];

  const adj = Array.from({ length: numNodes }, () => []);
  edges.forEach(([u, v]) => {
    adj[u].push(v);
    adj[v].push(u);
  });

  // 3. Render SVG Edges (Background layer)
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

  // 4. Render HTML Nodes (Foreground layer)
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

  // 5. Render Queue UI Container
  const queueUI = document.createElement("div");
  queueUI.style.position = "absolute";
  queueUI.style.bottom = "15px";
  queueUI.style.left = "15px";
  queueUI.style.display = "flex";
  queueUI.style.gap = "6px";
  queueUI.style.zIndex = "3";
  queueUI.style.padding = "8px 12px";
  queueUI.style.background = "rgba(16, 21, 29, 0.9)";
  queueUI.style.border = "1px solid var(--border)";
  queueUI.style.borderRadius = "var(--radius-md)";
  queueUI.style.backdropFilter = "blur(4px)";
  els.visualCanvas.appendChild(queueUI);

  const updateQueueUI = (q) => {
    queueUI.innerHTML = `<span style="color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; align-self: center; margin-right: 4px;">Queue</span>`;
    
    if (q.length === 0) {
      queueUI.innerHTML += `<span style="color: var(--text-faint); font-size: 12px; align-self: center;">Empty</span>`;
      return;
    }
    
    q.forEach((id) => {
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
      queueUI.appendChild(item);
      item.innerText = id;
    });
  };

  els.stageHint.textContent = `Graph of ${numNodes} nodes · tree layout generated`;

  await delay(800);
  if (isCancelled()) return;

  // 6. Execute BFS Traversal
  els.stageHint.textContent = `Graph of ${numNodes} nodes · BFS Traversal active`;
  
  const startNode = 0;
  const visited = new Set();
  const queue = [];

  visited.add(startNode);
  queue.push(startNode);
  updateQueueUI(queue);

  nodeElements[startNode].style.backgroundColor = "var(--accent-violet-dim)";
  nodeElements[startNode].style.borderColor = "var(--accent-violet)";

  while (queue.length > 0) {
    if (isCancelled()) return;
    await delay(stepDelay());
    if (isCancelled()) return;

    const curr = queue.shift();
    updateQueueUI(queue);

    // Actively processing node (amber)
    nodeElements[curr].style.backgroundColor = "var(--accent-amber)";
    nodeElements[curr].style.borderColor = "var(--accent-amber)";
    nodeElements[curr].style.color = "#000";
    nodeElements[curr].style.transform = "translate(-50%, -50%) scale(1.15)";

    await delay(stepDelay());
    if (isCancelled()) return;

    // Sort neighbors so it processes left-to-right visually
    const sortedNeighbors = [...adj[curr]].sort((a, b) => a - b);

    for (const neighbor of sortedNeighbors) {
      if (isCancelled()) return;

      const edge = edgeLines[`${curr}-${neighbor}`];
      if (edge) edge.setAttribute("stroke", "var(--accent-amber)");

      await delay(stepDelay() / 2);

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        updateQueueUI(queue);

        nodeElements[neighbor].style.backgroundColor = "var(--accent-violet-dim)";
        nodeElements[neighbor].style.borderColor = "var(--accent-violet)";
        nodeElements[neighbor].style.color = "var(--text-primary)";
      } else {
         if(edge) edge.setAttribute("stroke", "var(--border-soft)");
      }
    }

    // Explored (green)
    nodeElements[curr].style.backgroundColor = "var(--accent-green)";
    nodeElements[curr].style.borderColor = "var(--accent-green)";
    nodeElements[curr].style.color = "#000";
    nodeElements[curr].style.transform = "translate(-50%, -50%) scale(1)";

    for (const neighbor of adj[curr]) {
        const edge = edgeLines[`${curr}-${neighbor}`];
        if (edge && visited.has(neighbor)) {
            edge.setAttribute("stroke", "rgba(62, 207, 142, 0.4)"); 
        }
    }
  }

  if (isCancelled()) return;

  setStatus("done");
  toggleControls(false);
  state.isRunning = false;
};