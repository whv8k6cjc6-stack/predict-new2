/** 內建出生地（離線可用）。經緯度取市中心近似值；真太陽時以經度計算，每 1 度約 4 分鐘。 */
export interface Place { name: string; region: string; countryCode: string; lat: number; lng: number; timeZone: string }

const TW = (name: string, lat: number, lng: number): Place => ({ name, region: "台灣", countryCode: "TW", lat, lng, timeZone: "Asia/Taipei" });

export const PLACES: Place[] = [
  TW("台北", 25.04, 121.56), TW("新北（板橋）", 25.01, 121.46), TW("基隆", 25.13, 121.74), TW("桃園", 24.99, 121.30),
  TW("新竹", 24.80, 120.97), TW("苗栗", 24.56, 120.82), TW("台中", 24.15, 120.68), TW("彰化", 24.08, 120.54),
  TW("南投", 23.91, 120.68), TW("雲林（斗六）", 23.71, 120.54), TW("嘉義", 23.48, 120.45), TW("朴子", 23.46, 120.25),
  TW("新營", 23.31, 120.32), TW("鹽水", 23.32, 120.27), TW("柳營", 23.28, 120.31), TW("白河", 23.35, 120.42),
  TW("麻豆", 23.18, 120.25), TW("佳里", 23.17, 120.18), TW("台南", 22.99, 120.21), TW("高雄", 22.63, 120.30),
  TW("屏東", 22.67, 120.49), TW("宜蘭", 24.76, 121.75), TW("花蓮", 23.99, 121.60), TW("台東", 22.76, 121.14),
  TW("澎湖（馬公）", 23.57, 119.58), TW("金門", 24.43, 118.32), TW("馬祖（南竿）", 26.16, 119.95),
  { name: "香港", region: "港澳", countryCode: "HK", lat: 22.32, lng: 114.17, timeZone: "Asia/Hong_Kong" },
  { name: "澳門", region: "港澳", countryCode: "MO", lat: 22.20, lng: 113.55, timeZone: "Asia/Macau" },
  { name: "上海", region: "中國大陸", countryCode: "CN", lat: 31.23, lng: 121.47, timeZone: "Asia/Shanghai" },
  { name: "北京", region: "中國大陸", countryCode: "CN", lat: 39.90, lng: 116.40, timeZone: "Asia/Shanghai" },
  { name: "廣州", region: "中國大陸", countryCode: "CN", lat: 23.13, lng: 113.26, timeZone: "Asia/Shanghai" },
  { name: "廈門", region: "中國大陸", countryCode: "CN", lat: 24.48, lng: 118.09, timeZone: "Asia/Shanghai" },
  { name: "東京", region: "日本", countryCode: "JP", lat: 35.68, lng: 139.69, timeZone: "Asia/Tokyo" },
  { name: "大阪", region: "日本", countryCode: "JP", lat: 34.69, lng: 135.50, timeZone: "Asia/Tokyo" },
  { name: "福岡", region: "日本", countryCode: "JP", lat: 33.59, lng: 130.40, timeZone: "Asia/Tokyo" },
  { name: "札幌", region: "日本", countryCode: "JP", lat: 43.06, lng: 141.35, timeZone: "Asia/Tokyo" },
  { name: "首爾", region: "韓國", countryCode: "KR", lat: 37.57, lng: 126.98, timeZone: "Asia/Seoul" },
  { name: "新加坡", region: "東南亞", countryCode: "SG", lat: 1.29, lng: 103.85, timeZone: "Asia/Singapore" },
  { name: "吉隆坡", region: "東南亞", countryCode: "MY", lat: 3.14, lng: 101.69, timeZone: "Asia/Kuala_Lumpur" },
  { name: "曼谷", region: "東南亞", countryCode: "TH", lat: 13.76, lng: 100.50, timeZone: "Asia/Bangkok" },
  { name: "胡志明市", region: "東南亞", countryCode: "VN", lat: 10.82, lng: 106.63, timeZone: "Asia/Ho_Chi_Minh" },
  { name: "馬尼拉", region: "東南亞", countryCode: "PH", lat: 14.60, lng: 120.98, timeZone: "Asia/Manila" },
  { name: "雅加達", region: "東南亞", countryCode: "ID", lat: -6.21, lng: 106.85, timeZone: "Asia/Jakarta" },
  { name: "雪梨", region: "大洋洲", countryCode: "AU", lat: -33.87, lng: 151.21, timeZone: "Australia/Sydney" },
  { name: "墨爾本", region: "大洋洲", countryCode: "AU", lat: -37.81, lng: 144.96, timeZone: "Australia/Melbourne" },
  { name: "奧克蘭", region: "大洋洲", countryCode: "NZ", lat: -36.85, lng: 174.76, timeZone: "Pacific/Auckland" },
  { name: "洛杉磯", region: "北美", countryCode: "US", lat: 34.05, lng: -118.24, timeZone: "America/Los_Angeles" },
  { name: "舊金山", region: "北美", countryCode: "US", lat: 37.77, lng: -122.42, timeZone: "America/Los_Angeles" },
  { name: "西雅圖", region: "北美", countryCode: "US", lat: 47.61, lng: -122.33, timeZone: "America/Los_Angeles" },
  { name: "紐約", region: "北美", countryCode: "US", lat: 40.71, lng: -74.01, timeZone: "America/New_York" },
  { name: "溫哥華", region: "北美", countryCode: "CA", lat: 49.28, lng: -123.12, timeZone: "America/Vancouver" },
  { name: "多倫多", region: "北美", countryCode: "CA", lat: 43.65, lng: -79.38, timeZone: "America/Toronto" },
  { name: "倫敦", region: "歐洲", countryCode: "GB", lat: 51.51, lng: -0.13, timeZone: "Europe/London" },
  { name: "巴黎", region: "歐洲", countryCode: "FR", lat: 48.86, lng: 2.35, timeZone: "Europe/Paris" },
  { name: "柏林", region: "歐洲", countryCode: "DE", lat: 52.52, lng: 13.40, timeZone: "Europe/Berlin" },
];

export const TIME_ZONES = [...new Set(PLACES.map(p => p.timeZone))];
