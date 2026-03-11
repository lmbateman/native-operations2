/**
 * Connector Operations Prototype – interaction-driven (no step banner).
 * Operation data matches GitHub connector from camunda/connectors.
 */

const GITHUB_OPERATIONS = {
  groups: [
    'Issues',
    'Releases',
    'Branches',
    'Repositories',
    'Code scanning',
    'Actions',
    'References',
    'Pulls',
    'Collaborators',
  ],
  typesByGroup: {
    Issues: [
      'Create an issue',
      'Get an issue',
      'Update an issue',
      'Create an issue comment',
      'Search issues and pull requests',
      'List commits',
    ],
    Releases: ['Create a release', 'Get a release', 'List releases'],
    Branches: ['Create a branch', 'Get a branch', 'List branches', 'Delete a branch'],
    Repositories: ['Get repository', 'List repositories', 'Create repository'],
    'Code scanning': ['Get code scanning alert', 'List code scanning alerts'],
    Actions: ['List workflow runs', 'Get workflow run', 'Trigger workflow'],
    References: ['Create a reference', 'Get a reference', 'List references'],
    Pulls: [
      'Create a pull request',
      'Get a pull request',
      'Update a pull request',
      'List pull requests',
      'Merge a pull request',
    ],
    Collaborators: ['Add collaborator', 'List collaborators', 'Remove collaborator'],
  },
};

let connectorApplied = false;
let selectedGroup = 'Issues';
let selectedType = 'Create an issue';

const el = (id) => document.getElementById(id);
const hide = (node) => node?.classList.add('hidden');
const show = (node) => node?.classList.remove('hidden');
const isHidden = (node) => node?.classList.contains('hidden');

function positionPopupNearTask(popup) {
  const stage = document.querySelector('.diagram-stage');
  const taskNode = el('taskNode');
  if (!stage || !taskNode || !popup) return;
  const stageRect = stage.getBoundingClientRect();
  const taskRect = taskNode.getBoundingClientRect();
  const left = taskRect.right - stageRect.left + 16; // just to the right of the context pad
  const top = taskRect.top - stageRect.top - 8; // roughly aligned with the context pad
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.style.transform = 'none';
}

function updateAutosave() {
  const node = el('autosave');
  if (node) node.textContent = 'Acme Corp.';
}

function updateProblems() {
  const list = el('problemsList');
  if (!list) return;
  const problems = [
    'Process_12rhh0c: Process is missing end event',
    'StartEvent_1: Element is missing label/name',
    'Activity_06g5pcl: Element is missing label/name',
  ];
  if (connectorApplied) {
    problems.push('Activity_06g5pcl: Owner must not be empty.');
    problems.push('Activity_06g5pcl: Repository must not be empty.');
    problems.push('Activity_06g5pcl: Title must not be empty.');
    problems.push('Activity_06g5pcl: Element is an implicit end');
  }
  list.innerHTML = problems.map((p) => `<div>${p}</div>`).join('');
}

function scrollPropertiesToOperation() {
  const scroll = document.querySelector('.properties-scroll');
  if (scroll) scroll.scrollTop = 280;
}

function renderGroupDropdown() {
  const ul = el('groupDropdown');
  if (!ul) return;
  ul.innerHTML = GITHUB_OPERATIONS.groups
    .map(
      (g) =>
        `<li role="option" aria-selected="${g === selectedGroup}" data-group="${g}">${g}${g === selectedGroup ? ' <span class="check">✓</span>' : ''}</li>`
    )
    .join('');
}

function renderTypeDropdown() {
  const types = GITHUB_OPERATIONS.typesByGroup[selectedGroup] || [];
  const ul = el('typeDropdown');
  if (!ul) return;
  ul.innerHTML = types
    .map(
      (t) =>
        `<li role="option" aria-selected="${t === selectedType}" data-type="${t}">${t}${t === selectedType ? ' <span class="check">✓</span>' : ''}</li>`
    )
    .join('');
}

function setOperationGroup(group) {
  selectedGroup = group;
  const types = GITHUB_OPERATIONS.typesByGroup[group] || [];
  selectedType = types[0] || '';
  el('operationGroupLabel').textContent = group;
  el('operationTypeLabel').textContent = selectedType;
  renderGroupDropdown();
  renderTypeDropdown();
}

function setOperationType(type) {
  selectedType = type;
  el('operationTypeLabel').textContent = type;
  renderTypeDropdown();
}

function applyConnector(connectorId) {
  connectorApplied = true;
  const taskNode = el('taskNode');
  const genericHeader = el('genericHeader');
  const githubHeader = el('githubHeader');
  if (taskNode) {
    taskNode.setAttribute('data-selected', 'true');
    const iconEl = taskNode.querySelector('.task-icon');
    const label = taskNode.querySelector('.task-label');
    if (iconEl) {
      if (connectorId === 'github') {
        iconEl.innerHTML = '<svg class="icon" focusable="false"><use href="#icon-github"/></svg>';
      } else if (connectorId === 'gitlab') {
        iconEl.innerHTML = '<svg class="icon" focusable="false"><use href="#icon-gitlab"/></svg>';
      }
    }
    if (label) label.textContent = 'Service Task';
  }
  hide(genericHeader);
  show(githubHeader);
  scrollPropertiesToOperation();
  updateProblems();
  updateAutosave();
}

function applyGitHubConnector() {
  applyConnector('github');
}

function applyGitLabConnector() {
  applyConnector('gitlab');
}

function setupDropdowns() {
  const groupTrigger = el('operationGroupTrigger');
  const typeTrigger = el('operationTypeTrigger');
  const groupDropdown = el('groupDropdown');
  const typeDropdown = el('typeDropdown');

  groupTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !isHidden(groupDropdown);
    hide(groupDropdown);
    hide(typeDropdown);
    typeTrigger?.setAttribute('aria-expanded', 'false');
    if (!open) {
      show(groupDropdown);
      groupTrigger.setAttribute('aria-expanded', 'true');
    } else groupTrigger.setAttribute('aria-expanded', 'false');
  });

  typeTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !isHidden(typeDropdown);
    hide(typeDropdown);
    hide(groupDropdown);
    groupTrigger?.setAttribute('aria-expanded', 'false');
    if (!open) {
      show(typeDropdown);
      typeTrigger.setAttribute('aria-expanded', 'true');
    } else typeTrigger.setAttribute('aria-expanded', 'false');
  });

  groupDropdown?.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-group]');
    if (li) {
      setOperationGroup(li.dataset.group);
      hide(groupDropdown);
      groupTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  typeDropdown?.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-type]');
    if (li) {
      setOperationType(li.dataset.type);
      hide(typeDropdown);
      typeTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', () => {
    hide(groupDropdown);
    hide(typeDropdown);
    groupTrigger?.setAttribute('aria-expanded', 'false');
    typeTrigger?.setAttribute('aria-expanded', 'false');
  });
}

function setupPopups() {
  const taskNode = el('taskNode');
  const changeBtn = el('changeElementBtn');
  const changePopup = el('changePopup');
  const appendPopup = el('appendPopup');
   const changeClose = el('changeCloseBtn');
   const appendClose = el('appendCloseBtn');
  const appendRight = el('appendRight');
  const genericHeader = el('genericHeader');
  const githubHeader = el('githubHeader');
  const changeSearch = el('changeSearch');
  const changeMenu = el('changeMenu');
  const changeConnectorsGroup = el('changeConnectorsGroup');
  const changeConnectorsList = el('changeConnectorsList');
  const appendSearch = el('appendSearch');
  const appendMenu = el('appendMenu');
  const appendGatewaysGroup = el('appendGatewaysGroup');
  const appendTasksGroup = el('appendTasksGroup');
  const appendTasksList = el('appendTasksList');
  const appendConnectorsGroup = el('appendConnectorsGroup');
  const appendConnectorsList = el('appendConnectorsList');

  changeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isHidden(changePopup)) {
      show(changePopup);
      hide(appendPopup);
      positionPopupNearTask(changePopup);
      if (changeSearch) {
        changeSearch.value = '';
        changeSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
      changeSearch?.focus();
    } else hide(changePopup);
  });

  appendRight?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isHidden(appendPopup)) {
      show(appendPopup);
      hide(changePopup);
      positionPopupNearTask(appendPopup);
      if (appendSearch) {
        appendSearch.value = '';
        appendSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
      appendSearch?.focus();
    } else hide(appendPopup);
  });

  changeClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    hide(changePopup);
  });

  appendClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    hide(appendPopup);
  });

  document.querySelectorAll('#appendPopup .menu li[data-append]').forEach((li) => {
    li.addEventListener('click', () => {
      if (li.dataset.append === 'connector-github') applyGitHubConnector();
      hide(appendPopup);
    });
  });

  document.querySelectorAll('#appendPopup .menu li:not([data-append])').forEach((li) => {
    li.addEventListener('click', () => hide(appendPopup));
  });

  document.querySelectorAll('#changeMenu li').forEach((li) => {
    li.addEventListener('click', () => hide(changePopup));
  });

  function connectorMatchesQuery(title, keywordStr, q) {
    if (!q) return true;
    const titleLower = (title || '').toLowerCase();
    const keywordsLower = (keywordStr || '').toLowerCase();
    const keywordsList = keywordsLower.split(/\s+/).filter(Boolean);
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRe = new RegExp('\\b' + escaped + '\\b', 'i');
    const titleMatches = wordRe.test(titleLower) || titleLower.includes(q);
    const fullKeywordMatches = keywordsLower.includes(q);
    const singleKeywordMatches = keywordsList.some((k) => wordRe.test(k) || k.includes(q));
    return titleMatches || fullKeywordMatches || singleKeywordMatches;
  }

  changeSearch?.addEventListener('input', () => {
    const q = (changeSearch.value || '').trim().toLowerCase();
    const menuItems = changeMenu?.querySelectorAll('li') ?? [];
    const connectorItems = changeConnectorsList?.querySelectorAll('.connector-item') ?? [];

    menuItems.forEach((li) => {
      const text = (li.textContent || '').toLowerCase();
      li.style.display = q ? (text.includes(q) ? '' : 'none') : '';
    });

    if (!changeConnectorsGroup || !changeConnectorsList) return;
    if (!q) {
      changeConnectorsGroup.style.display = 'none';
      changeConnectorsList.style.display = 'none';
      return;
    }
    changeConnectorsGroup.style.display = 'block';
    let anyShown = false;
    connectorItems.forEach((li) => {
      const title = (li.querySelector('.connector-item-title')?.textContent || '').toLowerCase();
      const keywordStr = li.dataset.keywords || '';
      const matches = connectorMatchesQuery(title, keywordStr, q);
      li.style.display = matches ? 'flex' : 'none';
      if (matches) anyShown = true;
    });
    changeConnectorsList.style.display = anyShown ? 'block' : 'none';
  });

  function filterAppendPopup() {
    const q = (appendSearch?.value || '').trim().toLowerCase();
    const gatewayItems = appendMenu?.querySelectorAll('li') ?? [];
    const taskItems = appendTasksList?.querySelectorAll('li') ?? [];
    const connectorItems = appendConnectorsList?.querySelectorAll('.connector-item') ?? [];

    gatewayItems.forEach((li) => {
      const text = (li.textContent || '').toLowerCase();
      const keywords = (li.dataset.keywords || '').toLowerCase().split(/\s+/).filter(Boolean);
      const matches = !q || text.includes(q) || keywords.some((k) => k.includes(q) || q.includes(k));
      li.style.display = matches ? '' : 'none';
    });

    taskItems.forEach((li) => {
      const text = (li.textContent || '').toLowerCase();
      const keywords = (li.dataset.keywords || '').toLowerCase().split(/\s+/).filter(Boolean);
      const matches = !q || text.includes(q) || keywords.some((k) => k.includes(q) || q.includes(k));
      li.style.display = matches ? '' : 'none';
    });

    if (!q) {
      if (appendConnectorsGroup) appendConnectorsGroup.style.display = 'none';
      if (appendConnectorsList) appendConnectorsList.style.display = 'none';
    } else {
      let anyConnectorShown = false;
      connectorItems.forEach((li) => {
        const title = (li.querySelector('.connector-item-title')?.textContent || '').toLowerCase();
        const keywordStr = li.dataset.keywords || '';
        const matches = connectorMatchesQuery(title, keywordStr, q);
        li.style.display = matches ? 'flex' : 'none';
        if (matches) anyConnectorShown = true;
      });
      if (appendConnectorsGroup) appendConnectorsGroup.style.display = anyConnectorShown ? 'block' : 'none';
      if (appendConnectorsList) appendConnectorsList.style.display = anyConnectorShown ? 'block' : 'none';
    }

    const gatewaysShown = Array.from(gatewayItems).some((li) => li.style.display !== 'none');
    const tasksShown = Array.from(taskItems).some((li) => li.style.display !== 'none');
    if (appendGatewaysGroup) appendGatewaysGroup.style.display = gatewaysShown ? '' : 'none';
    if (appendTasksGroup) appendTasksGroup.style.display = tasksShown ? '' : 'none';
  }

  appendSearch?.addEventListener('input', filterAppendPopup);

  changeConnectorsList?.querySelectorAll('.connector-item').forEach((li) => {
    li.addEventListener('click', () => {
      if (li.dataset.connector === 'github') applyGitHubConnector();
      else if (li.dataset.connector === 'gitlab') applyGitLabConnector();
      hide(changePopup);
    });
  });

  appendConnectorsList?.querySelectorAll('.connector-item').forEach((li) => {
    li.addEventListener('click', () => {
      if (li.dataset.appendConnector === 'github') applyGitHubConnector();
      else if (li.dataset.appendConnector === 'gitlab') applyGitLabConnector();
      hide(appendPopup);
    });
  });

  document.addEventListener('click', (e) => {
    if (changePopup && !isHidden(changePopup) && !changePopup.contains(e.target) && !changeBtn?.contains(e.target)) {
      hide(changePopup);
    }
    if (appendPopup && !isHidden(appendPopup) && !appendPopup.contains(e.target) && !appendRight?.contains(e.target)) {
      hide(appendPopup);
    }
  });

  taskNode?.addEventListener('click', (e) => {
    if (e.target.closest('.popup') || e.target.closest('.toolbar-btn') || e.target.closest('.append-btn') || e.target.closest('.task-corner-dot')) return;
    taskNode.setAttribute('data-selected', 'true');
  });
}

function init() {
  renderGroupDropdown();
  renderTypeDropdown();
  updateProblems();
  updateAutosave();
  setupDropdowns();
  setupPopups();

  const taskNode = el('taskNode');
  const genericHeader = el('genericHeader');
  if (taskNode) taskNode.setAttribute('data-selected', 'true');
  show(genericHeader);
  hide(el('githubHeader'));
}

init();
