import { Injectable } from '@nestjs/common';
import { GoogleTranslate } from './google-translate/google-translate';
import { GptTranslate } from './gpt-translate/gpt-translate';
import type { Translator } from './translator.interface';
import { TranslatorName } from '@prisma/client';

@Injectable()
export class Translators {
  constructor(
    private googleTranslator: GoogleTranslate,
    private gptTranslator: GptTranslate,
  ) {}

  chooseTranslator(apiType: TranslatorName): Translator {
    switch (apiType) {
      case TranslatorName.GOOGLE:
        return this.googleTranslator;
      case TranslatorName.GPT:
        return this.gptTranslator;
    }
  }

  getAvailable() {
    return [TranslatorName.GOOGLE, TranslatorName.GPT];
  }

  isValidTranslator(translator: string): translator is TranslatorName {
    return this.getAvailable().includes(translator as TranslatorName);
  }
}
