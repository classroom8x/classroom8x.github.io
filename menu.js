/* ===============================
   AUTO-INJECT FLOATING MENU (menu.js)
   -- Performance-optimized version --
=============================== */
(function () {
  "use strict";

  function initMenu() {
    // 1. Floating Button, Overlay aur Sidebar ka complete HTML inject karein
    const menuHTML = `
      <!-- Floating Menu Toggle Button -->
      <button class="floating-menu-btn" id="floatingMenuBtn" aria-label="Open Menu" aria-expanded="false">
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

    let isOpen = false;
    let rafId = null;

    // requestAnimationFrame me class-toggle batch karne se layout thrashing
    // nahi hoti — teeno elements ek hi frame me update hote hain, smooth lagta hai
    function applyState(open) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        sidebar.classList.toggle('open', open);
        overlay.classList.toggle('show', open);
        floatingBtn.classList.toggle('active', open);
        floatingBtn.setAttribute('aria-expanded', String(open));
        rafId = null;
      });
    }

    function openSidebar() {
      if (isOpen) return;
      isOpen = true;
      applyState(true);
      // Body scroll lock — background scroll na ho jab sidebar khula ho,
      // is se bhi scroll jank kaafi kam hota hai
      document.documentElement.style.overflow = 'hidden';
    }

    function closeSidebar() {
      if (!isOpen) return;
      isOpen = false;
      applyState(false);
      document.documentElement.style.overflow = '';
    }

    // 3. Event Listeners (click events me passive ka effect nahi hota,
    // isliye normal hi rakha hai — passive sirf touch/wheel ke liye kaam aata hai)
    floatingBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen ? closeSidebar() : openSidebar();
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
              // Ek baar me poora HTML string banao aur ek hi baar DOM me daalo
              // (innerHTML already batched hai, but loop-appends se better rakha)
              sideWrap.innerHTML = cats.map(c =>
                `<a href="index.html" data-cat="${c}">${c}</a>`
              ).join('');
            }
          }
        }

        // Load Footer Pages — DocumentFragment use karke ek hi reflow me insert,
        // baar-baar appendChild se multiple reflow hone se bachne ke liye
        if (data.pages && data.pages.length) {
          const footerEl = document.getElementById('dynSidebarFooter');
          if (footerEl) {
            const frag = document.createDocumentFragment();
            data.pages.forEach(p => {
              const a = document.createElement('a');
              a.href = p.url;
              a.textContent = p.title;
              frag.appendChild(a);
            });
            footerEl.appendChild(frag);
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
