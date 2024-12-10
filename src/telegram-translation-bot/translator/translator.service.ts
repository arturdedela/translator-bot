import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

/**
 * Prompts:
 * 1. You are a helpful and precise translator between English and Russian language. Any message that you receive just translating it.
 * 2. You are a helpful and precise translator between all languages. Any message that you receive just translating it. Target languages are: ${langs_arr}
 */

const SYSTEM_PROMPT =
  'You are precise translator.' +
  'Any message from user must be translated to target languages.' +
  'Try to make answer shorter when possible without losing the meaning.' +
  'Answer should be a clean minified JSON where key is one of target languages code and value is traslation to this language.';

@Injectable()
export class TranslatorService {
  private readonly logger = new Logger(TranslatorService.name);
  private readonly openai = new OpenAI();

  /** Translate between 2 specified languages */
  async translateBetween(text: string, [lang1, lang2]: [string, string]) {}

  private logTokensSpent() {}

  async translate(
    text: string,
    targetLangs: string[],
  ): Promise<Record<string, string>> {
    const gptResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        // {
        //   role: 'assistant',
        //   content: [{ type: 'text', text: '{}' }],
        // },
        {
          role: 'system',
          content: `Target languages: ${targetLangs.sort()}`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    this.logger.debug('GPT response: ', gptResponse);

    this.logger.log('Tokens spent: ', {
      prompt_tokens: gptResponse.usage.prompt_tokens,
      completition_tokens: gptResponse.usage.completion_tokens,
    });

    const translationsJson: string = gptResponse.choices[0].message.content;

    try {
      // Should parsed JSON be validated?
      const translationsRecord: Record<string, string> =
        JSON.parse(translationsJson);

      this.logger.log('Received translations from GPT: ', translationsRecord);

      return translationsRecord;
    } catch {
      this.logger.error('Error parsing GPT generated JSON: ', translationsJson);
    }
  }
}
