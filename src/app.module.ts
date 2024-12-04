import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramTranslationBotModule } from './telegram-translation-bot/telegram-translation-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TelegramTranslationBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
