import { Test, TestingModule } from '@nestjs/testing';
import { TelegramTranslationBotController } from './telegram-translation-bot.controller';

describe('TelegramTranslationBotController', () => {
  let controller: TelegramTranslationBotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelegramTranslationBotController],
    }).compile();

    controller = module.get<TelegramTranslationBotController>(TelegramTranslationBotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
