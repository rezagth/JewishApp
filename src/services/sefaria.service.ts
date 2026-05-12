/**
 * Service Sefaria API - Récupère les textes liturgiques réels
 * API gratuite: https://www.sefaria.org/api/
 */

import SefariaAshkenazHe from '../data/siddur.sefaria_ashkenaz.he.json';
import SefariaSfaradHe from '../data/siddur_sfarad_he.json';

const SEFARIA_BASE = 'https://www.sefaria.org/api';

// Supprime les balises HTML et les entités HTML des textes Sefaria
const cleanHtml = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&thinsp;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
};

const flattenVerses = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value
      .flat(Infinity)
      .filter(Boolean)
      .map((v) => cleanHtml(String(v)))
      .join('\n');
  }
  if (typeof value === 'string') {
    return cleanHtml(value);
  }
  return '';
};

const cleanHtmlBlock = (items: unknown): string => {
  if (!Array.isArray(items)) return '';

  return items
    .map((item) =>
      String(item)
        .replace(/<small>.*?<\/small>/g, '')
        .replace(/<b>(.*?)<\/b>/g, '$1')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter(Boolean)
    .join('\n');
};

const findFirstArrayByKey = (value: unknown, targetKey: string): unknown[] | null => {
  if (!value || typeof value !== 'object') return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstArrayByKey(item, targetKey);
      if (found) return found;
    }
    return null;
  }

  const record = value as Record<string, unknown>;
  if (Array.isArray(record[targetKey])) {
    return record[targetKey] as unknown[];
  }

  for (const child of Object.values(record)) {
    const found = findFirstArrayByKey(child, targetKey);
    if (found) return found;
  }

  return null;
};

const flattenTextTree = (value: unknown): string => {
  if (typeof value === 'string') {
    return cleanHtml(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => flattenTextTree(item))
      .filter(Boolean)
      .join('\n');
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map((item) => flattenTextTree(item))
      .filter(Boolean)
      .join('\n');
  }

  return '';
};

const LOCAL_BIRKAT_HAMAZON = (() => {
  const birkatHamazon = (SefariaAshkenazHe as any)?.text?.Berachot?.['Birkat HaMazon'];

  if (!Array.isArray(birkatHamazon)) {
    return cleanHtmlBlock(birkatHamazon);
  }

  const startIndex = birkatHamazon.findIndex((entry: unknown) => {
    const text = String(entry || '');
    return text.includes('בָּרוּךְ אַתָּה') && text.includes('הַזָּן');
  });

  return cleanHtmlBlock(startIndex >= 0 ? birkatHamazon.slice(startIndex) : birkatHamazon);
})();

const LOCAL_MEEN_SHALOSH = (() => {
  const meEnShalosh = (SefariaAshkenazHe as any)?.text?.Berachot?.['Birkat Hanehenin']?.['Eating']?.['Brachot Achronot']?.['Al Hamichyah'];

  if (!Array.isArray(meEnShalosh)) {
    return cleanHtmlBlock(meEnShalosh);
  }

  const startIndex = meEnShalosh.findIndex((entry: unknown) => {
    const text = String(entry || '');
    return text.includes('בָּרוּךְ אַתָּה') || text.includes('ברוך אתה');
  });

  return cleanHtmlBlock(startIndex >= 0 ? meEnShalosh.slice(startIndex) : meEnShalosh);
})();

const LOCAL_BIRKAT_HAMAZON_SEPHARDIC = String((SefariaSfaradHe as any)?.siddur?.berachot?.sections?.birkat_hamazon?.text_he || '').trim();
const LOCAL_KADDISH_YEHE_SHELAMA = cleanHtmlBlock(findFirstArrayByKey(SefariaAshkenazHe as any, 'Kaddish Shalem'));
const LOCAL_KADDISH_YEHE_SHELAMA_SEPHARDIC = String((SefariaSfaradHe as any)?.siddur?.shacharit?.sections?.kaddish_yatom?.text_he || '').trim();
const LOCAL_KADDISH_AL_ISRAEL = cleanHtmlBlock(
  findFirstArrayByKey(SefariaAshkenazHe as any, 'Kaddish DeRabbanan') ||
  findFirstArrayByKey(SefariaAshkenazHe as any, 'Kaddish Derabbanan')
);
const LOCAL_HALLEL_MUSSAF_ROSH_HODESH = (() => {
  const roshHodesh = (SefariaAshkenazHe as any)?.text?.Festivals?.['Rosh Chodesh'];
  if (!roshHodesh) return '';

  const hallel = flattenTextTree(roshHodesh?.Hallel);
  const musaf = flattenTextTree(roshHodesh?.['Musaf Amidah for Rosh Chodesh']);

  return [hallel, musaf].filter(Boolean).join('\n\n');
})();

const LOCAL_BEDTIME_SHEMA = `שְׁמַע יִשְׂרָאֵל יְהֹוָה אֱלֹהֵינוּ יְהֹוָה אֶחָד׃
בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד׃

וְאָהַבְתָּ אֵת יְהֹוָה אֱלֹהֶיךָ בְּכׇל־לְבָבְךָ וּבְכׇל־נַפְשְׁךָ וּבְכׇל־מְאֹדֶךָ׃
וְהָיוּ הַדְּבָרִים הָאֵלֶּה אֲשֶׁר אָנֹכִי מְצַוְּךָ הַיּוֹם עַל־לְבָבֶךָ׃
וְשִׁנַּנְתָּם לְבָנֶיךָ וְדִבַּרְתָּ בָּם בְּשִׁבְתְּךָ בְּבֵיתֶךָ וּבְלֶכְתְּךָ בַדֶּרֶךְ וּבְשׇׁכְבְּךָ וּבְקוּמֶךָ׃

בְּיָדְךָ אַפְקִיד רוּחִי פָּדִיתָ אוֹתִי יְהֹוָה אֵל אֱמֶת׃

יִהִי רָצוֹן מִלְּפָנֶיךָ יְהֹוָה אֱלֹהַי וֵאלֹהֵי אֲבוֹתַי שֶׁתַּשְׁכִּיבֵנִי לְשָׁלוֹם וְתַעֲמִידֵנִי לְחַיִּים טוֹבִים וּלְשָׁלוֹם׃
וּמֵאִיר עֵינַי פֶּן אִישַׁן הַמָּוֶת׃`;

const LOCAL_BEDTIME_SHEMA_SEPHARDIC = String((SefariaSfaradHe as any)?.siddur?.bedtime?.sections?.kriat_shema?.text_he || (SefariaSfaradHe as any)?.evenings?.bedtime?.text_he || '').trim();

const LOCAL_TIKKUN_RATZOT = `וּדְחִילוּ, לְיַחֲדָא שֵׁם יוּ"ד קֵ"א בְּוָא"ו קֵ"א בְּיִחוּדָא שְׁלִים, בְּשֵׁם כָּל יִשְׂרָאֵל. הֲרֵינִי מוּכָן לוֹמַר
תִיקוּן רָחֵל וְתִיקוּן לֵאָה

כְּמוֹ שֶׁסִּדְּרוּ לָנוּ רַבּוֹתֵינוּ זִכְרוֹנָם לִבְרָכָה, לְתַקֵּן אֶת שָׁרְשָׁם בְּמָקוֹם עֶלְיוֹן, לַעֲשׂוֹת נַחַת רוּחַ לְיוֹצְרֵנוּ וְלַעֲשׂוֹת רְצוֹן בּוֹרְאֵנוּ. וִיהִי נֹעַם אֲדֹנָי אֱלֹהֵינוּ עָלֵינוּ וּמַעֲשֵׂה יָדֵינוּ כּוֹנְנָה עָלֵינוּ וּמַעֲשֵׂה יָדֵינוּ כּוֹנְנֵהוּ׃ (2x)

אָנָּא יְהֹוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ. תָּבֹא לְפָנֶיךָ תְּפִלָּתֵנוּ. וְאַל תִּתְעַלַּם מַלְכֵּנוּ מִתְּחִנָּתֵנוּ. שֶׁאֵין אֲנַחְנוּ עַזֵּי פָנִים וּקְשֵׁי עֹרֶף לוֹמַר לְפָנֶיךָ יְהֹוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ צַדִּיקִים אֲנַחְנוּ וְלא חָטָאנוּ. אֲבָל חָטָאנוּ. עָוִינוּ. פָּשַׁעְנוּ. אֲנַחְנוּ וַאֲבוֹתֵינוּ וְאַנְשֵׁי בֵיתֵנוּ:

אָשַׁמְנוּ. בָּגַדְנוּ. גָּזַלְנוּ. דִּבַּרְנוּ דֹפִי וְלָשׁון הָרָע. הֶעֱוִינוּ. וְהִרְשַׁעְנוּ. זַדְנוּ. חָמַסְנוּ. טָפַלְנוּ שֶׁקֶר וּמִרְמָה. יָעַצְנוּ עֵצוֹת רָעוֹת. כִּזַּבְנוּ. כָּעַסְנוּ. לַצְנוּ. מָרַדְנוּ. מָרִינוּ דְבָרֶיךָ. נִאַצְנוּ. נִאַפְנוּ. סָרַרְנוּ. עָוִינוּ. פָּשַׁעְנוּ. פָּגַמְנוּ. צָרַרְנוּ. צִעַרְנוּ אָב וָאֵם. קִשִּׁינוּ עֹרֶף. רָשַׁעְנוּ. שִׁחַתְנוּ. תִּעַבְנוּ. תָּעִינוּ וְתִעֲתַעְנוּ. וְסַרְנוּ מִמִּצְוֹתֶיךָ וּמִמִּשְׁפָּטֶיךָ הַטּוֹבִים וְלֹא שָׁוָה לָנוּ. וְאַתָּה צַדִּיק עַל כָּל הַבָּא עָלֵינוּ. כִּי אֱמֶת עָשִׂיתָ. וַאֲנַחְנוּ הִרְשָׁעְנוּ:

מַה נֹּאמַר לְפָנֶיךָ יוֹשֵׁב מָרוֹם, וּמַה נְסַפֵּר לְפָנֶיךָ שׁוֹכֵן שְׁחָקִים, הֲלֹא כָּל הַנִּסְתָּרוֹת וְהַנִּגְלוֹת אַתָּה יוֹדֵעַ, אַתָּה יוֹדֵעַ רָזֵי עוֹלָם, וְתַעֲלוּמוֹת סִתְרֵי כָּל חָי, אַתָּה חוֹפֵשׂ כָּל חַדְרֵי בָטֶן, רוֹאֶה כְלָיוֹת וְלֵב, אֵין דָּבָר נֶעְלָם מִמְּךָּ, וְאֵין נִסְתָּר מִנֶּגֶד עֵינֶיךָ:

יְהִי רָצוֹן מִלְּפָנֶיךָ, יְהֹוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ, שֶתִמְחוֹל לָנוּ אֶת כָּל חַטְּאוֹתֵינוּ, וּתְכַפֵּר לָנוּ אֶת כָּל עֲוֹנוֹתֵינוּ, וְתִמְחוֹל וְתִסְלַח לְכָל פְּשָׁעֵינוּ:

TIKKUN RACHEL:
עַל נַהֲרוֹת בָּבֶל שָׁם יָשַׁבְנוּ גַּם בָּכִינוּ בְּזָכְרֵנוּ אֶת צִיּוֹן׃ עַל עֲרָבִים בְּתוֹכָהּ תָּלִינוּ כִּנֹּרוֹתֵינוּ׃ כִּי שָׁם שְׁאֵלוּנוּ שׁוֹבֵינוּ דִּבְרֵי שִׁיר וְתוֹלָלֵינוּ שִׂמְחָה שִׁירוּ לָנוּ מִשִּׁיר צִיּוֹן׃ אֵיךְ נָשִׁיר אֶת שִׁיר יְהֹוָה עַל אַדְמַת נֵכָר׃ אִם אֶשְׁכָּחֵךְ יְרוּשָׁלָם תִּשְׁכַּח יְמִינִי׃ תִּדְבַּק לְשׁוֹנִי לְחִכִּי אִם לֹא אֶזְכְּרֵכִי אִם לֹא אַעֲלֶה אֶת יְרוּשָׁלַם עַל רֹאשׁ שִׂמְחָתִי׃

TIKKUN LEA:
לַמְנַצֵּחַ מַשְׂכִּיל לִבְנֵי קֹרַח׃ כְּאַיָּל תַּעֲרֹג עַל אֲפִיקֵי מָיִם כֵּן נַפְשִׁי תַעֲרֹג אֵלֶיךָ אֱלֹהִים׃ צָמְאָה נַפְשִׁי לֵאלֹהִים לְאֵל חָי מָתַי אָבוֹא וְאֵרָאֶה פְּנֵי אֱלֹהִים׃`;

const LOCAL_HAVDALA = `הִנֵּה אֵל יְשׁוּעָתִי אֶבְטַח וְלֹא אֶפְחָד כִּי עָזִּי וְזִמְרָת יָהּ יי וַיְהִי לִי לִישׁוּעָה׃
וּשְׁאַבְתֶּם מַיִם בְּשָׂשׂוֹן מִמַּעַיְנֵי הַיְשׁוּעָה׃
לַיי הַיְשׁוּעָה עַל עַמְּךָ בִרְכָתֶךָ סֶּלָה׃
יי צְבָאוֹת עִמָּנוּ מִשְׂגָּב לָנוּ אֱלֹהֵי יַעֲקֹב סֶלָה׃
יי צְבָאוֹת, אַשְׁרֵי אָדָם בֹּוטֵחַ בָּךְ׃
יי הוֹשִׁיעָה, הַמֶּלֶךְ יַעֲנֵנוּ בְיוֹם קָרְאֵנו׃
לַיְּהוּדִים הָיְתָה אוֹרָה וְשִׂמְחָה וְשָׂשֹׂן וִיקָר׃
כן תהיה לנו׃
כּוֹס יְשׁוּעוֹת אֶשָּׂא וּבְשֵׁם יי אֶקְרָא׃

בָּרוּךְ אַתָּה יי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא פְּרִי הַגָּפֶן׃

בָּרוּךְ אַתָּה יי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא מִינֵי בְשָׂמִים׃

בָּרוּךְ אַתָּה יי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא מְאוֹרֵי הָאֵשׁ׃

בָּרוּךְ אַתָּה יי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל, בֵּין אוֹר לְחֹשֶׁךְ, בֵּין יִשְׂרָאֵל לָעַמִּים, בֵּין יוֹם הַשְּׁבִיעִי לְשֵׁשֶׁת יְמֵי הַמַּעֲשֶׂה, בָּרוּךְ אַתָּה יי, הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל׃`;

const LOCAL_BIRKAT_HALEVANA = `אין לקדש החדש אלא בלילה בעת שהלבנה זורחת ונהנין מאורה (אגור). צריך שלא יהיה מסך מבדיל בינו לבין הלבנה. והוא הדין אם נתכסה בעבים. אבל אם נתכסה בעב דק וקלוש מברך. ואם התחיל לברך ונתכסה גומר הברכה.

הַלְ֒לוּיָהּ הַלְ֒לוּ אֶת־יְהֹוָה מִן־הַשָּׁמַֽיִם הַלְ֒לֽוּהוּ בַּמְּרוֹמִים: הַלְ֒לֽוּהוּ כָל־מַלְאָכָיו הַלְ֒לֽוּהוּ כָּל־צְבָאָיו: הַלְ֒לֽוּהוּ שֶֽׁמֶשׁ וְיָרֵֽחַ הַלְ֒לֽוּהוּ כָּל־כּֽוֹכְבֵי אוֹר: הַלְ֒לֽוּהוּ שְׁמֵי הַשָּׁמָֽיִם וְהַמַּֽיִם אֲשֶׁר מֵעַל הַשָּׁמָֽיִם: יְהַלְ֒לוּ אֶת־שֵׁם יְהֹוָה כִּי הוּא צִוָּה וְנִבְרָֽאוּ: וַיַּעֲמִידֵם לָעַד לְעוֹלָם חָק־נָתַן וְלֹא יַעֲבוֹר:

הִנְנִי מוּכָן וּמְזוּמָן לְקַיֵּם הַמִּצְוָה לְקַדֵּשׁ הַלְּבָנָה: לְשֵׁם יִחוּד קֻדְשָׁא בְּרִיךְ הוּא וּשְׁכִינְתֵּהּ עַל יְדֵי הַהוּא טָמִיר וְנֶעְלָם בְּשֵׁם כָּל־יִשְׂרָאֵל:

בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵֽינוּ מֶֽלֶךְ הָעוֹלָם אֲשֶׁר בְּמַאֲמָרוֹ בָּרָא שְׁחָקִים וּבְרֽוּחַ פִּיו כָּל־צְבָאָם: חֹק וּזְמַן נָתַן לָהֶם שֶׁלֹּא יְשַׁנּוּ אֶת־תַּפְקִידָם: שָׂשִׂים וּשְׂמֵחִים לַעֲשׂוֹת רְצוֹן קוֹנָם פּוֹעֵל אֱמֶת שֶׁפְּעֻלָּתוֹ אֱמֶת: וְלַלְּבָנָה אָמַר שֶׁתִּתְחַדֵּשׁ עֲטֶֽרֶת תִּפְאֶֽרֶת לַעֲמֽוּסֵי בָֽטֶן שֶׁהֵם עֲתִידִים לְהִתְחַדֵּשׁ כְּמוֹתָהּ וּלְפָאֵר לְיוֹצְרָם עַל שֵׁם כְּבוֹד מַלְכוּתוֹ: בָּרוּךְ אַתָּה יְהֹוָה מְחַדֵּשׁ חֳדָשִׁים:

ג"פ בָּרוּךְ יוֹצְרֵךְ בָּרוּךְ עוֹשֵׂךְ בָּרוּךְ קוֹנֵךְ בָּרוּךְ בּוֹרְאֵךְ:
ג"פ כְּשֵׁם שֶׁאֲנִי רוֹקֵד כְּנֶגְדֵּךְ וְאֵינִי יָכוֹל לִנְגֽוֹעַ בָּךְ כַּךְ לֹא יוּכְלוּ כָּל־אוֹיְבַי לִנְגֽוֹעַ בִּי לְרָעָה:
ג"פ תִּפֹּל עֲלֵיהֶם אֵימָֽתָה וָפַֽחַד בִּגְדֹל זְרוֹעֲךָ יִדְּמוּ כָּאָֽבֶן:
ג"פ כָּאָֽבֶן יִדְּמוּ זְרוֹעֲךָ בִּגְדֹל וָפַֽחַד אֵימָֽתָה עֲלֵיהֶם תִּפֹּל:
ג"פ דָּוִד מֶֽלֶךְ יִשְׂרָאֵל חַי וְקַיָּם:
אומרים לג' גברי שָׁלוֹם עֲלֵיכֶם:
ומשיבים עֲלֵיכֶם שָׁלוֹם:
ג"פ סִמָּן טוֹב וּמַזָּל טוֹב יְהֵא לָֽנוּ וּלְכָל יִשְׂרָאֵל אָמֵן:

קוֹל דּוֹדִי הִנֵּה־זֶה בָּא מְדַלֵּג עַל־הֶהָרִים מְקַפֵּץ עַל־הַגְּבָעוֹת: דּוֹמֶה דוֹדִי לִצְבִי אוֹ לְעֹֽפֶר הָאַיָּלִים הִנֵּה־זֶה עוֹמֵד אַחַר כָּתְלֵֽנוּ מַשְׁגִּֽיחַ מִן־הַחַלֹּנוֹת מֵצִיץ מִן־הַחֲרַכִּים:

שִׁיר לַמַּעֲלוֹת אֶשָּׂא עֵינַי אֶל־הֶהָרִים מֵאַֽיִן יָבֹא עֶזְרִי: עֶזְרִי מֵעִם יְהֹוָה עֹשֵׂה שָׁמַֽיִם וָאָֽרֶץ: אַל־יִתֵּן לַמּוֹט רַגְלֶֽךָ אַל־יָנוּם שֹׁמְרֶֽךָ: הִנֵּה לֹא־יָנוּם וְלֹא יִישָׁן שׁוֹמֵר יִשְׂרָאֵל: יְהֹוָה שֹׁמְרֶֽךָ יְהֹוָה צִלְּךָ עַל־יַד יְמִינֶֽךָ: יוֹמָם הַשֶּֽׁמֶשׁ לֹא־יַכֶּֽכָּה וְיָרֵֽחַ בַּלָּֽיְלָה: יְהֹוָה יִשְׁמָרְךָ מִכָּל־רָע יִשְׁמֹר אֶת־נַפְשֶֽׁךָ: יְהֹוָה יִשְׁמָר־צֵאתְךָ וּבוֹאֶֽךָ מֵעַתָּה וְעַד־עוֹלָם:

הַלְ֒לוּיָהּ הַלְ֒לוּ־אֵל בְּקָדְשׁוֹ הַלְ֒לֽוּהוּ בִּרְקִֽיעַ עֻזּוֹ: הַלְ֒לֽוּהוּ בִגְבוּרֹתָיו הַלְ֒לֽוּהוּ כְּרֹב גֻּדְלוֹ: הַלְ֒לֽוּהוּ בְּתֵֽקַע שׁוֹפָר הַלְ֒לֽוּהוּ בְּנֵֽבֶל וְכִנּוֹר: הַלְ֒לֽוּהוּ בְּתֹף וּמָחוֹל הַלְ֒לֽוּהוּ בְּמִנִּים וְעֻגָב: הַלְ֒לֽוּהוּ בְצִלְצְלֵי־שָֽׁמַע הַלְ֒לֽוּהוּ בְּצִלְצְלֵי תְרוּעָה: כֹּל הַנְּשָׁמָה תְּהַלֵּל יָהּ הַלְ֒לוּיָהּ:

תָּנָא דְבֵי רַבִּי יִשְׁמָעֵאל אִלְמָלֵא לֹא זָכוּ יִשְׂרָאֵל אֶלָּא לְהַקְבִּיל פְּנֵי אֲבִיהֶם שֶׁבַּשָּׁמַֽיִם פַּֽעַם אַחַת בַּחֹֽדֶשׁ דַּיָּם אָמַר אַבַּיֵּי הִלְכָּךְ צָרִיךְ לְמֵימְרָא מְעֻמָּד: מִי זֹאת עוֹלָה מִן־הַמִּדְבָּר מִתְרַפֶּֽקֶת עַל־דּוֹדָהּ: וִיהִי רָצוֹן מִלְּפָנֶֽיךָ יְהֹוָה אֱלֹהַי וֵאלֹהֵי אֲבוֹתַי לְמַלֹּאת פְּגִימַת הַלְּבָנָה וְלֹא יִהְיֶה בָּהּ שׁוּם מִעוּט וִיְהִי אוֹר הַלְּבָנָה כְּאוֹר הַחַמָּה וּכְאוֹר שִׁבְעַת יְמֵי בְרֵאשִׁית כְּמוֹ שֶׁהָיְתָה קֹֽדֶם מִעוּטָהּ שֶׁנֶּאֱמַר אֶת־שְׁנֵי הַמְּאֹרוֹת הַגְּדֹלִים וְיִתְקַיֵּם בָּֽנוּ מִקְרָא שֶׁכָּתוּב וּבִקְשׁוּ אֶת־יְהֹוָה אֱלֹהֵיהֶם וְאֵת דָּוִיד מַלְכָּם אָמֵן:

לַמְנַצֵּֽחַ בִּנְגִינוֹת מִזְמוֹר שִׁיר: אֱלֹהִים יְחָנֵּֽנוּ וִיבָרְכֵֽנוּ יָאֵר פָּנָיו אִתָּֽנוּ סֶֽלָה: לָדַֽעַת בָּאָֽרֶץ דַּרְכֶּֽךָ בְּכָל־גּוֹיִם יְשׁוּעָתֶֽךָ: יוֹדֽוּךָ עַמִּים אֱלֹהִים יוֹדֽוּךָ עַמִּים כֻּלָּם: יִשְׂמְחוּ וִירַנְּנוּ לְאֻמִּים כִּי־תִשְׁפּוֹט עַמִּים מִישׁוֹר וּלְאֻמִּים בָּאָֽרֶץ תַּנְחֵם סֶֽלָה: יוֹדֽוּךָ עַמִּים אֱלֹהִים יוֹדֽוּךָ עַמִּים כֻּלָּם: אֶֽרֶץ נָתְנָה יְבוּלָהּ יְבָרְכֵֽנוּ אֱלֹהִים אֱלֹהֵֽינוּ: יְבָרְכֵֽנוּ אֱלֹהִים וְיִירְאוּ אוֹתוֹ כָּל אַפְסֵי אָֽרֶץ:

אומרים עלינו לשבח וקדיש יתום`;

const LOCAL_SELIHOT = `אֵל מֶלֶךְ יוֹשֵׁב עַל כִּסֵּא רַחֲמִים, מִתְנַהֵג בַּחֲסִידוּת.
מוֹחֵל עֲוֹנוֹת עַמּוֹ, מַעֲבִיר רִאשׁוֹן רִאשׁוֹן.
מַרְבֶּה מְחִילָה לְחַטָּאִים, וּסְלִיחָה לַפּוֹשְׁעִים.
עוֹשֵׂה צְדָקוֹת עִם כָּל בָּשָׂר וְרוּחַ, לֹא כְרָעָתָם תִּגְמוֹל.

אֵל! הוֹרֵיתָ לָנוּ לוֹמַר שְׁלוֹשׁ עֶשְׂרֵה.
וּזְכָר לָנוּ הַיּוֹם בְּרִית שְׁלוֹשׁ עֶשְׂרֵה.

וַיֵּרֶד יְהֹוָה בֶּעָנָן וַיִּתְיַצֵּב עִמּוֹ שָׁם וַיִּקְרָא בְשֵׁם יְהֹוָה.
וַיַּעֲבֹר יְהֹוָה עַל פָּנָיו וַיִּקְרָא:
יְהֹוָה יְהֹוָה אֵל רַחוּם וְחַנּוּן אֶרֶךְ אַפַּיִם וְרַב חֶסֶד וֶאֱמֶת.
נֹצֵר חֶסֶד לָאֲלָפִים נֹשֵׂא עָוֹן וָפֶשַׁע וְחַטָּאָה וְנַקֵּה.

וְסָלַחְתָּ לַעֲוֹנֵנוּ וּלְחַטָּאתֵנוּ וּנְחַלְתָּנוּ.
סְלַח לָנוּ אָבִינוּ כִּי חָטָאנוּ, מְחַל לָנוּ מַלְכֵּנוּ כִּי פָשָׁעְנוּ.
כִּי אַתָּה יְהֹוָה טוֹב וְסַלָּח וְרַב חֶסֶד לְכָל קֹרְאֶיךָ.

דִּרְשׁוּ יְהֹוָה בְּהִמָּצְאוֹ קְרָאֻהוּ בִּהְיוֹתוֹ קָרוֹב.
יַעֲזֹב רָשָׁע דַּרְכּוֹ וְאִישׁ אָוֶן מַחְשְׁבֹתָיו וְיָשֹׁב אֶל יְהֹוָה וִירַחֲמֵהוּ וְאֶל אֱלֹהֵינוּ כִּי יַרְבֶּה לִסְלוֹחַ.
אֲדֹנָי שִׁמְעָה בְקוֹלֵנוּ תִּהְיֶינָה אָזְנֶיךָ קַשֻּׁבוֹת לְקוֹל תַּחֲנוּנֵינוּ.
תִּכּוֹן תְּפִלָּתֵנוּ קְטֹרֶת לְפָנֶיךָ.

כְּרַחֵם אָב עַל בָּנִים כֵּן תְּרַחַם יְהֹוָה עָלֵינוּ.
לַיהֹוָה הַיְשׁוּעָה עַל עַמְּךָ בִרְכָתֶךָ סֶּלָה.
יְהֹוָה צְבָאוֹת עִמָּנוּ מִשְׂגָּב לָנוּ אֱלֹהֵי יַעֲקֹב סֶלָה.
יְהֹוָה צְבָאוֹת אַשְׁרֵי אָדָם בֹּטֵחַ בָּךְ.
יְהֹוָה הוֹשִׁיעָה הַמֶּלֶךְ יַעֲנֵנוּ בְיוֹם קָרְאֵנוּ.

סְלַח נָא לַעֲוֹן הָעָם הַזֶּה כְּגֹדֶל חַסְדֶּךָ וְכַאֲשֶׁר נָשָׂאתָ לָעָם הַזֶּה מִמִּצְרַיִם וְעַד הֵנָּה.
וַיֹּאמֶר יְהֹוָה סָלַחְתִּי כִּדְבָרֶךָ.

הַטֵּה אֱלֹהַי אָזְנְךָ וּשְׁמָע פְּקַח עֵינֶיךָ וּרְאֵה שֹׁמְמֹתֵינוּ וְהָעִיר אֲשֶׁר נִקְרָא שִׁמְךָ עָלֶיהָ כִּי לֹא עַל צִדְקֹתֵינוּ אֲנַחְנוּ מַפִּילִים תַּחֲנוּנֵינוּ לְפָנֶיךָ כִּי עַל רַחֲמֶיךָ הָרַבִּים.
אֲדֹנָי שְׁמָעָה, אֲדֹנָי סְלָחָה, אֲדֹנָי הַקְשִׁיבָה וַעֲשֵׂה, אַל תְּאַחַר, לְמַעַנְךָ אֱלֹהַי כִּי שִׁמְךָ נִקְרָא עַל עִירְךָ וְעַל עַמֶּךָ.`;

export interface SefariaText {
  titleHe: string;
  titleEn: string;
  heText: string;
  enText: string;
  ref: string;
}

export interface SpecialInsertion {
  id: string;
  titleHe: string;
  titleFr: string;
  textHe: string;
  textFr?: string;
}

export const getSpecialInsertionsForDate = (_date?: unknown): SpecialInsertion[] => {
  return [];
};

export const fetchSefariaText = async (ref: string): Promise<SefariaText> => {
  const encoded = encodeURIComponent(ref);
  const url = `${SEFARIA_BASE}/texts/${encoded}?context=0&commentary=0&pad=0`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Sefaria API error: ${response.status}`);
  }

  const data = await response.json();

  if (data?.error) {
    throw new Error(`Sefaria API error: ${data.error}`);
  }

  const heText = flattenVerses(data.he || data.hebrew || '');
  const enText = flattenVerses(data.text || data.en || '');

  if (!heText && !enText) {
    throw new Error('Sefaria API returned empty text');
  }

  return {
    titleHe: data.heTitle || data.title || ref,
    titleEn: data.title || ref,
    heText,
    enText,
    ref,
  };
};

// Catégories de prières diverses (תפילות שונות) - correspond à l'image
export interface PrayerCategory {
  id: string;
  titleHe: string;
  titleFr: string;
  emoji?: string;
  sefariaRef?: string;
  sephardicSefariaRef?: string;
  // Si pas de ref Sefaria directe, texte statique
  staticHe?: string;
  sephardicStaticHe?: string;
}

export const PRAYER_CATEGORIES: PrayerCategory[] = [
  {
    id: 'tehillim',
    titleHe: 'ספר תהילים',
    titleFr: 'Livre des psaumes',
    emoji: '📖',
    sefariaRef: 'Psalms',
    staticHe: 'מִזְמוֹר לְדָוִד יי רֹעִי לֹא אֶחְסָר\nבנאות דשא ירביצני על מי מנוחות ינהלני\nגַּם כִּי אֵלֵךְ בְּגֵיא צַלְמָוֶת לֹא אִירָא רָע\nכִּי אַתָּה עִמָּדִי',
  },
  {
    id: 'birkat_hamazon',
    titleHe: 'ברכת המזון',
    titleFr: 'Birkat Hamazon',
    emoji: '🍽️',
    staticHe: LOCAL_BIRKAT_HAMAZON,
    sephardicStaticHe: LOCAL_BIRKAT_HAMAZON_SEPHARDIC,
  },
  {
    id: 'meen_chaloch',
    titleHe: 'מעין שלוש',
    titleFr: 'Meen Chaloch',
    emoji: '🍷',
    staticHe: LOCAL_MEEN_SHALOSH,
  },
  {
    id: 'kadich_yehe_shelama',
    titleHe: 'קדיש יהא שלמא',
    titleFr: 'Kadich Yehe Shelama',
    emoji: '🙏',
    staticHe: LOCAL_KADDISH_YEHE_SHELAMA,
    sephardicStaticHe: LOCAL_KADDISH_YEHE_SHELAMA_SEPHARDIC,
  },
  {
    id: 'kadich_al_israel',
    titleHe: 'קדיש על ישראל',
    titleFr: 'Kadich Al Israel',
    emoji: '🙏',
    staticHe: LOCAL_KADDISH_AL_ISRAEL,
    sephardicStaticHe: LOCAL_KADDISH_AL_ISRAEL,
  },
  {
    id: 'hallel_moussaf',
    titleHe: 'הלל ומוסף לראש חודש',
    titleFr: 'Hallel et moussaf de Roch Hodech',
    emoji: '🎺',
    staticHe: LOCAL_HALLEL_MUSSAF_ROSH_HODESH,
    sephardicStaticHe: LOCAL_HALLEL_MUSSAF_ROSH_HODESH,
  },
  {
    id: 'perek_chira',
    titleHe: 'פרק שירה',
    titleFr: 'Perek Chira',
    emoji: '🐦',
    sefariaRef: 'Perek Shirah',
    staticHe: 'הַשָּׁמַיִם מְסַפְּרִים כְּבוֹד אֵל\nוּמַעֲשֵׂה יָדָיו מַגִּיד הָרָקִיעַ\nכל הנשמה תהלל יה\nהַלְלוּ יָהּ',
  },
  {
    id: 'tikoun_haklali',
    titleHe: 'תיקון הכללי',
    titleFr: 'Tikoun Haklali',
    emoji: '🔥',
    sefariaRef: 'Tikkun HaKlali',
    staticHe: 'תִּקּוּן הַכְּלָלִי\nתהלים טז, לב, מא, מב, נט, עז, צ, קה, קלז, קנ\nמִזְמוֹר לְדָוִד שָׁמְרֵנִי אֵל כִּי חָסִיתִי בָךְ\nאַשְׁרֵי נְשׂוּי פֶשַׁע כְּסוּי חֲטָאָה',
  },
  {
    id: 'kriat_shema_amita',
    titleHe: 'קריאת שמע שעל המיטה',
    titleFr: 'Kriat Chema au coucher',
    emoji: '🛌',
    sefariaRef: 'Siddur Ashkenaz, Bedtime Shema',
    sephardicSefariaRef: 'Siddur Edot HaMizrach, Bedtime Shema',
    staticHe: LOCAL_BEDTIME_SHEMA,
    sephardicStaticHe: LOCAL_BEDTIME_SHEMA_SEPHARDIC,
  },
  {
    id: 'tikkun-hatzot',
    titleHe: 'תיקון חצות',
    titleFr: 'Tikkun Hatzot',
    emoji: '🌙',
    staticHe: LOCAL_TIKKUN_RATZOT,
  },
  {
    id: 'havdala',
    titleHe: 'הבדלה',
    titleFr: 'Havdala',
    emoji: '🕯️',
    staticHe: LOCAL_HAVDALA,
  },
  {
    id: 'birkat-halevana',
    titleHe: 'ברכת הלבנה',
    titleFr: 'Birkat HaLevana',
    emoji: '🌙',
    staticHe: LOCAL_BIRKAT_HALEVANA,
  },
  {
    id: 'slihot',
    titleHe: 'סליחות',
    titleFr: 'Slihot',
    emoji: '🎺',
    staticHe: LOCAL_SELIHOT,
  },
  {
    id: 'sefirat-haomer',
    titleHe: 'ספירת העומר',
    titleFr: 'Compte du Omer',
    emoji: '📊',
    sefariaRef: 'Leviticus.23.15',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו על ספירת העומר\nהיום יום אחד לעומר',
  },
  {
    id: 'hanukkah',
    titleHe: 'הדלקת נרות חנוכה',
    titleFr: 'Allumage des bougies de Hanoucca',
    emoji: '🕎',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו להדליק נר חנוכה\nברוך אתה יי אלהינו מלך העולם שעשה נסים לאבותינו בימים ההם בזמן הזה\nברוך אתה יי אלהינו מלך העולם שהחיינו וקימנו והגיענו לזמן הזה',
  },
  {
    id: 'meguila_esther',
    titleHe: 'מגילת אסתר',
    titleFr: 'Meguila ESTHER',
    emoji: '📜',
    sefariaRef: 'Esther',
  },
  {
    id: 'tefila_haderech',
    titleHe: 'תפילת הדרך',
    titleFr: 'Priere du voyage',
    emoji: '✈️',
    sefariaRef: 'Tefilat HaDerech',
    sephardicSefariaRef: 'Siddur Edot HaMizrach, Assorted Blessings and Prayers, Traveler\'s Prayer',
    staticHe: 'יהי רצון מלפניך יי אלהינו ואלהי אבותינו\nשתוליכנו לשלום ותצעדנו לשלום\nותגיענו למחוז חפצנו לחיים ולשמחה ולשלום\nותצילנו מכל אויב ואורב בדרך\nותתן חן וחסד ורחמים בעיניך ובעיני כל רואינו\nברוך אתה יי שומע תפלה',
  },
  {
    id: 'tfila_mezuza',
    titleHe: 'ברכת מזוזה',
    titleFr: 'Tfila Mezuza',
    emoji: '🚪',
    sefariaRef: 'Deuteronomy.6.4',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו לקבוע מזוזה',
  },
  {
    id: 'circumcision',
    titleHe: 'ברית מילה',
    titleFr: 'Circoncision',
    emoji: '👶',
    sefariaRef: 'Genesis.17.10',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו להכניסו בבריתו של אברהם אבינו',
  },
  {
    id: 'rachat_premier_ne',
    titleHe: 'פדיון הבן',
    titleFr: 'Rachat du premier ne',
    emoji: '💰',
    sefariaRef: 'Numbers.18.15',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו על פדיון הבן',
  },
  {
    id: 'hackava',
    titleHe: 'השכבה',
    titleFr: 'Hachkava',
    emoji: '🕊️',
    sefariaRef: 'Psalms.91',
    staticHe: 'המקום ינחם אתכם בתוך שאר אבלי ציון וירושלים\nלא תירא מפחד לילה מחץ יעוף יומם\nיי רועי לא אחסר',
  },
  {
    id: 'sheba_brakhot',
    titleHe: 'שבע ברכות',
    titleFr: 'Les Cheva Berakhot - Les 7 Benedictions Mariage',
    emoji: '💍',
    sefariaRef: 'Genesis.24.60',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם\nיוצר האדם\nשהכל ברא לכבודו\nיוצר האדם\nאשר ברא ששון ושמחה חתן וכלה\nברוך אתה יי משמח חתן עם הכלה',
  },
  {
    id: 'alfa-beta',
    titleHe: 'אלפא ביתא',
    titleFr: 'Alfa Beta',
    emoji: '🔤',
    staticHe: 'אלף בית גימל דלת\nהי ויו זין חית טית\nיוד כף למד מם\nנון סמך עין פה צדי\nקוף ריש שין תיו',
  },
  {
    id: 'torah_reading',
    titleHe: 'קריאת התורה',
    titleFr: 'Lecture de la Torah',
    emoji: '📜',
    sefariaRef: 'Deuteronomy.1',
    staticHe: 'ברכו את יי המבורך\nברוך יי המבורך לעולם ועד\nברוך אתה יי אלהינו מלך העולם אשר בחר בנו מכל העמים ונתן לנו את תורתו',
  },
];

// Catégories de prières horaires (basées sur l'heure)
export interface PrayerTimeCategory extends PrayerCategory {
  timeOfDay: 'shacharit' | 'mincha' | 'maariv';
  emoji: string;
}

export const PRAYER_TIME_CATEGORIES: PrayerTimeCategory[] = [
  {
    id: 'shacharit_service',
    titleHe: 'שחרית לימי החול',
    titleFr: 'Chaharith (Semaine)',
    emoji: '🌅',
    timeOfDay: 'shacharit',
    sefariaRef: 'Siddur Edot HaMizrach, Weekday Shacharit, Morning Prayer,Siddur Edot HaMizrach, Weekday Shacharit, Incense Offering,Siddur Edot HaMizrach, Weekday Shacharit, Hodu,Siddur Edot HaMizrach, Weekday Shacharit, Pesukei D\'Zimra,Siddur Edot HaMizrach, Weekday Shacharit, The Shema,Siddur Edot HaMizrach, Weekday Shacharit, Amida,Siddur Edot HaMizrach, Weekday Shacharit, Vidui,Siddur Edot HaMizrach, Weekday Shacharit, Torah Reading,Siddur Edot HaMizrach, Weekday Shacharit, Ashrei,Siddur Edot HaMizrach, Weekday Shacharit, Uva LeSion,Siddur Edot HaMizrach, Weekday Shacharit, Alenu',
  },
  {
    id: 'mincha_service',
    titleHe: 'מנחה לימי החול',
    titleFr: 'Mincha (Semaine)',
    emoji: '☀️',
    timeOfDay: 'mincha',
    sefariaRef: 'Siddur Edot HaMizrach, Weekday Mincha, Offerings,Siddur Edot HaMizrach, Weekday Mincha, Amida,Siddur Edot HaMizrach, Weekday Mincha, Vidui,Siddur Edot HaMizrach, Weekday Mincha, Alenu',
  },
  {
    id: 'maariv_service',
    titleHe: 'ערבית לימי החול',
    titleFr: 'Arvit (Semaine)',
    emoji: '🌙',
    timeOfDay: 'maariv',
    sefariaRef: 'Siddur Edot HaMizrach, Weekday Arvit, Barchu,Siddur Edot HaMizrach, Weekday Arvit, The Shema,Siddur Edot HaMizrach, Weekday Arvit, Amidah,Siddur Edot HaMizrach, Weekday Arvit, Alenu',
  },
];

// Récupère les psaumes individuels (1-150) pour le livre des psaumes
export const fetchPsalm = async (psalmNumber: number): Promise<SefariaText> => {
  return fetchSefariaText(`Psalms.${psalmNumber}`);
};

// Cache simple en mémoire
const textCache = new Map<string, SefariaText>();

export const getCachedSefariaText = async (ref: string): Promise<SefariaText> => {
  if (textCache.has(ref)) {
    return textCache.get(ref)!;
  }
  const text = await fetchSefariaText(ref);
  textCache.set(ref, text);
  return text;
};
