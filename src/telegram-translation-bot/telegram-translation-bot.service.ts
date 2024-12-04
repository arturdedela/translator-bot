import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { TranslatorService } from './translator/translator.service';

const SUPPORTED_LANGUAGES = [
  '🇬🇧 English',
  '🇨🇳 Chinese',
  '🇪🇸 Spanish',
  '🇷🇺 Russian',
  '🇷🇸 Serbian',
  '🇫🇷 French',
  '🇮🇳 Hindi',
  '🇸🇦 Arabic',
  '🇧🇩 Bengali',
  '🇵🇹 Portuguese',
  '🇵🇰 Urdu',
  '🇯🇵 Japanese',
  '🇰🇷 Korean',
  '🇹🇷 Turkish',
  '🇻🇳 Vietnamese',
  '🇩🇪 German',
  '🇮🇩 Indonesian',
  '🇮🇹 Italian',
  '🇹🇭 Thai',
  '🇳🇱 Dutch',
  '🇵🇱 Polish',
  '🇸🇪 Swedish',
  '🇺🇦 Ukrainian',
  '🇭🇺 Hungarian',
  '🇨🇿 Czech',
  '🇬🇷 Greek',
  '🇲🇾 Malay',
  '🇷🇴 Romanian',
  '🇵🇭 Tagalog/Filipino',
  '🇩🇰 Danish',
  '🇳🇴 Norwegian',
  '🇫🇮 Finnish',
  '🇭🇷 Croatian',
  '🇸🇰 Slovak',
  '🇸🇮 Slovenian',
  '🇧🇬 Bulgarian',
];

//

@Injectable()
export class TelegramTranslationBotService implements OnModuleInit {
  private readonly bot: Bot;
  private readonly logger = new Logger(TelegramTranslationBotService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly translator: TranslatorService,
  ) {
    const apiToken = configService.get<string | undefined>('BOT_API_TOKEN');

    this.bot = new Bot(apiToken);
  }

  onModuleInit() {
    this.initBot();
  }

  initBot() {
    this.bot.start().catch((reason) => console.error('Bot failed: ', reason));

    this.bot.on('message', (ctx, next) => {
      this.logger.debug('Received message: ', ctx.message);
      // console.log(ctx.message);
      // console.log('________________________________________');
      next();
    });

    this.bot.on('message').filter(
      async (ctx) => SUPPORTED_LANGUAGES.includes(ctx.message.text),
      (ctx) => {
        ctx.reply(`Added ${ctx.message.text} language`);
      },
    );

    this.bot.command('start', async (ctx) => {
      const keyboard = [];
      const columns = 2;
      for (let row = 0; row * columns < SUPPORTED_LANGUAGES.length; row += 1) {
        const start = row * columns;
        const end = start + columns;
        keyboard[row] = SUPPORTED_LANGUAGES.slice(start, end).map((lang) => ({
          text: lang,
        }));
      }

      ctx.reply('Choose desired languages', {
        reply_markup: {
          keyboard,
          resize_keyboard: true,
        },
      });

      this.logger.debug(ctx.message);
    });

    this.bot.command('t', async (ctx) => {
      const textForTranslation = ctx.match;

      this.logger.log('Translation request. Text: ', textForTranslation);

      ctx.replyWithChatAction('typing');

      const HARDCODED_TARGET_LANGUAGES = ['Russian', 'English', 'Serbian'];

      try {
        // const translations = await this.translator.translate(
        //   textForTranslation,
        //   HARDCODED_TARGET_LANGUAGES,
        // );
        const translations = {
          Russian: 'Привет! Как дела? Хочешь пойти выпить пиво?',
          Serbian: 'Zdravo! Šta ima? Da li želiš da idemo na pivo?',
        };

        const formattedTranslations = Object.entries(translations)
          .map(
            ([language, translation]) => `<b>${language}:</b>\n${translation}`,
          )
          .join('\n\n');

        ctx.reply(formattedTranslations, {
          parse_mode: 'HTML',
          reply_parameters: { message_id: ctx.message.message_id },
        });
      } catch (error) {
        this.logger.error('Translation failed ', error);
        ctx.reply('Sorry. There was error translating your message.');
      }
    });
  }
}
