import { Controller, type OnModuleInit } from '@nestjs/common';

@Controller('telegram-translation-bot')
export class TelegramTranslationBotController implements OnModuleInit {
  onModuleInit() {
    console.log('INIT BOT CONTROLLER')
    this.initBot();
  }

  initBot() {}
}
