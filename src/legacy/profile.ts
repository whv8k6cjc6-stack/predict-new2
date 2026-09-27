export interface BirthPlace {
  country: string;
  city: string;
  timezone: string; // IANA, 例 "Asia/Taipei"
  longitude: number;
  latitude: number;
}

export interface Profile {
  id: string;
  name: string;
  gender: "male" | "female";
  birthDate: string;            // 國曆 YYYY-MM-DD
  birthTime: string | null;     // HH:mm，不確定時為 null
  birthTimeAccuracy: "exact" | "approximate" | "unknown";
  birthPlace: BirthPlace;
  calendarType: "solar" | "lunar";
  useTrueSolarTime: boolean;
  ziRule: "lateZi" | "earlyZi"; // 晚子時不換日 / 早子時換日
  notes: string;
  createdAt: string;
  updatedAt: string;
}
