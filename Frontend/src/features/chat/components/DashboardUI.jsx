import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  Figma,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  MessageSquare,
  Settings,
  Trash2,
  RotateCcw,
  FileText,
  Sparkles,
  Menu,
  X,
  Bot,
  User,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";

// ─── Auto-resize textarea hook ────────────────────────────────────────────────
function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        textarea.style.overflowY = "hidden";
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const scrollH = textarea.scrollHeight;
      const cappedMax = maxHeight ?? Infinity;
      const newHeight = Math.max(minHeight, Math.min(scrollH, cappedMax));
      textarea.style.height = `${newHeight}px`;

      // Enable scroll when content exceeds max height
      textarea.style.overflowY = scrollH > cappedMax ? "auto" : "hidden";
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
      textarea.style.overflowY = "hidden";
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

// ─── Streaming text (word-by-word reveal) ─────────────────────────────────────
function StreamingText({ content, isUser, onComplete }) {
  const [displayedWordCount, setDisplayedWordCount] = useState(0);
  const words = useMemo(() => content.split(/( +)/), [content]);
  const totalWords = words.length;
  const isComplete = displayedWordCount >= totalWords;

  useEffect(() => {
    if (isComplete) {
      onComplete?.();
      return;
    }
    const speed = 20 + Math.random() * 20; // 20-40ms per word
    const timer = setTimeout(() => {
      setDisplayedWordCount((prev) => Math.min(prev + 1, totalWords));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayedWordCount, totalWords, isComplete, onComplete]);

  const partialContent = words.slice(0, displayedWordCount).join("");

  return (
    <>
      <MessageContent content={partialContent} isUser={isUser} />
      {!isComplete && (
        <span className="inline-block w-[6px] h-[14px] bg-violet-400 animate-pulse ml-0.5 align-text-bottom rounded-sm" />
      )}
    </>
  );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────
function DeleteConfirmModal({ chatTitle, onConfirm, onCancel }) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative bg-[#141414] border border-neutral-700/60 rounded-2xl p-6 w-[90%] max-w-[400px] shadow-2xl shadow-black/50 animate-message-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>

        <h3 className="text-white text-lg font-semibold text-center mb-2">
          Delete Chat?
        </h3>
        <p className="text-neutral-400 text-sm text-center mb-6 leading-relaxed">
          Are you sure you want to delete
          <span className="text-white font-medium"> "{chatTitle || "this chat"}"</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition-all duration-200 border border-neutral-700 hover:border-neutral-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all duration-200 border border-red-500 hover:border-red-400 active:scale-[0.97]"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}



// ─── Single chat message bubble ───────────────────────────────────────────────
function ChatBubble({ message, shouldStream = false }) {
  const [copied, setCopied] = useState(false);
  const [streamDone, setStreamDone] = useState(!shouldStream);
  const isUser = message.role === "user";

  // Reset streaming state when shouldStream flips to true
  useEffect(() => {
    if (shouldStream) {
      setStreamDone(false);
    }
  }, [shouldStream]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 w-full animate-message-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-violet-900/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message content */}
      <div
        className={cn(
          "group relative max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-white/10 text-white rounded-br-md border border-white/10"
            : "bg-neutral-800/80 text-neutral-200 rounded-bl-md border border-neutral-700/50"
        )}
      >
        {/* Streaming word-by-word for latest AI, or static render */}
        {shouldStream && !isUser && !streamDone ? (
          <StreamingText
            content={message.content}
            isUser={isUser}
            onComplete={() => setStreamDone(true)}
          />
        ) : (
          <MessageContent content={message.content} isUser={isUser} />
        )}

        {/* Copy button for AI messages */}
        {!isUser && streamDone && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-300"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-1 border border-white/10">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

// ─── Simple markdown-like message renderer ────────────────────────────────────
function MessageContent({ content, isUser }) {
  if (isUser) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const lines = part.slice(3, -3).split("\n");
          const lang = lines[0]?.trim() || "";
          const code = lines.slice(lang ? 1 : 0).join("\n");
          return (
            <pre
              key={i}
              className="bg-black/40 rounded-lg p-3 text-xs font-mono text-emerald-400 overflow-x-auto border border-neutral-700/40"
            >
              <code>{code}</code>
            </pre>
          );
        }

        // Process inline formatting
        return (
          <div key={i} className="whitespace-pre-wrap">
            {part.split("\n").map((line, j) => {
              // Blockquote
              if (line.startsWith("> ")) {
                return (
                  <blockquote
                    key={j}
                    className="border-l-2 border-violet-500/60 pl-3 my-1 text-neutral-400 italic"
                  >
                    {formatInline(line.slice(2))}
                  </blockquote>
                );
              }
              // Numbered list
              if (/^\d+\.\s/.test(line)) {
                return (
                  <p key={j} className="ml-2 my-0.5">
                    {formatInline(line)}
                  </p>
                );
              }
              return (
                <span key={j}>
                  {formatInline(line)}
                  {j < part.split("\n").length - 1 && <br />}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Inline formatting helper (bold, inline code)
function formatInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-neutral-700/60 text-orange-300 px-1.5 py-0.5 rounded text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start animate-message-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 mt-1">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-neutral-800/80 rounded-2xl rounded-bl-md px-4 py-3 border border-neutral-700/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar chat item ────────────────────────────────────────────────────────
function ChatHistoryItem({ icon: Icon, title, isActive, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
        isActive
          ? "bg-white/[0.08] text-white"
          : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
      )}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Icon className="w-4 h-4 shrink-0 opacity-60" />
      <span className="text-sm truncate flex-1">{title}</span>
      {showDelete && onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
        >
          <Trash2 className="w-3 h-3 text-neutral-500 hover:text-red-400" />
        </button>
      )}
    </div>
  );
}

// ─── Action button pill ────────────────────────────────────────────────────────
function ActionButton({ icon, label }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-all duration-200 hover:border-neutral-700 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

// ─── Sidebar content (shared between desktop & mobile) ────────────────────────
function SidebarContent({
  groupedChats,
  chatHistory,
  activeChatId,
  user,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSettingsClick,
  onProfileClick,
  onCloseMobile,
}) {
  return (
    <>
      {/* Logo + close button on mobile */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center border border-neutral-700/50">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-none">
                F.R.I.D.A.Y
              </h2>
              <span className="text-[10px] text-neutral-500 font-mono tracking-wider">
                V2.4.0
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-lg hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-4">
        <button
          type="button"
          onClick={() => {
            onNewChat?.();
            onCloseMobile?.();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white text-sm font-medium transition-all duration-200 border border-neutral-800 hover:border-neutral-700 active:scale-[0.98]"
        >
          <PlusIcon className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {groupedChats.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => {
                    onSelectChat?.(chat._id);
                    onCloseMobile?.();
                  }}
                >
                  <ChatHistoryItem
                    icon={getIconForChat(chat)}
                    title={chat.title || "Untitled Chat"}
                    isActive={chat._id === activeChatId}
                    onDelete={() => onDeleteChat?.(chat._id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
            <p className="text-xs text-neutral-600">No conversations yet</p>
          </div>
        )}
      </div>

      {/* Bottom: Settings + Profile */}
      <div className="border-t border-neutral-800/60 p-3 space-y-1">
        <button
          type="button"
          onClick={onSettingsClick}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200 transition-all duration-200"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>

        <div
          onClick={onProfileClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">
              {user?.username || "User"}
            </p>
            <p className="text-[11px] text-neutral-500 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <CircleUserRound className="w-4 h-4 text-neutral-600" />
        </div>
      </div>
    </>
  );
}

// ─── Chat Input Bar (shared between landing & chat view) ──────────────────────
function ChatInputBar({ value, setValue, textareaRef, adjustHeight, onKeyDown, onSend, compact }) {
  return (
    <div className={cn(
      "relative bg-neutral-900 rounded-xl border border-neutral-800",
      compact
        ? "shadow-xl shadow-black/30"
        : "shadow-2xl shadow-black/20"
    )}>
      <div className="overflow-y-auto">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={onKeyDown}
          placeholder="Ask F.R.I.D.A.Y a question..."
          className={cn(
            "w-full resize-none bg-transparent border-none text-white text-sm",
            "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-neutral-500 placeholder:text-sm",
            compact ? "px-3 py-2 min-h-[36px]" : "px-4 py-3 min-h-[60px]"
          )}
        />
      </div>

      <div className={cn("flex items-center justify-between pt-0", compact ? "p-2" : "p-3")}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
          >
            <Paperclip className="w-4 h-4 text-white" />
            <span className="text-xs text-zinc-400 hidden sm:group-hover:inline transition-opacity">
              Attach
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {!compact && (
            <button
              type="button"
              className="hidden sm:flex px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 items-center justify-between gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              Project
            </button>
          )}
          <button
            type="button"
            onClick={onSend}
            className={cn(
              "px-1.5 py-1.5 rounded-lg text-sm transition-all duration-200 border flex items-center justify-between gap-1",
              value.trim()
                ? "bg-white text-black border-white hover:bg-neutral-200 hover:border-white"
                : "text-zinc-400 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800"
            )}
          >
            <ArrowUpIcon
              className={cn(
                "w-4 h-4",
                value.trim() ? "text-black" : "text-zinc-400"
              )}
            />
            <span className="sr-only">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard UI Component ──────────────────────────────────────────────
export function DashboardUI({
  chatHistory = [],
  activeChatId = null,
  user = null,
  messages = [],
  isTyping = false,
  isLoading = false,
  streamedMsgId = null,

  onSendMessage,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSettingsClick,
  onProfileClick,
}) {
  const [value, setValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title } for delete modal
  const messagesEndRef = useRef(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 36,
    maxHeight: 150,
  });

  const isChatView = messages.length > 0 || activeChatId;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleSendInternal = (text) => {
    const msg = text || value.trim();
    if (!msg) return;

    setValue("");
    adjustHeight(true);

    // Delegate to parent handler (Dashboard -> useChat -> API)
    onSendMessage?.(msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendInternal();
    }
  };

  const handleNewChat = () => {
    setValue("");
    adjustHeight(true);
    onNewChat?.();
  };

  // Wrap onDeleteChat to show confirmation modal
  const handleDeleteRequest = (chatId) => {
    const chat = chatHistory.find((c) => c._id === chatId);
    setDeleteTarget({ id: chatId, title: chat?.title || "Untitled Chat" });
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDeleteChat?.(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const groupedChats = groupChatsByDate(chatHistory);

  return (
    <div className="flex h-[100dvh] w-full bg-[#0a0a0a] overflow-hidden">
      {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
      {deleteTarget && (
        <DeleteConfirmModal
          chatTitle={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {/* ═══ MOBILE SIDEBAR OVERLAY ═══ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0c0c0c] border-r border-neutral-800/60 flex flex-col animate-slide-in-left z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              groupedChats={groupedChats}
              chatHistory={chatHistory}
              activeChatId={activeChatId}
              user={user}
              onNewChat={handleNewChat}
              onSelectChat={onSelectChat}
              onDeleteChat={handleDeleteRequest}
              onSettingsClick={onSettingsClick}
              onProfileClick={onProfileClick}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside className="hidden lg:flex flex-col border-r border-neutral-800/60 bg-[#0c0c0c] w-[260px] shrink-0">
        <SidebarContent
          groupedChats={groupedChats}
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          user={user}
          onNewChat={handleNewChat}
          onSelectChat={onSelectChat}
          onDeleteChat={handleDeleteRequest}
          onSettingsClick={onSettingsClick}
          onProfileClick={onProfileClick}
        />
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-neutral-800/40 relative z-10">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <Menu className="w-5 h-5 text-neutral-400" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-semibold text-white">F.R.I.D.A.Y</span>
          </div>
          <button
            type="button"
            onClick={handleNewChat}
            className="p-2 -mr-2 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <PlusIcon className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Subtle radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.05),transparent)]" />

        {/* ─── LANDING VIEW (no messages) ─── */}
        {!isChatView && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative z-10">
            <div className="w-full max-w-[720px] space-y-6 sm:space-y-8">
              <h1 className="text-center">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight block">
                  What can I help
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent leading-[1.1] tracking-tight block">
                  you ship?
                </span>
              </h1>

              <ChatInputBar
                value={value}
                setValue={setValue}
                textareaRef={textareaRef}
                adjustHeight={adjustHeight}
                onKeyDown={handleKeyDown}
                onSend={() => handleSendInternal()}
                compact={false}
              />

              {/* Quick action pills */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-3 justify-center flex-wrap">
                  <ActionButton icon={<ImageIcon className="w-4 h-4" />} label="Clone a Screenshot" />
                  <ActionButton icon={<Figma className="w-4 h-4" />} label="Import from Figma" />
                  <ActionButton icon={<FileUp className="w-4 h-4" />} label="Upload a Project" />
                  <ActionButton icon={<MonitorIcon className="w-4 h-4" />} label="Landing Page" />
                  <ActionButton icon={<CircleUserRound className="w-4 h-4" />} label="Sign Up Form" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── CHAT VIEW (has messages) ─── */}
        {isChatView && (
          <div className="flex-1 flex flex-col relative z-10 min-h-0">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-3 py-4 chat-scrollbar">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg._id}
                    message={msg}
                    shouldStream={msg._id === streamedMsgId}
                  />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom input bar (sticky) */}
            <div className="border-t border-neutral-800/60 px-3 py-3 bg-[#0a0a0a]/90 backdrop-blur-xl">
              <div>
                <ChatInputBar
                  value={value}
                  setValue={setValue}
                  textareaRef={textareaRef}
                  adjustHeight={adjustHeight}
                  onKeyDown={handleKeyDown}
                  onSend={() => handleSendInternal()}
                  compact={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Status bar (only on landing) */}
        {!isChatView && (
          <div className="border-t border-neutral-800/60 px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center gap-3 sm:gap-6 relative z-10">
            <StatusIndicator label="SYSTEM READY" color="green" />
            <StatusDivider />
            <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono tracking-wider">
              V2.4.0 ENGINE
            </span>
            <StatusDivider />
            <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono tracking-wider hidden sm:inline">
              LATENCY 12MS
            </span>
            <span className="text-[10px] text-neutral-500 font-mono tracking-wider sm:hidden">
              12MS
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusIndicator({ label, color }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          color === "green" && "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]",
          color === "red" && "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]",
          color === "yellow" && "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"
        )}
      />
      <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono tracking-wider">
        {label}
      </span>
    </div>
  );
}

function StatusDivider() {
  return <span className="text-neutral-700 text-xs">•</span>;
}

function groupChatsByDate(chats) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const groups = { today: [], yesterday: [], previous7Days: [], older: [] };

  chats.forEach((chat) => {
    const createdAt = new Date(chat.createdAt || chat.updatedAt || Date.now());
    if (createdAt >= today) groups.today.push(chat);
    else if (createdAt >= yesterday) groups.yesterday.push(chat);
    else if (createdAt >= sevenDaysAgo) groups.previous7Days.push(chat);
    else groups.older.push(chat);
  });

  const result = [];
  if (groups.today.length > 0) result.push({ label: "Today", chats: groups.today });
  if (groups.yesterday.length > 0) result.push({ label: "Yesterday", chats: groups.yesterday });
  if (groups.previous7Days.length > 0) result.push({ label: "Previous 7 Days", chats: groups.previous7Days });
  if (groups.older.length > 0) result.push({ label: "Older", chats: groups.older });
  return result;
}

function getIconForChat(chat) {
  const title = (chat.title || "").toLowerCase();
  if (title.includes("api") || title.includes("doc")) return FileText;
  if (title.includes("design") || title.includes("ui")) return MonitorIcon;
  if (title.includes("meeting") || title.includes("note")) return RotateCcw;
  return MessageSquare;
}

export default DashboardUI;
