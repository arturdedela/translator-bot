import { Injectable } from '@nestjs/common';

const TITLE_TO_CODE = {
  '🇬🇧 English': 'en',
  '🇨🇳 Chinese': 'zh',
  '🇪🇸 Spanish': 'es',
  '🇷🇺 Russian': 'ru',
  '🇷🇸 Serbian': 'sr',
  '🇫🇷 French': 'fr',
  '🇮🇳 Hindi': 'hi',
  '🇸🇦 Arabic': 'ar',
  '🇧🇩 Bengali': 'bn',
  '🇵🇹 Portuguese': 'pt',
  '🇵🇰 Urdu': 'ur',
  '🇯🇵 Japanese': 'ja',
  '🇰🇷 Korean': 'ko',
  '🇹🇷 Turkish': 'tr',
  '🇻🇳 Vietnamese': 'vi',
  '🇩🇪 German': 'de',
  '🇮🇩 Indonesian': 'id',
  '🇮🇹 Italian': 'it',
  '🇹🇭 Thai': 'th',
  '🇳🇱 Dutch': 'nl',
  '🇵🇱 Polish': 'pl',
  '🇸🇪 Swedish': 'sv',
  '🇺🇦 Ukrainian': 'uk',
  '🇭🇺 Hungarian': 'hu',
  '🇨🇿 Czech': 'cs',
  '🇬🇷 Greek': 'el',
  '🇲🇾 Malay': 'ms',
  '🇷🇴 Romanian': 'ro',
  '🇵🇭 Tagalog/Filipino': 'tl',
  '🇩🇰 Danish': 'da',
  '🇳🇴 Norwegian': 'no',
  '🇫🇮 Finnish': 'fi',
  '🇭🇷 Croatian': 'hr',
  '🇸🇰 Slovak': 'sk',
  '🇸🇮 Slovenian': 'sl',
  '🇧🇬 Bulgarian': 'bg',
};

const CODE_TO_TITLE = {
  en: '🇬🇧 English',
  zh: '🇨🇳 Chinese',
  es: '🇪🇸 Spanish',
  ru: '🇷🇺 Russian',
  sr: '🇷🇸 Serbian',
  fr: '🇫🇷 French',
  hi: '🇮🇳 Hindi',
  ar: '🇸🇦 Arabic',
  bn: '🇧🇩 Bengali',
  pt: '🇵🇹 Portuguese',
  ur: '🇵🇰 Urdu',
  ja: '🇯🇵 Japanese',
  ko: '🇰🇷 Korean',
  tr: '🇹🇷 Turkish',
  vi: '🇻🇳 Vietnamese',
  de: '🇩🇪 German',
  id: '🇮🇩 Indonesian',
  it: '🇮🇹 Italian',
  th: '🇹🇭 Thai',
  nl: '🇳🇱 Dutch',
  pl: '🇵🇱 Polish',
  sv: '🇸🇪 Swedish',
  uk: '🇺🇦 Ukrainian',
  hu: '🇭🇺 Hungarian',
  cs: '🇨🇿 Czech',
  el: '🇬🇷 Greek',
  ms: '🇲🇾 Malay',
  ro: '🇷🇴 Romanian',
  tl: '🇵🇭 Tagalog/Filipino',
  da: '🇩🇰 Danish',
  no: '🇳🇴 Norwegian',
  fi: '🇫🇮 Finnish',
  hr: '🇭🇷 Croatian',
  sk: '🇸🇰 Slovak',
  sl: '🇸🇮 Slovenian',
  bg: '🇧🇬 Bulgarian',
};

// const removeLanguageFlag = (language: string) => language.split(' ')[1];

const SUPPORTED_LANGUAGES = [
  'en',
  'zh',
  'es',
  'ru',
  'sr',
  'fr',
  'hi',
  'ar',
  'bn',
  'pt',
  'ur',
  'ja',
  'ko',
  'tr',
  'vi',
  'de',
  'id',
  'it',
  'th',
  'nl',
  'pl',
  'sv',
  'uk',
  'hu',
  'cs',
  'el',
  'ms',
  'ro',
  'tl',
  'da',
  'no',
  'fi',
  'hr',
  'sk',
  'sl',
  'bg',
];

// const SUPPORTED_LANGUAGES = [
//   '🇬🇧 English',
//   '🇨🇳 Chinese',
//   '🇪🇸 Spanish',
//   '🇷🇺 Russian',
//   '🇷🇸 Serbian',
//   '🇫🇷 French',
//   '🇮🇳 Hindi',
//   '🇸🇦 Arabic',
//   '🇧🇩 Bengali',
//   '🇵🇹 Portuguese',
//   '🇵🇰 Urdu',
//   '🇯🇵 Japanese',
//   '🇰🇷 Korean',
//   '🇹🇷 Turkish',
//   '🇻🇳 Vietnamese',
//   '🇩🇪 German',
//   '🇮🇩 Indonesian',
//   '🇮🇹 Italian',
//   '🇹🇭 Thai',
//   '🇳🇱 Dutch',
//   '🇵🇱 Polish',
//   '🇸🇪 Swedish',
//   '🇺🇦 Ukrainian',
//   '🇭🇺 Hungarian',
//   '🇨🇿 Czech',
//   '🇬🇷 Greek',
//   '🇲🇾 Malay',
//   '🇷🇴 Romanian',
//   '🇵🇭 Tagalog/Filipino',
//   '🇩🇰 Danish',
//   '🇳🇴 Norwegian',
//   '🇫🇮 Finnish',
//   '🇭🇷 Croatian',
//   '🇸🇰 Slovak',
//   '🇸🇮 Slovenian',
//   '🇧🇬 Bulgarian',
// ];

@Injectable()
export class LanguagesService {
  private readonly languageCodes = Object.freeze(SUPPORTED_LANGUAGES);

  getAllCodes() {
    return this.languageCodes;
  }

  getAllTitles() {
    return this.languageCodes.map((code) => CODE_TO_TITLE[code]);
  }

  getTitle(languageCode: string) {
    return CODE_TO_TITLE[languageCode];
  }

  getCode(languageTitle: string) {
    return TITLE_TO_CODE[languageTitle];
  }
}
