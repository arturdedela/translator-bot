import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, type Context, type NextFunction, InlineKeyboard } from 'grammy';
import { LanguagesService } from './languages/languages.service';
import { Chats } from './chats/chats';
import { Prisma } from '@prisma/client';
import { MessagesAwaitingTranslation } from './messages-awaiting-translation/messages-awaiting-translation';
import { Translators } from './translators/translators';

@Injectable()
export class TelegramTranslationBotService implements OnModuleInit {
  private readonly bot: Bot;
  private readonly logger = new Logger(TelegramTranslationBotService.name);

  constructor(
    readonly configService: ConfigService,
    private readonly translators: Translators,
    private readonly languages: LanguagesService,
    private readonly chats: Chats,
    private readonly messagesAwaitingTranslation: MessagesAwaitingTranslation,
  ) {
    const apiToken = configService.get<string | undefined>('BOT_API_TOKEN');

    this.bot = new Bot(apiToken);
  }

  onModuleInit() {
    this.initBot();
  }

  registerNewChat = async (ctx: Context, next: NextFunction): Promise<void> => {
    const { id, type } = ctx.chat;
    const chatTitle =
      ctx.chat.title || ctx.from.username || ctx.from.first_name;

    try {
      const createdChat = await this.chats.createChat({
        id,
        type,
        title: chatTitle,
      });
      this.logger.log({ createdChat });
    } catch (err) {
      // FIXME
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          await ctx.reply(
            'You already have started translator bot for this chat',
          );
          return;
        }
      }

      this.logger.error(err.message);

      await ctx.reply('Sorry. Something went wrong.');
      return;
    }

    await next();
  };

  createLanguagesKeyboard(activeLanguages: string[]): InlineKeyboard {
    const keyboard = new InlineKeyboard();
    const languagesCodes = this.languages.getAllCodes();
    const columns = 2;

    for (let row = 0; row * columns < languagesCodes.length; row += 1) {
      const start = row * columns;
      const end = start + columns;
      languagesCodes.slice(start, end).forEach((langCode) => {
        const isLanguageActive = activeLanguages.includes(langCode);
        keyboard.text(
          this.languages.getTitle(langCode) + (isLanguageActive ? ' ✅' : ''),
          isLanguageActive ? `rm_lang ${langCode}` : `add_lang ${langCode}`,
        );
      });
      keyboard.row();
    }

    return keyboard;
  }

  showLanguagesKeyboard = async (ctx: Context): Promise<void> => {
    const chat = await this.chats.getChatById(ctx.chatId);

    await ctx.reply('Available languages', {
      reply_markup: this.createLanguagesKeyboard(chat.languages),
    });
  };

  addLanguage = async (ctx: Context, next: NextFunction): Promise<void> => {
    const langCode = ctx.callbackQuery.data.split(' ')[1];
    const chatId = ctx.chatId;

    const chat = await this.chats.getChatById(chatId);

    if (chat.languages.length >= chat.maxLanguages) {
      await ctx.deleteMessage();
      await ctx.reply('You have reached languages limit');
      return;
    }

    const updatedChat = await this.chats.addLanguage(chatId, langCode);

    await ctx.answerCallbackQuery({
      text: `${this.languages.getTitle(langCode)} language added`,
    });
    await ctx.editMessageReplyMarkup({
      reply_markup: this.createLanguagesKeyboard(updatedChat.languages),
    });
    await next();
  };

  removeLanguage = async (ctx: Context, next: NextFunction): Promise<void> => {
    const chatId = ctx.chatId;

    const langCodeToRemove = ctx.callbackQuery.data.split(' ')[1];

    const updatedChat = await this.chats.removeLanguage(
      chatId,
      langCodeToRemove,
    );

    await ctx.answerCallbackQuery({
      text: `${this.languages.getTitle(langCodeToRemove)} language removed`,
    });
    await ctx.editMessageReplyMarkup({
      reply_markup: this.createLanguagesKeyboard(updatedChat.languages),
    });
    await next();
  };

  onLanguagesChanged = async (ctx: Context): Promise<void> => {
    const chatId = ctx.chatId;
    const chat = await this.chats.getChatById(chatId);

    await ctx.api.setMyCommands(
      chat.languages.map((langCode) => ({
        command: `/${langCode}`,
        description: `Translate to ${this.languages.getTitle(langCode)}`,
      })),
    );
  };

  logggerMiddleware = async (ctx: Context, next: NextFunction) => {
    this.logger.debug('Received message: ', ctx.message);
    await next();
  };

  showAvailableTranslators = async (ctx: Context, next: NextFunction) => {
    await ctx.reply('Choose transation engine: ', {
      reply_markup: new InlineKeyboard([
        this.translators.getAvailable().map((translatorName) => ({
          text: translatorName,
          callback_data: `choose_translator ${translatorName}`,
        })),
      ]),
    });

    await next();
  };

  setChatTranslator = async (ctx: Context) => {
    const [, translator] = ctx.callbackQuery.data.split(' ');
    if (this.translators.isValidTranslator(translator)) {
      await this.chats.setTranslator(ctx.chatId, translator);
      await ctx.deleteMessage();
      await ctx.reply(`Now using "${translator}" translator`);
    }
  };

  initBot() {
    this.bot
      .start()
      .catch((reason) => this.logger.error('Bot start failed: ', reason));

    this.bot.catch((error) => {
      this.logger.error('Bot Error! ', error);
    });

    this.bot.on('message', this.logggerMiddleware);

    this.bot.command(
      'start',
      this.registerNewChat,
      this.showAvailableTranslators,
      this.showLanguagesKeyboard,
    );

    this.bot.command('engine', this.showAvailableTranslators, () => null);
    this.bot.callbackQuery(/choose_translator .*/, this.setChatTranslator);

    this.bot.command('lang', this.showLanguagesKeyboard);
    this.bot.callbackQuery(
      /add_lang .*/,
      this.addLanguage,
      this.onLanguagesChanged,
    );
    this.bot.callbackQuery(
      /rm_lang .*/,
      this.removeLanguage,
      this.onLanguagesChanged,
    );

    this.bot.callbackQuery(/translate .*/, async (ctx) => {
      // TODO: Create subscription check middleware
      const chat = await this.chats.getChatById(ctx.chatId);

      if (!chat.isActive) {
        ctx.reply('You dont have valid subscription.');
        return;
      }

      const [, targetLang, messageId] = ctx.callbackQuery.data.split(' ');

      const message = await this.messagesAwaitingTranslation.get(
        messageId,
        ctx.chatId,
      );

      const translation = await this.translators
        .chooseTranslator(chat.translator)
        .translate(message, targetLang);

      await ctx.reply(translation);
    });

    this.bot.on(':text', async (ctx) => {
      const textForTranslation = ctx.message.text;
      if (!textForTranslation) {
        this.logger.warn('No text in message. Aborting translation.');
        return null;
      }

      this.logger.log('Translation request. Text: ', textForTranslation);

      ctx.replyWithChatAction('typing');

      const chat = await this.chats.getChatById(ctx.chat.id);

      if (!chat) {
        // TODO: Initiate /start logic here.
        return;
      }

      if (!chat.isActive) {
        ctx.reply('You dont have valid subscription.');
        return;
      }

      const message = await this.messagesAwaitingTranslation.add({
        chatId: ctx.chat.id,
        text: ctx.message.text,
      });

      const keyboard = new InlineKeyboard([
        chat.languages.map((lang) => ({
          text: `${this.languages.getTitle(lang)}`,
          callback_data: `translate ${lang} ${message.id}`,
        })),
      ]);

      await ctx.reply('Do you want to translate this message?', {
        reply_markup: keyboard,
      });
    });
  }
}
