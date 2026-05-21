export type SeededRandom = () => number;

export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number): SeededRandom {
  let state = seed >>> 0;
  return function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickOne<T>(rng: SeededRandom, items: readonly T[]): T | null {
  if (items.length === 0) return null;
  const idx = Math.floor(rng() * items.length);
  return items[Math.min(idx, items.length - 1)];
}

export function shuffleSeeded<T>(rng: SeededRandom, items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sampleSeeded<T>(rng: SeededRandom, items: readonly T[], count: number): T[] {
  if (count <= 0) return [];
  return shuffleSeeded(rng, items).slice(0, count);
}
