/** 十二宮與十四主星的語義登錄資料。
 *  - classical＊欄位：必須來自已校驗的古籍原文；目前原文尚未匯入，全部為 null／pendingVerification。
 *  - 宮位 modernMeaning：App 依宮名字義整理的現代用途範圍（標為 palaceNameLiteral），用來決定主題取哪些宮，不是吉凶判讀。
 *  - 三方四正（combineWith）由十二宮固定排列推得，屬客觀結構。 */
import type { TopicId } from "@/kb/advice/topics";
import { MAJOR, PALACES, type PalaceName } from "@/core/ziwei/common";
import { MAIN_STARS } from "@/core/ziwei/stars";
import type { PalaceSemantic, SourcedField, StarSemantic } from "@/core/ziwei/interp/semantics";
import { palaceCode, starCode } from "./sources";

const pending = (citationIds: string[]): SourcedField => ({ text: null, citationIds, status: "pendingVerification" });
const at = (i: number) => PALACES[((i % 12) + 12) % 12];

const MODERN: Record<PalaceName, { text: string; topics: TopicId[]; scope: string }> = {
  命宮: { text: "本人的整體狀態與基本傾向", topics: ["general", "decision"], scope: "看整體基調時的出發點，所有主題都要參照" },
  兄弟: { text: "兄弟姊妹、同輩與平輩往來", topics: ["social", "cooperation"], scope: "同輩互動與平輩合作" },
  夫妻: { text: "伴侶與婚姻關係", topics: ["relationship", "marriage"], scope: "感情、伴侶互動與婚姻安排" },
  子女: { text: "子女與晚輩", topics: ["general"], scope: "子女、晚輩相關事務" },
  財帛: { text: "金錢的收入與支出", topics: ["wealth", "investment"], scope: "收入、支出與金錢往來的狀態" },
  疾厄: { text: "身體狀況（只作生活作息提醒）", topics: ["health"], scope: "作息與身心狀態的提醒；不作任何疾病判斷" },
  遷移: { text: "外出、移動與在外的環境", topics: ["travel", "jobChange"], scope: "出行、外派、環境變動" },
  交友: { text: "朋友、同事與往來對象", topics: ["social", "cooperation"], scope: "人際往來與合作對象" },
  官祿: { text: "工作、職務與事業", topics: ["career", "promotion", "jobSearch", "jobChange"], scope: "工作、職務與事業發展" },
  田宅: { text: "住所、不動產與家庭環境", topics: ["property"], scope: "居住、不動產與家庭環境" },
  福德: { text: "精神生活、興趣與內在感受", topics: ["health", "general"], scope: "心情、休閒與內在狀態" },
  父母: { text: "父母、長輩與上級", topics: ["general", "promotion"], scope: "與父母、長輩、上級的關係" },
};

export const PALACE_SEMANTICS: PalaceSemantic[] = PALACES.map((name, i) => {
  const m = MODERN[name];
  return {
    palaceId: palaceCode(name), name,
    classicalMeaning: pending([`CIT_QS_PALACE_${palaceCode(name)}`]),
    modernMeaning: { text: m.text, basis: "palaceNameLiteral" },
    relatedTopics: m.topics,
    interpretationScope: m.scope,
    combineWith: { opposite: at(i + 6), trines: [at(i + 4), at(i + 8)] },
    classicalSources: ["ziwei.quanshu"],
    caveats: [
      `判讀「${name}」相關問題不能只看本宮，須搭配對宮${at(i + 6)}、三合宮${at(i + 4)}與${at(i + 8)}，以及命宮、四化與運限。`,
      "三方照會的星曜不等於本宮坐守的星曜。",
      "現代用途範圍是 App 依宮名字義整理，古籍語義待原文匯入校驗後補上。",
      ...(name === "疾厄" ? ["命理只作生活作息提醒，不診斷、不預測疾病，健康問題以醫師判斷為準。"] : []),
    ],
  };
});

export const STAR_SEMANTICS: StarSemantic[] = MAJOR.map(star => {
  const cit = [`CIT_QS_STAR_${starCode(star)}`];
  return {
    star, starCode: starCode(star),
    placementGroup: MAIN_STARS.find(s => s.name === star)!.system,
    coreNature: pending(cit), favorableExpression: pending(cit), imbalancedExpression: pending(cit),
    palaceContext: pending(cit), sanfangInfluence: pending(cit), transformationChanges: pending(cit), withAuspiciousMalefic: pending(cit),
    sources: ["ziwei.quanshu"], school: "《紫微斗數全書》（待匯入）", confidence: "none",
    limitations: [
      "核心性質不等於對使用者的人格定論。",
      "星曜意義必須搭配所在宮位、亮度、三方四正、四化與吉煞同宮一起判讀，不可單獨下結論。",
      "不使用「某星＝某性格關鍵字」的簡化對照。",
      "古籍原文尚未匯入，所有欄位待校驗。",
    ],
  };
});

export const palaceSemantic = (p: PalaceName) => PALACE_SEMANTICS.find(x => x.name === p)!;
export const starSemantic = (s: string) => STAR_SEMANTICS.find(x => x.star === s);
