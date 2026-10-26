import { expect, test } from "@playwright/test";
import { nearestPointIndex } from "../../src/lib/nearest-point";

test("spatial pruning preserves the exact distance of a full river-point scan", () => {
  const points = Array.from({ length: 442 }, (_, i) => ({ x: Math.sin(i * 1.37) * 13, z: Math.cos(i * .73) * 7.5 }));
  const nearest = nearestPointIndex(points);
  for (let i = 0; i < 800; i++) {
    const x = Math.sin(i * .211) * 18, z = Math.cos(i * .177) * 12;
    const original = Math.min(...points.map(point => (point.x - x) ** 2 + (point.z - z) ** 2));
    expect(nearest(x, z)).toBe(original);
  }
  for (const point of points) expect(nearest(point.x, point.z)).toBe(0);
});

test("empty and duplicate point sets preserve their distance semantics", () => {
  expect(nearestPointIndex([])(2, 3)).toBe(Infinity);
  expect(nearestPointIndex([{ x: 1, z: 2 }, { x: 1, z: 2 }])(4, 6)).toBe(25);
});
