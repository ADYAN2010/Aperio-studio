import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Mail, Trash2, CheckCircle2, Eye, X, Send, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  admin_reply: string | null;
  status: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  session_id: string;
  visitor_name: string;
  visitor_email: string;
  business_name: string | null;
  status: string;
  is_read: boolean;
  last_message: string;
  last_time: string;
  message_count: number;
}

const AdminChat = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setMessages(data as ChatMsg[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel("admin-chat-all")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, () => {
        fetchMessages();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Group messages into conversations
  const conversations: Conversation[] = Object.values(
    messages.reduce<Record<string, Conversation>>((acc, msg) => {
      if (!acc[msg.session_id]) {
        acc[msg.session_id] = {
          session_id: msg.session_id,
          visitor_name: msg.visitor_name,
          visitor_email: msg.visitor_email,
          business_name: msg.business_name,
          status: msg.status,
          is_read: true,
          last_message: msg.message,
          last_time: msg.created_at,
          message_count: 0,
        };
      }
      acc[msg.session_id].last_message = msg.message;
      acc[msg.session_id].last_time = msg.created_at;
      acc[msg.session_id].message_count++;
      if (!msg.is_read && msg.sender === "visitor") acc[msg.session_id].is_read = false;
      if (msg.status !== "resolved") acc[msg.session_id].status = msg.status;
      return acc;
    }, {})
  ).sort((a, b) => new Date(b.last_time).getTime() - new Date(a.last_time).getTime());

  const sessionMessages = selectedSession
    ? messages.filter((m) => m.session_id === selectedSession)
    : [];

  const selectedConvo = conversations.find((c) => c.session_id === selectedSession);

  const markResolved = async (sessionId: string) => {
    await supabase.from("chat_messages").update({ status: "resolved", is_read: true }).eq("session_id", sessionId);
    toast.success("Conversation marked as resolved");
    fetchMessages();
  };

  const deleteConversation = async (sessionId: string) => {
    await supabase.from("chat_messages").delete().eq("session_id", sessionId);
    toast.success("Conversation deleted");
    if (selectedSession === sessionId) setSelectedSession(null);
    fetchMessages();
  };

  const sendReply = async () => {
    if (!selectedConvo || !reply.trim()) return;
    setReplying(true);
    await supabase.from("chat_messages").insert({
      session_id: selectedSession,
      visitor_name: selectedConvo.visitor_name,
      visitor_email: selectedConvo.visitor_email,
      business_name: selectedConvo.business_name,
      message: reply.trim(),
      sender: "admin",
      status: "replied",
      is_read: true,
    });
    setReplying(false);
    setReply("");
    toast.success("Reply sent");
    // Mark all visitor messages as read
    await supabase.from("chat_messages").update({ is_read: true }).eq("session_id", selectedSession).eq("sender", "visitor");
    fetchMessages();
  };

  const selectConvo = async (sessionId: string) => {
    setSelectedSession(sessionId);
    // Mark as read
    await supabase.from("chat_messages").update({ is_read: true }).eq("session_id", sessionId).eq("sender", "visitor");
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-warning/10 text-warning",
      replied: "bg-primary/10 text-primary",
      resolved: "bg-success/10 text-success",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
        {status}
      </span>
    );
  };

  const unreadCount = conversations.filter((c) => !c.is_read).length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">Live Chat</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle size={16} className="text-primary" />
          {unreadCount} unread
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-180px)] min-h-[400px]">
        {/* Conversation list */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border bg-muted/30">
            <p className="text-sm font-medium text-foreground">{conversations.length} Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-muted-foreground p-4 text-sm">Loading...</p>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <div
                  key={convo.session_id}
                  onClick={() => selectConvo(convo.session_id)}
                  className={`p-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/30 ${
                    selectedSession === convo.session_id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  } ${!convo.is_read ? "bg-primary/[0.02]" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-bold text-xs">
                          {convo.visitor_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{convo.visitor_name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{convo.visitor_email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(convo.last_time), "MMM d")}
                      </span>
                      {!convo.is_read && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate ml-10">{convo.last_message}</p>
                  <div className="flex items-center gap-2 mt-1.5 ml-10">
                    {statusBadge(convo.status)}
                    <span className="text-[10px] text-muted-foreground">{convo.message_count} msgs</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat detail */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
          {selectedConvo ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {selectedConvo.visitor_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{selectedConvo.visitor_name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail size={10} /> {selectedConvo.visitor_email}
                      {selectedConvo.business_name && (
                        <>
                          <Building2 size={10} /> {selectedConvo.business_name}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => markResolved(selectedConvo.session_id)}>
                    <CheckCircle2 size={12} /> Resolve
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => deleteConversation(selectedConvo.session_id)}>
                    <Trash2 size={12} /> Delete
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sessionMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 items-end ${msg.sender === "admin" ? "flex-row-reverse" : ""}`}>
                    {msg.sender === "visitor" && (
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-foreground font-bold text-[10px]">
                          {msg.visitor_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="max-w-[75%]">
                      <div
                        className={`px-3 py-2 rounded-2xl ${
                          msg.sender === "admin"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                      <p className={`text-[10px] text-muted-foreground mt-1 ${msg.sender === "admin" ? "text-right mr-1" : "ml-1"}`}>
                        {format(new Date(msg.created_at), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              <div className="border-t border-border p-3 flex items-end gap-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                  placeholder="Type a reply..."
                  rows={1}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none max-h-20"
                  maxLength={1000}
                />
                <button
                  onClick={sendReply}
                  disabled={replying || !reply.trim()}
                  className="w-9 h-9 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0 hover:scale-105 transition-transform disabled:opacity-50"
                  aria-label="Send reply"
                >
                  {replying ? <span className="animate-spin"><Send size={14} /></span> : <Send size={14} />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Eye size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Select a conversation to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
