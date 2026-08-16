(function () {
  // 1. Cute & Modern CSS Injection
  const style = document.createElement("style");
  style.innerHTML = `
    /* --- Mid-Post Cute Link Boxes --- */
    .auto-interlink-box {
      background: #ffffff;
      border: 1px solid #f1f5f9;
      border-radius: 16px;
      padding: 14px 18px;
      margin: 26px 0;
      box-shadow: 0 4px 20px -2px rgba(139, 92, 246, 0.08), 0 2px 4px rgba(0,0,0,0.02);
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .auto-interlink-box:hover {
      transform: translateY(-3px) scale(1.008);
      box-shadow: 0 10px 25px -4px rgba(139, 92, 246, 0.18);
      border-color: #ddd6fe;
    }
    .auto-interlink-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, #ede9fe, #fae8ff);
      color: #7c3aed;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }
    .auto-interlink-badge.hot {
      background: linear-gradient(135deg, #fee2e2, #fef3c7);
      color: #ea580c;
    }
    .auto-interlink-link {
      color: #1e1b4b;
      font-weight: 600;
      text-decoration: none;
      font-size: 15px;
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      transition: color 0.2s ease;
    }
    .auto-interlink-link:hover {
      color: #7c3aed;
    }
    .auto-interlink-arrow {
      font-size: 16px;
      color: #a78bfa;
      transition: transform 0.2s ease;
    }
    .auto-interlink-box:hover .auto-interlink-arrow {
      transform: translateX(4px);
      color: #7c3aed;
    }

    /* --- Bottom "Related Stories" Modern Cards Grid --- */
    .auto-footer-interlinks {
      margin-top: 45px;
      margin-bottom: 25px;
      padding: 24px;
      background: linear-gradient(180deg, #faf5ff 0%, #fdf4ff 100%);
      border: 1px solid #f3e8ff;
      border-radius: 20px;
      box-shadow: 0 8px 30px -8px rgba(192, 132, 252, 0.12);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .auto-footer-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
      font-size: 18px;
      font-weight: 700;
      color: #581c87;
    }
    .auto-footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 14px;
    }
    .auto-footer-card {
      background: #ffffff;
      border: 1px solid #f1f5f9;
      border-radius: 14px;
      padding: 14px 16px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .auto-footer-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 22px -4px rgba(147, 51, 234, 0.12);
      border-color: #d8b4fe;
    }
    .auto-footer-card-title {
      color: #1e293b;
      font-size: 14.5px;
      font-weight: 600;
      line-height: 1.45;
      transition: color 0.2s ease;
    }
    .auto-footer-card:hover .auto-footer-card-title {
      color: #7c3aed;
    }
    .auto-footer-card-tag {
      align-self: flex-start;
      font-size: 11px;
      font-weight: 600;
      color: #9333ea;
      background: #faf5ff;
      padding: 3px 9px;
      border-radius: 10px;
      border: 1px solid #f3e8ff;
    }
  `;
  document.head.appendChild(style);

  // Hash Function (SEO Consistent Seed)
  function getHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // 2. Logic Execution
  async function initInternalLinking() {
    try {
      const response = await fetch("https://classroom8x.github.io/data.json");
      const data = await response.json();
      
      const posts = data.posts || (Array.isArray(data) ? data : []);
      if (posts.length === 0) return;

      const currentPath = window.location.pathname.toLowerCase();
      const currentSlug = currentPath.split("/").pop();

      // Current category find
      const currentPost = posts.find(item => {
        const path = (item.url || item.slug || "").toLowerCase();
        return currentSlug && path.includes(currentSlug);
      });
      const currentCategory = currentPost ? currentPost.category : null;

      // Available Links Clean
      let validLinks = posts.map(item => {
        let path = item.url || item.slug || item.link || "";
        path = path.replace(/^\.\.\//, "").replace(/^\//, "");
        const fullUrl = path.startsWith("http") ? path : ("https://classroom8x.github.io/" + path);
        return {
          title: item.title || item.name || "Read More",
          url: fullUrl,
          category: item.category || ""
        };
      }).filter(item => {
        const itemSlug = item.url.toLowerCase().split("/").pop();
        return itemSlug && !currentPath.includes(itemSlug);
      });

      if (validLinks.length === 0) return;

      // Priority to same category
      if (currentCategory) {
        validLinks.sort((a, b) => {
          if (a.category === currentCategory && b.category !== currentCategory) return -1;
          if (b.category === currentCategory && a.category !== currentCategory) return 1;
          return 0;
        });
      }

      // Hash based selection (Consistent for SEO)
      const seed = getHash(currentPath || window.location.href);
      const selectedLinks = [];
      const total = validLinks.length;

      for (let i = 0; i < Math.min(6, total); i++) {
        const index = (seed + i * 3) % total;
        selectedLinks.push(validLinks[index]);
      }
      const uniqueLinks = [...new Set(selectedLinks)];

      // DOM Container Find
      const container = document.querySelector("article") || 
                        document.querySelector("main") || 
                        document.querySelector(".post-content") || 
                        document.querySelector(".entry-content") || 
                        document.body;

      const paragraphs = container.querySelectorAll("p");

      // Mid Post Link 1
      if (paragraphs.length >= 2 && uniqueLinks[0]) {
        const box1 = document.createElement("div");
        box1.className = "auto-interlink-box";
        box1.innerHTML = `
          <span class="auto-interlink-badge">✨ Also Read</span>
          <a class="auto-interlink-link" href="${uniqueLinks[0].url}">
            <span>${uniqueLinks[0].title}</span>
            <span class="auto-interlink-arrow">→</span>
          </a>
        `;
        paragraphs[1].insertAdjacentElement("afterend", box1);
      }

      // Mid Post Link 2
      if (paragraphs.length >= 5 && uniqueLinks[1]) {
        const box2 = document.createElement("div");
        box2.className = "auto-interlink-box";
        box2.innerHTML = `
          <span class="auto-interlink-badge hot">🔥 Trending</span>
          <a class="auto-interlink-link" href="${uniqueLinks[1].url}">
            <span>${uniqueLinks[1].title}</span>
            <span class="auto-interlink-arrow">→</span>
          </a>
        `;
        paragraphs[4].insertAdjacentElement("afterend", box2);
      }

      // Bottom Modern Cards Grid (4 Links)
      const bottomLinks = uniqueLinks.slice(2, 6);
      if (bottomLinks.length > 0) {
        const bottomBox = document.createElement("div");
        bottomBox.className = "auto-footer-interlinks";
        
        let cardsHtml = bottomLinks.map(p => `
          <a href="${p.url}" class="auto-footer-card">
            <span class="auto-footer-card-title">${p.title}</span>
            ${p.category ? `<span class="auto-footer-card-tag">#${p.category}</span>` : ''}
          </a>
        `).join("");

        bottomBox.innerHTML = `
          <div class="auto-footer-header">
            <span>💖 Recommended For You</span>
          </div>
          <div class="auto-footer-grid">${cardsHtml}</div>
        `;

        if (paragraphs.length > 0) {
          paragraphs[paragraphs.length - 1].insertAdjacentElement("afterend", bottomBox);
        } else {
          container.appendChild(bottomBox);
        }
      }

    } catch (e) {
      console.warn("Interlink script error:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInternalLinking);
  } else {
    initInternalLinking();
  }
})();
