import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Prisma, MessageAwaitingTranslation } from '@prisma/client';

@Injectable()
export class MessagesAwaitingTranslation {
  constructor(private readonly prisma: PrismaService) {}

  add({
    text,
    chatId,
  }: Prisma.MessageAwaitingTranslationCreateInput): Promise<MessageAwaitingTranslation> {
    return this.prisma.messageAwaitingTranslation.create({
      data: { chatId, text },
    });
  }

  async get(id: string, chatId: number): Promise<string> {
    const result = await this.prisma.messageAwaitingTranslation.findFirst({
      where: { id, chatId },
      select: { text: true },
    });

    return result.text;
  }

  delete(id: string, chatId: number) {
    return this.prisma.messageAwaitingTranslation.delete({
      where: { id, chatId },
    });
  }
}
