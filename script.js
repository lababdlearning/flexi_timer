// flexi_timer main JS
// Vanilla JS, modular, flow-based timer UI

const SOUNDS = [
  { name: 'Beep', id: 'beep', file: 'sounds/beep.mp3' },
  { name: 'Chime', id: 'chime', file: 'sounds/chime.mp3' },
  { name: 'Bell', id: 'bell', file: 'sounds/bell.mp3' }
];

let steps = [];
let activeStepIndex = null;
let flowState = 'idle'; // idle | running | paused | stopped
let flowTimer = null;
let flowPausedAt = null;

function createStepConfig(idx) {
  return {
    id: 'step-' + Date.now() + '-' + Math.floor(Math.random()*10000),
    title: `Step ${idx+1}`,
    interval: 10,
    intervalUnit: 'seconds',
    repeat: 1,
  sound: 'beep',
  stepDoneSound: 'chime',
    progress: 0,
    running: false,
    completed: false
  };
}

function renderSteps() {
  const container = document.getElementById('steps-container');
  container.innerHTML = '';
  steps.forEach((step, idx) => {
    const node = document.createElement('div');
    node.className = 'step-node' + (step.running ? ' active' : '');
    node.setAttribute('draggable', 'true');
    node.setAttribute('data-step-idx', idx);
    node.innerHTML = `
      <div class="step-header">
        <span class="step-title" contenteditable="true">${step.title}</span>
        <span class="step-actions">
          <button class="remove-step" title="Remove">✖️</button>
          <button class="move-left" title="Move Left">⬅️</button>
          <button class="move-right" title="Move Right">➡️</button>
        </span>
      </div>
      <div class="step-fields">
        <label>Interval:
          <input type="number" class="interval-input" min="1" value="${step.interval}" style="width:70px;">
          <select class="interval-unit">
            <option value="seconds" ${step.intervalUnit==='seconds'?'selected':''}>sec</option>
            <option value="minutes" ${step.intervalUnit==='minutes'?'selected':''}>min</option>
          </select>
        </label>
        <label>Repeat:
          <input type="number" class="repeat-input" min="1" value="${step.repeat}" style="width:60px;">
        </label>
        <label>Interval Sound:
          <select class="sound-select">
            ${SOUNDS.map(s=>`<option value="${s.id}" ${step.sound===s.id?'selected':''}>${s.name}</option>`).join('')}
          </select>
        </label>
        <label>Step Done Sound:
          <select class="stepdone-sound-select">
            ${SOUNDS.map(s=>`<option value="${s.id}" ${step.stepDoneSound===s.id?'selected':''}>${s.name}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="step-progress"><div class="step-progress-bar" style="width:${step.progress*100}%"></div></div>
    `;
    // Event listeners for config
    node.querySelector('.interval-input').addEventListener('input', e => {
      step.interval = parseInt(e.target.value)||1;
    });
    node.querySelector('.interval-unit').addEventListener('change', e => {
      step.intervalUnit = e.target.value;
    });
    node.querySelector('.repeat-input').addEventListener('input', e => {
      step.repeat = parseInt(e.target.value)||1;
    });
    node.querySelector('.sound-select').addEventListener('change', e => {
      step.sound = e.target.value;
    });
    node.querySelector('.stepdone-sound-select').addEventListener('change', e => {
      step.stepDoneSound = e.target.value;
    });
    node.querySelector('.step-title').addEventListener('input', e => {
      step.title = e.target.textContent;
    });
    // Remove, move left/right
    node.querySelector('.remove-step').addEventListener('click', () => {
      steps.splice(idx,1);
      renderSteps();
      drawConnections();
    });
    node.querySelector('.move-left').addEventListener('click', () => {
      if(idx>0){
        [steps[idx-1],steps[idx]] = [steps[idx],steps[idx-1]];
        renderSteps();
        drawConnections();
      }
    });
    node.querySelector('.move-right').addEventListener('click', () => {
      if(idx<steps.length-1){
        [steps[idx+1],steps[idx]] = [steps[idx],steps[idx+1]];
        renderSteps();
        drawConnections();
      }
    });
    // Drag and drop
    node.addEventListener('dragstart', e => {
      e.dataTransfer.setData('step-idx', idx);
      node.classList.add('dragging');
    });
    node.addEventListener('dragend', e => {
      node.classList.remove('dragging');
    });
    node.addEventListener('dragover', e => {
      e.preventDefault();
      node.classList.add('drag-over');
    });
    node.addEventListener('dragleave', e => {
      node.classList.remove('drag-over');
    });
    node.addEventListener('drop', e => {
      e.preventDefault();
      node.classList.remove('drag-over');
      const fromIdx = parseInt(e.dataTransfer.getData('step-idx'));
      if(fromIdx!==idx){
        const [moved] = steps.splice(fromIdx,1);
        steps.splice(idx,0,moved);
        renderSteps();
        drawConnections();
      }
    });
    container.appendChild(node);
  });
  drawConnections();
}

function drawConnections() {
  const svg = document.getElementById('connections');
  svg.innerHTML = '';
  const nodes = Array.from(document.querySelectorAll('.step-node'));
  if(nodes.length<2) return;
  nodes.forEach((node,i) => {
    if(i===0) return;
    const prev = nodes[i-1];
    const rect1 = prev.getBoundingClientRect();
    const rect2 = node.getBoundingClientRect();
    const parentRect = svg.parentElement.getBoundingClientRect();
    const x1 = rect1.right - parentRect.left;
    const y1 = rect1.top + rect1.height/2 - parentRect.top;
    const x2 = rect2.left - parentRect.left;
    const y2 = rect2.top + rect2.height/2 - parentRect.top;
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',`M${x1},${y1} C${x1+40},${y1} ${x2-40},${y2} ${x2},${y2}`);
    path.setAttribute('stroke','#b3b9c9');
    path.setAttribute('stroke-width','3');
    path.setAttribute('fill','none');
    svg.appendChild(path);
  });
}

function playSound(id, type = 'interval') {
  let audioId = 'audio-' + (type === 'stepdone' ? 'stepdone-' : '') + id;
  const audio = document.getElementById(audioId);
  if(audio){
    audio.currentTime = 0;
    audio.play();
  }
}

function setFlowState(state) {
  flowState = state;
  document.getElementById('start-flow').disabled = (state==='running');
  document.getElementById('pause-flow').disabled = !(state==='running');
  document.getElementById('stop-flow').disabled = (state!=='running' && state!=='paused');
}

async function runStep(idx) {
  if(idx>=steps.length) return;
  activeStepIndex = idx;
  steps.forEach((s,i)=>{s.running = (i===idx); s.completed = false; s.progress = 0;});
  renderSteps();
  const step = steps[idx];
  for(let rep=0; rep<step.repeat; rep++){
    if(flowState!=='running') return;
    let duration = step.interval * (step.intervalUnit==='minutes'?60:1);
    let elapsed = 0;
    while(elapsed<duration){
      if(flowState!=='running') return;
      await new Promise(res=>setTimeout(res,1000));
      elapsed++;
      step.progress = Math.min(1, (rep*duration+elapsed)/(step.repeat*duration));
      renderSteps();
    }
    playSound(step.sound, 'interval');
  }
  step.completed = true;
  step.running = false;
  step.progress = 1;
  renderSteps();
  playSound(step.stepDoneSound, 'stepdone'); // step complete
  await runStep(idx+1);
}

function startFlow(){
  if(steps.length===0) return;
  setFlowState('running');
  runStep(0).then(()=>{
    setFlowState('idle');
    activeStepIndex = null;
    steps.forEach(s=>{s.running=false;});
    renderSteps();
  });
}

function pauseFlow(){
  setFlowState('paused');
}

function stopFlow(){
  setFlowState('stopped');
  activeStepIndex = null;
  steps.forEach(s=>{s.running=false; s.progress=0;});
  renderSteps();
}

document.addEventListener('DOMContentLoaded',()=>{
  async function loadTemplates() {
    const select = document.getElementById('template-select');
    select.innerHTML = '<option value="">-- Load Template --</option>';
    try {
      // Fetch template list from index.json
      const resp = await fetch('templates/index.json');
      if (!resp.ok) return;
      const files = await resp.json();
      if (Array.isArray(files)) {
        files.forEach(fname => {
          const opt = document.createElement('option');
          opt.value = fname;
          opt.textContent = fname;
          select.appendChild(opt);
        });
      }
    } catch {}
  }

  function importFlowFromJSON(json) {
    try {
      const arr = JSON.parse(json);
      if (Array.isArray(arr)) {
        steps = arr;
        renderSteps();
        drawConnections();
      }
    } catch (e) {
      alert('Invalid flow file');
    }
  }

  loadTemplates();
  document.getElementById('import-flow').addEventListener('click',()=>{
    document.getElementById('import-file').click();
  });
  document.getElementById('import-file').addEventListener('change',e=>{
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      importFlowFromJSON(evt.target.result);
    };
    reader.readAsText(file);
  });
  document.getElementById('template-select').addEventListener('change',async e=>{
    const fname = e.target.value;
    if (!fname) return;
    try {
      const resp = await fetch('templates/' + fname);
      if (!resp.ok) throw new Error('Not found');
      const json = await resp.text();
      importFlowFromJSON(json);
    } catch {
      alert('Could not load template');
    }
  });
  document.getElementById('add-step').addEventListener('click',()=>{
    steps.push(createStepConfig(steps.length));
    renderSteps();
    drawConnections();
  });
  document.getElementById('start-flow').addEventListener('click',startFlow);
  document.getElementById('pause-flow').addEventListener('click',pauseFlow);
  document.getElementById('stop-flow').addEventListener('click',stopFlow);
  document.getElementById('save-flow').addEventListener('click',()=>{
    const flowData = JSON.stringify(steps, null, 2);
    const blob = new Blob([flowData], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flexi_timer_flow.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  });
  // Initial step
  steps.push(createStepConfig(steps.length));
  renderSteps();
  drawConnections();
});
