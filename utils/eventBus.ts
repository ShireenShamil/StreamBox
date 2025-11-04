type Handler = (payload?: any) => void;

const map = new Map<string, Set<Handler>>();

export function emit(event: string, payload?: any) {
  const set = map.get(event);
  if (!set) return;
  for (const h of Array.from(set)) h(payload);
}

export function subscribe(event: string, handler: Handler) {
  let set = map.get(event);
  if (!set) {
    set = new Set();
    map.set(event, set);
  }
  set.add(handler);
  return () => {
    set!.delete(handler);
    if (set!.size === 0) map.delete(event);
  };
}

export default { emit, subscribe };
