import { Test, TestingModule } from '@nestjs/testing';
import { GptTranslate } from './gpt-translate';

describe('GptTranslate', () => {
  let gptTranslate: GptTranslate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GptTranslate],
    }).compile();

    gptTranslate = module.get<GptTranslate>(GptTranslate);
  });

  it('should be defined', () => {
    expect(gptTranslate).toBeDefined();
  });
});
