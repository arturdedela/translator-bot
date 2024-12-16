import { Test, TestingModule } from '@nestjs/testing';
import { GoogleTranslate } from './google-translate';

describe('GoogleTranslate', () => {
  let provider: GoogleTranslate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleTranslate],
    }).compile();

    provider = module.get<GoogleTranslate>(GoogleTranslate);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
