// Rusça versiya (/ru/) uçun JS matnlari. Kalit — yangi lotindagi asl matn (i18n.js dagi t() ga berilgan satr).
// Yangi t("…") qöşilsa, şu yerga tarjimasi ham qöşiladi: web/i18n.test.mjs tekşiradi.
export const RU = {
  // Konverter
  "Lotin": "Латиница",
  "Kirill": "Кириллица",
  "Aralaş": "Смешанный",
  "Boş": "Пусто",
  "{n} belgi": "Знаков: {n}",
  "Kirilldan ögirildi": "Переведено с кириллицы",
  "{n} ta harf özgardi": "Изменено букв: {n}",
  "Nusxa olindi": "Скопировано",
  "Belgilandi, ⌘C bosing": "Выделено, нажмите ⌘C",
  "Belgilandi, Ctrl+C bosing": "Выделено, нажмите Ctrl+C",
  "Bosib turib nusxa oling": "Удерживайте, чтобы скопировать",
  "o' → ö, sh → ş: yangi alifboda odatdagidek yozing": "o' → ö, sh → ş: пишите на новом алфавите как привыкли",
  "Havola olindi": "Ссылка скопирована",

  // Söz tekşiruvi
  "Kirill harflari lotinga ögirildi": "Кириллица переведена в латиницу",
  "{bad} özbekça harf emas. Töğrisi {good} ({note}).": "{bad} — не узбекская буква. Правильно: {good} ({note}).",
  "Bu söz yangi alifboda töğri yozilgan.": "Это слово написано на новом алфавите правильно.",
  "{ng} özgarmaydi.": "{ng} не меняется.",
  "bitta harf": "одна буква",
  "s va h alohida öqiladi, ş bölmaydi": "s и h читаются раздельно, ş не получается",
  "tutuq belgisi qoladi, şakli ʼ": "тутук остаётся, его знак — ʼ",
  "tepasida ikki nuqta": "две точки сверху",
  "tepasida qayiqça": "«лодочка» сверху",
  "ostida ilmoq": "крючок снизу",
  "nuqtasiz": "без точки",
  "nuqtali": "с точкой",

  // /soz/ qidiruvi
  "Röyxatda yöq. Yangi alifboda:": "В списке нет. На новом алфавите:",

  // Sanoq
  "{qonun}-son Qonun bugun kuçga kirdi.": "Закон {qonun} вступил в силу сегодня.",
  "{qonun}-son Qonun 22.04.2027 dan kuçda.": "Закон {qonun} действует с 22.04.2027.",

  // «Işladimi?» tekşiruvi
  "Yozgiç yoqiq bölsa, {old} özi {new} ga aylanadi.": "Если Yozgiç включён, {old} само превратится в {new}.",
  "Işlayapti! Davom eting, qolgan harflar ham yonadi.": "Работает! Продолжайте — загорятся и остальные буквы.",
  "Hammasi joyida: Yozgiç işlayapti.": "Всё в порядке: Yozgiç работает.",
  "Harflar ögirilmadi. Menyu-barda {o} turibdimi? Yoqiş: {shift} ni ikki marta bosing. 3-qadamdagi ruxsatni ham tekşiring.":
    "Буквы не заменились. В строке меню стоит {o}? Включить: дважды нажмите {shift}. Проверьте и разрешение из шага 3.",
  "Harflar ögirilmadi. Soat yonida ikonka bormi? Yoqiş: {keys}.": "Буквы не заменились. Рядом с часами есть значок? Включить: {keys}.",

  // Test
  "{total} dan {n}-savol": "Вопрос {n} из {total}",
  "Töğri": "Верно",
  "Xato. Töğri javob: {javob}": "Неверно. Правильный ответ: {javob}",
  "Natijani körsatiş": "Показать результат",
  "Keyingi savol": "Следующий вопрос",
  "Döstlaringiz ham sinab körsin.": "Пусть друзья тоже попробуют.",
  "Natija: {total} dan {score}": "Результат: {score} из {total}",
  "«o'zbek» yangi alifboda qanday yoziladi?": "Как на новом алфавите пишется «o'zbek»?",
  "«o'» bitta harf böladi: ö.": "«o'» становится одной буквой: ö.",
  "«choy» qanday yoziladi?": "Как пишется «choy»?",
  "«ch» bitta harf: ç.": "«ch» — одна буква: ç.",
  "«shahar» qanday yoziladi?": "Как пишется «shahar»?",
  "«sh» bitta harf: ş.": "«sh» — одна буква: ş.",
  "«tog'» qanday yoziladi?": "Как пишется «tog'»?",
  "«g'» bitta harf böladi: ğ.": "«g'» становится одной буквой: ğ.",
  "«Is'hoq» qanday yoziladi?": "Как пишется «Is'hoq»?",
  "Bu sözda s va h alohida öqiladi, şuning uçun tutuq qoladi: sʼh.": "В этом слове s и h читаются раздельно, поэтому тутук остаётся: sʼh.",
  "«ma'no» qanday yoziladi?": "Как пишется «ma'no»?",
  "Tutuq belgisi qoladi, faqat şakli ʼ böladi.": "Тутук остаётся, меняется только знак — ʼ.",
  "«tong» qanday yoziladi?": "Как пишется «tong»?",
  "ng özgarmaydi.": "ng не меняется.",
  "Qaysi biri özbekça ş?": "Какая из них — узбекская ş?",
  "Özbekça ş ostida ilmoq bor. ș (ostida vergul) va š (tepasida qalpoqça) boşqa tillarning harfi.":
    "У узбекской ş крючок снизу. ș (запятая снизу) и š (галочка сверху) — буквы других языков.",
  "Kirilldagi «Ўзбекистон» yangi alifboda qanday yoziladi?": "Как на новом алфавите пишется кириллическое «Ўзбекистон»?",
  "Kirilldagi «ў» ham ö böladi.": "Кириллическая «ў» тоже становится ö.",
  "Yangi alifbo haqidagi qonun qaçon kuçga kiradi?": "Когда вступает в силу закон о новом алфавите?",
  "ЎРҚ-1184-son Qonun 21.10.2026 da imzolangan, 22.04.2027 dan kuçga kiradi.": "Закон ЎРҚ-1184 подписан 21.10.2026 и вступает в силу 22.04.2027.",
  "Aʼlo! Yangi alifboni töliq bilasiz.": "Отлично! Вы знаете новый алфавит полностью.",
  "Zör! Yangi alifboga deyarli tayyorsiz.": "Здорово! Вы почти готовы к новому алфавиту.",
  "Yomon emas. Qoidalarni bir körib çiqing.": "Неплохо. Загляните в правила.",
  "Boşlaniş şunday böladi. Qoidalarni öqib, qaytadan urinib köring.": "Всё начинается с этого. Прочитайте правила и попробуйте ещё раз.",

  // Ism kartasi
  "Ismim": "Моё имя",
  "yangi alifboda": "на новом алфавите",
  "Eski yozuvda:": "Старое написание:",
  "Ismingiz özgarmaydi": "Имя не меняется",
  "Siz ham yasang:": "Сделайте и вы:",

  // Maşq
  "Eng yaxşi natija: {n} söz/daqiqa": "Лучший результат: {n} слов/мин",
  "Hali natija yöq": "Результатов пока нет",
  "Oxirgi 7 kunda {n} kun maşq qilingan": "За последние 7 дней практики: {n} дн.",
  "Yoza boşlang — vaqt birinçi harfdan hisoblanadi.": "Начните печатать — время считается с первой буквы.",
  "Aniqlik: {a}%": "Точность: {a}%",
  "Köp adaşgan harf: {h}": "Чаще всего ошибались в букве {h}",
  "{n} / {all} söz": "{n} / {all} слов",
  "Tez yoziş": "Тренажёр",
  "maşqi": "набора",
  "söz/daqiqa": "слов/мин",

  // Fayl
  "Bu format qöllanmaydi. .doc, .pdf yoki .xlsx faylni Word (.docx) yoki matn sifatida saqlab, qayta taşlang.": "Этот формат не поддерживается. Сохраните .doc, .pdf или .xlsx как Word (.docx) или текст и перетащите снова.",
  "Fayl 20 MB dan katta.": "Файл больше 20 МБ.",
  "Word faylining oçilgandagi hajmi juda katta.": "После распаковки файл Word слишком большой.",
  "Brauzeringiz eski: docx uçun Chrome, Edge, Safari 16.4 yoki Firefoxʼning yangi versiyasi kerak.": "Браузер устарел: для docx нужен свежий Chrome, Edge, Safari 16.4 или Firefox.",
  "Faylni ögirib bölmadi. Asl fayl özgarmadi.": "Не удалось перевести файл. Исходный файл не изменился.",
  "Ögirilmoqda…": "Переводим…",
  "Yuklab oliş": "Скачать",

  // Story rasm
  "Yangi alifbo": "Новый алфавит",
  "testi": "тест",
  "Yangi alifbo testi": "Новый алфавит тест",
  "töğri javob": "верных ответа",
  "Siz ham sinab köring:": "Попробуйте и вы:",
};
