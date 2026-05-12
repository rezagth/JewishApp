/**
 * Données complètes du Siddur
 * Contient toutes les prières pour Shacharit, Mincha, Arvit et Shabbat
 * avec texte hébreu, translittération et traduction française
 */

export type ServiceType = 'shacharit' | 'mincha' | 'arvit' | 'shabbat_minha' | 'shabbat_arvit' | 'shabbat_shacharit';

export interface PrayerSection {
  id: string;
  title: string;
  titleHe: string;
  subtitle?: string;
  category: 'obligatoire' | 'optionnel' | 'special';
  verses: PrayerVerse[];
  sources?: Array<{
    label: string;
    url: string;
  }>;
}

export interface PrayerVerse {
  id: string;
  hebrew: string;
  transliteration?: string;
  french?: string;
  isTitle?: boolean;
  isInstruction?: boolean;
  isChazan?: boolean; // récité par le chazan
  isKaddish?: boolean;
  isAmida?: boolean;
}

export interface SiddurService {
  id: ServiceType;
  title: string;
  titleHe: string;
  icon: string;
  color: string;
  sections: PrayerSection[];
  sources?: Array<{
    label: string;
    url: string;
  }>;
}

// ============================================================
// SHACHARIT - PRIÈRES DU MATIN
// ============================================================

const shacharitSections: PrayerSection[] = [
  {
    id: 'modeh-ani',
    title: 'Modeh Ani',
    titleHe: 'מוֹדֶה אֲנִי',
    subtitle: 'Prière du réveil',
    category: 'obligatoire',
    sources: [
      {
        label: 'Open Siddur',
        url: 'https://opensiddur.org/prayers/solilunar/everyday/daytime/birkhot-hashahar/self-awareness/modah-modeh-ani-translation-by-andrew-shaw/',
      },
    ],
    verses: [
      {
        id: 'modeh-1',
        hebrew: 'מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם',
        transliteration: 'Modeh ani lefanecha melech chai vekayam',
        french: 'Je Te rends grâce devant Toi, Roi vivant et éternel',
      },
      {
        id: 'modeh-2',
        hebrew: 'שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה',
        transliteration: 'Shehechezarta bi nishmati bechemla',
        french: 'Car Tu as rendu mon âme en moi avec miséricorde',
      },
      {
        id: 'modeh-3',
        hebrew: 'רַבָּה אֱמוּנָתֶךָ',
        transliteration: 'Raba emunatecha',
        french: 'Grande est Ta fidélité',
      },
    ],
  },
  {
    id: 'netilat-yadayim',
    title: 'Netilat Yadayim',
    titleHe: 'נְטִילַת יָדַיִם',
    subtitle: 'Lavage des mains',
    category: 'obligatoire',
    verses: [
      {
        id: 'netilat-1',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam',
        french: 'Béni sois-Tu, Éternel notre Dieu, Roi de l\'univers',
      },
      {
        id: 'netilat-2',
        hebrew: 'אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל נְטִילַת יָדָיִם',
        transliteration: 'Asher kideshanu bemitzvotav vetzivanu al netilat yadayim',
        french: 'Qui nous a sanctifiés par Ses commandements et nous a ordonné le lavage des mains',
      },
    ],
  },
  {
    id: 'birkot-hashachar',
    title: 'Birkot HaShachar',
    titleHe: 'בִּרְכוֹת הַשַּׁחַר',
    subtitle: 'Bénédictions du matin',
    category: 'obligatoire',
    verses: [
      {
        id: 'birkot-title',
        hebrew: 'בִּרְכוֹת הַשַּׁחַר',
        isTitle: true,
      },
      {
        id: 'birkot-1',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם אֲשֶׁר נָתַן לַשֶּׂכְוִי בִינָה לְהַבְחִין בֵּין יוֹם וּבֵין לָיְלָה',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam asher natan lasechvi vina lehavchin bein yom uvein layla',
        french: 'Béni sois-Tu... qui as donné au coq l\'intelligence de distinguer le jour de la nuit',
      },
      {
        id: 'birkot-2',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם שֶׁלֹּא עָשַׂנִי גּוֹי',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam shelo asani goy',
        french: 'Béni sois-Tu... qui ne m\'as pas fait non-Juif',
      },
      {
        id: 'birkot-3',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם שֶׁלֹּא עָשַׂנִי עָבֶד',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam shelo asani aved',
        french: 'Béni sois-Tu... qui ne m\'as pas fait esclave',
      },
      {
        id: 'birkot-4',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם פּוֹקֵחַ עִוְרִים',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam pokéach ivrim',
        french: 'Béni sois-Tu... qui ouvres les yeux des aveugles',
      },
      {
        id: 'birkot-5',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם מַלְבִּישׁ עֲרֻמִּים',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam malbish arumim',
        french: 'Béni sois-Tu... qui vêts les nus',
      },
      {
        id: 'birkot-6',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם מַתִּיר אֲסוּרִים',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam matir asurim',
        french: 'Béni sois-Tu... qui libères les captifs',
      },
      {
        id: 'birkot-7',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם זוֹקֵף כְּפוּפִים',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam zokef kefufim',
        french: 'Béni sois-Tu... qui redresses les courbés',
      },
      {
        id: 'birkot-8',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם רוֹקַע הָאָרֶץ עַל הַמָּיִם',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam roka haaretz al hamayim',
        french: 'Béni sois-Tu... qui étends la terre sur les eaux',
      },
      {
        id: 'birkot-9',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם שֶׁעָשָׂה לִי כָּל צָרְכִּי',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam sheasa li kol tzorki',
        french: 'Béni sois-Tu... qui as pourvu à tous mes besoins',
      },
      {
        id: 'birkot-10',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם הַמֵּכִין מִצְעֲדֵי גָבֶר',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam hamechin mitzadei gaver',
        french: 'Béni sois-Tu... qui affermis les pas de l\'homme',
      },
      {
        id: 'birkot-11',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם אוֹזֵר יִשְׂרָאֵל בִּגְבוּרָה',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam ozer Yisrael bigvura',
        french: 'Béni sois-Tu... qui ceins Israël de force',
      },
      {
        id: 'birkot-12',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹטֵר יִשְׂרָאֵל בְּתִפְאָרָה',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam oter Yisrael betifara',
        french: 'Béni sois-Tu... qui couronnes Israël de gloire',
      },
      {
        id: 'birkot-13',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם הַנּוֹתֵן לַיָּעֵף כֹּחַ',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam hanotén layaef koach',
        french: 'Béni sois-Tu... qui donnes de la force à celui qui est las',
      },
      {
        id: 'birkot-14',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם הַמַּעֲבִיר שֵׁנָה מֵעֵינַי וּתְנוּמָה מֵעַפְעַפָּי',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam hamavir shena meeinai utenuma meafapai',
        french: 'Béni sois-Tu... qui éloignes le sommeil de mes yeux et l\'assoupissement de mes paupières',
      },
    ],
  },
  {
    id: 'psukei-dezimra',
    title: 'Psouqei DeZimra',
    titleHe: 'פְּסוּקֵי דְזִמְרָה',
    subtitle: 'Versets de louange',
    category: 'obligatoire',
    sources: [
      {
        label: 'Open Siddur',
        url: 'https://opensiddur.org/prayers/solilunar/everyday/daytime/psukei-dzimrah/yishtabah-shimkha/yishtabah-shimkha-translated-by-zalman-schachter-shalomi/',
      },
    ],
    verses: [
      {
        id: 'baruch-sheamar',
        hebrew: 'בָּרוּךְ שֶׁאָמַר וְהָיָה הָעוֹלָם בָּרוּךְ הוּא',
        transliteration: 'Baruch sheamar vehaya haolam baruch hu',
        french: 'Béni soit Celui qui a dit et le monde fut, béni soit-Il',
      },
      {
        id: 'baruch-oseh',
        hebrew: 'בָּרוּךְ עוֹשֶׂה בְרֵאשִׁית בָּרוּךְ אוֹמֵר וְעוֹשֶׂה',
        transliteration: 'Baruch oseh vereshit baruch omer veoseh',
        french: 'Béni soit Celui qui fait la Création, béni soit Celui qui dit et fait',
      },
      {
        id: 'baruch-gozer',
        hebrew: 'בָּרוּךְ גּוֹזֵר וּמְקַיֵּם בָּרוּךְ מְרַחֵם עַל הָאָרֶץ',
        transliteration: 'Baruch gozer umekayem baruch merachem al haaretz',
        french: 'Béni soit Celui qui décrète et accomplit, béni soit Celui qui a pitié de la terre',
      },
      {
        id: 'baruch-meshalem',
        hebrew: 'בָּרוּךְ מְשַׁלֵּם שָׂכָר טוֹב לִירֵאָיו בָּרוּךְ חַי לָעַד וְקַיָּם לָנֶצַח',
        transliteration: 'Baruch meshalem sachar tov lireiav baruch chai laad vekayam lanetzach',
        french: 'Béni soit Celui qui récompense bien ceux qui Le craignent, béni soit Celui qui vit éternellement',
      },
      {
        id: 'ashrei-1',
        hebrew: 'אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ עוֹד יְהַלְלוּךָ סֶּלָה',
        transliteration: 'Ashrei yoshvei vetecha od yehaleluka sela',
        french: 'Heureux ceux qui habitent Ta maison, ils Te loueront encore, Sela',
      },
      {
        id: 'ashrei-2',
        hebrew: 'אַשְׁרֵי הָעָם שֶׁכָּכָה לּוֹ אַשְׁרֵי הָעָם שֶׁיְהֹוָה אֱלֹהָיו',
        transliteration: 'Ashrei haam shekakha lo ashrei haam sheAdonai Elohav',
        french: 'Heureux le peuple à qui il en est ainsi, heureux le peuple dont l\'Éternel est le Dieu',
      },
      {
        id: 'tehila-ledavid',
        hebrew: 'תְּהִלָּה לְדָוִד אֲרוֹמִמְךָ אֱלוֹהַי הַמֶּלֶךְ וַאֲבָרְכָה שִׁמְךָ לְעוֹלָם וָעֶד',
        transliteration: 'Tehila leDavid aromimcha Elohai hamelech vaavaracha shimcha leolam vaed',
        french: 'Louange de David. Je T\'exalterai, mon Dieu le Roi, et je bénirai Ton nom à jamais',
      },
      {
        id: 'gadol-adonai',
        hebrew: 'גָּדוֹל יְהֹוָה וּמְהֻלָּל מְאֹד וְלִגְדֻלָּתוֹ אֵין חֵקֶר',
        transliteration: 'Gadol Adonai umehulal meod veligedoulato ein cheker',
        french: 'Grand est l\'Éternel et très loué, et Sa grandeur est insondable',
      },
      {
        id: 'yishtabach',
        hebrew: 'יִשְׁתַּבַּח שִׁמְךָ לָעַד מַלְכֵּנוּ הָאֵל הַמֶּלֶךְ הַגָּדוֹל וְהַקָּדוֹשׁ בַּשָּׁמַיִם וּבָאָרֶץ',
        transliteration: 'Yishtabach shimcha laad malkenu hael hamelech hagadol vehakadosh bashamayim uvaretz',
        french: 'Que Ton nom soit loué à jamais, notre Roi, le Dieu, le grand et saint Roi dans les cieux et sur la terre',
      },
    ],
  },
  {
    id: 'shema-uvirchoteha',
    title: 'Shema et ses Bénédictions',
    titleHe: 'שְׁמַע וּבִרְכוֹתֶיהָ',
    subtitle: 'Kériat Shema',
    category: 'obligatoire',
    verses: [
      {
        id: 'barkhu',
        hebrew: 'בָּרְכוּ אֶת יְהֹוָה הַמְבֹרָךְ',
        transliteration: 'Barchu et Adonai hamevoracha',
        french: 'Bénissez l\'Éternel le Béni',
        isChazan: true,
      },
      {
        id: 'barkhu-response',
        hebrew: 'בָּרוּךְ יְהֹוָה הַמְבֹרָךְ לְעוֹלָם וָעֶד',
        transliteration: 'Baruch Adonai hamevoracha leolam vaed',
        french: 'Béni soit l\'Éternel le Béni pour toujours et à jamais',
      },
      {
        id: 'yotzer-or',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם יוֹצֵר אוֹר וּבוֹרֵא חֹשֶׁךְ עֹשֶׂה שָׁלוֹם וּבוֹרֵא אֶת הַכֹּל',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam yotzer or uvore choshech oseh shalom uvore et hakol',
        french: 'Béni sois-Tu... qui formes la lumière et crées les ténèbres, qui fais la paix et crées tout',
      },
      {
        id: 'ahavat-olam',
        hebrew: 'אַהֲבַת עוֹלָם בֵּית יִשְׂרָאֵל עַמְּךָ אָהָבְתָּ תּוֹרָה וּמִצְוֹת חֻקִּים וּמִשְׁפָּטִים אוֹתָנוּ לִמַּדְתָּ',
        transliteration: 'Ahavat olam beit Yisrael amcha ahavta Torah umitzvot chukim umishpatim otanu limadeta',
        french: 'D\'un amour éternel Tu as aimé la maison d\'Israël Ton peuple, Torah et commandements, lois et jugements, Tu nous les as enseignés',
      },
      {
        id: 'shema',
        hebrew: 'שְׁמַע יִשְׂרָאֵל יְהֹוָה אֱלֹהֵינוּ יְהֹוָה אֶחָד',
        transliteration: 'Shema Yisrael Adonai Eloheinu Adonai Echad',
        french: 'Écoute Israël, l\'Éternel est notre Dieu, l\'Éternel est Un',
      },
      {
        id: 'baruch-shem',
        hebrew: 'בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד',
        transliteration: 'Baruch shem kevod malchuto leolam vaed',
        french: 'Béni soit le nom de la gloire de Son règne pour toujours et à jamais',
      },
      {
        id: 'veahavta',
        hebrew: 'וְאָהַבְתָּ אֵת יְהֹוָה אֱלֹהֶיךָ בְּכָל לְבָבְךָ וּבְכָל נַפְשְׁךָ וּבְכָל מְאֹדֶךָ',
        transliteration: 'Veahavta et Adonai Elohecha bechol levavcha uvechol nafshecha uvechol meodecha',
        french: 'Tu aimeras l\'Éternel ton Dieu de tout ton cœur, de toute ton âme et de toute ta force',
      },
      {
        id: 'vehayu-hadevarim',
        hebrew: 'וְהָיוּ הַדְּבָרִים הָאֵלֶּה אֲשֶׁר אָנֹכִי מְצַוְּךָ הַיּוֹם עַל לְבָבֶךָ',
        transliteration: 'Vehayu hadevarim haele asher anochi metzavecha hayom al levavecha',
        french: 'Ces paroles que je te prescris aujourd\'hui seront dans ton cœur',
      },
      {
        id: 'veshinantam',
        hebrew: 'וְשִׁנַּנְתָּם לְבָנֶיךָ וְדִבַּרְתָּ בָּם בְּשִׁבְתְּךָ בְּבֵיתֶךָ וּבְלֶכְתְּךָ בַדֶּרֶךְ וּבְשָׁכְבְּךָ וּבְקוּמֶךָ',
        transliteration: 'Veshinantam levanecha vedibarta bam beshivtecha bevetecha uvelechtecha vaderech uveshochbecha uvekumecha',
        french: 'Tu les enseigneras à tes enfants et tu en parleras quand tu seras dans ta maison, en chemin, en te couchant et en te levant',
      },
      {
        id: 'vekashartam',
        hebrew: 'וּקְשַׁרְתָּם לְאוֹת עַל יָדֶךָ וְהָיוּ לְטֹטָפֹת בֵּין עֵינֶיךָ',
        transliteration: 'Ukeshartam leot al yadecha vehayu letotafot bein einecha',
        french: 'Tu les attacheras en signe sur ta main et ils seront en fronteaux entre tes yeux',
      },
      {
        id: 'uchtavtam',
        hebrew: 'וּכְתַבְתָּם עַל מְזוּזוֹת בֵּיתֶךָ וּבִשְׁעָרֶיךָ',
        transliteration: 'Uchtavtam al mezuzot betecha uvishearecha',
        french: 'Tu les écriras sur les poteaux de ta maison et sur tes portes',
      },
      {
        id: 'vayomer',
        hebrew: 'וַיֹּאמֶר יְהֹוָה אֶל מֹשֶׁה לֵּאמֹר דַּבֵּר אֶל בְּנֵי יִשְׂרָאֵל וְאָמַרְתָּ אֲלֵהֶם',
        transliteration: 'Vayomer Adonai el Moshe lemor daber el benei Yisrael veamarta aleihem',
        french: 'L\'Éternel parla à Moïse en disant : Parle aux enfants d\'Israël et dis-leur',
      },
      {
        id: 'veasou-tzitzit',
        hebrew: 'וְעָשׂוּ לָהֶם צִיצִת עַל כַּנְפֵי בִגְדֵיהֶם לְדֹרֹתָם וְנָתְנוּ עַל צִיצִת הַכָּנָף פְּתִיל תְּכֵלֶת',
        transliteration: 'Veasu lahem tzitzit al kanfei vigdeihem ledorotam venatenu al tzitzit hakanaf petil techelet',
        french: 'Ils se feront des franges aux coins de leurs vêtements pour leurs générations et mettront sur la frange du coin un fil de bleu',
      },
      {
        id: 'emet',
        hebrew: 'אֱמֶת וְיַצִּיב וְנָכוֹן וְקַיָּם וְיָשָׁר וְנֶאֱמָן וְאָהוּב וְחָבִיב וְנֶחְמָד וְנָעִים',
        transliteration: 'Emet veyatziv venachon vekayam veyashar veneeman veahov vehaviv venechmad venaim',
        french: 'Vrai, établi, juste, permanent, droit, fidèle, aimé, cher, désirable et agréable',
      },
    ],
  },
  {
    id: 'amida-shacharit',
    title: 'Amida - Shacharit',
    titleHe: 'עֲמִידָה - שַׁחֲרִית',
    subtitle: 'Les 19 bénédictions',
    category: 'obligatoire',
    verses: [
      {
        id: 'amida-intro',
        hebrew: 'אֲדֹנָי שְׂפָתַי תִּפְתָּח וּפִי יַגִּיד תְּהִלָּתֶךָ',
        transliteration: 'Adonai sefatai tiftach ufi yagid tehilatecha',
        french: 'Seigneur, ouvre mes lèvres et ma bouche proclamera Ta louange',
        isAmida: true,
      },
      {
        id: 'avot',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ אֱלֹהֵי אַבְרָהָם אֱלֹהֵי יִצְחָק וֵאלֹהֵי יַעֲקֹב',
        transliteration: 'Baruch Ata Adonai Eloheinu vElohei avoteinu Elohei Avraham Elohei Yitzchak vElohei Yaakov',
        french: 'Béni sois-Tu, Éternel notre Dieu et Dieu de nos pères, Dieu d\'Abraham, Dieu d\'Isaac et Dieu de Jacob',
        isAmida: true,
      },
      {
        id: 'avot-2',
        hebrew: 'הָאֵל הַגָּדוֹל הַגִּבּוֹר וְהַנּוֹרָא אֵל עֶלְיוֹן גּוֹמֵל חֲסָדִים טוֹבִים וְקוֹנֵה הַכֹּל',
        transliteration: 'Hael hagadol hagibor vehanora El elyon gomel chasadim tovim vekoneh hakol',
        french: 'Le Dieu grand, puissant et redoutable, Dieu Très-Haut, qui accomplit de bonnes grâces et possède tout',
        isAmida: true,
      },
      {
        id: 'avot-3',
        hebrew: 'וְזוֹכֵר חַסְדֵי אָבוֹת וּמֵבִיא גוֹאֵל לִבְנֵי בְנֵיהֶם לְמַעַן שְׁמוֹ בְּאַהֲבָה',
        transliteration: 'Vezochér chasdei avot umevi goel livnei veneihem lemaan shemo beahava',
        french: 'Qui se souvient des grâces des pères et amène un Rédempteur aux fils de leurs fils, pour l\'amour de Son nom',
        isAmida: true,
      },
      {
        id: 'gevurot',
        hebrew: 'אַתָּה גִּבּוֹר לְעוֹלָם אֲדֹנָי מְחַיֵּה מֵתִים אַתָּה רַב לְהוֹשִׁיעַ',
        transliteration: 'Ata gibor leolam Adonai mechayeh metim ata rav lehoshia',
        french: 'Tu es puissant pour toujours, Seigneur, Tu fais revivre les morts, Tu es grand pour sauver',
        isAmida: true,
      },
      {
        id: 'kedusha-title',
        hebrew: 'קְדֻשַּׁת הַשֵּׁם',
        isTitle: true,
        isAmida: true,
      },
      {
        id: 'kedusha',
        hebrew: 'אַתָּה קָדוֹשׁ וְשִׁמְךָ קָדוֹשׁ וּקְדוֹשִׁים בְּכָל יוֹם יְהַלְלוּךָ סֶּלָה',
        transliteration: 'Ata kadosh veshimcha kadosh ukdoshim bechol yom yehaleluka sela',
        french: 'Tu es saint et Ton nom est saint, et les saints Te louent chaque jour, Sela',
        isAmida: true,
      },
      {
        id: 'bina',
        hebrew: 'אַתָּה חוֹנֵן לְאָדָם דַּעַת וּמְלַמֵּד לֶאֱנוֹשׁ בִּינָה חָנֵּנוּ מֵאִתְּךָ דֵּעָה בִּינָה וְהַשְׂכֵּל',
        transliteration: 'Ata chonen leadam daat umelamed leanosh bina chanenu meaitcha dea bina vehaskeil',
        french: 'Tu accordes à l\'homme la connaissance et enseignes à l\'être humain la compréhension. Accorde-nous de Toi connaissance, compréhension et sagesse',
        isAmida: true,
      },
      {
        id: 'teshuva',
        hebrew: 'הֲשִׁיבֵנוּ אָבִינוּ לְתוֹרָתֶךָ וְקָרְבֵנוּ מַלְכֵּנוּ לַעֲבוֹדָתֶךָ וְהַחֲזִירֵנוּ בִּתְשׁוּבָה שְׁלֵמָה לְפָנֶיךָ',
        transliteration: 'Hashivenu avinu leToratecha vekarveinu malkenu lavodatecha vehachazirenu biteshuva shelema lefanecha',
        french: 'Ramène-nous, notre Père, à Ta Torah, rapproche-nous, notre Roi, de Ton service, et fais-nous revenir en repentir complet devant Toi',
        isAmida: true,
      },
      {
        id: 'slicha',
        hebrew: 'סְלַח לָנוּ אָבִינוּ כִּי חָטָאנוּ מְחַל לָנוּ מַלְכֵּנוּ כִּי פָשָׁעְנוּ כִּי מוֹחֵל וְסוֹלֵחַ אָתָּה',
        transliteration: 'Selach lanu avinu ki chatanu mechal lanu malkenu ki fashanu ki mochel vesoleiach ata',
        french: 'Pardonne-nous, notre Père, car nous avons péché, absous-nous, notre Roi, car nous avons transgressé, car Tu es Celui qui pardonne et absout',
        isAmida: true,
      },
      {
        id: 'geula',
        hebrew: 'רְאֵה בְעָנְיֵנוּ וְרִיבָה רִיבֵנוּ וּגְאָלֵנוּ מְהֵרָה לְמַעַן שְׁמֶךָ כִּי גּוֹאֵל חָזָק אָתָּה',
        transliteration: 'Ree veonyenu veriba rivenu ugealeinu mehera lemaan shemecha ki goel chazak ata',
        french: 'Vois notre misère, défends notre cause et rachète-nous promptement pour l\'amour de Ton nom, car Tu es un Rédempteur puissant',
        isAmida: true,
      },
      {
        id: 'refua',
        hebrew: 'רְפָאֵנוּ יְהֹוָה וְנֵרָפֵא הוֹשִׁיעֵנוּ וְנִוָּשֵׁעָה כִּי תְהִלָּתֵנוּ אָתָּה',
        transliteration: 'Refaenu Adonai venirafe hoshienu venivashea ki tehilatenu ata',
        french: 'Guéris-nous, Éternel, et nous serons guéris, sauve-nous et nous serons sauvés, car Tu es notre louange',
        isAmida: true,
      },
      {
        id: 'birkat-hashanim',
        hebrew: 'בָּרֵךְ עָלֵינוּ יְהֹוָה אֱלֹהֵינוּ אֶת הַשָּׁנָה הַזֹּאת וְאֶת כָּל מִינֵי תְבוּאָתָהּ לְטוֹבָה',
        transliteration: 'Barech aleinu Adonai Eloheinu et hashana hazot veet kol minei tevuata letova',
        french: 'Bénis pour nous, Éternel notre Dieu, cette année et toutes ses productions pour le bien',
        isAmida: true,
      },
      {
        id: 'kibbutz-galuyot',
        hebrew: 'תְּקַע בְּשׁוֹפָר גָּדוֹל לְחֵרוּתֵנוּ וְשָׂא נֵס לְקַבֵּץ גָּלֻיּוֹתֵינוּ',
        transliteration: 'Teka beshofar gadol lecherutenu vesa nes lekabetz galuyoteinu',
        french: 'Sonne du grand Shofar pour notre liberté, lève l\'étendard pour rassembler nos exilés',
        isAmida: true,
      },
      {
        id: 'hashavat-mishpat',
        hebrew: 'הָשִׁיבָה שׁוֹפְטֵינוּ כְּבָרִאשׁוֹנָה וְיוֹעֲצֵינוּ כְּבַתְּחִלָּה',
        transliteration: 'Hashiva shoftenu kevarishona veyoatzenu ketechila',
        french: 'Rétablis nos juges comme autrefois et nos conseillers comme au début',
        isAmida: true,
      },
      {
        id: 'birkat-haminim',
        hebrew: 'וְלַמַּלְשִׁינִים אַל תְּהִי תִקְוָה וְכָל הָרִשְׁעָה כְּרֶגַע תֹּאבֵד',
        transliteration: 'Velamalshinim al tehi tikva vechol harisha kerega toved',
        french: 'Que les délateurs n\'aient aucun espoir et que toute la méchanceté disparaisse en un instant',
        isAmida: true,
      },
      {
        id: 'al-hatzadikim',
        hebrew: 'עַל הַצַּדִּיקִים וְעַל הַחֲסִידִים וְעַל זִקְנֵי עַמְּךָ בֵּית יִשְׂרָאֵל',
        transliteration: 'Al hatzadikim veal hachasidim veal ziknei amcha beit Yisrael',
        french: 'Sur les justes et sur les pieux et sur les anciens de Ton peuple la maison d\'Israël',
        isAmida: true,
      },
      {
        id: 'binyan-yerushalayim',
        hebrew: 'וְלִירוּשָׁלַיִם עִירְךָ בְּרַחֲמִים תָּשׁוּב וְתִשְׁכֹּן בְּתוֹכָהּ כַּאֲשֶׁר דִּבַּרְתָּ',
        transliteration: 'Velirushalayim ircha berachamim tashuv vetishkon betochah kaasher dibarta',
        french: 'Et à Jérusalem Ta ville, reviens avec miséricorde et habite en son sein comme Tu l\'as dit',
        isAmida: true,
      },
      {
        id: 'malchut-david',
        hebrew: 'אֶת צֶמַח דָּוִד עַבְדְּךָ מְהֵרָה תַצְמִיחַ וְקַרְנוֹ תָּרוּם בִּישׁוּעָתֶךָ',
        transliteration: 'Et tzemach David avdecha mehera tatzmiah vekerno tarum bishuatecha',
        french: 'Fais germer promptement le rejeton de David Ton serviteur et élève sa corne par Ta délivrance',
        isAmida: true,
      },
      {
        id: 'shomea-tefila',
        hebrew: 'שְׁמַע קוֹלֵנוּ יְהֹוָה אֱלֹהֵינוּ חוּס וְרַחֵם עָלֵינוּ וְקַבֵּל בְּרַחֲמִים וּבְרָצוֹן אֶת תְּפִלָּתֵנוּ',
        transliteration: 'Shema kolenu Adonai Eloheinu chus verachem aleinu vekabel berachamim uvratzon et tefilatenu',
        french: 'Entends notre voix, Éternel notre Dieu, aie pitié et compassion de nous, et accepte avec miséricorde et bienveillance notre prière',
        isAmida: true,
      },
      {
        id: 'avoda',
        hebrew: 'רְצֵה יְהֹוָה אֱלֹהֵינוּ בְּעַמְּךָ יִשְׂרָאֵל וּבִתְפִלָּתָם וְהָשֵׁב אֶת הָעֲבוֹדָה לִדְבִיר בֵּיתֶךָ',
        transliteration: 'Retzeh Adonai Eloheinu beamcha Yisrael uvtefilatam vehashev et haavoda lidvir betecha',
        french: 'Agrée, Éternel notre Dieu, Ton peuple Israël et leur prière, et rétablis le service dans le Saint des Saints de Ta maison',
        isAmida: true,
      },
      {
        id: 'hoda-ah',
        hebrew: 'מוֹדִים אֲנַחְנוּ לָךְ שָׁאַתָּה הוּא יְהֹוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ לְעוֹלָם וָעֶד',
        transliteration: 'Modim anachnu lach shaata hu Adonai Eloheinu vElohei avoteinu leolam vaed',
        french: 'Nous Te rendons grâce car Tu es l\'Éternel notre Dieu et le Dieu de nos pères pour toujours et à jamais',
        isAmida: true,
      },
      {
        id: 'birkat-kohanim',
        hebrew: 'שִׂים שָׁלוֹם טוֹבָה וּבְרָכָה חֵן וָחֶסֶד וְרַחֲמִים עָלֵינוּ וְעַל כָּל יִשְׂרָאֵל עַמֶּךָ',
        transliteration: 'Sim shalom tova uveracha chen vachesed verachamim aleinu veal kol Yisrael amecha',
        french: 'Accorde la paix, le bien et la bénédiction, la grâce, la bonté et la miséricorde sur nous et sur tout Israël Ton peuple',
        isAmida: true,
      },
    ],
  },
  {
    id: 'tachanun',
    title: 'Tachanoun',
    titleHe: 'תַּחֲנוּן',
    subtitle: 'Supplications',
    category: 'optionnel',
    verses: [
      {
        id: 'tachanun-1',
        hebrew: 'וַיֹּאמֶר דָּוִד אֶל גָּד צַר לִי מְאֹד נִפְּלָה נָּא בְיַד יְהֹוָה כִּי רַבִּים רַחֲמָיו',
        transliteration: 'Vayomer David el Gad tzar li meod nifla na beyad Adonai ki rabim rachamav',
        french: 'David dit à Gad : Je suis dans une grande détresse. Que je tombe entre les mains de l\'Éternel car Ses miséricordes sont grandes',
      },
      {
        id: 'tachanun-2',
        hebrew: 'רַחוּם וְחַנּוּן חָטָאתִי לְפָנֶיךָ יְהֹוָה מָלֵא רַחֲמִים רַחֵם עָלַי וְקַבֵּל תַּחֲנוּנַי',
        transliteration: 'Rachum vechanun chatati lefanecha Adonai male rachamim rachem alai vekabel tachanunai',
        french: 'Miséricordieux et clément, j\'ai péché devant Toi, Éternel plein de miséricordes, aie pitié de moi et accepte mes supplications',
      },
    ],
  },
  {
    id: 'aleinu',
    title: 'Aleïnou',
    titleHe: 'עָלֵינוּ',
    subtitle: 'Prière de clôture',
    category: 'obligatoire',
    verses: [
      {
        id: 'aleinu-1',
        hebrew: 'עָלֵינוּ לְשַׁבֵּחַ לַאֲדוֹן הַכֹּל לָתֵת גְּדֻלָּה לְיוֹצֵר בְּרֵאשִׁית',
        transliteration: 'Aleinu leshabeach laAdon hakol latet gedula leyotzer bereshit',
        french: 'Il nous incombe de louer le Maître de tout, de proclamer la grandeur du Créateur du commencement',
      },
      {
        id: 'aleinu-2',
        hebrew: 'שֶׁלֹּא עָשָׂנוּ כְּגוֹיֵי הָאֲרָצוֹת וְלֹא שָׂמָנוּ כְּמִשְׁפְּחוֹת הָאֲדָמָה',
        transliteration: 'Shelo asanu kegoyei haaratzot velo samanu kemishpechot haadama',
        french: 'Qui ne nous a pas faits comme les nations des pays et ne nous a pas placés comme les familles de la terre',
      },
      {
        id: 'aleinu-3',
        hebrew: 'וַאֲנַחְנוּ כּוֹרְעִים וּמִשְׁתַּחֲוִים וּמוֹדִים לִפְנֵי מֶלֶךְ מַלְכֵי הַמְּלָכִים הַקָּדוֹשׁ בָּרוּךְ הוּא',
        transliteration: 'Vaanachnu korim umishtachavim umodim lifnei melech malchei hamelachim hakadosh baruch hu',
        french: 'Et nous, nous nous prosternons, nous nous inclinons et nous rendons grâce devant le Roi des rois des rois, le Saint béni soit-Il',
      },
      {
        id: 'aleinu-4',
        hebrew: 'לְתַקֵּן עוֹלָם בְּמַלְכוּת שַׁדַּי וְכָל בְּנֵי בָשָׂר יִקְרְאוּ בִשְׁמֶךָ',
        transliteration: 'Letaken olam bemalchut Shadai vechol benei vasar yikreu vishemecha',
        french: 'Pour réparer le monde sous le règne du Tout-Puissant, et que tous les êtres humains invoquent Ton nom',
      },
      {
        id: 'aleinu-5',
        hebrew: 'יִמְלֹךְ יְהֹוָה לְעֹלָם אֱלֹהַיִךְ צִיּוֹן לְדֹר וָדֹר הַלְלוּיָהּ',
        transliteration: 'Yimloch Adonai leolam Elohayich Tzion ledor vador halleluya',
        french: 'L\'Éternel régnera pour toujours, ton Dieu, ô Sion, de génération en génération, Hallelouya',
      },
    ],
  },
  {
    id: 'kaddish-yatom',
    title: 'Kaddish Yatom',
    titleHe: 'קַדִּישׁ יָתוֹם',
    subtitle: 'Kaddish des endeuillés',
    category: 'optionnel',
    verses: [
      {
        id: 'kaddish-1',
        hebrew: 'יִתְגַּדַּל וְיִתְקַדַּשׁ שְׁמֵהּ רַבָּא',
        transliteration: 'Yitgadal veyitkadash shemeh raba',
        french: 'Que Son grand nom soit magnifié et sanctifié',
        isKaddish: true,
      },
      {
        id: 'kaddish-2',
        hebrew: 'בְּעָלְמָא דִּי בְרָא כִרְעוּתֵהּ וְיַמְלִיךְ מַלְכוּתֵהּ',
        transliteration: 'Beolma di vera chiruteh veyamlich malchuteh',
        french: 'Dans le monde qu\'Il a créé selon Sa volonté et qu\'Il établisse Son règne',
        isKaddish: true,
      },
      {
        id: 'kaddish-3',
        hebrew: 'בְּחַיֵּיכוֹן וּבְיוֹמֵיכוֹן וּבְחַיֵּי דְכָל בֵּית יִשְׂרָאֵל בַּעֲגָלָא וּבִזְמַן קָרִיב',
        transliteration: 'Bechayeichon uveyomeichon uvechayei dechol beit Yisrael baagala uvizman kariv',
        french: 'De votre vivant et de vos jours et de la vie de toute la maison d\'Israël, promptement et dans un temps proche',
        isKaddish: true,
      },
      {
        id: 'kaddish-amen',
        hebrew: 'וְאִמְרוּ אָמֵן יְהֵא שְׁמֵהּ רַבָּא מְבָרַךְ לְעָלַם וּלְעָלְמֵי עָלְמַיָּא',
        transliteration: 'Veimru amen yehe shemeh raba mevarach lealam ulalmei almaya',
        french: 'Et dites Amen. Que Son grand nom soit béni pour toujours et pour l\'éternité des éternités',
        isKaddish: true,
      },
    ],
  },
];

// ============================================================
// MINCHA - PRIÈRES DE L'APRÈS-MIDI
// ============================================================

const minhaSections: PrayerSection[] = [
  {
    id: 'ashrei-mincha',
    title: 'Ashrei',
    titleHe: 'אַשְׁרֵי',
    subtitle: 'Psaume 145',
    category: 'obligatoire',
    verses: [
      {
        id: 'ashrei-m1',
        hebrew: 'אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ עוֹד יְהַלְלוּךָ סֶּלָה',
        transliteration: 'Ashrei yoshvei vetecha od yehaleluka sela',
        french: 'Heureux ceux qui habitent Ta maison, ils Te loueront encore, Sela',
      },
      {
        id: 'ashrei-m2',
        hebrew: 'אַשְׁרֵי הָעָם שֶׁכָּכָה לּוֹ אַשְׁרֵי הָעָם שֶׁיְהֹוָה אֱלֹהָיו',
        transliteration: 'Ashrei haam shekakha lo ashrei haam sheAdonai Elohav',
        french: 'Heureux le peuple à qui il en est ainsi, heureux le peuple dont l\'Éternel est le Dieu',
      },
      {
        id: 'tehila-m',
        hebrew: 'תְּהִלָּה לְדָוִד אֲרוֹמִמְךָ אֱלוֹהַי הַמֶּלֶךְ',
        transliteration: 'Tehila leDavid aromimcha Elohai hamelech',
        french: 'Louange de David. Je T\'exalterai, mon Dieu le Roi',
      },
      {
        id: 'aleph-m',
        hebrew: 'בְּכָל יוֹם אֲבָרְכֶךָּ וַאֲהַלְלָה שִׁמְךָ לְעוֹלָם וָעֶד',
        transliteration: 'Bechol yom avarecheka vaahallela shimcha leolam vaed',
        french: 'Chaque jour je Te bénirai et je louerai Ton nom pour toujours et à jamais',
      },
      {
        id: 'gadol-m',
        hebrew: 'גָּדוֹל יְהֹוָה וּמְהֻלָּל מְאֹד וְלִגְדֻלָּתוֹ אֵין חֵקֶר',
        transliteration: 'Gadol Adonai umehulal meod veligedoulato ein cheker',
        french: 'Grand est l\'Éternel et très loué, et Sa grandeur est insondable',
      },
      {
        id: 'poteach-m',
        hebrew: 'פּוֹתֵחַ אֶת יָדֶךָ וּמַשְׂבִּיעַ לְכָל חַי רָצוֹן',
        transliteration: 'Poteach et yadecha umasbia lechol chai ratzon',
        french: 'Tu ouvres Ta main et Tu rassasies tout être vivant selon son désir',
      },
    ],
  },
  {
    id: 'amida-mincha',
    title: 'Amida - Mincha',
    titleHe: 'עֲמִידָה - מִנְחָה',
    subtitle: 'Les 19 bénédictions',
    category: 'obligatoire',
    verses: [
      {
        id: 'amida-mincha-intro',
        hebrew: 'אֲדֹנָי שְׂפָתַי תִּפְתָּח וּפִי יַגִּיד תְּהִלָּתֶךָ',
        transliteration: 'Adonai sefatai tiftach ufi yagid tehilatecha',
        french: 'Seigneur, ouvre mes lèvres et ma bouche proclamera Ta louange',
        isAmida: true,
      },
      {
        id: 'avot-mincha',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ אֱלֹהֵי אַבְרָהָם אֱלֹהֵי יִצְחָק וֵאלֹהֵי יַעֲקֹב הָאֵל הַגָּדוֹל הַגִּבּוֹר וְהַנּוֹרָא',
        transliteration: 'Baruch Ata Adonai Eloheinu vElohei avoteinu Elohei Avraham Elohei Yitzchak vElohei Yaakov hael hagadol hagibor vehanora',
        french: 'Béni sois-Tu, Éternel notre Dieu et Dieu de nos pères, Dieu d\'Abraham, Dieu d\'Isaac et Dieu de Jacob, le Dieu grand, puissant et redoutable',
        isAmida: true,
      },
      {
        id: 'gevurot-mincha',
        hebrew: 'אַתָּה גִּבּוֹר לְעוֹלָם אֲדֹנָי מְחַיֵּה מֵתִים אַתָּה רַב לְהוֹשִׁיעַ',
        transliteration: 'Ata gibor leolam Adonai mechayeh metim ata rav lehoshia',
        french: 'Tu es puissant pour toujours, Seigneur, Tu fais revivre les morts, Tu es grand pour sauver',
        isAmida: true,
      },
      {
        id: 'kedusha-mincha',
        hebrew: 'אַתָּה קָדוֹשׁ וְשִׁמְךָ קָדוֹשׁ וּקְדוֹשִׁים בְּכָל יוֹם יְהַלְלוּךָ סֶּלָה',
        transliteration: 'Ata kadosh veshimcha kadosh ukdoshim bechol yom yehaleluka sela',
        french: 'Tu es saint et Ton nom est saint, et les saints Te louent chaque jour, Sela',
        isAmida: true,
      },
      {
        id: 'sim-shalom-mincha',
        hebrew: 'שִׂים שָׁלוֹם טוֹבָה וּבְרָכָה חֵן וָחֶסֶד וְרַחֲמִים עָלֵינוּ וְעַל כָּל יִשְׂרָאֵל עַמֶּךָ',
        transliteration: 'Sim shalom tova uveracha chen vachesed verachamim aleinu veal kol Yisrael amecha',
        french: 'Accorde la paix, le bien et la bénédiction, la grâce, la bonté et la miséricorde sur nous et sur tout Israël Ton peuple',
        isAmida: true,
      },
    ],
  },
  {
    id: 'aleinu-mincha',
    title: 'Aleïnou',
    titleHe: 'עָלֵינוּ',
    subtitle: 'Prière de clôture',
    category: 'obligatoire',
    verses: [
      {
        id: 'aleinu-m1',
        hebrew: 'עָלֵינוּ לְשַׁבֵּחַ לַאֲדוֹן הַכֹּל לָתֵת גְּדֻלָּה לְיוֹצֵר בְּרֵאשִׁית',
        transliteration: 'Aleinu leshabeach laAdon hakol latet gedula leyotzer bereshit',
        french: 'Il nous incombe de louer le Maître de tout, de proclamer la grandeur du Créateur du commencement',
      },
      {
        id: 'aleinu-m2',
        hebrew: 'וַאֲנַחְנוּ כּוֹרְעִים וּמִשְׁתַּחֲוִים וּמוֹדִים לִפְנֵי מֶלֶךְ מַלְכֵי הַמְּלָכִים הַקָּדוֹשׁ בָּרוּךְ הוּא',
        transliteration: 'Vaanachnu korim umishtachavim umodim lifnei melech malchei hamelachim hakadosh baruch hu',
        french: 'Et nous, nous nous prosternons, nous nous inclinons et nous rendons grâce devant le Roi des rois des rois, le Saint béni soit-Il',
      },
    ],
  },
];

// ============================================================
// ARVIT / MA'ARIV - PRIÈRES DU SOIR
// ============================================================

const arvitSections: PrayerSection[] = [
  {
    id: 'barkhu-arvit',
    title: 'Barkhou',
    titleHe: 'בָּרְכוּ',
    subtitle: 'Appel à la prière',
    category: 'obligatoire',
    verses: [
      {
        id: 'barkhu-a1',
        hebrew: 'בָּרְכוּ אֶת יְהֹוָה הַמְבֹרָךְ',
        transliteration: 'Barchu et Adonai hamevoracha',
        french: 'Bénissez l\'Éternel le Béni',
        isChazan: true,
      },
      {
        id: 'barkhu-a2',
        hebrew: 'בָּרוּךְ יְהֹוָה הַמְבֹרָךְ לְעוֹלָם וָעֶד',
        transliteration: 'Baruch Adonai hamevoracha leolam vaed',
        french: 'Béni soit l\'Éternel le Béni pour toujours et à jamais',
      },
    ],
  },
  {
    id: 'maariv-aravim',
    title: 'Maariv Aravim',
    titleHe: 'מַעֲרִיב עֲרָבִים',
    subtitle: 'Bénédiction du soir',
    category: 'obligatoire',
    verses: [
      {
        id: 'maariv-1',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם אֲשֶׁר בִּדְבָרוֹ מַעֲרִיב עֲרָבִים',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam asher bidvaro maariv aravim',
        french: 'Béni sois-Tu, Éternel notre Dieu, Roi de l\'univers, qui par Sa parole fait venir les soirs',
      },
      {
        id: 'maariv-2',
        hebrew: 'בְּחָכְמָה פּוֹתֵחַ שְׁעָרִים וּבִתְבוּנָה מְשַׁנֶּה עִתִּים',
        transliteration: 'Bechochma poteach shearim uvitevuna meshane itim',
        french: 'Avec sagesse Il ouvre les portes et avec intelligence Il change les temps',
      },
      {
        id: 'maariv-3',
        hebrew: 'וּמַחֲלִיף אֶת הַזְּמַנִּים וּמְסַדֵּר אֶת הַכּוֹכָבִים בְּמִשְׁמְרוֹתֵיהֶם בָּרָקִיעַ כִּרְצוֹנוֹ',
        transliteration: 'Umachalif et hazmanim umsader et hakochavim bemishmeroteihem barakia kirtzono',
        french: 'Il alterne les saisons et dispose les étoiles dans leurs gardes dans le firmament selon Sa volonté',
      },
      {
        id: 'maariv-4',
        hebrew: 'בּוֹרֵא יוֹם וָלָיְלָה גּוֹלֵל אוֹר מִפְּנֵי חֹשֶׁךְ וְחֹשֶׁךְ מִפְּנֵי אוֹר',
        transliteration: 'Bore yom valayla golel or mipnei choshech vechoshech mipnei or',
        french: 'Il crée le jour et la nuit, Il fait rouler la lumière devant les ténèbres et les ténèbres devant la lumière',
      },
    ],
  },
  {
    id: 'shema-arvit',
    title: 'Shema - Arvit',
    titleHe: 'שְׁמַע - עַרְבִית',
    subtitle: 'Kériat Shema du soir',
    category: 'obligatoire',
    verses: [
      {
        id: 'shema-a',
        hebrew: 'שְׁמַע יִשְׂרָאֵל יְהֹוָה אֱלֹהֵינוּ יְהֹוָה אֶחָד',
        transliteration: 'Shema Yisrael Adonai Eloheinu Adonai Echad',
        french: 'Écoute Israël, l\'Éternel est notre Dieu, l\'Éternel est Un',
      },
      {
        id: 'baruch-shem-a',
        hebrew: 'בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד',
        transliteration: 'Baruch shem kevod malchuto leolam vaed',
        french: 'Béni soit le nom de la gloire de Son règne pour toujours et à jamais',
      },
      {
        id: 'veahavta-a',
        hebrew: 'וְאָהַבְתָּ אֵת יְהֹוָה אֱלֹהֶיךָ בְּכָל לְבָבְךָ וּבְכָל נַפְשְׁךָ וּבְכָל מְאֹדֶךָ',
        transliteration: 'Veahavta et Adonai Elohecha bechol levavcha uvechol nafshecha uvechol meodecha',
        french: 'Tu aimeras l\'Éternel ton Dieu de tout ton cœur, de toute ton âme et de toute ta force',
      },
    ],
  },
  {
    id: 'amida-arvit',
    title: 'Amida - Arvit',
    titleHe: 'עֲמִידָה - עַרְבִית',
    subtitle: 'Les 19 bénédictions',
    category: 'obligatoire',
    verses: [
      {
        id: 'amida-arvit-intro',
        hebrew: 'אֲדֹנָי שְׂפָתַי תִּפְתָּח וּפִי יַגִּיד תְּהִלָּתֶךָ',
        transliteration: 'Adonai sefatai tiftach ufi yagid tehilatecha',
        french: 'Seigneur, ouvre mes lèvres et ma bouche proclamera Ta louange',
        isAmida: true,
      },
      {
        id: 'avot-arvit',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ אֱלֹהֵי אַבְרָהָם אֱלֹהֵי יִצְחָק וֵאלֹהֵי יַעֲקֹב',
        transliteration: 'Baruch Ata Adonai Eloheinu vElohei avoteinu Elohei Avraham Elohei Yitzchak vElohei Yaakov',
        french: 'Béni sois-Tu, Éternel notre Dieu et Dieu de nos pères, Dieu d\'Abraham, Dieu d\'Isaac et Dieu de Jacob',
        isAmida: true,
      },
      {
        id: 'gevurot-arvit',
        hebrew: 'אַתָּה גִּבּוֹר לְעוֹלָם אֲדֹנָי מְחַיֵּה מֵתִים אַתָּה רַב לְהוֹשִׁיעַ',
        transliteration: 'Ata gibor leolam Adonai mechayeh metim ata rav lehoshia',
        french: 'Tu es puissant pour toujours, Seigneur, Tu fais revivre les morts, Tu es grand pour sauver',
        isAmida: true,
      },
      {
        id: 'hashkivenu',
        hebrew: 'הַשְׁכִּיבֵנוּ יְהֹוָה אֱלֹהֵינוּ לְשָׁלוֹם וְהַעֲמִידֵנוּ מַלְכֵּנוּ לְחַיִּים',
        transliteration: 'Hashkivenu Adonai Eloheinu leshalom vehamidenu malkenu lechayim',
        french: 'Fais-nous coucher, Éternel notre Dieu, en paix, et relève-nous, notre Roi, pour la vie',
      },
      {
        id: 'ufros-aleinu',
        hebrew: 'וּפְרוֹשׂ עָלֵינוּ סֻכַּת שְׁלוֹמֶךָ וְתַקְּנֵנוּ בְּעֵצָה טוֹבָה מִלְּפָנֶיךָ',
        transliteration: 'Ufros aleinu sukat shelomecha vetakenu beeza tova milfanecha',
        french: 'Étends sur nous la tente de Ta paix et redresse-nous par un bon conseil venant de Toi',
      },
    ],
  },
  {
    id: 'aleinu-arvit',
    title: 'Aleïnou',
    titleHe: 'עָלֵינוּ',
    subtitle: 'Prière de clôture',
    category: 'obligatoire',
    verses: [
      {
        id: 'aleinu-a1',
        hebrew: 'עָלֵינוּ לְשַׁבֵּחַ לַאֲדוֹן הַכֹּל לָתֵת גְּדֻלָּה לְיוֹצֵר בְּרֵאשִׁית',
        transliteration: 'Aleinu leshabeach laAdon hakol latet gedula leyotzer bereshit',
        french: 'Il nous incombe de louer le Maître de tout, de proclamer la grandeur du Créateur du commencement',
      },
      {
        id: 'aleinu-a2',
        hebrew: 'וַאֲנַחְנוּ כּוֹרְעִים וּמִשְׁתַּחֲוִים וּמוֹדִים לִפְנֵי מֶלֶךְ מַלְכֵי הַמְּלָכִים הַקָּדוֹשׁ בָּרוּךְ הוּא',
        transliteration: 'Vaanachnu korim umishtachavim umodim lifnei melech malchei hamelachim hakadosh baruch hu',
        french: 'Et nous, nous nous prosternons, nous nous inclinons et nous rendons grâce devant le Roi des rois des rois, le Saint béni soit-Il',
      },
    ],
  },
  {
    id: 'kaddish-arvit',
    title: 'Kaddish',
    titleHe: 'קַדִּישׁ',
    subtitle: 'Kaddish du soir',
    category: 'optionnel',
    verses: [
      {
        id: 'kaddish-a1',
        hebrew: 'יִתְגַּדַּל וְיִתְקַדַּשׁ שְׁמֵהּ רַבָּא',
        transliteration: 'Yitgadal veyitkadash shemeh raba',
        french: 'Que Son grand nom soit magnifié et sanctifié',
        isKaddish: true,
      },
      {
        id: 'kaddish-a2',
        hebrew: 'יְהֵא שְׁמֵהּ רַבָּא מְבָרַךְ לְעָלַם וּלְעָלְמֵי עָלְמַיָּא',
        transliteration: 'Yehe shemeh raba mevarach lealam ulalmei almaya',
        french: 'Que Son grand nom soit béni pour toujours et pour l\'éternité des éternités',
        isKaddish: true,
      },
    ],
  },
];

// ============================================================
// SHABBAT ARVIT - PRIÈRES DU VENDREDI SOIR
// ============================================================

const shabbatArvitSections: PrayerSection[] = [
  {
    id: 'kabbalat-shabbat',
    title: 'Kabbalat Shabbat',
    titleHe: 'קַבָּלַת שַׁבָּת',
    subtitle: 'Accueil du Shabbat',
    category: 'special',
    verses: [
      {
        id: 'lecha-dodi-1',
        hebrew: 'לְכָה דוֹדִי לִקְרַאת כַּלָּה פְּנֵי שַׁבָּת נְקַבְּלָה',
        transliteration: 'Lecha dodi likrat kala penei Shabbat nekabela',
        french: 'Viens, mon bien-aimé, à la rencontre de la fiancée, accueillons la face du Shabbat',
      },
      {
        id: 'lecha-dodi-2',
        hebrew: 'שָׁמוֹר וְזָכוֹר בְּדִבּוּר אֶחָד הִשְׁמִיעָנוּ אֵל הַמְיֻחָד',
        transliteration: 'Shamor vezachor bedibur echad hishmianu El hameyuchad',
        french: 'Garde et souviens-toi en une seule parole, le Dieu unique nous a fait entendre',
      },
      {
        id: 'lecha-dodi-3',
        hebrew: 'יְהֹוָה אֶחָד וּשְׁמוֹ אֶחָד לְשֵׁם וּלְתִפְאֶרֶת וְלִתְהִלָּה',
        transliteration: 'Adonai echad ushemo echad leshem uletiferet velitehila',
        french: 'L\'Éternel est Un et Son nom est Un, pour la renommée, la gloire et la louange',
      },
      {
        id: 'lecha-dodi-4',
        hebrew: 'לִקְרַאת שַׁבָּת לְכוּ וְנֵלְכָה כִּי הִיא מְקוֹר הַבְּרָכָה',
        transliteration: 'Likrat Shabbat lechu venelcha ki hi mekor haberacha',
        french: 'Allons à la rencontre du Shabbat, car il est la source de la bénédiction',
      },
      {
        id: 'lecha-dodi-5',
        hebrew: 'מֵרֹאשׁ מִקֶּדֶם נְסוּכָה סוֹף מַעֲשֶׂה בְּמַחֲשָׁבָה תְּחִלָּה',
        transliteration: 'Merosh mikedem nesuchah sof maase bemachshava techila',
        french: 'Depuis le début, depuis l\'antiquité, il fut établi, dernier dans l\'acte mais premier dans la pensée',
      },
      {
        id: 'lecha-dodi-refrain',
        hebrew: 'לְכָה דוֹדִי לִקְרַאת כַּלָּה פְּנֵי שַׁבָּת נְקַבְּלָה',
        transliteration: 'Lecha dodi likrat kala penei Shabbat nekabela',
        french: 'Viens, mon bien-aimé, à la rencontre de la fiancée, accueillons la face du Shabbat',
      },
      {
        id: 'boi-veshalom',
        hebrew: 'בּוֹאִי בְשָׁלוֹם עֲטֶרֶת בַּעְלָהּ גַּם בְּשִׂמְחָה וּבְצָהֳלָה',
        transliteration: 'Boi veshalom ateret baala gam besimcha uvetzahala',
        french: 'Entre en paix, couronne de son époux, aussi dans la joie et l\'allégresse',
      },
      {
        id: 'boi-kala',
        hebrew: 'תּוֹךְ אֱמוּנֵי עַם סְגֻלָּה בּוֹאִי כַלָּה בּוֹאִי כַלָּה',
        transliteration: 'Toch emunei am segula boi kala boi kala',
        french: 'Au milieu des fidèles du peuple élu, entre, ô fiancée, entre, ô fiancée',
      },
    ],
  },
  {
    id: 'maariv-shabbat',
    title: 'Maariv de Shabbat',
    titleHe: 'מַעֲרִיב שַׁבָּת',
    subtitle: 'Prières du soir de Shabbat',
    category: 'obligatoire',
    verses: [
      {
        id: 'vayechulu',
        hebrew: 'וַיְכֻלּוּ הַשָּׁמַיִם וְהָאָרֶץ וְכָל צְבָאָם',
        transliteration: 'Vayechulu hashamayim veharetz vechol tzevaam',
        french: 'Les cieux et la terre et toute leur armée furent achevés',
      },
      {
        id: 'vayechal',
        hebrew: 'וַיְכַל אֱלֹהִים בַּיּוֹם הַשְּׁבִיעִי מְלַאכְתּוֹ אֲשֶׁר עָשָׂה',
        transliteration: 'Vayechal Elohim bayom hashevii melachto asher asa',
        french: 'Dieu acheva au septième jour Son œuvre qu\'Il avait faite',
      },
      {
        id: 'vayishbot',
        hebrew: 'וַיִּשְׁבֹּת בַּיּוֹם הַשְּׁבִיעִי מִכָּל מְלַאכְתּוֹ אֲשֶׁר עָשָׂה',
        transliteration: 'Vayishbot bayom hashevii mikol melachto asher asa',
        french: 'Et Il se reposa le septième jour de toute Son œuvre qu\'Il avait faite',
      },
      {
        id: 'vayevarech',
        hebrew: 'וַיְבָרֶךְ אֱלֹהִים אֶת יוֹם הַשְּׁבִיעִי וַיְקַדֵּשׁ אֹתוֹ',
        transliteration: 'Vayevarech Elohim et yom hashevii vayekadesh oto',
        french: 'Dieu bénit le septième jour et le sanctifia',
      },
    ],
  },
  {
    id: 'kiddush-shabbat',
    title: 'Kiddoush de Shabbat',
    titleHe: 'קִדּוּשׁ שַׁבָּת',
    subtitle: 'Sanctification du Shabbat',
    category: 'special',
    verses: [
      {
        id: 'kiddush-1',
        hebrew: 'סַבְרִי מָרָנָן וְרַבָּנָן וְרַבּוֹתַי',
        transliteration: 'Savri maranan verabanan verabotai',
        french: 'Avec votre permission, messieurs et maîtres',
      },
      {
        id: 'kiddush-2',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הַגָּפֶן',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam bore peri hagafen',
        french: 'Béni sois-Tu, Éternel notre Dieu, Roi de l\'univers, qui crées le fruit de la vigne',
      },
      {
        id: 'kiddush-3',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְרָצָה בָנוּ',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam asher kideshanu bemitzvotav veratzah vanu',
        french: 'Béni sois-Tu... qui nous as sanctifiés par Ses commandements et a voulu de nous',
      },
      {
        id: 'kiddush-4',
        hebrew: 'וְשַׁבַּת קָדְשׁוֹ בְּאַהֲבָה וּבְרָצוֹן הִנְחִילָנוּ זִכָּרוֹן לְמַעֲשֵׂה בְרֵאשִׁית',
        transliteration: 'Veshabbat kodsho beahava uvratzon hinchilanu zikaron lemaaseh vereshit',
        french: 'Et Son saint Shabbat avec amour et bienveillance Il nous a légué, souvenir de l\'œuvre de la Création',
      },
      {
        id: 'kiddush-5',
        hebrew: 'כִּי הוּא יוֹם תְּחִלָּה לְמִקְרָאֵי קֹדֶשׁ זֵכֶר לִיצִיאַת מִצְרָיִם',
        transliteration: 'Ki hu yom techila lemikraei kodesh zecher litziat Mitzrayim',
        french: 'Car il est le premier des jours saints, souvenir de la sortie d\'Égypte',
      },
      {
        id: 'kiddush-6',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה מְקַדֵּשׁ הַשַּׁבָּת',
        transliteration: 'Baruch Ata Adonai mekadesh haShabbat',
        french: 'Béni sois-Tu, Éternel, qui sanctifies le Shabbat',
      },
    ],
  },
];

// ============================================================
// SHABBAT SHACHARIT
// ============================================================

const shabbatShacharitSections: PrayerSection[] = [
  {
    id: 'shacharit-shabbat-intro',
    title: 'Shacharit de Shabbat',
    titleHe: 'שַׁחֲרִית שַׁבָּת',
    subtitle: 'Prières du matin de Shabbat',
    category: 'special',
    verses: [
      {
        id: 'el-adon',
        hebrew: 'אֵל אָדוֹן עַל כָּל הַמַּעֲשִׂים בָּרוּךְ וּמְבֹרָךְ בְּפִי כָּל נְשָׁמָה',
        transliteration: 'El adon al kol hamaasin baruch umevoracha befi kol neshama',
        french: 'Dieu, Maître de toutes les œuvres, béni et loué par toute âme',
      },
      {
        id: 'el-adon-2',
        hebrew: 'גָּדְלוֹ וְטוּבוֹ מָלֵא עוֹלָם דַּעַת וּתְבוּנָה סוֹבְבִים אוֹתוֹ',
        transliteration: 'Gadlo vetuvo male olam daat utevuna sovevim oto',
        french: 'Sa grandeur et Sa bonté remplissent le monde, connaissance et intelligence L\'entourent',
      },
    ],
  },
  {
    id: 'kedusha-shabbat',
    title: 'Kedusha de Shabbat',
    titleHe: 'קְדֻשַּׁת שַׁבָּת',
    subtitle: 'Sanctification du Shabbat',
    category: 'special',
    verses: [
      {
        id: 'nishmat',
        hebrew: 'נִשְׁמַת כָּל חַי תְּבָרֵךְ אֶת שִׁמְךָ יְהֹוָה אֱלֹהֵינוּ',
        transliteration: 'Nishmat kol chai tevarech et shimcha Adonai Eloheinu',
        french: 'L\'âme de tout être vivant bénira Ton nom, Éternel notre Dieu',
      },
      {
        id: 'nishmat-2',
        hebrew: 'וְרוּחַ כָּל בָּשָׂר תְּפָאֵר וּתְרוֹמֵם זִכְרְךָ מַלְכֵּנוּ תָּמִיד',
        transliteration: 'Veruach kol basar tifaer uteromem zichrecha malkenu tamid',
        french: 'Et l\'esprit de toute chair glorifiera et exaltera Ton souvenir, notre Roi, toujours',
      },
      {
        id: 'nishmat-3',
        hebrew: 'מִן הָעוֹלָם וְעַד הָעוֹלָם אַתָּה אֵל',
        transliteration: 'Min haolam vead haolam ata El',
        french: 'De l\'éternité à l\'éternité Tu es Dieu',
      },
      {
        id: 'kedusha-shabbat-1',
        hebrew: 'נְקַדֵּשׁ אֶת שִׁמְךָ בָּעוֹלָם כְּשֵׁם שֶׁמַּקְדִּישִׁים אוֹתוֹ בִּשְׁמֵי מָרוֹם',
        transliteration: 'Nekadesh et shimcha baolam keshem shemakdishim oto bishmei marom',
        french: 'Nous sanctifierons Ton nom dans le monde comme on Le sanctifie dans les cieux d\'en haut',
      },
      {
        id: 'kadosh-kadosh',
        hebrew: 'קָדוֹשׁ קָדוֹשׁ קָדוֹשׁ יְהֹוָה צְבָאוֹת מְלֹא כָל הָאָרֶץ כְּבוֹדוֹ',
        transliteration: 'Kadosh kadosh kadosh Adonai Tzvaot melo chol haaretz kevodo',
        french: 'Saint, saint, saint est l\'Éternel des armées, toute la terre est pleine de Sa gloire',
      },
      {
        id: 'baruch-kevod',
        hebrew: 'בָּרוּךְ כְּבוֹד יְהֹוָה מִמְּקוֹמוֹ',
        transliteration: 'Baruch kevod Adonai mimekomo',
        french: 'Bénie soit la gloire de l\'Éternel depuis Son lieu',
      },
      {
        id: 'yimloch',
        hebrew: 'יִמְלֹךְ יְהֹוָה לְעֹלָם אֱלֹהַיִךְ צִיּוֹן לְדֹר וָדֹר הַלְלוּיָהּ',
        transliteration: 'Yimloch Adonai leolam Elohayich Tzion ledor vador halleluya',
        french: 'L\'Éternel régnera pour toujours, ton Dieu, ô Sion, de génération en génération, Hallelouya',
      },
    ],
  },
  {
    id: 'musaf-shabbat',
    title: 'Moussaf de Shabbat',
    titleHe: 'מוּסַף שַׁבָּת',
    subtitle: 'Prière supplémentaire',
    category: 'special',
    verses: [
      {
        id: 'tikanta-shabbat',
        hebrew: 'תִּכַּנְתָּ שַׁבָּת רָצִיתָ קָרְבְּנוֹתֶיהָ צִוִּיתָ פֵּרוּשֶׁיהָ עִם סִדּוּרֵי נְסָכֶיהָ',
        transliteration: 'Tikanta Shabbat ratzita korbenoteha tzivita perusheha im siddurei nesacheha',
        french: 'Tu as établi le Shabbat, Tu as agréé ses offrandes, Tu as ordonné ses explications avec l\'ordre de ses libations',
      },
      {
        id: 'yismchu',
        hebrew: 'יִשְׂמְחוּ בְמַלְכוּתְךָ שׁוֹמְרֵי שַׁבָּת וְקוֹרְאֵי עֹנֶג',
        transliteration: 'Yismechu vemalchutecha shomrei Shabbat vekorei oneg',
        french: 'Ils se réjouiront de Ton règne, ceux qui observent le Shabbat et l\'appellent délice',
      },
      {
        id: 'am-mekadshei',
        hebrew: 'עַם מְקַדְּשֵׁי שְׁבִיעִי כֻּלָּם יִשְׂבְּעוּ וְיִתְעַנְּגוּ מִטּוּבֶךָ',
        transliteration: 'Am mekadshei shevii kulam yisbu veyitangu mituvecha',
        french: 'Le peuple qui sanctifie le septième jour, tous seront rassasiés et se délecteront de Ta bonté',
      },
    ],
  },
];

// ============================================================
// SHABBAT MINCHA
// ============================================================

const shabbatMinhaSections: PrayerSection[] = [
  {
    id: 'ashrei-shabbat-mincha',
    title: 'Ashrei',
    titleHe: 'אַשְׁרֵי',
    subtitle: 'Psaume 145',
    category: 'obligatoire',
    verses: [
      {
        id: 'ashrei-sm1',
        hebrew: 'אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ עוֹד יְהַלְלוּךָ סֶּלָה',
        transliteration: 'Ashrei yoshvei vetecha od yehaleluka sela',
        french: 'Heureux ceux qui habitent Ta maison, ils Te loueront encore, Sela',
      },
      {
        id: 'ashrei-sm2',
        hebrew: 'אַשְׁרֵי הָעָם שֶׁכָּכָה לּוֹ אַשְׁרֵי הָעָם שֶׁיְהֹוָה אֱלֹהָיו',
        transliteration: 'Ashrei haam shekakha lo ashrei haam sheAdonai Elohav',
        french: 'Heureux le peuple à qui il en est ainsi, heureux le peuple dont l\'Éternel est le Dieu',
      },
    ],
  },
  {
    id: 'havdala',
    title: 'Havdala',
    titleHe: 'הַבְדָּלָה',
    subtitle: 'Séparation du Shabbat',
    category: 'special',
    verses: [
      {
        id: 'havdala-1',
        hebrew: 'הִנֵּה אֵל יְשׁוּעָתִי אֶבְטַח וְלֹא אֶפְחָד',
        transliteration: 'Hineh El yeshuati evtach velo efchad',
        french: 'Voici, Dieu est mon salut, je ferai confiance et ne craindrai pas',
      },
      {
        id: 'havdala-2',
        hebrew: 'כִּי עָזִּי וְזִמְרָת יָהּ יְהֹוָה וַיְהִי לִי לִישׁוּעָה',
        transliteration: 'Ki ozi vezimrat Yah Adonai vayehi li lishuah',
        french: 'Car l\'Éternel est ma force et ma louange, Il est devenu mon salut',
      },
      {
        id: 'havdala-3',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הַגָּפֶן',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam bore peri hagafen',
        french: 'Béni sois-Tu... qui crées le fruit de la vigne',
      },
      {
        id: 'havdala-4',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא מִינֵי בְשָׂמִים',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam bore minei vesamim',
        french: 'Béni sois-Tu... qui crées les espèces d\'aromates',
      },
      {
        id: 'havdala-5',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא מְאוֹרֵי הָאֵשׁ',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam bore meorei haesh',
        french: 'Béni sois-Tu... qui crées les lumières du feu',
      },
      {
        id: 'havdala-6',
        hebrew: 'בָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחֹל',
        transliteration: 'Baruch Ata Adonai Eloheinu Melech haolam hamavdil bein kodesh lechol',
        french: 'Béni sois-Tu... qui distingues entre le sacré et le profane',
      },
      {
        id: 'havdala-7',
        hebrew: 'בֵּין אוֹר לְחֹשֶׁךְ בֵּין יִשְׂרָאֵל לָעַמִּים בֵּין יוֹם הַשְּׁבִיעִי לְשֵׁשֶׁת יְמֵי הַמַּעֲשֶׂה',
        transliteration: 'Bein or lechoshech bein Yisrael laamim bein yom hashevii lesheshet yemei hamaaseh',
        french: 'Entre la lumière et les ténèbres, entre Israël et les nations, entre le septième jour et les six jours de travail',
      },
    ],
  },
];

// ============================================================
// STRUCTURE COMPLÈTE DU SIDDUR
// ============================================================

export const SIDDUR_DATA: SiddurService[] = [
  {
    id: 'shacharit',
    title: 'Shacharit',
    titleHe: 'שַׁחֲרִית',
    icon: '🌅',
    color: '#F59E0B',
    sources: [
      {
        label: 'Open Siddur - Weekday Siddur',
        url: 'https://archive.org/details/SiddurTehillatHaShemYedaberPiWeekdaySiddur?view=theater#page/n0/mode/2up',
      },
    ],
    sections: shacharitSections,
  },
  {
    id: 'mincha',
    title: 'Mincha',
    titleHe: 'מִנְחָה',
    icon: '☀️',
    color: '#3B82F6',
    sources: [
      {
        label: 'Open Siddur - Weekday Siddur',
        url: 'https://archive.org/details/SiddurTehillatHaShemYedaberPiWeekdaySiddur?view=theater#page/n0/mode/2up',
      },
    ],
    sections: minhaSections,
  },
  {
    id: 'arvit',
    title: 'Arvit',
    titleHe: 'עַרְבִית',
    icon: '🌙',
    color: '#8B5CF6',
    sources: [
      {
        label: 'Open Siddur - Weekday Siddur',
        url: 'https://archive.org/details/SiddurTehillatHaShemYedaberPiWeekdaySiddur?view=theater#page/n0/mode/2up',
      },
    ],
    sections: arvitSections,
  },
  {
    id: 'shabbat_arvit',
    title: 'Shabbat Arvit',
    titleHe: 'שַׁבָּת עַרְבִית',
    icon: '✡️',
    color: '#10B981',
    sections: shabbatArvitSections,
  },
  {
    id: 'shabbat_shacharit',
    title: 'Shabbat Shacharit',
    titleHe: 'שַׁבָּת שַׁחֲרִית',
    icon: '⭐',
    color: '#F59E0B',
    sections: shabbatShacharitSections,
  },
  {
    id: 'shabbat_minha',
    title: 'Shabbat Mincha',
    titleHe: 'שַׁבָּת מִנְחָה',
    icon: '🕯️',
    color: '#EC4899',
    sections: shabbatMinhaSections,
  },
];

export default SIDDUR_DATA;
