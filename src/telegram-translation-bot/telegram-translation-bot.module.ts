import { Module } from '@nestjs/common';
import { TelegramTranslationBotService } from './telegram-translation-bot.service';
import { ConfigModule } from '@nestjs/config';
import { TranslatorService } from './translator/translator.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LanguagesService } from './languages/languages.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    TelegramTranslationBotService,
    TranslatorService,
    LanguagesService,
  ],
})
export class TelegramTranslationBotModule {}
