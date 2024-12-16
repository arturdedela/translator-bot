import { Test, TestingModule } from '@nestjs/testing';
import { Chats } from './chats';

describe('Chats', () => {
  let provider: Chats;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Chats],
    }).compile();

    provider = module.get<Chats>(Chats);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
