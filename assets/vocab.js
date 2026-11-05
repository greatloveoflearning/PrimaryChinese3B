window.VOCAB_PREVIEW = [{"lesson": 10, "hanzi": "干净", "pinyin": "gānjìng", "meaning": "clean", "example_cn": "我住的地方真干净。", "example_en": "The place where I live is really clean.", "id": "10-0"}, {"lesson": 10, "hanzi": "破坏", "pinyin": "pòhuài", "meaning": "to damage; to destroy", "example_cn": "四处乱画会破坏环境。", "example_en": "Drawing everywhere damages the environment.", "id": "10-1"}, {"lesson": 10, "hanzi": "环境", "pinyin": "huánjìng", "meaning": "environment", "example_cn": "我住的地方环境很好。", "example_en": "The environment where I live is very nice.", "id": "10-2"}, {"lesson": 10, "hanzi": "四处", "pinyin": "sìchù", "meaning": "everywhere", "example_cn": "小狗在公园里四处跑。", "example_en": "The puppy runs everywhere in the park.", "id": "10-3"}, {"lesson": 10, "hanzi": "涂鸦", "pinyin": "túyā", "meaning": "to scribble; graffiti", "example_cn": "不可以在墙上涂鸦。", "example_en": "You must not scribble on the wall.", "id": "10-4"}, {"lesson": 10, "hanzi": "引来", "pinyin": "yǐnlái", "meaning": "to attract; to draw", "example_cn": "乱扔垃圾会引来蚊虫。", "example_en": "Littering will attract mosquitoes and insects.", "id": "10-5"}, {"lesson": 10, "hanzi": "蚊虫", "pinyin": "wénchóng", "meaning": "mosquitoes and insects", "example_cn": "夏天的晚上蚊虫很多。", "example_en": "There are many mosquitoes and insects on summer nights.", "id": "10-6"}, {"lesson": 10, "hanzi": "随地", "pinyin": "suídì", "meaning": "anywhere; wherever one likes", "example_cn": "不可以随地吐痰。", "example_en": "You must not spit anywhere you like.", "id": "10-7"}, {"id": "110-0", "lesson": 110, "hanzi": "仔", "pinyin": "zǐ", "meaning": "careful; detailed", "example_cn": "仔细", "example_en": "careful; attentive"}, {"id": "110-1", "lesson": 110, "hanzi": "招", "pinyin": "zhāo", "meaning": "beckon; wave", "example_cn": "打招呼", "example_en": "greet; wave hello"}, {"id": "210-0", "lesson": 210, "hanzi": "周", "pinyin": "zhōu", "meaning": "week", "example_cn": "周末", "example_en": "weekend"}, {"id": "210-1", "lesson": 210, "hanzi": "末", "pinyin": "mò", "meaning": "end", "example_cn": "周末", "example_en": "weekend"}];
window.LESSON_META = {"10": {"num": "10", "title": "胡姬花是大家的", "suffix": "词语表", "count": 66}, "11": {"num": "11", "title": "康康的绿色记事本", "suffix": "词语表", "count": 51}, "12": {"num": "12", "title": "新加坡生日快乐", "suffix": "词语表", "count": 60}, "13": {"num": "13", "title": "袋鼠在哪里", "suffix": "词语表", "count": 52}, "14": {"num": "14", "title": "可爱的大熊猫", "suffix": "词语表", "count": 54}, "15": {"num": "15", "title": "谁是朱肚皮", "suffix": "词语表", "count": 60}, "16": {"num": "16", "title": "圈圈圈", "suffix": "词语表", "count": 50}, "17": {"num": "17", "title": "两分", "suffix": "词语表", "count": 58}, "110": {"num": "10", "title": "胡姬花是大家的", "suffix": "识字表", "count": 5}, "111": {"num": "11", "title": "康康的绿色记事本", "suffix": "识字表", "count": 6}, "112": {"num": "12", "title": "新加坡生日快乐", "suffix": "识字表", "count": 7}, "113": {"num": "13", "title": "袋鼠在哪里", "suffix": "识字表", "count": 5}, "114": {"num": "14", "title": "可爱的大熊猫", "suffix": "识字表", "count": 8}, "115": {"num": "15", "title": "谁是朱肚皮", "suffix": "识字表", "count": 5}, "116": {"num": "16", "title": "圈圈圈", "suffix": "识字表", "count": 5}, "117": {"num": "17", "title": "两分", "suffix": "识字表", "count": 9}, "210": {"num": "10", "title": "胡姬花是大家的", "suffix": "写字表", "count": 7}, "211": {"num": "11", "title": "康康的绿色记事本", "suffix": "写字表", "count": 8}, "212": {"num": "12", "title": "新加坡生日快乐", "suffix": "写字表", "count": 8}, "213": {"num": "13", "title": "袋鼠在哪里", "suffix": "写字表", "count": 6}, "214": {"num": "14", "title": "可爱的大熊猫", "suffix": "写字表", "count": 7}, "215": {"num": "15", "title": "谁是朱肚皮", "suffix": "写字表", "count": 6}, "216": {"num": "16", "title": "圈圈圈", "suffix": "写字表", "count": 6}, "217": {"num": "17", "title": "两分", "suffix": "写字表", "count": 8}, "9001": {"num": null, "title": null, "suffix": "写字表", "allCategory": true, "count": 56}, "9002": {"num": null, "title": null, "suffix": "识字表", "allCategory": true, "count": 50}, "9003": {"num": null, "title": null, "suffix": "词语表", "allCategory": true, "count": 451}};
window.getAllLessonIds = function () {
  return window.sortLessonIds(Object.keys(window.LESSON_META).map(Number));
};
window.getTotalWordCount = function () {
  return Object.keys(window.LESSON_META).reduce(function (sum, k) {
    var m = window.LESSON_META[k];
    return m.allCategory ? sum : sum + (m.count || 0);
  }, 0);
};
// Default starting lesson for a fresh visitor (nothing saved yet): the
// lowest-numbered 词语表 lesson, not just the first sorted id (which would
// be a 写字表/识字表 lesson since those sort before 词语表 for the same
// num) and not "All lessons" — so a plain sign-in only fetches one lesson's
// words instead of immediately pulling the whole vocabulary set.
window.getDefaultLessonValue = function () {
  var candidates = Object.keys(window.LESSON_META).filter(function (k) {
    var m = window.LESSON_META[k];
    return m.suffix === "词语表" && !m.allCategory && m.num != null;
  });
  if (!candidates.length) return "all";
  candidates.sort(function (a, b) {
    return Number(window.LESSON_META[a].num) - Number(window.LESSON_META[b].num);
  });
  return candidates[0];
};
window.AGGREGATE_LESSON_IDS = { xiezi: 9001, shizi: 9002, ciyu: 9003 };
window.lessonLabel = function (lesson) {
  if (lesson === "all" || lesson === undefined || lesson === null) return "All lessons";
  if (lesson === "mistakes") return "📌 My Mistakes (错题集)";
  if (lesson === "typing") return "⌨️ Typing Test";
  var meta = window.LESSON_META[Number(lesson)];
  if (!meta) return isNaN(Number(lesson)) ? "📌 My Mistakes (错题集)" : "Lesson " + lesson;
  if (meta.allCategory) return "All Lessons' " + meta.suffix;
  var prefix = meta.num ? "Lesson " + meta.num + " " : "";
  return prefix + meta.title + "-" + meta.suffix;
};
function lessonSortTier(id) {
  var meta = window.LESSON_META[id];
  var suffixOrder = { 写字表: 0, 识字表: 1, 词语表: 2 };
  if (!meta) return [9999, 3, id];
  var order = suffixOrder.hasOwnProperty(meta.suffix) ? suffixOrder[meta.suffix] : 3;
  if (meta.allCategory) return [10000, order, id];
  if (meta.num == null) return [9000, order, id];
  return [Number(meta.num), order, id];
}
window.sortLessonIds = function (ids) {
  return ids.slice().sort(function (a, b) {
    var ta = lessonSortTier(Number(a));
    var tb = lessonSortTier(Number(b));
    for (var i = 0; i < ta.length; i++) {
      if (ta[i] !== tb[i]) return ta[i] - tb[i];
    }
    return 0;
  });
};
window.getSortedLessonIds = function (allCards) {
  var ids = Array.from(new Set(allCards.map(function (c) { return c.lesson; })));
  Object.keys(window.AGGREGATE_LESSON_IDS).forEach(function (key) {
    var id = window.AGGREGATE_LESSON_IDS[key];
    if (ids.indexOf(id) === -1) ids.push(id);
  });
  return window.sortLessonIds(ids);
};
window.getCardsForLessonValue = function (allCards, value) {
  if (value === "all" || value === undefined || value === null) return allCards.slice();
  if (value === "mistakes") {
    var ids = window.vocabActivity && window.vocabActivity.getWrongWordIds ? window.vocabActivity.getWrongWordIds() : new Set();
    return allCards.filter(function (c) { return ids.has(c.id); });
  }
  var num = Number(value);
  var meta = window.LESSON_META[num];
  if (meta && meta.allCategory) {
    return allCards.filter(function (c) {
      var cm = window.LESSON_META[c.lesson];
      return cm && cm.suffix === meta.suffix && !cm.allCategory;
    });
  }
  return allCards.filter(function (c) { return c.lesson === num; });
};
window.TYPE1_ONLY_LESSONS = new Set([110, 111, 112, 113, 114, 115, 116, 117, 210, 211, 212, 213, 214, 215, 216, 217, 9001, 9002]);
