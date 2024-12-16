import { Module } from '@nestjs/common';
import { TelegramTranslationBotService } from './telegram-translation-bot.service';
import { ConfigModule } from '@nestjs/config';
import { GptTranslate } from './translators/gpt-translate/gpt-translate';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LanguagesService } from './languages/languages.service';
import { Chats } from './chats/chats';
import { GoogleTranslate } from './translators/google-translate/google-translate';
import { TelegramTranslationBotController } from './telegram-translation-bot.controller';
import { MessagesAwaitingTranslation } from './messages-awaiting-translation/messages-awaiting-translation';
import { Translators } from './translators/translators';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    TelegramTranslationBotService,
    GptTranslate,
    LanguagesService,
    Chats,
    GoogleTranslate,
    MessagesAwaitingTranslation,
    Translators,
  ],
  controllers: [TelegramTranslationBotController],
})
export class TelegramTranslationBotModule {}
