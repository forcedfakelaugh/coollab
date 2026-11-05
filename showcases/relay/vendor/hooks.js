// One-shot stand-ins for the React hooks used by the generated modules. A component runs
// once; its effects are queued until run() has attached real DOM nodes to its refs.
let queue = null;
export const useRef = value => ({ current: value });
export const useState = value => [typeof value === 'function' ? value() : value, () => {}];
export const useMemo = fn => fn();
export const useEffect = fn => { queue?.push(fn); };
export const useLayoutEffect = useEffect;
export function mount(component, props, attach) {
  queue = [];
  const refs = component(props);
  const effects = queue;
  queue = null;
  attach(refs);
  const cleanups = effects.map(fn => fn()).filter(Boolean);
  return { refs, destroy: () => cleanups.forEach(fn => fn()) };
}
