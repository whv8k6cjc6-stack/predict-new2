/** 《全書》廣益版判讀規則庫（v4）：由 specs/ 的逐句規格建構出引用、規則、古典廟旺與衝突。 */
import { buildClauses, type ClauseSpec } from "./dsl";
import { buildBrightness, brightnessConflicts, classicalLevel } from "./brightness";
import { MAIN_STAR_BRIGHTNESS, MAIN_STAR_CLAUSES } from "./specs/mainStars";
import { AUX_STAR_BRIGHTNESS, AUX_STAR_CLAUSES } from "./specs/auxStars";
import { PALACE_CLAUSES, historicalColumns } from "./specs/palaces";
import { PATTERN_CLAUSES } from "./specs/patterns";
import { PERIOD_CLAUSES } from "./specs/periods";
import { APHORISM_BRIGHTNESS, APHORISM_CLAUSES } from "./specs/aphorisms";

export const GY_CLAUSE_SPECS: ClauseSpec[] = [
  ...MAIN_STAR_CLAUSES, ...AUX_STAR_CLAUSES, ...PALACE_CLAUSES, ...historicalColumns(new Set()), ...PATTERN_CLAUSES, ...PERIOD_CLAUSES, ...APHORISM_CLAUSES,
];
export const GY_BUILT = buildClauses(GY_CLAUSE_SPECS);
/** 卷二各星「X宮Y地」為主；諸星同位垣（p50 起）各星廟旺表只補卷二沒寫到的宮位 */
export const GY_BRIGHTNESS = buildBrightness([...MAIN_STAR_BRIGHTNESS, ...AUX_STAR_BRIGHTNESS, ...APHORISM_BRIGHTNESS]);
export const GY_BRIGHTNESS_CONFLICTS = brightnessConflicts(GY_BRIGHTNESS.rules);
export const gyClassicalLevel = (star: string, branch: string) => classicalLevel(GY_BRIGHTNESS.rules, star, branch);
