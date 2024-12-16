import { Injectable } from '@nestjs/common';
import type { Chat, Prisma, GroupChatMode } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class Chats {
  constructor(private readonly prisma: PrismaService) {}

  async getChatById(id: number): Promise<Chat | null> {
    const chat = await this.prisma.chat.findFirst({ where: { id } });

    return chat;
  }

  createChat(chat: Prisma.ChatCreateInput): Promise<Chat> {
    return this.prisma.chat.create({ data: chat });
  }

  setMode(chatId: number, mode: GroupChatMode): Promise<Chat> {
    return this.prisma.chat.update({ where: { id: chatId }, data: { mode } });
  }

  setLanguages(chatId: number, languages: string[]): Promise<Chat> {
    return this.prisma.chat.update({
      where: { id: chatId },
      data: { languages },
    });
  }

  setTranslator(chatId: number, translator: Chat['translator']): Promise<Chat> {
    return this.prisma.chat.update({
      where: { id: chatId },
      data: { translator },
    });
  }

  async addLanguage(chatId: number, language: string): Promise<Chat> {
    const chat = await this.getChatById(chatId);

    if (chat.languages.includes(language)) {
      return chat;
    }

    return this.setLanguages(chatId, chat.languages.concat(language));
  }

  async removeLanguage(chatId: number, language: string) {
    const chat = await this.getChatById(chatId);

    return this.setLanguages(
      chatId,
      chat.languages.filter((lang) => lang !== language),
    );
  }

  private setChatIsActive(chatId: number, isActive: boolean): Promise<Chat> {
    return this.prisma.chat.update({
      where: { id: chatId },
      data: { isActive },
    });
  }

  activateChat(chatId: number): Promise<Chat> {
    return this.setChatIsActive(chatId, true);
  }

  deactivateChat(chatId: number) {
    return this.setChatIsActive(chatId, false);
  }

  updateTitle() {
    // Later
    console.warn('NOT IMPLEMENTED');
  }
}
