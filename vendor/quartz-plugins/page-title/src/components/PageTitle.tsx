import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import { classNames } from "../util/lang";
import { pathToRoot } from "../util/path";
import { i18n } from "../i18n";

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const locale = cfg?.locale ?? "en-US";
  const title = cfg?.pageTitle ?? i18n(locale).propertyDefaults.title;
  const baseDir = pathToRoot(fileData.slug as string);
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>{title}</a>
      <span class="page-title-cursor" aria-hidden="true">
        █
      </span>
    </h2>
  );
};

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

@media all and (min-width: 800px) {
  .page-title {
    position: fixed;
    top: 1.5rem;
    left: 2rem;
    z-index: 2;
    padding: 0.3rem 0.6rem;
    margin-left: -0.6rem;
    border-radius: 5px;
    background-color: var(--light);
  }
}

.page-title-cursor {
  display: inline-block;
  transform: scaleX(0.5);
  transform-origin: left;
  animation: page-title-cursor-blink 1s step-end infinite;
}

@keyframes page-title-cursor-blink {
  50% {
    opacity: 0;
  }
}
`;

export default (() => PageTitle) satisfies QuartzComponentConstructor;
