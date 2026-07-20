const DATA_URL = './progress-data.json';
const STORAGE_KEY = 'agent-roadmap-progress-data';
const SIDEBAR_KEY = 'agent-roadmap-sidebar-collapsed';

const laneNames = ['待拆解', '学习中', '实现中', '待验收', '已沉淀'];

const phaseResources = {
  short: [
    ['《前端 + AI 转型探索营》', '1-10 周主线课程，每个模块转成作品功能。', 'COURSE'],
    ['hello-agents', 'Agent 基础、tool calling、memory、planning、RAG。', 'CORE'],
    ['learn-claude-code', 'Agent Harness、工具、状态和任务系统。', 'CODE'],
    ['pi-mono', 'TypeScript Agent runtime、CLI、tool calling。', 'RUNTIME'],
    ['Pi Agent 原理与实现', '贯穿第 1/5/7/9 周，作为 loop、tools、session、context compaction 和教学版 Agent 的 runtime 参考。', 'PI'],
    ['Project Ladder', 'Loop Demo -> Tool Agent -> RAG/Citation -> Coding Review -> Nano Coding Agent -> Production Harness。', 'LADDER'],
    ['Eval/Trace', '短期也保留固定任务、失败分类、工具调用次数、成本/耗时和人工确认记录。', 'EVAL'],
    ['Open Design', '把 token/context、ReAct、MCP 权限确认做成视觉指南。', 'VISUAL']
  ],
  mid: [
    ['FastAPI', 'routing、Pydantic、streaming response、后台任务。', 'API'],
    ['LangGraph', 'state、node、edge、checkpoint、human-in-the-loop。', 'GRAPH'],
    ['RAG', 'chunk、embedding、retrieval、rerank、citation、eval。', 'RAG'],
    ['Vector DB', 'Chroma 或 pgvector 二选一，避免数据库过载。', 'DB'],
    ['Observability', 'trace、latency、token/cost、tool error。', 'TRACE']
  ],
  long: [
    ['工程化', '任务恢复、发布门禁、可观测性和回归保障。', 'ENG'],
    ['权限', 'permission policy、audit log、ACL、human approval。', 'AUTH'],
    ['队列', '异步任务、取消、checkpoint resume、历史回放。', 'QUEUE'],
    ['Eval', 'golden dataset、regression eval、CI gate。', 'EVAL'],
    ['IDE/CLI/MCP', 'VS Code extension、Electron、CLI、MCP server。', 'TOOLS']
  ]
};

const phaseSubtitles = {
  short: '0-3 个月 · 短期求职优先 · 当前焦点是可演示作品和面试叙事。',
  mid: '4-6 个月 · 全栈补齐 · 当前目标是把前端作品接入真实 Agent 后端。',
  long: '6-12 个月 · 工程化深化 · 当前目标是负责 Agent 应用长期落地。'
};

const ratioMeta = {
  short: '前端 Agent 60% / 协议基础 25% / 轻后端 15%',
  mid: '前端产品化 35% / FastAPI+LangGraph 40% / RAG+Evals 25%',
  long: '工程化落地 40% / 工具链平台化 35% / 权限成本评测 25%'
};

const viewSearch = {
  board: '',
  portfolio: '',
  interview: '面试',
  review: '沉淀'
};

let roadmap = null;
let activePhaseId = 'short';
let focusOnly = false;
let activeView = 'board';

const els = {
  appShell: document.querySelector('#appShell'),
  sidebarToggle: document.querySelector('#sidebarToggle'),
  phaseSubtitle: document.querySelector('#phaseSubtitle'),
  phaseTabs: document.querySelector('#phaseTabs'),
  kanbanTitle: document.querySelector('#kanbanTitle'),
  kanbanSummary: document.querySelector('#kanbanSummary'),
  kanbanBoard: document.querySelector('#kanbanBoard'),
  progressText: document.querySelector('#progressText'),
  progressBar: document.querySelector('#progressBar'),
  deliverablesTitle: document.querySelector('#deliverablesTitle'),
  deliverablesSummary: document.querySelector('#deliverablesSummary'),
  deliverables: document.querySelector('#deliverables'),
  resources: document.querySelector('#resources'),
  searchInput: document.querySelector('#searchInput'),
  focusButton: document.querySelector('#focusButton'),
  exportJsonButton: document.querySelector('#exportJsonButton'),
  importJsonInput: document.querySelector('#importJsonInput'),
  navItems: document.querySelectorAll('.nav-item'),
  deliverablesPanel: document.querySelector('.deliverables-panel'),
  resourcePanel: document.querySelector('.resource-panel')
};

init();

async function init() {
  try {
    const seed = await loadFromJson();
    const stored = loadFromStorage();
    roadmap = stored ? mergeStoredData(seed, stored) : seed;
    applySidebarState();
    bindActions();
    render();
  } catch (error) {
    renderLoadError(error);
  }
}

async function loadFromJson() {
  const response = await fetch(DATA_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`无法读取 ${DATA_URL}，HTTP ${response.status}`);
  }
  return response.json();
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveToStorage() {
  roadmap.meta.updatedAt = new Date().toISOString().slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmap));
}

function bindActions() {
  els.sidebarToggle.addEventListener('click', toggleSidebar);
  els.navItems.forEach((item) => {
    item.addEventListener('click', () => setActiveView(item.dataset.view));
  });
  els.searchInput.addEventListener('input', () => renderKanban(getActivePhase()));
  els.focusButton.addEventListener('click', () => {
    focusOnly = !focusOnly;
    activeView = 'board';
    render();
  });
  els.exportJsonButton.addEventListener('click', exportJson);
  els.importJsonInput.addEventListener('change', importJson);
}

function applySidebarState() {
  const collapsed = localStorage.getItem(SIDEBAR_KEY) === 'true';
  els.appShell.classList.toggle('sidebar-collapsed', collapsed);
  els.sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
  els.sidebarToggle.setAttribute('aria-label', collapsed ? '展开侧边栏' : '收起侧边栏');
}

function toggleSidebar() {
  const collapsed = !els.appShell.classList.contains('sidebar-collapsed');
  localStorage.setItem(SIDEBAR_KEY, String(collapsed));
  applySidebarState();
}

function render() {
  const phase = getActivePhase();
  const progress = calculateProgress(phase);

  renderPhaseTabs();
  els.phaseSubtitle.textContent = phaseSubtitles[phase.id] || `${phase.period} · ${phase.title}`;
  els.kanbanTitle.textContent = `${phase.period} 学习流程 Kanban`;
  els.kanbanSummary.textContent = phase.summary;
  els.progressText.textContent = `${progress}% 推进`;
  els.progressBar.style.width = `${progress}%`;
  els.focusButton.textContent = focusOnly ? '显示全部任务' : '只看当前焦点';
  renderNav();

  renderKanban(phase);
  renderDeliverables(phase);
  renderResources(phase);
}

function setActiveView(view) {
  activeView = view || 'board';
  focusOnly = false;
  els.searchInput.value = viewSearch[activeView] || '';
  render();

  if (view === 'portfolio') {
    els.deliverablesPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (view === 'review') {
    els.resourcePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderNav() {
  els.navItems.forEach((item) => {
    const isActive = item.dataset.view === activeView;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

function renderPhaseTabs() {
  els.phaseTabs.innerHTML = '';
  roadmap.phases.forEach((phase) => {
    const progress = calculateProgress(phase);
    const ratioWidths = parseRatioWidths(phase.ratio);
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `phase-tab ${phase.id === activePhaseId ? 'active' : ''}`;
    tab.dataset.phase = phase.id;
    tab.setAttribute('aria-pressed', String(phase.id === activePhaseId));
    tab.innerHTML = `
      <div class="phase-head">
        <strong>${escapeHtml(phase.period)} · ${escapeHtml(phase.title)}</strong>
        <span>${progress}%</span>
      </div>
      <p>${escapeHtml(phase.goal)}</p>
      <div class="ratio" aria-label="${escapeHtml(ratioMeta[phase.id] || phase.ratio.join(' / '))}">
        ${ratioWidths.map((width) => `<span style="width:${width}%"></span>`).join('')}
      </div>
      <div class="phase-meta">
        <span>${escapeHtml(ratioMeta[phase.id] || phase.ratio.join(' / '))}</span>
        <span>${escapeHtml(phase.emphasis)}</span>
      </div>
    `;
    tab.addEventListener('click', () => {
      activePhaseId = phase.id;
      render();
    });
    els.phaseTabs.appendChild(tab);
  });
}

function renderKanban(phase) {
  const query = els.searchInput.value.trim();
  const cards = phase.items
    .map((item, index) => normalizeTask(item, index, phase))
    .filter((task) => matchesQuery(task, query))
    .filter((task) => !focusOnly || ['实现', '验收', '面试表达'].includes(task.type));

  els.kanbanBoard.innerHTML = laneNames.map((lane) => {
    const laneTasks = cards.filter((task) => task.lane === lane);
    const list = laneTasks.length
      ? laneTasks.map(renderTaskCard).join('')
      : '<div class="empty">当前筛选下没有任务。</div>';
    return `
      <section class="lane" aria-label="${escapeHtml(lane)}">
        <div class="lane-title"><span>${escapeHtml(lane)}</span><span>${laneTasks.length}</span></div>
        <div class="task-list">${list}</div>
      </section>
    `;
  }).join('');

  els.kanbanBoard.querySelectorAll('.lane-select').forEach((select) => {
    select.addEventListener('change', (event) => {
      updateItem(event.target.dataset.id, { lane: event.target.value });
      renderKanban(getActivePhase());
    });
  });

  els.kanbanBoard.querySelectorAll('.status-select').forEach((select) => {
    select.addEventListener('change', (event) => {
      updateItem(event.target.dataset.id, { status: event.target.value });
      render();
    });
  });

  els.kanbanBoard.querySelectorAll('.notes-input').forEach((input) => {
    input.addEventListener('input', (event) => {
      updateItem(event.target.dataset.id, { notes: event.target.value });
    });
  });
}

function renderTaskCard(task) {
  return `
    <article class="task-card">
      <div class="task-top">
        <span class="period">${escapeHtml(task.period)}</span>
        <span class="type">${escapeHtml(task.type)}</span>
      </div>
      <h3>${escapeHtml(task.title)}</h3>
      <dl>
        <div><dt>产出</dt><dd>${escapeHtml(task.output)}</dd></div>
        <div><dt>验收</dt><dd>${escapeHtml(task.acceptance)}</dd></div>
      </dl>
      <div class="resource-tags">${task.resources.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join('')}</div>
      <div class="task-actions">
        ${renderLaneSelect(task)}
        ${renderStatusSelect(task)}
      </div>
      <textarea class="notes-input" data-id="${escapeHtml(task.id)}" aria-label="${escapeHtml(task.title)}备注" placeholder="备注、阻塞或复盘…">${escapeHtml(task.notes || '')}</textarea>
    </article>
  `;
}

function renderLaneSelect(task) {
  const options = laneNames.map((lane) => {
    const selected = lane === task.lane ? 'selected' : '';
    return `<option value="${escapeHtml(lane)}" ${selected}>${escapeHtml(lane)}</option>`;
  }).join('');
  return `<select class="lane-select" data-id="${escapeHtml(task.id)}" aria-label="${escapeHtml(task.title)}流程列">${options}</select>`;
}

function renderStatusSelect(task) {
  const options = roadmap.meta.statusOptions.map((option) => {
    const selected = option.value === task.status ? 'selected' : '';
    return `<option value="${escapeHtml(option.value)}" ${selected}>${escapeHtml(option.label)}</option>`;
  }).join('');
  return `<select class="status-select" data-id="${escapeHtml(task.id)}" aria-label="${escapeHtml(task.title)}状态">${options}</select>`;
}

function renderDeliverables(phase) {
  const deliverables = phase.deliverables || [];
  const doneCount = deliverables.filter((item) => item.status === 'done').length;
  els.deliverablesTitle.textContent = '阶段交付物';
  els.deliverablesSummary.textContent = `${doneCount}/${deliverables.length} 项已确认，用于作品展示、简历投递和阶段复盘。`;
  els.deliverables.innerHTML = deliverables.map((item) => `
    <article class="deliverable">
      <div class="deliverable-head">
        <strong>${escapeHtml(item.title)}</strong>
        <span class="state ${escapeHtml(item.status)}">${escapeHtml(statusLabel(item.status))}</span>
      </div>
      <p>${escapeHtml(item.description)}</p>
      ${renderDeliverableStatusSelect(item)}
    </article>
  `).join('');

  els.deliverables.querySelectorAll('.status-select').forEach((select) => {
    select.addEventListener('change', (event) => {
      updateDeliverable(event.target.dataset.id, { status: event.target.value });
      renderDeliverables(getActivePhase());
      renderPhaseTabs();
    });
  });
}

function renderDeliverableStatusSelect(item) {
  const options = roadmap.meta.statusOptions.map((option) => {
    const selected = option.value === item.status ? 'selected' : '';
    return `<option value="${escapeHtml(option.value)}" ${selected}>${escapeHtml(option.label)}</option>`;
  }).join('');
  return `<select class="status-select" data-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.title)}状态">${options}</select>`;
}

function renderResources(phase) {
  const resources = phaseResources[phase.id] || [];
  els.resources.innerHTML = resources.map(([title, description, meta]) => `
    <article class="resource">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description)}</span>
      </div>
      <small>${escapeHtml(meta)}</small>
    </article>
  `).join('');
}

function normalizeTask(item, index, phase) {
  return {
    id: item.id,
    period: item.period || item.label,
    type: item.type || taskType(item),
    title: item.title || item.target,
    output: item.output || item.deliverable,
    acceptance: item.acceptance,
    resources: Array.isArray(item.resources) && item.resources.length ? item.resources : resourceTags(item),
    status: item.status,
    notes: item.notes,
    lane: item.lane || defaultLane()
  };
}

function taskType(item) {
  const text = `${item.target} ${item.deliverable} ${item.course}`;
  if (/Open Design|视觉指南/.test(text)) return 'Open Design视觉指南';
  if (/面试|简历|README|演示|讲稿|作品集|系统设计/.test(text)) return '面试表达';
  if (/验收|Evals|Observability|审计|权限|确认/.test(text)) return '验收';
  if (/LLM 与 Agent 基础|基础概念|知识卡片|学习重点|课程/.test(text) && !/Demo|UI|API|Workbench|Docker|MCP server/.test(text)) return '学习';
  if (/实现|Demo|UI|API|MCP|Workbench|FastAPI|LangGraph|RAG|Docker|队列|路由|插件|CLI|IDE/.test(text)) return '实现';
  return '学习';
}

function resourceTags(item) {
  const text = item.course || '';
  const tags = text
    .split(/[；、,，]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 3);
  return tags.length ? tags : ['路线文档'];
}

function defaultLane() {
  return '待拆解';
}

function matchesQuery(task, query) {
  if (!query) return true;
  const blob = [
    task.period,
    task.type,
    task.title,
    task.output,
    task.acceptance,
    task.resources.join(' ')
  ].join(' ').toLowerCase();
  return blob.includes(query.toLowerCase());
}

function parseRatioWidths(ratio) {
  const values = ratio.map((item) => {
    const match = String(item).match(/(\d+)%/);
    return match ? Number(match[1]) : 1;
  });
  const total = values.reduce((sum, value) => sum + value, 0) || 1;
  return values.map((value) => Math.round((value / total) * 100));
}

function statusLabel(status) {
  const option = roadmap.meta.statusOptions.find((entry) => entry.value === status);
  return option?.label || status;
}

function updateItem(itemId, patch) {
  const phase = getActivePhase();
  const item = phase.items.find((entry) => entry.id === itemId);
  if (!item) return;
  Object.assign(item, patch);
  saveToStorage();
}

function updateDeliverable(itemId, patch) {
  const phase = getActivePhase();
  const item = (phase.deliverables || []).find((entry) => entry.id === itemId);
  if (!item) return;
  Object.assign(item, patch);
  saveToStorage();
}

function calculateProgress(phase) {
  const items = [...(phase.items || []), ...(phase.deliverables || [])];
  if (!items.length) return 0;
  const score = items.reduce((total, item) => {
    if (item.status === 'done') return total + 1;
    if (item.status === 'in-progress') return total + 0.5;
    return total;
  }, 0);
  return Math.round((score / items.length) * 100);
}

function getActivePhase() {
  return roadmap.phases.find((phase) => phase.id === activePhaseId) || roadmap.phases[0];
}

function mergeStoredData(seed, stored) {
  const storedPhases = new Map((stored.phases || []).map((phase) => [phase.id, phase]));

  seed.phases.forEach((phase) => {
    const storedPhase = storedPhases.get(phase.id);
    if (!storedPhase) return;

    const storedItems = new Map((storedPhase.items || []).map((item) => [item.id, item]));
    phase.items.forEach((item) => {
      const storedItem = storedItems.get(item.id);
      if (storedItem) {
        item.status = storedItem.status || item.status;
        item.notes = storedItem.notes || item.notes;
        item.lane = storedItem.lane || item.lane;
      }
    });

    const storedDeliverables = new Map((storedPhase.deliverables || []).map((item) => [item.id, item]));
    (phase.deliverables || []).forEach((item) => {
      const storedItem = storedDeliverables.get(item.id);
      if (storedItem) {
        item.status = storedItem.status || item.status;
        item.notes = storedItem.notes || item.notes;
      }
    });
  });

  return seed;
}

function exportJson() {
  saveToStorage();
  const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'progress-data.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result));
      validateData(imported);
      roadmap = imported;
      activePhaseId = roadmap.phases[0].id;
      saveToStorage();
      render();
    } catch (error) {
      alert(`导入失败：${error.message}`);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function validateData(data) {
  if (!data || !Array.isArray(data.phases) || !data.phases.length) {
    throw new Error('JSON 缺少 phases 数据');
  }
  data.phases.forEach((phase) => {
    if (!phase.id || !Array.isArray(phase.items)) {
      throw new Error('phase 必须包含 id 和 items');
    }
  });
}

function renderLoadError(error) {
  document.body.innerHTML = `
    <main class="main">
      <div class="load-error">
        <strong>看板数据加载失败</strong>
        <p>${escapeHtml(error.message)}</p>
        <p>请通过本地 HTTP 服务打开，例如在当前目录运行 <code>python -m http.server 4173</code> 后访问 <code>http://localhost:4173/progress-dashboard.html</code>。</p>
      </div>
    </main>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
