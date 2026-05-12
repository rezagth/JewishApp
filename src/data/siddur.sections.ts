/**
 * Contenu statique des sections du Siddur
 * Utilisé comme fallback quand Sefaria n'est pas disponible
 */

export const SECTION_CONTENT: Record<string, { he: string; en: string }> = {
  'birkhot_hashachar': {
    he: 'בִּרְכוֹת הַשַּׁחַר\n\nמוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם, שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה. רַבָּה אֱמוּנָתֶךָ.\n\nבָּרוּךְ אַתָּה יְהֹוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְווֹתָיו וְצִוָּנוּ עַל נְטִילַת יָדַיִם.',
    en: 'Morning Blessings\n\nI am grateful before You, living and eternal King, for you have returned my soul to me with compassion. Great is Your faithfulness.\n\nBlessed are You, Lord our God, Ruler of the universe, who has sanctified us with commandments, and commanded us regarding the washing of hands.',
  },
  'pesuke_dezimra': {
    he: 'פְּסוּקֵי דְזִמְרָה\n\nהַלְלוּ אֶת יְהֹוָה מִן הַשָּׁמַיִם. הַלְלוּ אוֹתוֹ בִּמְרוֹמִים.\n\nבָּרוּךְ יְהֹוָה לְעוֹלָם אָמֵן וְאָמֵן.',
    en: 'Verses of Praise\n\nPraise the Lord from the heavens. Praise Him in the heights.\n\nBlessed is the Lord forever, Amen and Amen.',
  },
  'kriat_shema': {
    he: 'קְרִיאַת שְׁמַע\n\nשְׁמַע יִשְׂרָאֵל יְהֹוָה אֱלֹהֵינוּ יְהֹוָה אֶחָד.\n\nבָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד.',
    en: 'Recitation of Shema\n\nHear O Israel, the Lord is our God, the Lord is One.\n\nBlessed be the name of His glorious kingdom forever and ever.',
  },
  'amida': {
    he: 'עַמִּידָה\n\nאֲדֹנָי שְׂפָתַי תִּפְתָּח וּפִי יַגִּיד תְּהִלָּתֶךָ.',
    en: 'Standing Prayer\n\nMy Lord, open my lips, that my mouth may declare Your praise.',
  },
  'tahanoun': {
    he: 'תַּחֲנוּן\n\nאַל תִּשְׁלַח מִמְּךָ וּמִרוּחֲךָ הַקְּדוֹשָׁה אַל תִּקְחֵנִי מִלְּפָנֶיךָ.',
    en: 'Supplication\n\nDo not cast me away from Your presence, do not take Your holy spirit from me.',
  },
  'alenu': {
    he: 'עָלֵינוּ\n\nעָלֵינוּ לְשַׁבֵּחַ לַאֲדוֹן הַכֹּל, לָתֵת גְּדוּלָּה לְיוֹצֵר בְּרֵשִׁית.',
    en: 'Upon Us\n\nUpon us to praise the Lord of all, to ascribe greatness to the Creator of all creation.',
  },
  'ashrei': {
    he: 'אַשְׁרֵי\n\nאַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ, עוֹד יְהַלְלוּךָ סֶלָה.',
    en: 'Happy\n\nHappy are those who dwell in Your house; they ever praise You. Selah.',
  },
  'barchu': {
    he: 'בָּרְכוּ\n\nבָּרְכוּ אֶת יְהֹוָה הַמְּבוֹרָךְ.\nבָּרוּךְ יְהֹוָה הַמְּבוֹרָךְ לְעוֹלָם וָעֶד.',
    en: 'Bless\n\nBless the Lord, the blessed One.\nBlessed is the Lord, the blessed One, forever and ever.',
  },
  'al_hanissim_hanukkah': {
    he: 'עַל הַנִּסִּים\n\nעַל הַנִּסִּים וְעַל הַפּוּרְקָן וְעַל הַגְּבוּרוֹת וְעַל הַתְּשׁוּעוֹת וְעַל הַנִּפְלָאוֹת שֶׁעָשִׂיתָ לַאֲבוֹתֵינוּ בַּיָּמִים הָהֵם בַּזְּמַן הַזֶּה.',
    en: 'For the Miracles\n\nFor the miracles, the deliverance, the mighty deeds and the triumphs and the wonders which You performed for our ancestors in those days, at this season.',
  },
  'yaale_veyavo': {
    he: 'יַעֲלֶה וְיָבוֹא\n\nיַעֲלֶה וְיָבוֹא וְיֵרָאֶה וְיֵרָצֶה וְיִשָּׁמַע וְיִפָּקֵד וְיִזָּכֵר זִכְרוֹנֵנוּ וּפִקְדוֹנֵנוּ וְזִכְרוֹן אֲבוֹתֵינוּ.',
    en: 'May It Ascend\n\nMay it ascend and come, be seen and be accepted, heard and reckoned, and remembered - our remembrance and our petition, and the remembrance of our ancestors.',
  },
  'veten_tal_umatar': {
    he: 'וְתֵן טַל וּמָטָר\n\nוְתֵן טַל וּמָטָר לִבְרָכַת הָאָרֶץ, וּשְׂבַע מִן הַמָּזוֹן וּמִן הַטּוּב וּבָרֵךְ שְׁנָתֵנוּ כַּשָּׁנִים הַטּוֹבוֹת.',
    en: 'Grant Dew and Rain\n\nGrant dew and rain for a blessing upon the land, and satisfy us from its goodness, and bless our year like the good years.',
  },
  'sefirat_haomer': {
    he: 'סְפִירַת הָעוֹמֶר\n\nהִנְנִי מוּכָן וּמְזוּמָּן לְקַיֵּם מִצְוַת עֲשֵׂה שֶׁל סְפִירַת הָעוֹמֶר.',
    en: 'Counting of the Omer\n\nBehold, I am ready and prepared to fulfill the positive commandment of counting the Omer.',
  },
};
