// ---------- Liquid glass wiring ----------
const glassInstances = [];

function applyGlass(el) {
  if (!el || el.dataset.glassApplied) return;
  el.dataset.glassApplied = 'true';
  const instance = liquidGlass(el, {
    scale: -65,
    chroma: 4,
    border: 0.09,
    blur: 3,
    saturate: 1.25,
    fallbackBlur: 20
  });
  glassInstances.push(instance);
}

function applyGlassToAll(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-glass]').forEach(applyGlass);
}

// ---------- API health check ----------
async function checkHealth() {
  const statusText = document.getElementById('status-text');
  const metricStatus = document.getElementById('metric-status');
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (data.status === 'ok' && data.db === 'connected') {
      statusText.textContent = 'online';
      metricStatus.textContent = 'Live';
    } else {
      statusText.textContent = 'degraded';
      metricStatus.textContent = 'Degraded';
    }
  } catch (err) {
    statusText.textContent = 'offline';
    metricStatus.textContent = 'Offline';
  }
}

// ---------- Projects ----------
async function loadProjects() {
  const list = document.getElementById('project-list');
  const metricProjects = document.getElementById('metric-projects');
  try {
    const res = await fetch('/api/projects');
    const projects = await res.json();

    metricProjects.textContent = projects.length;

    if (!projects.length) {
      list.innerHTML = '<div class="loading-row">No projects yet - check back soon.</div>';
      return;
    }

    list.innerHTML = projects.map(renderProjectCard).join('');
  } catch (err) {
    list.innerHTML = '<div class="loading-row">Could not load projects. Is the API running?</div>';
  }
}

function renderProjectCard(p) {
  const statusClass = p.status === 'live' ? 'live' : p.status === 'in-progress' ? 'in-progress' : '';
  const stack = (p.stack || []).map(function (s) {
    return '<span class="chip">' + escapeHtml(s) + '</span>';
  }).join('');
  const links = [
    p.repoUrl ? '<a href="' + escapeHtml(p.repoUrl) + '" target="_blank" rel="noopener">Source</a>' : '',
    p.liveUrl ? '<a href="' + escapeHtml(p.liveUrl) + '" target="_blank" rel="noopener">Live</a>' : ''
  ].filter(Boolean).join('');

  return '' +
    '<article class="project-row">' +
      '<div class="project-top">' +
        '<h3>' + escapeHtml(p.title) + '</h3>' +
        '<span class="status-pill ' + statusClass + '">' + escapeHtml(p.status) + '</span>' +
      '</div>' +
      '<p class="project-summary">' + escapeHtml(p.summary) + '</p>' +
      (stack ? '<div class="chip-row">' + stack + '</div>' : '') +
      (links ? '<div class="project-links">' + links + '</div>' : '') +
    '</article>';
}

// ---------- Skills ----------
const CATEGORY_LABELS = {
  language: 'Languages',
  framework: 'Frameworks & Libraries',
  infra: 'Infrastructure',
  database: 'Databases',
  tool: 'Tools'
};

async function loadSkills() {
  const grid = document.getElementById('skills-grid');
  try {
    const res = await fetch('/api/skills');
    const skills = await res.json();

    if (!skills.length) {
      grid.innerHTML = '<div class="loading-row">No skills listed yet.</div>';
      return;
    }

    const grouped = {};
    skills.forEach(function (s) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });

    grid.innerHTML = Object.entries(grouped).map(function (entry) {
      const cat = entry[0];
      const items = entry[1];
      const rows = items.map(function (s) {
        return '' +
          '<div class="skill-row">' +
            '<div class="skill-row-top"><span>' + escapeHtml(s.name) + '</span><span>' + s.level + '%</span></div>' +
            '<div class="skill-meter"><div class="skill-meter-fill" style="width:' + s.level + '%"></div></div>' +
          '</div>';
      }).join('');
      return '' +
        '<div class="skill-card">' +
          '<h4>' + (CATEGORY_LABELS[cat] || cat) + '</h4>' +
          rows +
        '</div>';
    }).join('');
  } catch (err) {
    grid.innerHTML = '<div class="loading-row">Could not load skills.</div>';
  }
}

// ---------- Contact form ----------
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn = document.getElementById('submit-btn');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      status.textContent = 'Message sent — thanks, I\'ll reply soon.';
      status.className = 'form-status success';
      form.reset();
    } catch (err) {
      status.textContent = err.message;
      status.className = 'form-status error';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send message';
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : str;
  return div.innerHTML;
}

// ---------- Init ----------
document.getElementById('footer-year').textContent = new Date().getFullYear();
applyGlassToAll(document);
checkHealth();
loadProjects();
loadSkills();
setupContactForm();
