import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface ChatMsg {
  id: string;
  session_id: string;
  visitor_name: string;
  visitor_email: string;
  business_name: string | null;
  message: string;
  sender: string;
  created_at: string;
}

const LiveChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [identified, setIdentified] = useState(false);
  const [info, setInfo] = useState({ name: "", email: "", business: "" });
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Listen for external open requests
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  // Restore session
  useEffect(() => {
    const stored = sessionStorage.getItem("chat_session");
    if (stored) {
      const data = JSON.parse(stored);
      setInfo({ name: data.name, email: data.email, business: data.business || "" });
      setSessionId(data.sessionId);
      setIdentified(true);
    }
  }, []);

  // Fetch messages for session
  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as ChatMsg[]);
    };
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMsg]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!info.name.trim() || !info.email.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setIdentified(true);
    sessionStorage.setItem("chat_session", JSON.stringify({
      name: info.name.trim(),
      email: info.email.trim(),
      business: info.business.trim(),
      sessionId: newSessionId,
    }));
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const { error } = await supabase.from("chat_messages").insert({
      session_id: sessionId,
      visitor_name: info.name.trim(),
      visitor_email: info.email.trim(),
      business_name: info.business.trim() || null,
      message: input.trim(),
      sender: "visitor",
    });
    setSending(false);
    if (error) {
      toast.error("Failed to send message.");
      return;
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full bg-gradient-primary text-primary-foreground shadow-hero flex items-center justify-center hover:scale-105 transition-transform touch-manipulation"
        aria-label="Open live chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[70] w-[370px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-120px)] rounded-2xl border border-border bg-card shadow-hero flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-cta px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <MessageCircle size={18} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-primary-foreground text-sm">Aperio Studios Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-primary-foreground/70 text-xs">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOpen(false)}
                  className="text-primary-foreground/70 hover:text-primary-foreground p-1"
                  aria-label="Minimize"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-primary-foreground/70 hover:text-primary-foreground p-1"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!identified ? (
              /* Identification form */
              <div className="flex-1 p-5 flex flex-col justify-center">
                <div className="text-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-lg">Start a Conversation</h3>
                  <p className="text-muted-foreground text-sm mt-1">Tell us a bit about yourself</p>
                </div>
                <form onSubmit={startChat} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    maxLength={100}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email *"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    maxLength={255}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Business name (optional)"
                    value={info.business}
                    onChange={(e) => setInfo({ ...info, business: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    maxLength={100}
                  />
                  <Button type="submit" variant="hero" className="w-full gap-2">
                    <MessageCircle size={16} />
                    Start Chat
                  </Button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Welcome message */}
                  <div className="flex gap-2 items-end">
                    <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                       <span className="text-primary-foreground font-bold text-[10px]">A</span>
                    </div>
                    <div className="max-w-[80%]">
                      <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2">
                        <p className="text-sm text-foreground leading-relaxed">
                          Hi {info.name}! 👋 Welcome to Aperio Studios. How can we help you today?
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 ml-1">Just now</p>
                    </div>
                  </div>

                  {/* Offline notice if no admin replies after a bit */}
                  {messages.length > 0 && !messages.some((m) => m.sender === "admin") && (
                    <div className="flex gap-2 items-end">
                      <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                         <span className="text-primary-foreground font-bold text-[10px]">A</span>
                      </div>
                      <div className="max-w-[80%]">
                        <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Our team is currently offline. Please leave your message and we will respond shortly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 items-end ${msg.sender === "visitor" ? "flex-row-reverse" : ""}`}>
                      {msg.sender === "admin" && (
                        <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                          <span className="text-primary-foreground font-bold text-[10px]">A</span>
                        </div>
                      )}
                      <div className={`max-w-[80%] ${msg.sender === "visitor" ? "items-end" : ""}`}>
                        <div
                          className={`px-3 py-2 rounded-2xl ${
                            msg.sender === "visitor"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <p className={`text-[10px] text-muted-foreground mt-1 ${msg.sender === "visitor" ? "text-right mr-1" : "ml-1"}`}>
                          {format(new Date(msg.created_at), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="shrink-0 border-t border-border p-3 flex items-end gap-2 bg-background">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none max-h-20"
                    maxLength={1000}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !input.trim()}
                    className="w-9 h-9 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    aria-label="Send"
                  >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
