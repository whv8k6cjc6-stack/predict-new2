/** 六十四卦資料：卦名、上下卦（先天數）、卦辭原文、白話、吉凶傾向（-2~+2）、各面向提示。
 *  卦辭依《周易》通行本；白話為通行釋義，僅供參考。 */
export interface HexData {
  no: number;
  name: string;
  upper: number; // 先天數 乾1 兌2 離3 震4 巽5 坎6 艮7 坤8
  lower: number;
  judgment: string;
  plain: string;
  tone: -2 | -1 | 0 | 1 | 2;
  keyword: string;
  advice: string;
}

export const HEXAGRAMS: HexData[] = [
  { no: 1, name: "乾為天", upper: 1, lower: 1, judgment: "元亨利貞。", plain: "剛健向上、自強不息，氣勢正旺。", tone: 2, keyword: "自強", advice: "主動出擊、承擔責任，但要守正、別剛愎。" },
  { no: 2, name: "坤為地", upper: 8, lower: 8, judgment: "元亨，利牝馬之貞。君子有攸往，先迷後得主，利。西南得朋，東北喪朋。安貞吉。", plain: "柔順包容、厚德載物，跟隨比領頭更有利。", tone: 1, keyword: "包容", advice: "配合團隊、穩穩做事，不搶第一反而得利。" },
  { no: 3, name: "水雷屯", upper: 6, lower: 4, judgment: "元亨利貞，勿用有攸往，利建侯。", plain: "萬事起頭難，像草木破土，困難中蘊藏生機。", tone: -1, keyword: "起步艱難", advice: "先打基礎、找幫手，不宜貿然擴張。" },
  { no: 4, name: "山水蒙", upper: 7, lower: 6, judgment: "亨。匪我求童蒙，童蒙求我。初筮告，再三瀆，瀆則不告。利貞。", plain: "情況未明、認知不足，是學習與請教的時候。", tone: -1, keyword: "啟蒙", advice: "多請教、多查證，不要在資訊不全時下定論。" },
  { no: 5, name: "水天需", upper: 6, lower: 1, judgment: "有孚，光亨，貞吉。利涉大川。", plain: "時機未到，需要耐心等待，但前景是光明的。", tone: 1, keyword: "等待", advice: "備妥條件、耐心等候，時機到再行動。" },
  { no: 6, name: "天水訟", upper: 1, lower: 6, judgment: "有孚，窒惕，中吉，終凶。利見大人，不利涉大川。", plain: "意見不合、容易起爭執，堅持到底反而吃虧。", tone: -2, keyword: "爭訟", advice: "避免爭辯與硬碰，必要時找公正第三方協調。" },
  { no: 7, name: "地水師", upper: 8, lower: 6, judgment: "貞，丈人吉，無咎。", plain: "如同帶兵，需要紀律與有經驗的領導者。", tone: 0, keyword: "紀律", advice: "按規矩、有組織地推進，聽從有經驗者。" },
  { no: 8, name: "水地比", upper: 6, lower: 8, judgment: "吉。原筮元永貞，無咎。不寧方來，後夫凶。", plain: "親近依附、團結合作，人和是今天的關鍵。", tone: 2, keyword: "親和", advice: "主動靠近貴人與夥伴，別遲疑到錯過。" },
  { no: 9, name: "風天小畜", upper: 5, lower: 1, judgment: "亨。密雲不雨，自我西郊。", plain: "烏雲密布卻未下雨，力量正在累積，尚未到發揮時。", tone: 0, keyword: "蓄積", advice: "小步累積，不要急著要結果。" },
  { no: 10, name: "天澤履", upper: 1, lower: 2, judgment: "履虎尾，不咥人，亨。", plain: "如踩在老虎尾巴上，處境微妙，謹慎守禮就能平安。", tone: 0, keyword: "謹慎", advice: "言行守分寸，面對強勢者以禮相待。" },
  { no: 11, name: "地天泰", upper: 8, lower: 1, judgment: "小往大來，吉亨。", plain: "天地交通、上下和諧，付出小而收穫大。", tone: 2, keyword: "通泰", advice: "順勢推進、溝通上下，是做事的好時機。" },
  { no: 12, name: "天地否", upper: 1, lower: 8, judgment: "否之匪人，不利君子貞，大往小來。", plain: "上下不通、閉塞不順，付出大而收穫小。", tone: -2, keyword: "閉塞", advice: "保守、低調，等待轉機，不宜強求。" },
  { no: 13, name: "天火同人", upper: 1, lower: 3, judgment: "同人于野，亨。利涉大川，利君子貞。", plain: "與人同心，志同道合，合作有成。", tone: 2, keyword: "合作", advice: "公開透明地找人合作，團隊力量大。" },
  { no: 14, name: "火天大有", upper: 3, lower: 1, judgment: "元亨。", plain: "如日中天、收穫豐盛，擁有的資源多。", tone: 2, keyword: "豐收", advice: "善用資源，同時要謙虛分享、避免驕滿。" },
  { no: 15, name: "地山謙", upper: 8, lower: 7, judgment: "亨，君子有終。", plain: "謙虛低調，最後能有好結果。", tone: 1, keyword: "謙遜", advice: "放低姿態、多讓一步，反而能成事。" },
  { no: 16, name: "雷地豫", upper: 4, lower: 8, judgment: "利建侯行師。", plain: "心情愉悅、眾人響應，適合規劃與動員。", tone: 1, keyword: "愉悅", advice: "可以發起計畫，但別因安逸而鬆懈。" },
  { no: 17, name: "澤雷隨", upper: 2, lower: 4, judgment: "元亨利貞，無咎。", plain: "隨順時勢、擇善而從。", tone: 1, keyword: "隨順", advice: "順著大方向走，跟對人、做對事。" },
  { no: 18, name: "山風蠱", upper: 7, lower: 5, judgment: "元亨，利涉大川。先甲三日，後甲三日。", plain: "積弊已久需要整頓，事前事後都要周詳。", tone: -1, keyword: "整頓", advice: "處理陳年問題，先想清楚再改革。" },
  { no: 19, name: "地澤臨", upper: 8, lower: 2, judgment: "元亨利貞。至于八月有凶。", plain: "好運來臨、居高臨下，但要預防盛極而衰。", tone: 1, keyword: "臨近", advice: "把握眼前機會，同時預留退路。" },
  { no: 20, name: "風地觀", upper: 5, lower: 8, judgment: "盥而不薦，有孚顒若。", plain: "靜觀全局、以身作則，觀察多於行動。", tone: 0, keyword: "觀察", advice: "先看清局勢再動，重大決定可緩一緩。" },
  { no: 21, name: "火雷噬嗑", upper: 3, lower: 4, judgment: "亨。利用獄。", plain: "口中有物需咬合，遇障礙要果斷排除。", tone: 0, keyword: "排障", advice: "明快處理卡住的事，按規則賞罰分明。" },
  { no: 22, name: "山火賁", upper: 7, lower: 3, judgment: "亨。小利有攸往。", plain: "文飾美化，重視外在形象，小事有利。", tone: 0, keyword: "修飾", advice: "注意包裝與表達，但別只重表面。" },
  { no: 23, name: "山地剝", upper: 7, lower: 8, judgment: "不利有攸往。", plain: "逐漸剝落、根基受侵蝕，宜守不宜攻。", tone: -2, keyword: "剝落", advice: "停損、保守，靜待觸底回升。" },
  { no: 24, name: "地雷復", upper: 8, lower: 4, judgment: "亨。出入無疾，朋來無咎。反復其道，七日來復，利有攸往。", plain: "一陽來復、否極泰來，轉機初現。", tone: 1, keyword: "復甦", advice: "重新開始，小步前進，好的循環正在回來。" },
  { no: 25, name: "天雷無妄", upper: 1, lower: 4, judgment: "元亨利貞。其匪正有眚，不利有攸往。", plain: "真誠不妄為，照本分做事就好，投機會出錯。", tone: 0, keyword: "真誠", advice: "不走捷徑、不存僥倖，按正道行事。" },
  { no: 26, name: "山天大畜", upper: 7, lower: 1, judgment: "利貞，不家食吉，利涉大川。", plain: "大量蓄積實力，適合進修、承擔大任。", tone: 1, keyword: "蓄德", advice: "累積實力與人脈，時機到可承擔大事。" },
  { no: 27, name: "山雷頤", upper: 7, lower: 4, judgment: "貞吉。觀頤，自求口實。", plain: "頤養身心，注意飲食言語。", tone: 0, keyword: "頤養", advice: "照顧健康、慎言慎食，自己的需要自己顧。" },
  { no: 28, name: "澤風大過", upper: 2, lower: 5, judgment: "棟橈，利有攸往，亨。", plain: "樑柱彎曲、負荷過重，非常時期要非常手段。", tone: -1, keyword: "過重", advice: "減輕負擔、分散風險，別硬撐。" },
  { no: 29, name: "坎為水", upper: 6, lower: 6, judgment: "習坎，有孚，維心亨，行有尚。", plain: "重重險阻，只要內心誠信堅定，就能穿越。", tone: -2, keyword: "險阻", advice: "穩住心、照步驟，不冒險、不慌張。" },
  { no: 30, name: "離為火", upper: 3, lower: 3, judgment: "利貞，亨。畜牝牛，吉。", plain: "光明依附，需要依附正確的人事物才能發光。", tone: 1, keyword: "光明", advice: "展現才華，同時選對依靠與方向。" },
  { no: 31, name: "澤山咸", upper: 2, lower: 7, judgment: "亨，利貞，取女吉。", plain: "相互感應、心意相通，利感情與人際。", tone: 2, keyword: "感應", advice: "真誠交流，感情與合作容易有共鳴。" },
  { no: 32, name: "雷風恆", upper: 4, lower: 5, judgment: "亨，無咎，利貞，利有攸往。", plain: "恆久持續，貴在堅持既定方向。", tone: 1, keyword: "恆心", advice: "維持節奏、不輕易改變計畫。" },
  { no: 33, name: "天山遯", upper: 1, lower: 7, judgment: "亨，小利貞。", plain: "適時退避，保存實力，以退為進。", tone: -1, keyword: "退避", advice: "避開鋒頭與紛爭，暫時退一步。" },
  { no: 34, name: "雷天大壯", upper: 4, lower: 1, judgment: "利貞。", plain: "聲勢壯大，但要防止恃強冒進。", tone: 1, keyword: "壯盛", advice: "有氣勢可推進，但守規矩、別衝過頭。" },
  { no: 35, name: "火地晉", upper: 3, lower: 8, judgment: "康侯用錫馬蕃庶，晝日三接。", plain: "旭日東升、步步高升，受到賞識。", tone: 2, keyword: "晉升", advice: "積極表現、爭取曝光，有被看見的機會。" },
  { no: 36, name: "地火明夷", upper: 8, lower: 3, judgment: "利艱貞。", plain: "光明受傷、暫時被遮蔽，宜韜光養晦。", tone: -2, keyword: "韜晦", advice: "低調保身、不強出頭，守住原則。" },
  { no: 37, name: "風火家人", upper: 5, lower: 3, judgment: "利女貞。", plain: "家和萬事興，重視家庭與內部秩序。", tone: 1, keyword: "齊家", advice: "先顧好家庭與團隊內部，再談外面。" },
  { no: 38, name: "火澤睽", upper: 3, lower: 2, judgment: "小事吉。", plain: "意見相左、方向分歧，只宜小事。", tone: -1, keyword: "乖違", advice: "求同存異，大事暫緩，小事可做。" },
  { no: 39, name: "水山蹇", upper: 6, lower: 7, judgment: "利西南，不利東北；利見大人，貞吉。", plain: "前有險山、行走困難，要停下來反省求助。", tone: -2, keyword: "蹇難", advice: "暫停、檢討、找貴人，不要硬闖。" },
  { no: 40, name: "雷水解", upper: 4, lower: 6, judgment: "利西南，無所往，其來復吉。有攸往，夙吉。", plain: "困難解除、雨過天晴，宜及早處理。", tone: 1, keyword: "解困", advice: "趁早把問題了結，寬以待人。" },
  { no: 41, name: "山澤損", upper: 7, lower: 2, judgment: "有孚，元吉，無咎，可貞，利有攸往。曷之用？二簋可用享。", plain: "減損自己以利他人，先捨後得。", tone: 0, keyword: "減損", advice: "節制開支、減少慾望，捨得才有得。" },
  { no: 42, name: "風雷益", upper: 5, lower: 4, judgment: "利有攸往，利涉大川。", plain: "增益得利，上面照顧下面，利於行動。", tone: 2, keyword: "增益", advice: "積極作為、多行善助人，會有回報。" },
  { no: 43, name: "澤天夬", upper: 2, lower: 1, judgment: "揚于王庭，孚號，有厲，告自邑，不利即戎，利有攸往。", plain: "果斷決斷、清除障礙，但不宜用暴力衝突。", tone: 0, keyword: "決斷", advice: "該下決定就下，但方式要和緩。" },
  { no: 44, name: "天風姤", upper: 1, lower: 5, judgment: "女壯，勿用取女。", plain: "不期而遇，有突如其來的人事，需辨真偽。", tone: -1, keyword: "邂逅", advice: "對突然出現的機會或人保持警覺。" },
  { no: 45, name: "澤地萃", upper: 2, lower: 8, judgment: "亨。王假有廟，利見大人，亨，利貞。用大牲吉，利有攸往。", plain: "群英薈萃、人氣聚集，利聚會與合作。", tone: 2, keyword: "聚合", advice: "參加聚會、整合資源，多與人連結。" },
  { no: 46, name: "地風升", upper: 8, lower: 5, judgment: "元亨，用見大人，勿恤，南征吉。", plain: "如樹苗向上生長，循序漸進地上升。", tone: 2, keyword: "上升", advice: "按部就班往上走，可以拜見長官貴人。" },
  { no: 47, name: "澤水困", upper: 2, lower: 6, judgment: "亨，貞，大人吉，無咎，有言不信。", plain: "受困窘迫，說了也沒人信，要靠實力撐過。", tone: -2, keyword: "困窮", advice: "少說多做、守住本分，等待脫困。" },
  { no: 48, name: "水風井", upper: 6, lower: 5, judgment: "改邑不改井，無喪無得，往來井井。汔至亦未繘井，羸其瓶，凶。", plain: "井水源源不絕，重在持續經營與修繕。", tone: 0, keyword: "養成", advice: "維護既有資源，做事要有始有終。" },
  { no: 49, name: "澤火革", upper: 2, lower: 3, judgment: "己日乃孚，元亨利貞，悔亡。", plain: "變革時機到來，改變要取得信任才會成功。", tone: 0, keyword: "變革", advice: "可以改變做法，但要說清楚理由、爭取支持。" },
  { no: 50, name: "火風鼎", upper: 3, lower: 5, judgment: "元吉，亨。", plain: "鼎立革新、穩固新局，利於建立制度。", tone: 2, keyword: "鼎新", advice: "建立新制度或新局面，找穩固的夥伴。" },
  { no: 51, name: "震為雷", upper: 4, lower: 4, judgment: "亨。震來虩虩，笑言啞啞。震驚百里，不喪匕鬯。", plain: "雷聲震動，突發事件多，但鎮定就能化險。", tone: 0, keyword: "震動", advice: "遇突發狀況先冷靜，再從容應對。" },
  { no: 52, name: "艮為山", upper: 7, lower: 7, judgment: "艮其背，不獲其身，行其庭，不見其人，無咎。", plain: "適可而止、靜止不動，該停就停。", tone: 0, keyword: "止", advice: "不宜冒進，把手上的事做好就好。" },
  { no: 53, name: "風山漸", upper: 5, lower: 7, judgment: "女歸吉，利貞。", plain: "循序漸進，慢慢來反而穩。", tone: 1, keyword: "漸進", advice: "一步一步來，不要跳級求快。" },
  { no: 54, name: "雷澤歸妹", upper: 4, lower: 2, judgment: "征凶，無攸利。", plain: "名分不正、時機不對，貿然行動不利。", tone: -2, keyword: "失序", advice: "先確認角色與名分，不宜主動出擊。" },
  { no: 55, name: "雷火豐", upper: 4, lower: 3, judgment: "亨，王假之，勿憂，宜日中。", plain: "盛大豐滿，正值高峰，要把握當下。", tone: 1, keyword: "豐盛", advice: "趁勢完成重要事，也要預防盛極而衰。" },
  { no: 56, name: "火山旅", upper: 3, lower: 7, judgment: "小亨，旅貞吉。", plain: "羈旅在外、漂泊不定，小事可成。", tone: 0, keyword: "旅行", advice: "出門在外謹言慎行，適合短程移動。" },
  { no: 57, name: "巽為風", upper: 5, lower: 5, judgment: "小亨，利有攸往，利見大人。", plain: "如風般柔順滲透，靠溝通與配合取勝。", tone: 1, keyword: "順入", advice: "用柔性溝通、反覆說明來推動事情。" },
  { no: 58, name: "兌為澤", upper: 2, lower: 2, judgment: "亨，利貞。", plain: "喜悅和樂、言談愉快，利人際溝通。", tone: 1, keyword: "喜悅", advice: "多交流分享，但避免只說好聽話。" },
  { no: 59, name: "風水渙", upper: 5, lower: 6, judgment: "亨。王假有廟，利涉大川，利貞。", plain: "渙散離散，需要凝聚人心、化解隔閡。", tone: 0, keyword: "渙散", advice: "重新凝聚團隊、化解心結。" },
  { no: 60, name: "水澤節", upper: 6, lower: 2, judgment: "亨。苦節不可貞。", plain: "節制有度，但過度節制反而痛苦。", tone: 0, keyword: "節制", advice: "控制預算與時間，但不必苛刻自己。" },
  { no: 61, name: "風澤中孚", upper: 5, lower: 2, judgment: "豚魚吉，利涉大川，利貞。", plain: "誠信感人，以誠待人就能得到信任。", tone: 1, keyword: "誠信", advice: "守信用、說實話，人際與合作都會順。" },
  { no: 62, name: "雷山小過", upper: 4, lower: 7, judgment: "亨，利貞，可小事，不可大事。飛鳥遺之音，不宜上宜下，大吉。", plain: "稍有過度，只宜小事、宜低不宜高。", tone: 0, keyword: "小過", advice: "做小事、守本分，大決定先放一放。" },
  { no: 63, name: "水火既濟", upper: 6, lower: 3, judgment: "亨小，利貞，初吉終亂。", plain: "事情已成，但成功後容易鬆懈生亂。", tone: 0, keyword: "已成", advice: "守成防變，完成後要檢查收尾。" },
  { no: 64, name: "火水未濟", upper: 3, lower: 6, judgment: "亨，小狐汔濟，濡其尾，無攸利。", plain: "事情尚未完成，最後一哩路要小心。", tone: -1, keyword: "未完成", advice: "耐心收尾，別在最後關頭大意。" },
];
