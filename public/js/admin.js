// admin.js - mobile sidebar toggle
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("adminSidebar");
  const toggle = document.getElementById("adminSidebarToggle");

  if (!sidebar) return;

  const openSidebar = () => sidebar.classList.add("open");
  const closeSidebar = () => sidebar.classList.remove("open");

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (sidebar.classList.contains("open")) closeSidebar();
      else openSidebar();
    });
  }

  // close when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth > 767) return;
    if (!sidebar.classList.contains("open")) return;

    const isInside = sidebar.contains(e.target) || (toggle && toggle.contains(e.target));
    if (!isInside) closeSidebar();
  });

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") sidebar.classList.remove("open");
  });
});
