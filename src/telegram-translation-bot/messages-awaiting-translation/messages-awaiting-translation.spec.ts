import { Test, TestingModule } from '@nestjs/testing';
import { MessagesAwaitingTranslation } from './messages-awaiting-translation';

describe('MessagesAwaitingTranslation', () => {
  let provider: MessagesAwaitingTranslation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesAwaitingTranslation],
    }).compile();

    provider = module.get<MessagesAwaitingTranslation>(MessagesAwaitingTranslation);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
