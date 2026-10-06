/** 工作角色設定：只調整建議與時間表的用語（例：公務機關主管看到「公文陳核」「跨科室協調」），不影響判讀與觸發條件。 */

export type WorkRole = "publicStaff" | "publicManager" | "employee" | "manager" | "selfEmployed" | "student" | "retired";
export interface WorkProfile { role?: WorkRole }

export const WORK_ROLE_LABEL: Record<WorkRole, string> = {
  publicStaff: "公務機關（一般職員）",
  publicManager: "公務機關（主管）",
  employee: "民間企業（職員）",
  manager: "民間企業（主管）",
  selfEmployed: "自營或接案",
  student: "學生",
  retired: "退休或家管",
};
export const WORK_ROLES = Object.keys(WORK_ROLE_LABEL) as WorkRole[];

/** 用語查找順序：角色本身 → 公務（公務兩類）→ 主管（兩類主管）→ 通用 */
export type RoleKey = WorkRole | "public" | "lead";
export function roleKeys(role?: WorkRole): RoleKey[] {
  if (!role) return [];
  const out: RoleKey[] = [role];
  if (role === "publicStaff" || role === "publicManager") out.push("public");
  if (role === "publicManager" || role === "manager") out.push("lead");
  return out;
}
