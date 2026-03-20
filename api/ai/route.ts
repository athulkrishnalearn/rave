import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import AIChat from '@/lib/models/AIChat';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const CREDIT_COSTS: Record<string, number> = {
    marketing: 2,
    programming: 3,
    tutor: 1
};

const SYSTEM_PROMPTS: Record<string, string> = {
    marketing: `You are the RAVE Marketing Copilot. Your goal is to help creators and freelancers grow their brands.
        You specialize in:
        - Generating viral captions and hooks.
        - Building comprehensive marketing strategies.
        - Suggesting campaign ideas (Instagram, TikTok, YouTube).
        - Creating ad copy and hashtag lists.
        Always provide actionable, high-energy advice tailored to creator economy trends.`,
    
    programming: `You are the RAVE Programming Copilot. Your goal is to help users build and debug technical projects.
        You specialize in:
        - Generating clean, modern code (React, Next.js, Node.js, Python, etc.).
        - Explaining complex technical concepts simply.
        - Debugging errors and suggesting optimizations.
        - Helping with API integrations.
        Always provide structured code blocks and clear explanations.`,
        
    tutor: `You are the RAVE Tutor Copilot inside the Learning Hub. Your goal is to help users master new skills.
        You specialize in:
        - Explaining course lessons and playbooks.
        - Creating personalized learning roadmaps.
        - Simplifying complex topics for beginners.
        - Generating practice tasks and quizzes.
        Always encourage the user and provide clear, step-by-step guidance. Link concepts to real-world applications.`
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const requestUser = getUserFromRequest(req);
        if (!requestUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await User.findById(requestUser.id);
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { messages, type = 'tutor', chatId } = await req.json();
        const cost = CREDIT_COSTS[type] || 1;
        const FREE_TOKEN_LIMIT = 100000;

        const isPro = dbUser.role === 'og_vendor' || dbUser.role === 'admin' ? true : dbUser.isPro;
        if (!isPro && dbUser.aiTokensUsed >= FREE_TOKEN_LIMIT) {
            return NextResponse.json({ 
                error: 'Free tier AI limit reached (100k tokens). Please upgrade to PRO for unlimited synchronization.' 
            }, { status: 403 });
        }

        if (dbUser.aiCredits < cost) {
            return NextResponse.json({ error: 'Insufficient AI credits. Upgrade to PRO to continue synchronization.' }, { status: 403 });
        }

        if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'undefined') {
            return NextResponse.json({ error: 'AI Service configuration missing' }, { status: 500 });
        }

        const systemPrompt = SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.tutor;
        
        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                "X-Title": "RAVE Social",
            },
            body: JSON.stringify({
                model: "nvidia/llama-3.1-nemotron-70b-instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1000,
            })
        });

        const data = await aiResponse.json();
        
        if (!aiResponse.ok || data.error) {
            const errorMessage = data.error?.message || data.error || 'AI synchronization failed';
            return NextResponse.json({ error: errorMessage }, { status: aiResponse.status || 500 });
        }

        const assistantMessage = data.choices[0].message.content;

        // Persist Chat History
        let currentChat;
        if (chatId) {
            currentChat = await AIChat.findById(chatId);
            if (currentChat && currentChat.userId.toString() === dbUser.id) {
                currentChat.messages.push(
                    { role: 'user', content: messages[messages.length - 1].content, timestamp: new Date() },
                    { role: 'assistant', content: assistantMessage, timestamp: new Date() }
                );
                await currentChat.save();
            }
        } else {
            // Create a new chat session if no chatId provided
            currentChat = await AIChat.create({
                userId: dbUser.id,
                type,
                title: messages[messages.length - 1].content.substring(0, 30) + "...",
                messages: [
                    { role: 'user', content: messages[messages.length - 1].content, timestamp: new Date() },
                    { role: 'assistant', content: assistantMessage, timestamp: new Date() }
                ]
            });
        }

        // Deduct credits and update token usage
        dbUser.aiCredits -= cost;
        dbUser.aiTokensUsed += (data.usage?.completion_tokens || 0);
        await dbUser.save();

        return NextResponse.json({ 
            content: assistantMessage,
            usage: data.usage,
            remainingCredits: dbUser.aiCredits,
            tokensUsed: dbUser.aiTokensUsed,
            chatId: currentChat?._id
        });

    } catch (error: any) {
        console.error('[/api/ai] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
