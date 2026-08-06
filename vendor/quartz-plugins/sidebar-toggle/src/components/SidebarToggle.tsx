import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types";
// @ts-expect-error - Inline script loaded as text by esbuild plugin
import sidebarToggleScript from "./scripts/sidebar-toggle.inline.ts";

const SidebarToggle: QuartzComponent = () => {
  return (
    <button type="button" class="left-nav-toggle" aria-label="Toggle sidebar">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="4" x2="20" y1="6" y2="6"></line>
        <line x1="4" x2="20" y1="12" y2="12"></line>
        <line x1="4" x2="20" y1="18" y2="18"></line>
      </svg>
    </button>
  );
};

SidebarToggle.css = `
.left-nav-toggle {
  cursor: pointer;
  padding: 0.4rem;
  margin: 0;
  background: none;
  border: 2px solid var(--lightgray);
  border-radius: 4px;
  color: var(--darkgray);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.left-nav-toggle:hover {
  color: var(--dark);
  background-color: var(--lightgray);
  border-color: var(--gray);
}

@media all and (max-width: 800px) {
  .left-nav-toggle {
    display: none;
  }
}
`;

SidebarToggle.beforeDOMLoaded = sidebarToggleScript;

export default (() => SidebarToggle) satisfies QuartzComponentConstructor;
