import { Module } from '@nestjs/common';
import { TelegramTranslationBotService } from './telegram-translation-bot.service';
import { ConfigModule } from '@nestjs/config';
import { TranslatorService } from './translator/translator.service';

@Module({
  imports: [ConfigModule],
  providers: [TelegramTranslationBotService, TranslatorService],
})
export class TelegramTranslationBotModule {}
