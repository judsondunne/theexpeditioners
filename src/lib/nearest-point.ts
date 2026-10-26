interface Point { x: number; z: number }
interface Node { point: Point; axis: "x" | "z"; left: Node | null; right: Node | null }

/** Exact nearest-neighbour lookup: spatial pruning changes cost, never terrain heights. */
export function nearestPointIndex(points: readonly Point[]) {
  const build = (values: Point[], depth: number): Node | null => {
    if (!values.length) return null;
    const axis = depth % 2 ? "z" : "x";
    values.sort((a, b) => a[axis] - b[axis]);
    const middle = Math.floor(values.length / 2);
    return { point: values[middle], axis, left: build(values.slice(0, middle), depth + 1), right: build(values.slice(middle + 1), depth + 1) };
  };
  const root = build([...points], 0);
  return (x: number, z: number) => {
    let distance = Infinity;
    const visit = (node: Node | null): void => {
      if (!node) return;
      const squared = (node.point.x - x) ** 2 + (node.point.z - z) ** 2;
      if (squared < distance) distance = squared;
      const delta = node.axis === "x" ? x - node.point.x : z - node.point.z;
      visit(delta < 0 ? node.left : node.right);
      if (delta * delta < distance) visit(delta < 0 ? node.right : node.left);
    };
    visit(root);
    return distance;
  };
}
