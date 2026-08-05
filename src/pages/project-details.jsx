import { useState } from "react";
import { useApp } from "../context";
import { ChevronLeft, Calendar, Tag, DollarSign, Send, CheckCircle2, User, Award } from "lucide-react";

export default function ProjectDetails({ projectId }) {
  const { projects, bids, submitBid, user } = useApp();
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const [message, setMessage] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fh-title-serif text-danger">Project Not Found</h3>
        <p className="text-muted">The project details you are looking for do not exist or have been removed.</p>
        <button className="fh-btn-navy mt-3" onClick={() => window.location.hash = "#/projects"}>
          <ChevronLeft size={16} /> Back to Projects
        </button>
      </div>
    );
  }

  // Check if current freelancer already placed a bid
  const myBid = user && user.role === "freelancer" 
    ? bids.find(b => b.projectId === project.id && b.freelancerId === user.id) 
    : null;

  // Filter all bids for this project (visible to client and freelancers)
  const projectBids = bids.filter(b => b.projectId === project.id);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    if (!amount || !days || !message) {
      setStatusMsg({ type: "danger", text: "Please fill in all proposal fields." });
      return;
    }

    if (Number(amount) <= 0 || Number(days) <= 0) {
      setStatusMsg({ type: "danger", text: "Please enter valid numeric amounts." });
      return;
    }

    const result = submitBid(project.id, amount, message, days);
    if (result.success) {
      setStatusMsg({ type: "success", text: "Your proposal was successfully submitted!" });
      setAmount("");
      setDays("");
      setMessage("");
    } else {
      setStatusMsg({ type: "danger", text: result.error || "Failed to submit bid." });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "open": return "bg-warning-subtle text-warning-emphasis";
      case "in-progress": return "bg-primary-subtle text-primary-emphasis";
      case "review-pending": return "bg-info-subtle text-info-emphasis";
      case "completed": return "bg-success-subtle text-success-emphasis";
      default: return "bg-light text-dark";
    }
  };

  return (
    <div className="container py-5 px-4">
      {/* Back Button */}
      <button 
        className="btn btn-link text-decoration-none d-flex align-items-center gap-1 p-0 mb-4 fw-medium text-dark"
        onClick={() => window.location.hash = "#/projects"}
        style={{ fontSize: "14px" }}
      >
        <ChevronLeft size={16} /> Back to Listings
      </button>

      <div className="row g-5">
        {/* Main Details Area */}
        <div className="col-lg-8">
          <div className="fh-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <span className={`badge ${getStatusBadgeClass(project.status)} px-3 py-2 fw-semibold mb-2`} style={{ borderRadius: "8px", textTransform: "capitalize" }}>
                  Status: {project.status.replace("-", " ")}
                </span>
                <h2 className="fh-title-serif mt-1" style={{ fontSize: "28px" }}>{project.title}</h2>
                <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                  Posted by <strong className="text-dark">{project.clientName}</strong> • {project.createdAt}
                </p>
              </div>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="row g-3 p-3 my-3 bg-light rounded" style={{ fontSize: "14px" }}>
              <div className="col-md-4 d-flex align-items-center gap-2">
                <DollarSign size={18} className="text-muted" />
                <div>
                  <small className="text-muted d-block" style={{ fontSize: "11px" }}>ESTIMATED BUDGET</small>
                  <span className="fw-semibold">₹{project.budget.toLocaleString()}</span>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center gap-2">
                <Calendar size={18} className="text-muted" />
                <div>
                  <small className="text-muted d-block" style={{ fontSize: "11px" }}>TIMELINE</small>
                  <span className="fw-semibold">{project.duration}</span>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-center gap-2">
                <Tag size={18} className="text-muted" />
                <div>
                  <small className="text-muted d-block" style={{ fontSize: "11px" }}>CATEGORY</small>
                  <span className="fw-semibold">{project.category}</span>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="mt-4">
              <h5 className="fw-semibold mb-3" style={{ fontSize: "16px" }}>Project Scope</h5>
              <p className="text-muted mb-0" style={{ fontSize: "14.5px", lineHeight: "1.7" }}>
                {project.description}
              </p>
            </div>
          </div>

          {/* Received Bids Listing (Visible to all for demonstration) */}
          <div className="fh-card p-4">
            <h5 className="fw-semibold mb-4" style={{ fontSize: "16px" }}>Active Proposals ({projectBids.length})</h5>
            {projectBids.length === 0 ? (
              <p className="text-muted mb-0" style={{ fontSize: "13px" }}>No proposals submitted yet. Be the first to pitch!</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {projectBids.map(b => (
                  <div key={b.id} className="p-3 border rounded bg-light-subtle d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <User size={14} className="text-muted" />
                        <span className="fw-semibold" style={{ fontSize: "13.5px" }}>{b.freelancerName}</span>
                        {b.status === "accepted" && (
                          <span className="badge bg-success-subtle text-success border border-success-subtle py-1" style={{ fontSize: "9px" }}>
                            Accepted Bid
                          </span>
                        )}
                      </div>
                      {/* Only show messages for accepted bids or if the current user is the poster/bidder */}
                      {(user?.role === "client" || user?.id === b.freelancerId || b.status === "accepted") ? (
                        <p className="text-muted mb-0 italic" style={{ fontSize: "13px", fontStyle: "italic" }}>
                          "{b.message}"
                        </p>
                      ) : (
                        <p className="text-muted mb-0 small" style={{ fontSize: "12px" }}>
                          [Proposal description hidden for privacy]
                        </p>
                      )}
                    </div>
                    <div className="text-end" style={{ minWidth: "120px" }}>
                      <span className="fw-bold text-dark d-block" style={{ fontSize: "14px" }}>₹{b.amount.toLocaleString()}</span>
                      <small className="text-muted" style={{ fontSize: "11px" }}>Delivered in {b.days} days</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Action Center (Bid Form or Info Box) */}
        <div className="col-lg-4">
          {/* Case 1: Freelancer View - Post Bid */}
          {user?.role === "freelancer" && project.status === "open" && !myBid && (
            <div className="fh-card p-4" style={{ position: "sticky", top: "90px" }}>
              <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
                <Award size={18} className="text-warning" /> Submit Proposal
              </h5>

              {statusMsg.text && (
                <div className={`alert alert-${statusMsg.type} py-2 px-3 mb-3`} style={{ fontSize: "12px" }}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleBidSubmit}>
                <div className="mb-3">
                  <label className="fh-form-label">Your Bid Amount (₹)</label>
                  <div className="fh-input-group">
                    <DollarSign size={16} className="text-muted" />
                    <input 
                      type="number" 
                      placeholder="e.g. 42000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>Suggested: Up to ₹{project.budget.toLocaleString()}</small>
                </div>

                <div className="mb-3">
                  <label className="fh-form-label">Estimated Delivery (Days)</label>
                  <div className="fh-input-group">
                    <Calendar size={16} className="text-muted" />
                    <input 
                      type="number" 
                      placeholder="e.g. 10"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="fh-form-label">Proposal Letter</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your credentials, project understanding, and why the client should pick you..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control fh-input-classic"
                    style={{ fontSize: "13px", resize: "none" }}
                  />
                </div>

                <button type="submit" className="w-100 fh-btn-gold justify-content-center py-2">
                  <Send size={14} /> Send Proposal
                </button>
              </form>
            </div>
          )}

          {/* Case 2: Freelancer View - Already Bid */}
          {user?.role === "freelancer" && myBid && (
            <div className="fh-card p-4 border border-warning" style={{ position: "sticky", top: "90px", backgroundColor: "#FFFDF9" }}>
              <div className="d-flex align-items-center gap-2 mb-3 text-warning-emphasis">
                <CheckCircle2 size={20} className="text-success" />
                <h5 className="fw-semibold mb-0" style={{ fontSize: "16px" }}>Proposal Submitted</h5>
              </div>
              <p className="text-muted mb-4" style={{ fontSize: "13px" }}>
                You have already bid on this project. The client has been notified of your terms.
              </p>

              <div className="p-3 border rounded bg-white" style={{ fontSize: "13px" }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Your Price:</span>
                  <span className="fw-semibold text-dark">₹{myBid.amount.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Duration:</span>
                  <span className="fw-semibold text-dark">{myBid.days} days</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Status:</span>
                  <span className="badge bg-warning-subtle text-warning fw-semibold px-2 py-1" style={{ fontSize: "10px", textTransform: "capitalize" }}>
                    {myBid.status}
                  </span>
                </div>
              </div>

              {/* Shortcut buttons if bid is accepted */}
              {myBid.status === "accepted" && (
                <div className="mt-4 d-flex flex-column gap-2">
                  <button 
                    onClick={() => window.location.hash = `#/project/${project.id}/chat`}
                    className="w-100 fh-btn-navy justify-content-center py-2"
                  >
                    Open Workspace Chat
                  </button>
                  <button 
                    onClick={() => window.location.hash = `#/project/${project.id}/submit`}
                    className="w-100 fh-btn-outline justify-content-center py-2"
                  >
                    Submit Project Files
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Case 3: Project is in-progress or closed */}
          {project.status !== "open" && (!myBid || myBid.status !== "accepted") && (
            <div className="fh-card p-4 text-center bg-light" style={{ position: "sticky", top: "90px" }}>
              <CheckCircle2 size={32} className="text-muted mx-auto mb-3" />
              <h5 className="fw-semibold mb-2" style={{ fontSize: "15px" }}>Project Closed</h5>
              <p className="text-muted mb-0" style={{ fontSize: "12.5px" }}>
                This project is currently {project.status.replace("-", " ")} and is no longer accepting new bids.
              </p>
            </div>
          )}

          {/* Case 4: Client View - Manage Dashboard */}
          {user?.role === "client" && (
            <div className="fh-card p-4 text-center bg-light" style={{ position: "sticky", top: "90px" }}>
              <User size={32} className="text-primary mx-auto mb-3" />
              <h5 className="fw-semibold mb-2" style={{ fontSize: "15px" }}>Manage Project Bids</h5>
              <p className="text-muted mb-4" style={{ fontSize: "12.5px" }}>
                You posted this project. You can review all received bids, accept proposals, and initiate chat on your Client Dashboard.
              </p>
              <button 
                onClick={() => window.location.hash = "#/dashboard/client"}
                className="w-100 fh-btn-navy justify-content-center py-2"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
