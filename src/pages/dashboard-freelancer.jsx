import { useState } from "react";
import { useApp } from "../context";
import { DollarSign, MessageSquare, Award, Clock, Star, BrainCircuit, ExternalLink, Plus } from "lucide-react";

export default function DashboardFreelancer() {
  const { user, projects, bids } = useApp();
  const [newSkill, setNewSkill] = useState("");
  const [localSkills, setLocalSkills] = useState(user?.skills || ["React", "CSS"]);

  if (!user) return null;

  const myBids = bids.filter((b) => b.freelancerId === user.id);
  const activeContractsCount = myBids.filter((b) => b.status === "accepted").length;

  const getProjectTitle = (projId) => {
    const proj = projects.find((p) => p.id === projId);
    return proj ? proj.title : "Unknown Project";
  };

  const getProjectStatus = (projId) => {
    const proj = projects.find((p) => p.id === projId);
    return proj ? proj.status : "open";
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !localSkills.includes(newSkill.trim())) {
      setLocalSkills([...localSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">Pending</span>;
      case "accepted":
        return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Accepted</span>;
      case "rejected":
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">Rejected</span>;
      default:
        return <span className="badge bg-light text-dark px-2 py-1">{status}</span>;
    }
  };

  return (
    <div className="container py-5 px-4">
      {/* Header */}
      <div className="mb-5 pb-3 border-bottom">
        <h1 className="fh-title-serif mb-2">Freelancer Dashboard</h1>
        <p className="fh-subtitle-sans mb-0">Track your proposals, active client work, and professional credentials.</p>
      </div>

      <div className="row g-4">
        {/* Main Panel - Bids and Work */}
        <div className="col-lg-8">
          {/* Stats Bar */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="fh-card p-3 d-flex align-items-center gap-2">
                <div className="p-2 bg-light text-success rounded">
                  <DollarSign size={20} />
                </div>
                <div>
                  <small className="text-muted d-block" style={{ fontSize: "10px" }}>EARNED VOLUME</small>
                  <span className="fw-bold" style={{ fontSize: "16px" }}>₹{user.earnings?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="fh-card p-3 d-flex align-items-center gap-2">
                <div className="p-2 bg-light text-primary rounded">
                  <Clock size={20} />
                </div>
                <div>
                  <small className="text-muted d-block" style={{ fontSize: "10px" }}>SENT PROPOSALS</small>
                  <span className="fw-bold" style={{ fontSize: "16px" }}>{myBids.length} Submitted</span>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="fh-card p-3 d-flex align-items-center gap-2">
                <div className="p-2 bg-light text-warning rounded">
                  <Star size={20} />
                </div>
                <div>
                  <small className="text-muted d-block" style={{ fontSize: "10px" }}>AVERAGE RATING</small>
                  <span className="fw-bold text-warning-emphasis" style={{ fontSize: "16px" }}>
                    {user.rating} <Star size={12} fill="currentColor" className="mb-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposals List */}
          <div className="fh-card">
            <h5 className="fw-semibold mb-4" style={{ fontSize: "16px" }}>Your Proposals & Bids Log</h5>
            
            {myBids.length === 0 ? (
              <div className="text-center py-5">
                <Award size={36} className="text-muted mx-auto mb-3" />
                <p className="text-muted mb-3" style={{ fontSize: "13px" }}>You haven't submitted any bids yet.</p>
                <button 
                  onClick={() => window.location.hash = "#/projects"} 
                  className="fh-btn-gold btn-sm py-2"
                >
                  Browse Open Projects
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle" style={{ fontSize: "13px" }}>
                  <thead>
                    <tr className="table-light">
                      <th scope="col" style={{ width: "35%" }}>Project Title</th>
                      <th scope="col">Bid Amount</th>
                      <th scope="col">Timeline</th>
                      <th scope="col">Bid Status</th>
                      <th scope="col" className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBids.map((bid) => {
                      const projStatus = getProjectStatus(bid.projectId);
                      return (
                        <tr key={bid.id}>
                          <td>
                            <span 
                              onClick={() => window.location.hash = `#/projects/${bid.projectId}`}
                              className="fw-semibold text-dark text-decoration-none" 
                              style={{ cursor: "pointer" }}
                            >
                              {getProjectTitle(bid.projectId)}
                            </span>
                          </td>
                          <td className="fw-bold">₹{bid.amount.toLocaleString()}</td>
                          <td>{bid.days} Days</td>
                          <td>{getStatusBadge(bid.status)}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              {bid.status === "accepted" ? (
                                <>
                                  <button 
                                    onClick={() => window.location.hash = `#/project/${bid.projectId}/chat`}
                                    className="btn btn-xs btn-outline-dark p-1"
                                    title="Open Chat"
                                  >
                                    <MessageSquare size={13} />
                                  </button>
                                  {(projStatus === "in-progress" || projStatus === "review-pending") && (
                                    <button 
                                      onClick={() => window.location.hash = `#/project/${bid.projectId}/submit`}
                                      className="btn btn-xs btn-success text-white p-1"
                                      title="Submit Work"
                                    >
                                      <Award size={13} />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <button 
                                  onClick={() => window.location.hash = `#/projects/${bid.projectId}`}
                                  className="btn btn-xs btn-light border p-1"
                                  title="View Specs"
                                >
                                  <ExternalLink size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info - Profile details */}
        <div className="col-lg-4">
          <div className="fh-card p-4 mb-4">
            <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
              <BrainCircuit size={18} className="text-primary" /> Credentials & Bio
            </h5>

            <div className="mb-4 text-center pb-3 border-bottom">
              <div className="rounded-circle bg-dark-subtle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "60px", height: "60px", backgroundColor: "#D9A441", color: "#10192E", fontWeight: "600", fontSize: "18px" }}>
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <h6 className="fw-bold mb-1">{user.name}</h6>
              <span className="text-muted" style={{ fontSize: "12px" }}>{user.title || "Full Stack Expert"}</span>
            </div>

            {/* Biography */}
            <div className="mb-4">
              <label className="fh-form-label">Professional Summary</label>
              <p className="text-muted" style={{ fontSize: "12.5px", lineHeight: "1.6" }}>
                Freelance developer specialized in creating rapid prototype applications, clean database architectures, and intuitive React frontends. Delivering quality code on time.
              </p>
            </div>

            {/* Skills Badges */}
            <div>
              <label className="fh-form-label">Verified Skill Pills</label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {localSkills.map((skill, idx) => (
                  <span key={idx} className="badge bg-light text-dark border py-1.5 px-2 fw-medium" style={{ fontSize: "11px", borderRadius: "6px" }}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* Add local Skill pill form */}
              <form onSubmit={handleAddSkill} className="d-flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Web3, Next.js"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="form-control form-control-sm border"
                  style={{ fontSize: "12px", borderRadius: "6px" }}
                />
                <button type="submit" className="btn btn-sm btn-dark d-flex align-items-center justify-content-center p-2" style={{ borderRadius: "6px" }}>
                  <Plus size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
