document.getElementById('year').textContent = new Date().getFullYear();

const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) root.dataset.theme = saved;
document.getElementById('theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});

const USER = 'PBesstDev';
const box = document.getElementById('repos');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(repos => {
    const list = repos
      .filter(r => !r.fork && r.name.toLowerCase() !== `${USER.toLowerCase()}.github.io`)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 9);
    if (!list.length) { box.innerHTML = '<p class="muted">No public projects yet — check back soon.</p>'; return; }
    box.innerHTML = list.map(r => `
      <a class="card" href="${esc(r.html_url)}" target="_blank" rel="noopener">
        <h3>${esc(r.name)}</h3>
        <p>${esc(r.description || 'No description yet.')}</p>
        <div class="meta">${r.language ? `<span>● ${esc(r.language)}</span>` : ''}<span>★ ${r.stargazers_count}</span></div>
      </a>`).join('');
  })
  .catch(() => {
    box.innerHTML = `<p class="muted">Couldn't load projects right now. <a href="https://github.com/${USER}?tab=repositories">See them on GitHub</a>.</p>`;
  });
