import { useState } from "react";
import { useApp } from "../context";
import { Plus, FolderClosed, DollarSign, Users, Award, MessageSquare, ExternalLink, Calendar, CheckSquare, Sparkles } from "lucide-react";

export default function DashboardClient() {
  const { user, projects, bids, postProject, acceptBid } = useApp();
  const [showPostForm, setShowPostForm] = useState(false);
  
  // Post Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("14 days");
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  if (!user) return null;

  const clientProjects = projects.filter(p => p.clientId === user.id);
  const activeContracts = clientProjects.filter(p => p.status === "in-progress" || p.status === "review-pending").length;
  
  // Total Spendings Calculator
  const totalSpendings = clientProjects
    .filter(p => p.status === "completed" || p.status === "in-progress" || p.status === "review-pending")
    .reduce((sum, p) => sum + (p.contractAmount || p.budget), 0);

  const getBidsForProject = (projId) => {
    return bids.filter(b => b.projectId === projId);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    setStatusMsg({ type: "", text: "" });

    if (!title || !description || !budget || !duration) {
      setStatusMsg({ type: "danger", text: "Please fill out all fields." });
      return;
    }

    if (Number(budget) <= 0) {
      setStatusMsg({ type: "danger", text: "Please enter a valid budget." });
      return;
    }

    const result = postProject(title, description, budget, duration, category);
    if (result.success) {
      setStatusMsg({ type: "success", text: `"${title}" has been successfully posted!` });
      setTitle("");
      setDescription("");
      setBudget("");
      setDuration("14 days");
      setTimeout(() => {
        setShowPostForm(false);
        setStatusMsg({ type: "", text: "" });
      }, 1500);
    } else {
      setStatusMsg({ type: "danger", text: result.error || "Failed to post project" });
    }
  };

  const handleAcceptBid = (bidId, freelancerName) => {
    if (window.confirm(`Are you sure you want to hire ${freelancerName} for this contract?`)) {
      acceptBid(bidId);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return <span className="fh-badge-status fh-badge-open">Open Bids</span>;
      case "in-progress":
        return <span className="fh-badge-status fh-badge-progress">In Progress</span>;
      case "review-pending":
        return <span className="fh-badge-status fh-badge-review">Review Pending</span>;
      case "completed":
        return <span className="fh-badge-status fh-badge-completed">Completed</span>;
      default:
        return <span className="fh-badge-status bg-light text-dark">{status}</span>;
    }
  };

  return (
    <div className="container py-5 px-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 pb-3 border-bottom gap-3">
        <div>
          <h1 className="fh-title-serif mb-2">Welcome back, {user.name}</h1>
          <p className="fh-subtitle-sans mb-0">Manage projects, review pitches, and collaborate with your hired specialists.</p>
        </div>
        <button 
          onClick={() => setShowPostForm(!showPostForm)}
          className="fh-btn-gold"
        >
          <Plus size={16} /> Post a New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="fh-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 bg-light rounded" style={{ color: "var(--fh-gold-dark)" }}>
              <FolderClosed size={24} />
            </div>
            <div>
              <small className="text-muted d-block" style={{ fontSize: "11px" }}>TOTAL PROJECTS</small>
              <h3 className="fw-bold mb-0" style={{ fontSize: "22px" }}>{clientProjects.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="fh-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 bg-light rounded text-primary">
              <Users size={24} />
            </div>
            <div>
              <small className="text-muted d-block" style={{ fontSize: "11px" }}>ACTIVE CONTRACTS</small>
              <h3 className="fw-bold mb-0" style={{ fontSize: "22px" }}>{activeContracts}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="fh-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 bg-light rounded text-success">
              <DollarSign size={24} />
            </div>
            <div>
              <small className="text-muted d-block" style={{ fontSize: "11px" }}>ESTIMATED TOTAL OUTLAY</small>
              <h3 className="fw-bold mb-0" style={{ fontSize: "22px" }}>₹{totalSpendings.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Post Project Form Container */}
      {showPostForm && (
        <div className="fh-card p-4 mb-5 border border-primary bg-white shadow">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h4 className="fw-semibold mb-0" style={{ fontSize: "18px" }}>Post a Project Pitch</h4>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowPostForm(false)}
            />
          </div>

          {statusMsg.text && (
            <div className={`alert alert-${statusMsg.type} py-2 px-3 mb-4`} style={{ fontSize: "13px" }}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handlePostSubmit}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="fh-form-label">Project Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Modern Shopify Website redesign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="fh-input-classic"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="fh-form-label">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select fh-input-classic"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Content & Marketing">Content & Marketing</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="fh-form-label">Budget Range (₹)</label>
                <div className="fh-input-group">
                  <DollarSign size={16} className="text-muted" />
                  <input 
                    type="number" 
                    placeholder="e.g. 45000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="fh-form-label">Timeline / Delivery Window</label>
                <div className="fh-input-group">
                  <Calendar size={16} className="text-muted" />
                  <input 
                    type="text" 
                    placeholder="e.g. 14 days"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-12 mb-2">
                <label className="fh-form-label">Detailed Project Specifications</label>
                <textarea 
                  rows={4} 
                  placeholder="Outline requirements, milestones, integrations, and deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control fh-input-classic"
                  style={{ resize: "none" }}
                  required
                />
              </div>

              <div className="col-12 text-end">
                <button type="button" className="btn btn-sm btn-light border me-2 px-3 py-2 fw-medium" style={{ borderRadius: "8px" }} onClick={() => setShowPostForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="fh-btn-gold px-4 py-2">
                  <Sparkles size={14} /> Launch Project
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div>
        <h4 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ fontSize: "18px" }}>
          <CheckSquare size={18} /> Manage Posted Projects
        </h4>

        {clientProjects.length === 0 ? (
          <div className="fh-card text-center py-5">
            <FolderClosed size={40} className="text-muted mx-auto mb-3" />
            <h5 className="fw-semibold">No Projects Posted Yet</h5>
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>Get started by launching your first project on the market.</p>
            <button 
              onClick={() => setShowPostForm(true)}
              className="fh-btn-gold py-2"
            >
              <Plus size={14} /> Post a Project
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {clientProjects.map((proj) => {
              const projectBids = getBidsForProject(proj.id);
              return (
                <div key={proj.id} className="fh-card p-4">
                  {/* Top card metadata */}
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div>
                      <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: "18px" }}>{proj.title}</h5>
                      <span className="text-muted" style={{ fontSize: "12px" }}>
                        Posted: {proj.createdAt} • Category: <strong>{proj.category}</strong>
                      </span>
                    </div>
                    {getStatusBadge(proj.status)}
                  </div>

                  {/* Quick summary line */}
                  <p className="text-muted" style={{ fontSize: "13.5px", lineHeight: "1.5" }}>
                    {proj.description.substring(0, 160)}...
                  </p>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top flex-wrap gap-3">
                    <div style={{ fontSize: "13px" }}>
                      <span className="fw-semibold text-dark">Budget Outlay:</span> ₹{(proj.contractAmount || proj.budget).toLocaleString()}
                    </div>

                    {/* Navigation buttons according to status */}
                    <div className="d-flex gap-2">
                      {proj.status === "in-progress" && (
                        <button 
                          onClick={() => window.location.hash = `#/project/${proj.id}/chat`}
                          className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1 py-2 px-3 fw-medium"
                          style={{ borderRadius: "8px" }}
                        >
                          <MessageSquare size={13} /> Chat Workspace
                        </button>
                      )}

                      {proj.status === "review-pending" && (
                        <>
                          <button 
                            onClick={() => window.location.hash = `#/project/${proj.id}/chat`}
                            className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1 py-2 px-3 fw-medium"
                            style={{ borderRadius: "8px" }}
                          >
                            <MessageSquare size={13} /> Chat Workspace
                          </button>
                          <button 
                            onClick={() => window.location.hash = `#/project/${proj.id}/submit`}
                            className="btn btn-sm btn-success d-flex align-items-center gap-1 py-2 px-3 fw-medium"
                            style={{ borderRadius: "8px" }}
                          >
                            <Award size={13} /> Review Work
                          </button>
                        </>
                      )}

                      {proj.status === "completed" && (
                        <button 
                          onClick={() => window.location.hash = `#/project/${proj.id}/submit`}
                          className="btn btn-sm btn-light border d-flex align-items-center gap-1 py-2 px-3 fw-medium"
                          style={{ borderRadius: "8px" }}
                        >
                          <ExternalLink size={13} /> View Feedback
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bids Drawer - Nested inside "open" projects */}
                  {proj.status === "open" && (
                    <div className="mt-4 pt-4 border-top">
                      <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>Received Proposals ({projectBids.length})</h6>
                      {projectBids.length === 0 ? (
                        <p className="text-muted mb-0" style={{ fontSize: "12px" }}>No proposals submitted by freelancers yet.</p>
                      ) : (
                        <div className="d-flex flex-column gap-3">
                          {projectBids.map((b) => (
                            <div key={b.id} className="p-3 border rounded bg-light d-flex justify-content-between align-items-start flex-wrap gap-3">
                              <div style={{ flex: 1 }}>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <strong className="text-dark" style={{ fontSize: "13px" }}>{b.freelancerName}</strong>
                                  <span className="text-muted" style={{ fontSize: "11px" }}>Delivers in {b.days} days</span>
                                </div>
                                <p className="text-muted mb-0 small" style={{ fontSize: "12.5px" }}>"{b.message}"</p>
                              </div>
                              <div className="text-end d-flex flex-column align-items-end gap-2">
                                <span className="fw-bold text-dark d-block" style={{ fontSize: "14px" }}>₹{b.amount.toLocaleString()}</span>
                                <button 
                                  onClick={() => handleAcceptBid(b.id, b.freelancerName)}
                                  className="btn btn-xs btn-primary fw-medium px-3 py-1 text-white border-0"
                                  style={{ fontSize: "11px", backgroundColor: "var(--fh-teal)", borderRadius: "6px" }}
                                >
                                  Accept & Hire
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
