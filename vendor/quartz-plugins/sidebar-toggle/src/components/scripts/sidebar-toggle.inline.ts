const STORAGE_KEY = "sidebar-collapsed";

const initialCollapsed = localStorage.getItem(STORAGE_KEY) === "true";
document.documentElement.setAttribute("data-sidebar-collapsed", String(initialCollapsed));

const setupSidebarToggle = () => {
  const toggle = (e) => {
    e.preventDefault();
    const collapsed = document.documentElement.getAttribute("data-sidebar-collapsed") === "true";
    const next = !collapsed;
    document.documentElement.setAttribute("data-sidebar-collapsed", String(next));
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  for (const button of document.getElementsByClassName("left-nav-toggle")) {
    button.addEventListener("click", toggle);
    window.addCleanup(() => button.removeEventListener("click", toggle));
  }
};

document.addEventListener("nav", setupSidebarToggle);
document.addEventListener("render", setupSidebarToggle);
