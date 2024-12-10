import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { TranslatorService } from './translator/translator.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { LanguagesService } from './languages/languages.service';

@Injectable()
export class TelegramTranslationBotService implements OnModuleInit {
  private readonly bot: Bot;
  private readonly logger = new Logger(TelegramTranslationBotService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly translator: TranslatorService,
    private readonly languages: LanguagesService,
    private readonly prisma: PrismaService,
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

    this.bot.command('start', async (ctx) => {
      const chatType = ctx.message.chat.type;
      const chatId = ctx.message.chat.id;

      try {
        const createdChat = await this.prisma.chat.create({
          data: { type: chatType, id: chatId },
        });
        this.logger.log({ createdChat });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            ctx.reply('You already have started translator bot for this chat');
            return;
          }
        }

        this.logger.error(err.message);

        ctx.reply('Sorry. Something went wrong.');
        return;
      }

      const languages = this.languages.getAllTitles();
      const languagesKeyboard = [];
      const columns = 2;
      for (let row = 0; row * columns < languages.length; row += 1) {
        const start = row * columns;
        const end = start + columns;
        languagesKeyboard[row] = languages.slice(start, end).map((lang) => ({
          text: lang,
        }));
      }

      ctx.reply('Choose desired languages', {
        reply_markup: {
          keyboard: languagesKeyboard,
          resize_keyboard: true,
          input_field_placeholder: 'Choose languages',
        },
      });
    });

    this.bot.command('rm', async (ctx) => {
      const chatId = ctx.chatId;

      const chat = await this.prisma.chat.findFirst({
        where: { id: chatId },
        select: { languages: true },
      });

      ctx.reply('Which languages you want to remove?', {
        reply_markup: {
          inline_keyboard: [
            chat.languages.map((langCode) => ({
              text: this.languages.getTitle(langCode),
              callback_data: `remove_language ${langCode}`,
            })),
          ],
        },
      });
    });

    this.bot.command('add', async (ctx) => {
      const languages = this.languages.getAllTitles();
      const languagesKeyboard = [];
      const columns = 2;
      for (let row = 0; row * columns < languages.length; row += 1) {
        const start = row * columns;
        const end = start + columns;
        languagesKeyboard[row] = languages.slice(start, end).map((lang) => ({
          text: lang,
        }));
      }

      ctx.reply('Choose desired languages', {
        reply_markup: {
          keyboard: languagesKeyboard,
          resize_keyboard: true,
          input_field_placeholder: 'Choose languages',
        },
      });
    });

    this.bot.callbackQuery(/remove_language .*/, async (ctx) => {
      const chatId = ctx.chatId;

      const chat = await this.prisma.chat.findFirst({
        where: { id: chatId },
        select: { languages: true, maxLanguages: true },
      });

      const langCodeToRemove = ctx.callbackQuery.data.split(' ')[1];

      const updatedChatLanguages = chat.languages.filter(
        (langCode) => langCode !== langCodeToRemove,
      );

      await this.prisma.chat.update({
        where: { id: chatId },
        data: { languages: updatedChatLanguages },
      });

      await ctx.answerCallbackQuery({ text: 'Language removed' });
      await ctx.reply(
        `Active chat languages(${updatedChatLanguages.length}/${chat.maxLanguages}): ${updatedChatLanguages.map((langCode) => this.languages.getTitle(langCode)).join(', ')}`,
      );
    });

    this.bot.on('message').filter(
      async (ctx) => this.languages.getAllTitles().includes(ctx.message.text),
      async (ctx) => {
        const languageTitle = ctx.message.text;
        const languageCode = this.languages.getCode(languageTitle);
        const chatId = ctx.chatId;

        const chat = await this.prisma.chat.findFirst({
          where: { id: chatId },
          select: { languages: true, maxLanguages: true },
        });

        if (chat.languages.length >= chat.maxLanguages) {
          ctx.reply('You have reached languages limit', {
            reply_markup: { remove_keyboard: true },
          });
          return;
        }

        const updatedChatLanguages = chat.languages.concat(languageCode);

        await this.prisma.chat.update({
          where: { id: chatId },
          data: { languages: updatedChatLanguages },
        });

        const languagesCount = updatedChatLanguages.length;

        ctx.reply(
          `Active chat languages(${updatedChatLanguages.length}/${chat.maxLanguages}): ${updatedChatLanguages.map((langCode) => this.languages.getTitle(langCode)).join(', ')}`,
          languagesCount >= chat.maxLanguages
            ? {
                reply_markup: {
                  remove_keyboard: true,
                },
              }
            : undefined,
        );
      },
    );

    this.bot.on('message', async (ctx) => {
      const textForTranslation = ctx.message.text;
      if (!textForTranslation) {
        this.logger.warn('No text in message. Aborting translation.');
        return null;
      }

      this.logger.log('Translation request. Text: ', textForTranslation);

      ctx.replyWithChatAction('typing');

      const chat = await this.prisma.chat.findFirst({
        where: { id: ctx.chatId },
        select: { isActive: true, languages: true },
      });

      if (!chat.isActive) {
        ctx.reply('You dont have valid subscription.');
        return;
      }

      console.log(chat.languages);

      try {
        const translations = await this.translator.translate(
          textForTranslation,
          chat.languages,
        );
        // const translations = {
        //   Russian: 'Привет! Как дела? Хочешь пойти выпить пиво?',
        //   Serbian: 'Zdravo! Šta ima? Da li želiš da idemo na pivo?',
        // };

        const formattedTranslations = Object.entries(translations)
          .map(
            ([language, translation]) =>
              `<b>${this.languages.getTitle(language)}:</b>\n${translation}`,
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
