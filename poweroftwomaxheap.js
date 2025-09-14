/**
 * PowerOfTwoMaxHeap
 * A max-heap where each node has exactly 2^branchingPower children.
 * Backed by a single array for performance.
 */
class PowerOfTwoMaxHeap {
  constructor(branchingPower, comparator = null) {
    if (branchingPower < 0 || branchingPower > 30) {
      throw new Error("branchingPower must be in [0, 30]");
    }
    this.branchingPower = branchingPower;
    this.childrenPerNode = 1 << branchingPower; // 2^branchingPower
    this.comparator = comparator || ((a, b) => (a > b ? 1 : a < b ? -1 : 0));
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    if (this.isEmpty()) throw new Error("heap is empty");
    return this.heap[0];
  }

  insert(value) {
    this.heap.push(value);
    this._siftUp(this.heap.length - 1);
  }

  popMax() {
    if (this.isEmpty()) throw new Error("heap is empty");
    const last = this.heap.length - 1;
    const max = this.heap[0];
    if (last === 0) {
      this.heap.pop();
      return max;
    }
    const tail = this.heap.pop();
    this.heap[0] = tail;
    this._siftDown(0);
    return max;
  }

  // ---- internal helpers ----

  _siftUp(i) {
    const d = this.childrenPerNode;
    const v = this.heap[i];
    while (i > 0) {
      const parent = Math.floor((i - 1) / d);
      const p = this.heap[parent];
      if (this.comparator(v, p) <= 0) break;
      this.heap[i] = p;
      i = parent;
    }
    this.heap[i] = v;
  }

  _siftDown(i) {
    const n = this.heap.length;
    const d = this.childrenPerNode;
    const v = this.heap[i];

    while (true) {
      const firstChild = i * d + 1;
      if (firstChild >= n) break;

      let maxChildIdx = firstChild;
      let maxChildVal = this.heap[firstChild];
      const lastChild = Math.min(firstChild + d - 1, n - 1);

      for (let c = firstChild + 1; c <= lastChild; c++) {
        const cand = this.heap[c];
        if (this.comparator(cand, maxChildVal) > 0) {
          maxChildVal = cand;
          maxChildIdx = c;
        }
      }

      if (this.comparator(maxChildVal, v) <= 0) break;

      this.heap[i] = maxChildVal;
      i = maxChildIdx;
    }
    this.heap[i] = v;
  }

  // ---- verifier for debugging ----
  isValidHeap() {
    const n = this.heap.length;
    const d = this.childrenPerNode;
    for (let i = 0; i < n; i++) {
      const firstChild = i * d + 1;
      const lastChild = Math.min(firstChild + d - 1, n - 1);
      for (let c = firstChild; c <= lastChild; c++) {
        if (this.comparator(this.heap[i], this.heap[c]) < 0) return false;
      }
    }
    return true;
  }
}

// ---- Example usage / quick tests ----
if (require.main === module) {
  const testPowers = [0, 1, 2, 3, 5, 10];
  for (const bp of testPowers) {
    const h = new PowerOfTwoMaxHeap(bp);
    const vals = [];
    for (let i = 0; i < 50; i++) {
      const v = Math.floor(Math.random() * 1000);
      vals.push(v);
      h.insert(v);
    }
    const popped = [];
    while (!h.isEmpty()) {
      popped.push(h.popMax());
    }
    const sorted = [...vals].sort((a, b) => b - a);
    console.log(
      `branchingPower=${bp}, valid=${JSON.stringify(
        popped
      ) === JSON.stringify(sorted)}`
    );
  }
}
