import { Test, TestingModule } from '@nestjs/testing';
import { TelegramTranslationBotService } from './telegram-translation-bot.service';

describe('TelegramTranslationBotService', () => {
  let service: TelegramTranslationBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramTranslationBotService],
    }).compile();

    service = module.get<TelegramTranslationBotService>(TelegramTranslationBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
