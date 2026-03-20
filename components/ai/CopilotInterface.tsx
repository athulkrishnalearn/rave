"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, User, Bot, Sparkles, RefreshCw, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface CopilotInterfaceProps {
    type: "marketing" | "programming" | "tutor";
    title: string;
    description: string;
    initialMessage?: string;
    isModal?: boolean;
    onClose?: () => void;
}

export default function CopilotInterface({ 
    type, 
    title, 
    description, 
    initialMessage,
    isModal,
    onClose 
}: CopilotInterfaceProps) {
    const { token } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
    const [tokensUsed, setTokensUsed] = useState<number | null>(null);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Initial Load: Fetch latest chat of this type
    useEffect(() => {
        if (!token) return;
        
        const fetchLatestChat = async () => {
            try {
                const res = await fetch(`/api/ai/history?type=${type}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setHistory(data);
                    // Load the most recent one by default
                    const latest = data[0];
                    setActiveChatId(latest._id);
                    setMessages(latest.messages.map((m: any) => ({
                        role: m.role,
                        content: m.content
                    })));
                } else if (initialMessage) {
                    setMessages([{ role: "assistant", content: initialMessage }]);
                }
            } catch (err) {
                console.error("History fetch error:", err);
            }
        };
        
        fetchLatestChat();
    }, [token, type]);

    const handleSend = async () => {
        if (!input.trim() || loading || !token) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    type,
                    messages: [...messages, userMessage],
                    chatId: activeChatId
                })
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                const msg = typeof data.error === 'string' ? data.error : (data.error?.message || "AI Sync Failure");
                throw new Error(msg);
            }

            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
            if (data.remainingCredits !== undefined) {
                setRemainingCredits(data.remainingCredits);
            }
            if (data.tokensUsed !== undefined) {
                setTokensUsed(data.tokensUsed);
            }
            if (data.chatId) {
                setActiveChatId(data.chatId);
            }
// ... scroll logic is already there
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
            console.error("AI Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadChat = (chat: any) => {
        setActiveChatId(chat._id);
        setMessages(chat.messages.map((m: any) => ({
            role: m.role,
            content: m.content
        })));
        setShowHistory(false);
    };

    const startNewChat = () => {
        setActiveChatId(null);
        setMessages(initialMessage ? [{ role: "assistant", content: initialMessage }] : []);
        setShowHistory(false);
    };

    return (
        <div className={`flex flex-col h-full bg-white border border-[#EBEBEB] shadow-sm ${isModal ? "rounded-2xl overflow-hidden" : "rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50"}`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between bg-zinc-50/50 relative z-20">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl text-white ${
                        type === 'marketing' ? 'bg-indigo-600' : 
                        type === 'programming' ? 'bg-zinc-900' : 'bg-amber-500'
                    }`}>
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-black uppercase tracking-tight text-zinc-900">{title}</h3>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                            showHistory ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-400 border border-zinc-200 hover:text-zinc-900'
                        }`}
                    >
                        History
                    </button>
                    {isModal && onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* History Overlay */}
            {showHistory && (
                <div className="absolute inset-0 top-[65px] bg-white/95 backdrop-blur-sm z-30 p-5 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Sync History</h4>
                        <button onClick={startNewChat} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-zinc-900 text-white rounded-lg">
                            + New Session
                        </button>
                    </div>
                    <div className="space-y-2">
                        {history.length === 0 ? (
                            <p className="text-center py-10 text-[11px] font-bold text-zinc-400">No previous sessions found</p>
                        ) : (
                            history.map((chat) => (
                                <button 
                                    key={chat._id}
                                    onClick={() => loadChat(chat)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                        activeChatId === chat._id ? 'border-zinc-900 bg-zinc-50' : 'border-[#EBEBEB] hover:border-zinc-300'
                                    }`}
                                >
                                    <p className="text-[12px] font-black text-zinc-900 truncate">{chat.title}</p>
                                    <p className="text-[10px] text-zinc-400 mt-1 font-bold uppercase tracking-widest">
                                        {new Date(chat.updatedAt).toLocaleDateString()} • {chat.messages.length} messages
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[#FAFAFA]"
            >
                {messages.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#EBEBEB] text-zinc-300">
                            <Bot size={24} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">RAVE AI Core is online</p>
                        <p className="text-[12px] text-zinc-500 mt-1">Ask me anything to get started.</p>
                    </div>
                )}
                
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                            m.role === 'user' ? 'bg-zinc-100 border-zinc-200 text-zinc-400' : 'bg-zinc-900 border-zinc-900 text-white'
                        }`}>
                            {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                            m.role === 'user' 
                                ? 'bg-white text-zinc-900 rounded-tr-none border border-[#EBEBEB] font-medium' 
                                : 'bg-[#1A1A1E] text-zinc-100 rounded-tl-none'
                        }`}>
                            {m.role === 'user' ? (
                                <div className="whitespace-pre-wrap">{m.content}</div>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({node, ...props}) => <h1 className="text-lg font-black uppercase tracking-tight mb-2 mt-1 border-b border-zinc-700 pb-1" {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-md font-black uppercase tracking-tight mb-2 mt-2" {...props} />,
                                            h3: ({node, ...props}) => <h3 className="text-sm font-black uppercase tracking-tight mb-1 mt-2" {...props} />,
                                            p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed text-zinc-300" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-3 space-y-1 text-zinc-300" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-3 space-y-1 text-zinc-300" {...props} />,
                                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                            code: ({node, inline, className, children, ...props}: any) => {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline ? (
                                                    <div className="my-3 rounded-xl overflow-hidden bg-black/50 border border-zinc-800">
                                                        <div className="bg-zinc-800/50 px-3 py-1.5 flex justify-between items-center">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{match ? match[1] : 'code'}</span>
                                                        </div>
                                                        <pre className="p-4 overflow-x-auto text-[12px] font-mono leading-relaxed text-emerald-400">
                                                            <code className={className} {...props}>{children}</code>
                                                        </pre>
                                                    </div>
                                                ) : (
                                                    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-[12px] font-mono text-amber-400" {...props}>{children}</code>
                                                );
                                            },
                                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-zinc-700 pl-4 italic my-4 text-zinc-400" {...props} />
                                        }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-900 text-white flex items-center justify-center animate-pulse">
                            <Bot size={14} />
                        </div>
                        <div className="bg-zinc-900 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 border border-zinc-900 shadow-sm">
                            <Loader2 size={16} className="text-zinc-400 animate-spin" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Thinking…</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#F0F0F0] bg-white">
                <div className="relative">
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Sync your thoughts here…"
                        className="w-full px-5 py-4 bg-zinc-50 border border-[#EBEBEB] rounded-2xl text-[13px] font-medium outline-none focus:border-zinc-900 transition-all resize-none min-h-[56px] max-h-32 pr-12 scrollbar-hide"
                        rows={1}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className={`absolute right-2 top-2 p-2.5 rounded-xl transition-all ${
                            input.trim() && !loading ? 'bg-zinc-900 text-white hover:scale-105 active:scale-95 shadow-md' : 'text-zinc-300'
                        }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="mt-2 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300">Power by Nemotron 70B</p>
                        {remainingCredits !== null && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-md border border-zinc-200">
                                {remainingCredits} Credits
                            </span>
                        )}
                        {tokensUsed !== null && (
                            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${
                                tokensUsed >= 90000 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                                {Math.round(tokensUsed / 1000)}k / 100k Tokens
                            </span>
                        )}
                    </div>
                    <button onClick={() => setMessages([])} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                        <RefreshCw size={10} /> Reset Sync
                    </button>
                </div>
            </div>
        </div>
    );
}
