(function () {
  // 1. CSS Styles Auto Inject
  const style = document.createElement("style");
  style.innerHTML = `
    .auto-interlink-box {
      background: #f1f5f9;
      border-left: 4px solid #2563eb;
      padding: 12px 18px;
      margin: 24px 0;
      border-radius: 6px;
      font-size: 15px;
      line-height: 1.5;
      font-family: inherit;
    }
    .auto-interlink-box strong {
      color: #0f172a;
    }
    .auto-interlink-box a {
      color: #2563eb;
      font-weight: 600;
      text-decoration: underline;
      margin-left: 6px;
    }
    .auto-interlink-box a:hover {
      color: #1d4ed8;
    }
    .auto-footer-interlinks {
      margin-top: 40px;
      margin-bottom: 20px;
      padding: 20px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-family: inherit;
    }
    .auto-footer-interlinks h4 {
      margin: 0 0 12px 0;
      color: #0f172a;
      font-size: 18px;
      font-weight: 700;
    }
    .auto-footer-interlinks ul {
      margin: 0;
      padding-left: 20px;
    }
    .auto-footer-interlinks li {
      margin-bottom: 8px;
      font-size: 15px;
    }
    .auto-footer-interlinks a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }
    .auto-footer-interlinks a:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);

  // Simple string hash function (Fixed seed based on current URL)
  function getHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // 2. Main SEO-Friendly Interlink Function
  async function initInternalLinking() {
    try {
      const response = await fetch("https://classroom8x.github.io/data.json");
      const data = await response.json();
      
      const posts = data.posts || (Array.isArray(data) ? data : []);
      if (posts.length === 0) return;

      const currentPath = window.location.pathname.toLowerCase();
      const currentSlug = currentPath.split("/").pop();

      // Current post ki detail dhoondho (category pata lagane ke liye)
      const currentPost = posts.find(item => {
        const path = (item.url || item.slug || "").toLowerCase();
        return currentSlug && path.includes(currentSlug);
      });
      const currentCategory = currentPost ? currentPost.category : null;

      // Available Links prepare aur Current Page filter karna
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

      // Category Matching: Pehle Same Category wale posts ko priority do
      if (currentCategory) {
        validLinks.sort((a, b) => {
          if (a.category === currentCategory && b.category !== currentCategory) return -1;
          if (b.category === currentCategory && a.category !== currentCategory) return 1;
          return 0;
        });
      }

      // DETERMINISTIC SELECTION (URL ke hash se hamesha same links select honge, refresh pe badlenge nahi)
      const seed = getHash(currentPath || window.location.href);
      const selectedLinks = [];
      const total = validLinks.length;

      for (let i = 0; i < Math.min(6, total); i++) {
        const index = (seed + i * 3) % total;
        selectedLinks.push(validLinks[index]);
      }

      // Duplicate hatayein agar koi aayi ho
      const uniqueLinks = [...new Set(selectedLinks)];

      // DOM Container Find Karein
      const container = document.querySelector("article") || 
                        document.querySelector("main") || 
                        document.querySelector(".post-content") || 
                        document.querySelector(".entry-content") || 
                        document.body;

      const paragraphs = container.querySelectorAll("p");

      // Mid-Post Link 1
      if (paragraphs.length >= 2 && uniqueLinks[0]) {
        const box1 = document.createElement("div");
        box1.className = "auto-interlink-box";
        box1.innerHTML = `👉 <strong>Also Read:</strong> <a href="${uniqueLinks[0].url}">${uniqueLinks[0].title}</a>`;
        paragraphs[1].insertAdjacentElement("afterend", box1);
      }

      // Mid-Post Link 2
      if (paragraphs.length >= 5 && uniqueLinks[1]) {
        const box2 = document.createElement("div");
        box2.className = "auto-interlink-box";
        box2.innerHTML = `🔥 <strong>Must Read:</strong> <a href="${uniqueLinks[1].url}">${uniqueLinks[1].title}</a>`;
        paragraphs[4].insertAdjacentElement("afterend", box2);
      }

      // Bottom Section (Fixed 4 Links)
      const bottomLinks = uniqueLinks.slice(2, 6);
      if (bottomLinks.length > 0) {
        const bottomBox = document.createElement("div");
        bottomBox.className = "auto-footer-interlinks";
        
        let listHtml = bottomLinks.map(p => {
          const cat = p.category ? ` <span style="font-size:12px; color:#64748b;">(${p.category})</span>` : "";
          return `<li><a href="${p.url}">${p.title}</a>${cat}</li>`;
        }).join("");

        bottomBox.innerHTML = `
          <h4>⚡ Recommended Stories:</h4>
          <ul>${listHtml}</ul>
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
