"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Send, Search, ArrowLeft, CheckCheck,
    Clock, Plus, MoreVertical, Paperclip, Smile,
    MessageSquare, Loader2, Briefcase, FileText
} from "lucide-react";
import { Suspense } from "react";
import { getPusherClient, chatChannel } from "@/lib/pusher";

function InboxContent() {
    const { user, token } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const partnerFromUrl = searchParams.get('u');

    const [conversations, setConversations] = useState<any[]>([]);
    const [activePartnerId, setActivePartnerId] = useState<string | null>(partnerFromUrl);
    const [messages, setMessages] = useState<any[]>([]);
    const [tempPartner, setTempPartner] = useState<any>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [sending, setSending] = useState(false);
    
    // Negotiation state
    const [showQuoteInput, setShowQuoteInput] = useState(false);
    const [quoteAmount, setQuoteAmount] = useState("");
    const [counterMsgId, setCounterMsgId] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Conversations (Poll every 8s)
    useEffect(() => {
        if (!token) return;
        async function fetchConvs() {
            try {
                const res = await fetch("/api/message/conversations", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.conversations) setConversations(data.conversations);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingConvs(false);
            }
        }

        fetchConvs(); // Initial fetch
        const interval = setInterval(fetchConvs, 8000);
        return () => clearInterval(interval);
    }, [token]);

    // Fetch Messages (initial load) + Pusher real-time subscription
    useEffect(() => {
        if (!token || !activePartnerId || !user) return;

        // Initial load
        async function fetchMsgs() {
            try {
                const res = await fetch(`/api/message?u=${activePartnerId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.messages) setMessages(data.messages);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingMsgs(false);
            }
        }

        setLoadingMsgs(true);
        fetchMsgs();

        // ── Pusher real-time subscription ────────────────────────────────────
        const pusher = getPusherClient(token ?? undefined);

        const channel = pusher.subscribe(chatChannel((user as any).id, activePartnerId));

        channel.bind('new-message', (data: any) => {
            // Only append messages from the OTHER person — our own are added
            // optimistically in handleSend already.
            if (data.sender !== (user as any).id) {
                setMessages(prev => [...prev, data]);
                // Update conversation snippet in sidebar
                setConversations(prev => prev.map(c =>
                    c.partnerId === activePartnerId
                        ? { ...c, lastMessage: data.content, lastAt: data.createdAt }
                        : c
                ));
            }
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(chatChannel((user as any).id, activePartnerId));
        };
    }, [activePartnerId, token, user]);

    // Fetch Partner if not in Conversations (for new chats)
    useEffect(() => {
        if (!activePartnerId || !token) return;

        // Check if this partner is already in the conversation list
        const found = conversations.find(c => c.partnerId === activePartnerId);
        if (found) {
            setTempPartner(null); // Already in real convs, clear temp
            return;
        }

        // Fetch partner details (covers both: new chat from URL, or convs not loaded yet)
        fetch(`/api/users/${activePartnerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.user) setTempPartner(data.user);
            })
            .catch(e => console.error("Temp partner fetch error", e));
    }, [activePartnerId, token, conversations]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (isQuote = false) => {
        if ((!newMessage.trim() && !isQuote) || !activePartnerId) return;
        if (isQuote && (!quoteAmount.trim() || isNaN(Number(quoteAmount)))) return;
        
        setSending(true);
        try {
            const bodyPayload: any = { recipientId: activePartnerId, content: newMessage };
            if (isQuote) {
                bodyPayload.isNegotiation = true;
                bodyPayload.negotiationAmount = Number(quoteAmount);
            }

            const res = await fetch("/api/message", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(bodyPayload),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => [...prev, data.message]);
                setNewMessage("");
                setQuoteAmount("");
                setShowQuoteInput(false);
                // Update conversation list item last message
                setConversations(prev => prev.map(c =>
                    c.partnerId === activePartnerId ? { ...c, lastMessage: isQuote ? `Proposal: $${quoteAmount}` : newMessage, lastAt: new Date().toISOString() } : c
                ));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
        }
    };

    const handleNegotiation = async (messageId: string, action: 'ACCEPT' | 'DECLINE' | 'COUNTER', counterVal?: number) => {
        try {
            const res = await fetch('/api/message/negotiate', {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ messageId, action, counterAmount: counterVal })
            });
            const data = await res.json();
            if (data.success) {
                // Instantly sync the message state locally
                setMessages(prev => prev.map(m => m._id === messageId ? { ...m, negotiationStatus: action === 'COUNTER' ? 'COUNTERED' : action, relatedProject: data.project?._id } : m));
                setCounterMsgId(null);
                setQuoteAmount("");
            } else {
                alert(data.error || "Failed to negotiate");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const activeConv = conversations.find(c => c.partnerId === activePartnerId);

    if (!user) return (
        <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
            <div className="text-center">
                <p className="text-zinc-400 font-black uppercase text-xl mb-6 italic tracking-tighter">Inbound Communications Only</p>
                <Link href="/login" className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                    Login Access
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F7F8] font-sans overflow-hidden">
            <Sidebar />

            <div className="md:pl-16 h-[100dvh] flex pb-[64px] md:pb-0">

                {/* ── CONVERSATION LIST (Sidebar-ish) ──── */}
                <div className={`w-full md:w-80 lg:w-96 border-r border-[#E8E8E8] flex flex-col bg-white ${activePartnerId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-[#E8E8E8] space-y-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Inbox</h1>
                            <button className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all">
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="search-bar-container rounded-2xl px-4 py-3 bg-zinc-100 border-none group">
                            <input
                                type="text"
                                placeholder="Search collaborators..."
                                className="search-bar-input text-[13px] font-bold text-zinc-900"
                            />
                            <Search size={16} className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors shrink-0" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {loadingConvs ? (
                            <div className="p-4 space-y-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-zinc-50 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-300">
                                <MessageSquare size={48} className="mb-4 opacity-20" />
                                <p className="text-[12px] font-black uppercase tracking-widest">No conversations yet</p>
                                <p className="text-[10px] mt-1 font-bold">Start drops to get messages</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <button
                                    key={conv.partnerId}
                                    onClick={() => setActivePartnerId(conv.partnerId)}
                                    className={`w-full p-4 flex items-center gap-4 transition-all border-b border-[#F7F7F8] relative ${activePartnerId === conv.partnerId ? "bg-zinc-50" : "hover:bg-zinc-50/50"}`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-[#E8E8E8] flex items-center justify-center font-black text-zinc-400 overflow-hidden shrink-0">
                                        {(conv.partner.profileImage || conv.partner.image) ? (
                                            <img src={conv.partner.profileImage || conv.partner.image} alt={conv.partner.name} className="w-full h-full object-cover" />
                                        ) : (
                                            conv.partner.brandName?.[0] || conv.partner.name?.[0]
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <p className="text-[13px] font-black uppercase text-zinc-900 truncate">
                                                {conv.partner.brandName || conv.partner.name}
                                            </p>
                                            <span className="text-[9px] text-zinc-400 font-black font-mono">
                                                {new Date(conv.lastAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className={`text-[12px] truncate ${conv.unread > 0 ? "font-black text-zinc-900" : "text-zinc-400 font-medium"}`}>
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                    {conv.unread > 0 && (
                                        <div className="absolute right-4 bottom-4 w-5 h-5 bg-zinc-900 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                            {conv.unread}
                                        </div>
                                    )}
                                    {activePartnerId === conv.partnerId && <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* ── CHAT AREA ──── */}
                <div className={`flex-1 flex flex-col bg-[#F7F7F8] ${!activePartnerId ? 'hidden md:flex' : 'flex'}`}>
                    {activePartnerId && (activeConv || tempPartner) ? (
                        <>
                            {/* Header */}
                            <div className="p-4 px-6 bg-white border-b border-[#E8E8E8] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setActivePartnerId(null)} className="md:hidden p-2 -ml-2 text-zinc-400">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center font-black text-white text-xs overflow-hidden">
                                        {((activeConv?.partner?.profileImage || activeConv?.partner?.image) || (tempPartner?.profileImage || tempPartner?.image)) ? (
                                            <img src={(activeConv?.partner?.profileImage || activeConv?.partner?.image) || (tempPartner?.profileImage || tempPartner?.image)} alt={activeConv?.partner?.name || tempPartner?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            activeConv?.partner?.brandName?.[0] || activeConv?.partner?.name?.[0] || tempPartner?.brandName?.[0] || tempPartner?.name?.[0]
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase text-zinc-900 leading-none mb-1">
                                            {activeConv?.partner?.brandName || activeConv?.partner?.name || tempPartner?.brandName || tempPartner?.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none">Online now</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 text-zinc-400 hover:text-zinc-900 transition-colors">
                                        <Paperclip size={18} />
                                    </button>
                                    <button className="p-2.5 text-zinc-400 hover:text-zinc-900 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-white"
                            >
                                {loadingMsgs ? (
                                    <div className="h-full flex items-center justify-center">
                                        <Loader2 size={24} className="text-zinc-200 animate-spin" />
                                    </div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const isMe = msg.sender === user.id;
                                        return (
                                            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[75%] space-y-1`}>
                                                    {msg.isNegotiation ? (
                                                        <div className={`p-4 rounded-3xl ${isMe ? "bg-zinc-900 border border-zinc-700 text-white" : "bg-white border border-[#E8E8E8] text-zinc-900 shadow-sm"}`}>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Briefcase size={16} className={isMe ? "text-violet-400" : "text-violet-600"} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{isMe ? "Sent Proposal" : "Received Proposal"}</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black tracking-tighter mb-1">${msg.negotiationAmount}</h3>
                                                            {msg.content && <p className={`text-[13px] mb-4 font-normal ${isMe ? "text-zinc-300" : "text-zinc-500"}`}>{msg.content}</p>}
                                                            
                                                            {msg.negotiationStatus === 'PENDING' && !isMe && (
                                                                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-200/20">
                                                                    {counterMsgId === msg._id ? (
                                                                        <div className="flex gap-2 items-center">
                                                                            <span className="text-zinc-400 font-bold">$</span>
                                                                            <input 
                                                                                type="number" 
                                                                                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-sm outline-none"
                                                                                placeholder="Counter amount"
                                                                                value={quoteAmount}
                                                                                onChange={e => setQuoteAmount(e.target.value)}
                                                                            />
                                                                            <button onClick={() => handleNegotiation(msg._id, 'COUNTER', Number(quoteAmount))} className="py-1.5 px-3 bg-zinc-900 text-white text-[10px] font-black uppercase rounded-xl">Send</button>
                                                                            <button onClick={() => setCounterMsgId(null)} className="py-1.5 px-3 bg-transparent text-zinc-400 text-[10px] font-black uppercase rounded-xl border border-zinc-200">Cancel</button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex gap-2">
                                                                            <button onClick={() => handleNegotiation(msg._id, 'ACCEPT')} className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors">Accept</button>
                                                                            <button onClick={() => setCounterMsgId(msg._id)} className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors">Counter</button>
                                                                            <button onClick={() => handleNegotiation(msg._id, 'DECLINE')} className="flex-1 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors">Decline</button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {msg.negotiationStatus !== 'PENDING' && (
                                                                <div className="mt-2 pt-2 border-t border-zinc-200/20 flex items-center justify-between gap-4">
                                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${msg.negotiationStatus === 'ACCEPTED' ? 'text-green-500' : msg.negotiationStatus === 'DECLINED' ? 'text-red-500' : 'text-zinc-400'}`}>
                                                                        Status: {msg.negotiationStatus}
                                                                    </span>
                                                                    {msg.negotiationStatus === 'ACCEPTED' && msg.relatedProject && (
                                                                         <Link href={`/project/${msg.relatedProject}`} className="text-[10px] font-black uppercase tracking-widest text-violet-500 hover:underline">View Project</Link>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className={`px-5 py-3 rounded-3xl text-[14px] leading-relaxed font-medium ${isMe
                                                            ? "bg-zinc-900 text-white rounded-br-none"
                                                            : "bg-zinc-100 text-zinc-900 rounded-bl-none"
                                                            }`}>
                                                            {msg.content}
                                                        </div>
                                                    )}
                                                    <p className={`text-[9px] font-black font-mono uppercase tracking-widest px-2 ${isMe ? "text-right text-zinc-400" : "text-zinc-400"}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {isMe && <CheckCheck size={10} className="inline ml-1 text-zinc-400" />}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 px-6 bg-white border-t border-[#E8E8E8] flex flex-col gap-2">
                                {showQuoteInput && (
                                    <div className="max-w-4xl mx-auto flex w-full items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl mb-1 animate-in fade-in slide-in-from-bottom-2">
                                        <Briefcase size={16} className="text-zinc-400" />
                                        <span className="text-[12px] font-black uppercase tracking-widest text-zinc-500">Proposal Amount: $</span>
                                        <input 
                                            type="number"
                                            value={quoteAmount}
                                            onChange={e => setQuoteAmount(e.target.value)}
                                            placeholder="500"
                                            className="bg-transparent border-none outline-none font-black text-lg w-24 placeholder:text-zinc-300"
                                            autoFocus
                                        />
                                        <button onClick={() => setShowQuoteInput(false)} className="ml-auto text-[10px] font-black uppercase text-zinc-400 hover:text-zinc-700">Cancel</button>
                                        <button onClick={() => handleSend(true)} disabled={sending || !quoteAmount} className="ml-2 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50">
                                            Send Proposal
                                        </button>
                                    </div>
                                )}
                                <div className="max-w-4xl mx-auto flex items-center gap-3 w-full">
                                    <button onClick={() => setShowQuoteInput(!showQuoteInput)} className={`p-3 rounded-2xl transition-all ${showQuoteInput ? 'bg-violet-100 text-violet-600' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`} title="Send Proposal/Quote">
                                        <FileText size={20} />
                                    </button>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleSend(false)}
                                            placeholder={showQuoteInput ? "Add a message to your proposal..." : "Compose internal brief..."}
                                            className="w-full pl-6 pr-4 py-3.5 bg-zinc-100 border-none rounded-2xl text-[14px] font-medium outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSend(false)}
                                        disabled={!newMessage.trim() || sending}
                                        className="p-3.5 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center"
                                    >
                                        <Send size={20} className={sending ? "animate-pulse" : ""} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-24 h-24 bg-white rounded-full border border-[#E8E8E8] flex items-center justify-center mb-6 shadow-sm">
                                <MessageSquare size={32} className="text-zinc-200" />
                            </div>
                            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Your Encrypted Briefs</h2>
                            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
                                Select a collaborator to begin high-fidelity coordination.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function InboxPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#F7F7F8]">
                <Loader2 className="animate-spin text-zinc-300" size={32} />
            </div>
        }>
            <InboxContent />
        </Suspense>
    );
}
