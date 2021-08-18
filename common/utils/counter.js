export interface Counter {
  next(): number;
}

export function newCounter(init = 0): Counter {
  return {
    next: () => ++init
  }
}
