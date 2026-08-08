document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const svg = document.getElementById("trace");
  const path = document.getElementById("tracePath");
  const pathBg = document.getElementById("tracePathBg");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!svg || !path || !pathBg) return;

  let pathLength = 0;

  function sizeTrace() {
    const docHeight = document.body.scrollHeight;
    svg.setAttribute("viewBox", `0 0 40 ${docHeight}`);
    svg.style.height = `${docHeight}px`;

    const d = `M 20 0 L 20 ${docHeight}`;
    path.setAttribute("d", d);
    pathBg.setAttribute("d", d);

    pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;
  }

  function updateTraceProgress() {
    if (!pathLength) return;
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
    const offset = pathLength - pathLength * progress;
    path.style.strokeDashoffset = `${offset}`;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const node = entry.target.querySelector(".node");
        if (!node) return;
        if (entry.isIntersecting) {
          node.classList.add("is-live");
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll("section").forEach((section) => observer.observe(section));

  function refresh() {
    sizeTrace();
    updateTraceProgress();
  }

  refresh();
  window.addEventListener("resize", refresh);

  if (!reduceMotion) {
    window.addEventListener("scroll", updateTraceProgress, { passive: true });
  } else {
    path.style.strokeDashoffset = "0";
  }
});
