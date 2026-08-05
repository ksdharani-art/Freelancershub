import { useState, useEffect, useRef } from "react";
import { useApp } from "../context";
import { Send, ChevronLeft, ArrowRight, MessageSquare, ShieldAlert } from "lucide-react";

export default function Chat({ projectId }) {
  const { user, projects, chats, sendChatMessage } = useApp();
  const [typedMessage, setTypedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  if (!user) return null;

  const project = projects.find(p => p.id === projectId);
  const thread = chats[projectId] || [];

  // Determine chat recipient
  const isClient = user?.role === "client";
  const recipientName = project
    ? isClient
      ? project.freelancerName || "Alex Rivera"
      : project.clientName || "Sarah Jenkins"
    : "Chat Partner";

  // Auto-scroll chat thread to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [thread, isTyping]);

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fh-title-serif text-danger">Project Chat Not Found</h4>
        <button 
          onClick={() => window.location.hash = "#/login"}
          className="fh-btn-navy mt-3"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Security Gate: Ensure user is either the Client or assigned Freelancer on this project
  const isAuthorized = user.role === "admin" || project.clientId === user.id || project.freelancerId === user.id;
  if (!isAuthorized) {
    return (
      <div className="container py-5 text-center">
        <ShieldAlert size={48} className="text-danger mx-auto mb-3" />
        <h4 className="fh-title-serif">Unauthorized Access</h4>
        <p className="text-muted">You are not a participant in this project workspace.</p>
        <button onClick={() => window.location.hash = "/"} className="fh-btn-navy mt-3">Return to Safety</button>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    sendChatMessage(project.id, typedMessage);
    setTypedMessage("");
    setIsTyping(true);

    // Mocks writing effect for the bot
    setTimeout(() => {
      setIsTyping(false);
    }, 2400);
  };

  const handleBack = () => {
    if (isClient) {
      window.location.hash = "#/dashboard/client";
    } else {
      window.location.hash = "#/dashboard/freelancer";
    }
  };

  return (
    <div className="container py-5 px-4" style={{ maxHeight: "90vh" }}>
      {/* Back Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <button 
          onClick={handleBack}
          className="btn btn-link text-decoration-none d-flex align-items-center gap-1 p-0 fw-medium text-dark"
          style={{ fontSize: "13.5px" }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        <span className="text-muted" style={{ fontSize: "12px" }}>
          Contract: <strong className="text-dark">{project.title}</strong>
        </span>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="fh-card p-0 d-flex flex-column" style={{ height: "550px", overflow: "hidden" }}>
            {/* Header info bar */}
            <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-light">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                style={{ width: "36px", height: "36px", backgroundColor: "var(--fh-navy)", color: "#fff", fontSize: "13px" }}
              >
                {recipientName.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h6 className="fw-bold mb-0" style={{ fontSize: "14px" }}>{recipientName}</h6>
                <small className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                  <span className="d-inline-block rounded-circle bg-success" style={{ width: "6px", height: "6px" }} />
                  Active Workspace Chat
                </small>
              </div>
            </div>

            {/* Message bubbles body */}
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto", backgroundColor: "#FDFDFD" }}>
              {thread.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <MessageSquare size={36} className="mx-auto mb-3 text-muted-light" />
                  <p style={{ fontSize: "13px" }}>No messages yet. Send a greeting to initiate conversation.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {thread.map((msg, idx) => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <div 
                        key={idx} 
                        className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div 
                          style={{
                            maxWidth: "75%",
                            borderRadius: "12px",
                            padding: "10px 14px",
                            fontSize: "13.5px",
                            lineHeight: "1.4",
                            backgroundColor: isMe ? "var(--fh-navy)" : "#F1F2F6",
                            color: isMe ? "#fff" : "var(--fh-navy)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            borderTopRightRadius: isMe ? "2px" : "12px",
                            borderTopLeftRadius: isMe ? "12px" : "2px"
                          }}
                        >
                          <small className="d-block mb-1 opacity-75" style={{ fontSize: "9.5px", fontWeight: "600" }}>
                            {isMe ? "You" : msg.senderName}
                          </small>
                          <p className="mb-1" style={{ wordBreak: "break-word" }}>{msg.message}</p>
                          <small 
                            className="d-block text-end opacity-50" 
                            style={{ fontSize: "8.5px" }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="d-flex justify-content-start">
                      <div 
                        className="p-3 bg-light rounded" 
                        style={{
                          borderRadius: "12px",
                          borderTopLeftRadius: "2px",
                          fontSize: "12.5px"
                        }}
                      >
                        <small className="text-muted italic d-block mb-1">{recipientName} is typing...</small>
                        <div className="d-flex gap-1 align-items-center mt-1">
                          <span className="d-inline-block bg-muted rounded-circle" style={{ width: "5px", height: "5px", backgroundColor: "#9CA3AF", animation: "bounce 1.2s infinite 0.2s" }} />
                          <span className="d-inline-block bg-muted rounded-circle" style={{ width: "5px", height: "5px", backgroundColor: "#9CA3AF", animation: "bounce 1.2s infinite 0.4s" }} />
                          <span className="d-inline-block bg-muted rounded-circle" style={{ width: "5px", height: "5px", backgroundColor: "#9CA3AF", animation: "bounce 1.2s infinite 0.6s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              )}
            </div>

            {/* Message input footer */}
            <form onSubmit={handleSend} className="p-3 border-top bg-light d-flex gap-2">
              <input 
                type="text" 
                placeholder="Type your message details..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="form-control fh-input-classic"
                style={{ fontSize: "13.5px" }}
              />
              <button 
                type="submit" 
                className="fh-btn-navy px-3"
                disabled={!typedMessage.trim()}
                style={{ borderRadius: "10px" }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Styles for typing bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
