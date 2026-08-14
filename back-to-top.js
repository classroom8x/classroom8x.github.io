(function () {
  "use strict";

  // बटन को ऑटो-इंसर्ट (Inject) करना
  let btn = document.getElementById("backToTopBtn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "backToTopBtn";
    btn.className = "back-to-top";
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  // 300px से ज्यादा स्क्रॉल होने पर बटन दिखाना
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });

  // क्लिक करने पर स्मूथ स्क्रॉल टॉप
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
})();