/** Suspend animation work outside the viewport and while the tab is hidden. */
export function observeMotionVisibility(element: Element, onChange: (active: boolean) => void, rootMargin = "100px") {
  let inView = true;
  let active: boolean | undefined;
  const update = () => {
    const next = inView && !document.hidden;
    if (next !== active) { active = next; onChange(next); }
  };
  const observer = new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting ?? false; update(); }, { rootMargin });
  observer.observe(element);
  document.addEventListener("visibilitychange", update);
  update();
  return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
}
