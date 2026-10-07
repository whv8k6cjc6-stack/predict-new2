import { describe, it, expect } from "vitest";
import { SAMPLES } from "../../scripts/calibrate-samples";
import { buildNatal, findGroupDays, eventSlotsAll, GROUP_GOOD } from "@/core/analysis";

const TZ = "Asia/Taipei";
const people = [SAMPLES[2], SAMPLES[4], SAMPLES[5]].map((s, i) => ({ id: `p${i}`, name: `人${i}`, natal: buildNatal(s) }));

describe("多人擇時", () => {
  it("每天挑出大家共同最好的時段，依最低分排序", () => {
    const xs = findGroupDays(people, "trip", "2026-10-01", 14, TZ, { top: 6 });
    expect(xs.length).toBeGreaterThan(0);
    expect(xs.length).toBeLessThanOrEqual(6);
    expect(new Set(xs.map(x => x.date)).size).toBe(xs.length);
    for (let i = 1; i < xs.length; i++) expect(xs[i - 1].min).toBeGreaterThanOrEqual(xs[i].min);
    for (const d of xs) {
      expect(d.members.map(m => m.id)).toEqual(["p0", "p1", "p2"]);
      expect(d.min).toBe(Math.min(...d.members.map(m => m.score)));
      expect(d.weakest?.score).toBe(d.min);
      const good = d.members.filter(m => m.score >= GROUP_GOOD).length;
      expect(d.verdict).toBe(good === 3 ? "allGood" : good >= 2 ? "mostlyGood" : "mixed");
    }
  });
  it("每人分數與單人擇時一致", () => {
    const [d] = findGroupDays(people, "leave", "2026-10-01", 7, TZ);
    for (const [i, p] of people.entries()) {
      const s = eventSlotsAll(p.natal, "leave", "2026-10-01", 7, TZ).find(x => x.date === d.date && x.time === d.time)!;
      expect(d.members[i].score).toBe(s.score);
    }
  });
  it("只看週末", () => {
    const xs = findGroupDays(people, "trip", "2026-10-01", 30, TZ, { weekendsOnly: true, top: 20 });
    expect(xs.length).toBe(8);
    for (const d of xs) expect([0, 6]).toContain(new Date(`${d.date}T00:00:00Z`).getUTCDay());
  });
  it("一個人也能用，且不標示最弱者", () => {
    const xs = findGroupDays(people.slice(0, 1), "meeting", "2026-10-01", 7, TZ);
    expect(xs.length).toBe(5);
    expect(xs.every(x => x.weakest === null && x.min === x.avg)).toBe(true);
  });
  it("沒有人時回傳空陣列", () => {
    expect(findGroupDays([], "trip", "2026-10-01", 7, TZ)).toEqual([]);
  });
});
