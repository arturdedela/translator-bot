import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from '@google-cloud/translate';
import type { Translator } from '../translator.interface';

@Injectable()
export class GoogleTranslate implements Translator {
  private readonly googleTranslate: typeof v2.Translate.prototype;

  constructor(readonly configService: ConfigService) {
    const googleApiKey = configService.get('GOOGLE_TRANSLATE_API_KEY');
    const googleProjectId = configService.get('GOOGLE_PROJECT_ID');

    this.googleTranslate = new v2.Translate({
      projectId: googleProjectId,
      key: googleApiKey,
    });
  }
  async translate(text: string, targetLang: string): Promise<string> {
    const [translation] = await this.googleTranslate.translate(text, {
      to: targetLang,
    });

    return translation;
  }
}
