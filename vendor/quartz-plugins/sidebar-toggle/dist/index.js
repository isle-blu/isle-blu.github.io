// src/components/scripts/sidebar-toggle.inline.ts
var sidebar_toggle_inline_default = 'const STORAGE_KEY = "sidebar-collapsed";\n\nconst initialCollapsed = localStorage.getItem(STORAGE_KEY) === "true";\ndocument.documentElement.setAttribute("data-sidebar-collapsed", String(initialCollapsed));\n\nconst setupSidebarToggle = () => {\n  const toggle = (e) => {\n    e.preventDefault();\n    const collapsed = document.documentElement.getAttribute("data-sidebar-collapsed") === "true";\n    const next = !collapsed;\n    document.documentElement.setAttribute("data-sidebar-collapsed", String(next));\n    localStorage.setItem(STORAGE_KEY, String(next));\n  };\n\n  for (const button of document.getElementsByClassName("left-nav-toggle")) {\n    button.addEventListener("click", toggle);\n    window.addCleanup(() => button.removeEventListener("click", toggle));\n  }\n};\n\ndocument.addEventListener("nav", setupSidebarToggle);\ndocument.addEventListener("render", setupSidebarToggle);\n';
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/SidebarToggle.tsx
var SidebarToggle = () => {
  return /* @__PURE__ */ u2("button", { type: "button", class: "left-nav-toggle", "aria-label": "Toggle sidebar", children: /* @__PURE__ */ u2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      children: [
        /* @__PURE__ */ u2("line", { x1: "4", x2: "20", y1: "6", y2: "6" }),
        /* @__PURE__ */ u2("line", { x1: "4", x2: "20", y1: "12", y2: "12" }),
        /* @__PURE__ */ u2("line", { x1: "4", x2: "20", y1: "18", y2: "18" })
      ]
    }
  ) });
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
SidebarToggle.beforeDOMLoaded = sidebar_toggle_inline_default;
var SidebarToggle_default = (() => SidebarToggle);

export { SidebarToggle_default as SidebarToggle };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map