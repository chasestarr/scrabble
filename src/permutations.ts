// https://www.quickperm.org/
export function permutations<T>(elements: T[]): T[][] {
  const result = [];

  const a = [...elements];
  const n = a.length;
  const p = Array.from(Array(n + 1).keys());
  p[n] = n;

  let i = 1;
  while (i < n) {
    p[i] -= 1;
    const j = (i % 2) * p[i];

    const tmp = a[j];
    a[j] = a[i];
    a[i] = tmp;

    i = 1;
    while (p[i] === 0) {
      p[i] = i;
      i += 1;
    }

    result.push(a.slice(0));
  }

  return result;
}

export function subsets<T>(elements: T[]): T[][] {
  const result = [];

  for (let i = 1; i < 2 ** elements.length; i++) {
    const subset = [];

    for (let j = 1; j <= elements.length; j++) {
      const m = 1 << (j - 1);
      if ((i & m) > 0) {
        subset.push(elements[j - 1]);
      }
    }

    result.push(subset);
  }

  return result;
}

export function isAnagram<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const map = new Map<T, number>();
  for (const char of a) {
    const v = map.get(char);
    if (v === undefined) {
      map.set(char, 1);
    } else {
      map.set(char, v + 1);
    }
  }

  for (const char of b) {
    const v = map.get(char);
    if (v === undefined) {
      return false;
    } else {
      map.set(char, v - 1);
    }
  }

  for (const value of map.values()) {
    if (value !== 0) {
      return false;
    }
  }

  return true;
}
