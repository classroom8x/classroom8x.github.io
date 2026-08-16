/* ===============================
   AUTO-INJECT FLOATING MENU (menu.js)
=============================== */
(function () {
  "use strict";

  function initMenu() {
    // 1. Floating Button, Overlay aur Sidebar ka complete HTML inject karein
    const menuHTML = `
      <!-- Floating Menu Toggle Button -->
      <button class="floating-menu-btn" id="floatingMenuBtn" aria-label="Open Menu">
        <span></span><span></span><span></span>
      </button>

      <!-- Background Overlay -->
      <div class="overlay" id="globalOverlay"></div>

      <!-- Slide-in Sidebar -->
      <aside class="sidebar" id="globalSidebar" aria-label="Site menu">
        <div class="sidebar-head">
          <span>Menu</span>
          <button class="sidebar-close" id="globalSidebarClose" aria-label="Close menu">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <nav class="sidebar-nav">
          <div class="section-label">Browse</div>
          <a href="index.html">Home</a>
          <a href="index.html" data-cat="all">All Posts</a>
          <div class="section-label" id="dynSidebarCategoriesLabel" style="display:none;">Categories</div>
          <div id="dynSidebarCategories"></div>
        </nav>
        <div class="sidebar-footer" id="dynSidebarFooter">
          <div class="section-label">Important Pages</div>
        </div>
      </aside>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHTML);

    // 2. Elements grab karein
    const floatingBtn = document.getElementById('floatingMenuBtn');
    const sidebar = document.getElementById('globalSidebar');
    const overlay = document.getElementById('globalOverlay');
    const closeBtn = document.getElementById('globalSidebarClose');

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('show');
      floatingBtn.classList.add('active');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      floatingBtn.classList.remove('active');
    }

    // 3. Event Listeners
    floatingBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });

    // 4. data.json se Categories aur Pages load karein
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        // Load Categories
        if (data.posts && data.posts.length) {
          const counts = {};
          data.posts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
          const cats = Object.keys(counts).sort();

          if (cats.length) {
            const sideLabel = document.getElementById('dynSidebarCategoriesLabel');
            const sideWrap = document.getElementById('dynSidebarCategories');
            if (sideLabel && sideWrap) {
              sideLabel.style.display = 'block';
              sideWrap.innerHTML = cats.map(c =>
                `<a href="index.html" data-cat="${c}">${c}</a>`
              ).join('');
            }
          }
        }

        // Load Footer Pages
        if (data.pages && data.pages.length) {
          const footerEl = document.getElementById('dynSidebarFooter');
          if (footerEl) {
            data.pages.forEach(p => {
              const a = document.createElement('a');
              a.href = p.url;
              a.textContent = p.title;
              footerEl.appendChild(a);
            });
          }
        }
      })
      .catch(err => console.error("Menu data load failed:", err));
  }

  // Agar DOM load ho gaya ho to turant run karein
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();