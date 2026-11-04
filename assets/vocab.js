window.VOCAB_PREVIEW = [{"lesson": 10, "hanzi": "干净", "pinyin": "gānjìng", "meaning": "clean", "example_cn": "我住的地方真干净。", "example_en": "The place where I live is really clean."}, {"lesson": 10, "hanzi": "破坏", "pinyin": "pòhuài", "meaning": "to damage; to destroy", "example_cn": "四处乱画会破坏环境。", "example_en": "Drawing everywhere damages the environment."}, {"lesson": 10, "hanzi": "环境", "pinyin": "huánjìng", "meaning": "environment", "example_cn": "我住的地方环境很好。", "example_en": "The environment where I live is very nice."}, {"lesson": 10, "hanzi": "四处", "pinyin": "sìchù", "meaning": "everywhere", "example_cn": "小狗在公园里四处跑。", "example_en": "The puppy runs everywhere in the park."}, {"lesson": 10, "hanzi": "涂鸦", "pinyin": "túyā", "meaning": "to scribble; graffiti", "example_cn": "不可以在墙上涂鸦。", "example_en": "You must not scribble on the wall."}, {"lesson": 10, "hanzi": "引来", "pinyin": "yǐnlái", "meaning": "to attract; to draw", "example_cn": "乱扔垃圾会引来蚊虫。", "example_en": "Littering will attract mosquitoes and insects."}, {"lesson": 10, "hanzi": "蚊虫", "pinyin": "wénchóng", "meaning": "mosquitoes and insects", "example_cn": "夏天的晚上蚊虫很多。", "example_en": "There are many mosquitoes and insects on summer nights."}, {"lesson": 10, "hanzi": "随地", "pinyin": "suídì", "meaning": "anywhere; wherever one likes", "example_cn": "不可以随地吐痰。", "example_en": "You must not spit anywhere you like."}];
window.LESSON_META = {"10": {"num": "10", "title": "胡姬花是大家的", "suffix": "词语表"}, "11": {"num": "11", "title": "康康的绿色记事本", "suffix": "词语表"}, "12": {"num": "12", "title": "新加坡生日快乐", "suffix": "词语表"}, "13": {"num": "13", "title": "袋鼠在哪里", "suffix": "词语表"}, "14": {"num": "14", "title": "可爱的大熊猫", "suffix": "词语表"}, "15": {"num": "15", "title": "谁是朱肚皮", "suffix": "词语表"}, "16": {"num": "16", "title": "圈圈圈", "suffix": "词语表"}, "17": {"num": "17", "title": "两分", "suffix": "词语表"}};
window.AGGREGATE_LESSON_IDS = {};
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
  return allCards.filter(function (c) { return c.lesson === num; });
};
window.TYPE1_ONLY_LESSONS = new Set();
