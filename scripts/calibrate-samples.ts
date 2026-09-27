/** 校準與回歸測試共用的固定樣本命例（合成資料，非真實人物） */
import { defaultSchool, DEFAULT_SCHOOL_ID, type Gender } from "@/core/person";
import type { Subject } from "@/core/analysis/collect";

const RAW: [string, string | null, Gender][] = [
  ["1958-03-11", "06:20", "male"], ["1963-11-02", "22:45", "female"], ["1969-07-24", "13:05", "male"],
  ["1972-01-30", "03:40", "female"], ["1975-07-18", "07:40", "female"], ["1979-10-09", "17:15", "male"],
  ["1984-05-21", "11:30", "male"], ["1988-12-13", "20:10", "female"], ["1991-08-05", "00:25", "male"],
  ["1995-02-27", "09:55", "female"], ["2000-06-16", "15:35", "male"], ["2004-09-29", "05:50", "female"],
];

export const SAMPLES: Subject[] = RAW.map(([date, time, gender], i) => ({
  person: { id: `s${i}`, displayName: `樣本${i + 1}`, gender, relation: "other", isFavorite: false, sortOrder: i, createdAt: "", updatedAt: "" },
  birth: {
    personId: `s${i}`, localDate: date, localTime: time, timeAccuracy: "exact", inputCalendar: "solar",
    place: { name: "臺北", countryCode: "TW", lat: 25.04, lng: 121.51 }, timeZone: "Asia/Taipei", dstOverride: "auto",
    useTrueSolarTime: false, schoolProfileId: DEFAULT_SCHOOL_ID, createdAt: "", updatedAt: "",
  },
  school: defaultSchool(""),
}));
