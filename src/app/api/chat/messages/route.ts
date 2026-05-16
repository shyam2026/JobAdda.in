import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (user.role === 'STUDENT' && conversation.studentId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (user.role === 'COMPANY' && conversation.companyId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read if fetched by the other party
    const unreadMessages = messages.filter((m: any) => !m.isRead && m.senderId !== user.id);
    if (unreadMessages.length > 0) {
      await prisma.chatMessage.updateMany({
        where: { id: { in: unreadMessages.map((m: any) => m.id) } },
        data: { isRead: true }
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('CHAT_MESSAGES_GET_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, content } = await req.json();

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    let senderType = '';
    if (user.role === 'STUDENT') {
      if (conversation.studentId !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      
      const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { isPremium: true } });
      if (!dbUser?.isPremium) return NextResponse.json({ error: 'Premium required to send messages' }, { status: 403 });
      
      senderType = 'STUDENT';
    } else if (user.role === 'COMPANY') {
      if (conversation.companyId !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      senderType = 'COMPANY';
    } else {
      return NextResponse.json({ error: 'Unauthorized Role' }, { status: 403 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId,
        senderId: user.id,
        senderType,
        content,
      }
    });

    // Update conversation timestamp for sorting
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('CHAT_MESSAGES_POST_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
