export function shuffle<T>(a: Array<T>): Array<T> {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = b[i];
    b[i] = b[j];
    b[j] = temp;
  }
  return b;
}
