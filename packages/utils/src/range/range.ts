export function* range(a: number, b = 0) {
  const start = arguments.length === 2 ? a : b;
  const end = arguments.length === 2 ? b : a;

  if (start < end) {
    for (let i = start; i < end; i++) {
      yield i;
    }
    yield end;
    return;
  } else if (start > end) {
    for (let i = start; i > end; i--) {
      yield i;
    }
    yield end;
    return;
  }

  yield start;
}
