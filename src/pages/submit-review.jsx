import { useState } from "react";
import { useApp } from "../context";
import { ChevronLeft, UploadCloud, FileCheck, Star, Award, DollarSign, Download, Clock, ShieldAlert } from "lucide-react";

export default function SubmitReview({ projectId }) {
  const { user, projects, submissions, reviews, submitWork, submitReview } = useApp();
  
  // Local state for Freelancer Submission
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState("");

  // Local state for Client Review
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  if (!user) return null;

  const project = projects.find(p => p.id === projectId);
  const activeSubmission = submissions.find(s => s.projectId === projectId);
  const activeReview = reviews.find(r => r.projectId === projectId);

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fh-title-serif text-danger">Workspace Not Found</h4>
        <button onClick={() => window.location.hash = "/"} className="fh-btn-navy mt-3">Go Home</button>
      </div>
    );
  }

  // Security Gate
  const isParticipant = user.role === "admin" || project.clientId === user.id || project.freelancerId === user.id;
  if (!isParticipant) {
    return (
      <div className="container py-5 text-center">
        <ShieldAlert size={48} className="text-danger mx-auto mb-3" />
        <h4 className="fh-title-serif">Access Blocked</h4>
        <p className="text-muted">You are not authorized to view this work review portal.</p>
        <button onClick={() => window.location.hash = "/"} className="fh-btn-navy mt-3">Return</button>
      </div>
    );
  }

  // Simulate File Upload progress bar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleWorkSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const result = submitWork(project.id, selectedFile.name, submissionNotes);
    if (result.success) {
      setSelectedFile(null);
      setSubmissionNotes("");
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setStatusMsg({ type: "danger", text: "Please enter feedback comment." });
      return;
    }

    const result = submitReview(project.id, rating, reviewComment);
    if (result.success) {
      setStatusMsg({ type: "success", text: "Review submitted. Project marked as completed." });
    }
  };

  const handleBack = () => {
    if (user.role === "client") {
      window.location.hash = "#/dashboard/client";
    } else {
      window.location.hash = "#/dashboard/freelancer";
    }
  };

  return (
    <div className="container py-5 px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 pb-2 border-bottom">
        <button 
          onClick={handleBack}
          className="btn btn-link text-decoration-none d-flex align-items-center gap-1 p-0 fw-medium text-dark"
          style={{ fontSize: "14px" }}
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        <span className="text-muted" style={{ fontSize: "12px" }}>
          Contract Review: <strong className="text-dark">{project.title}</strong>
        </span>
      </div>

      <div className="row g-5 justify-content-center">
        <div className="col-lg-8">
          
          {/* Section 1: Project Metadata Card */}
          <div className="fh-card p-4 mb-4">
            <h5 className="fw-semibold mb-3" style={{ fontSize: "15px" }}>Contract Summary</h5>
            <div className="row g-2" style={{ fontSize: "13px" }}>
              <div className="col-sm-6 text-muted">Client: <strong className="text-dark">{project.clientName}</strong></div>
              <div className="col-sm-6 text-muted">Contractor: <strong className="text-dark">{project.freelancerName || "Pending"}</strong></div>
              <div className="col-sm-6 text-muted">Contract Price: <strong className="text-dark">₹{(project.contractAmount || project.budget).toLocaleString()}</strong></div>
              <div className="col-sm-6 text-muted">Stipulated Window: <strong className="text-dark">{project.duration}</strong></div>
            </div>
          </div>

          {/* Section 2: FREELANCER ACTIONS - SUBMIT WORK */}
          {user.role === "freelancer" && project.status === "in-progress" && (
            <div className="fh-card p-4">
              <h4 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ fontSize: "18px" }}>
                <UploadCloud size={22} className="text-primary" /> Deliver Codebase / Asset files
              </h4>

              <form onSubmit={handleWorkSubmit}>
                {/* Upload box */}
                <div 
                  className="border border-dashed rounded text-center p-5 mb-4"
                  style={{
                    backgroundColor: "#F8F9FA",
                    borderColor: "var(--fh-border)",
                    cursor: "pointer",
                    position: "relative"
                  }}
                >
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="position-absolute opacity-0 top-0 left-0 w-100 h-100"
                    style={{ cursor: "pointer" }}
                    disabled={uploading}
                  />

                  {uploadProgress === 0 ? (
                    <div>
                      <UploadCloud size={40} className="text-muted mx-auto mb-2" />
                      <p className="mb-1 fw-medium" style={{ fontSize: "13.5px" }}>Click or drag a file to submit</p>
                      <small className="text-muted" style={{ fontSize: "11px" }}>ZIP, PDF or PNG formats accepted. Max 50MB.</small>
                    </div>
                  ) : (
                    <div>
                      <FileCheck size={40} className="text-success mx-auto mb-2" />
                      <p className="mb-1 fw-bold text-success" style={{ fontSize: "13.5px" }}>
                        {uploadProgress < 100 ? "Uploading asset files..." : "File Uploaded successfully!"}
                      </p>
                      <small className="text-muted d-block mb-2" style={{ fontSize: "11.5px" }}>
                        {selectedFile ? selectedFile.name : "Uploading..."} ({(uploadProgress)}%)
                      </small>
                      <div className="progress mx-auto" style={{ width: "200px", height: "6px" }}>
                        <div className="progress-bar bg-success" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="fh-form-label">Submission Remarks / Notes</label>
                  <textarea 
                    rows={4}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Provide details on the features built, build files location, setup steps, or any other credentials for review..."
                    className="form-control fh-input-classic"
                    style={{ fontSize: "13.5px", resize: "none" }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-100 fh-btn-gold justify-content-center py-2.5"
                  disabled={uploading || !selectedFile}
                >
                  Submit Codebase for Review
                </button>
              </form>
            </div>
          )}

          {/* Freelancer has submitted, waiting for Client review */}
          {user.role === "freelancer" && project.status === "review-pending" && (
            <div className="fh-card p-4 text-center bg-light">
              <Clock size={40} className="text-primary mx-auto mb-3" />
              <h5 className="fw-semibold mb-2">Deliverables Pending Review</h5>
              <p className="text-muted mb-4 mx-auto" style={{ fontSize: "13px", maxWidth: "450px" }}>
                You submitted files for this project. The client (Sarah Jenkins) has been notified. We will update your earnings log as soon as they review it.
              </p>

              {activeSubmission && (
                <div className="p-3 border rounded bg-white text-start mb-0" style={{ fontSize: "13px" }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">File Submitted:</span>
                    <strong className="text-dark">{activeSubmission.fileUrl}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Submission Date:</span>
                    <strong>{activeSubmission.submittedAt}</strong>
                  </div>
                  <p className="text-muted mb-0 small mt-2 pt-2 border-top">
                    Remarks: "{activeSubmission.comments}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Section 3: CLIENT ACTIONS - EXAMINE DELIVERABLES AND LEAVE REVIEW */}
          {user.role === "client" && project.status === "review-pending" && (
            <div className="d-flex flex-column gap-4">
              {/* Deliverables Info Card */}
              <div className="fh-card p-4">
                <h5 className="fw-semibold mb-3" style={{ fontSize: "15px" }}>Freelancer Deliverables</h5>
                
                {activeSubmission ? (
                  <div className="p-3 bg-light rounded" style={{ fontSize: "13px" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: "10px" }}>SUBMITTED FILE</small>
                        <strong style={{ fontSize: "14px" }}>{activeSubmission.fileUrl}</strong>
                      </div>
                      <a href="#" className="btn btn-sm btn-dark d-flex align-items-center gap-1 py-2 px-3 text-white" style={{ borderRadius: "8px" }}>
                        <Download size={13} /> Download Zip
                      </a>
                    </div>
                    <div className="mt-2 pt-2 border-top">
                      <small className="text-muted d-block" style={{ fontSize: "10px" }}>FREELANCER COMMENTS</small>
                      <p className="text-muted mb-0 italic" style={{ fontSize: "13px" }}>"{activeSubmission.comments}"</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted mb-0">No submission files logged.</p>
                )}
              </div>

              {/* Review and Rating Form */}
              <div className="fh-card p-4">
                <h4 className="fw-semibold mb-4" style={{ fontSize: "18px" }}>Review & Approve Deliverables</h4>

                {statusMsg.text && (
                  <div className={`alert alert-${statusMsg.type} py-2 px-3 mb-3`} style={{ fontSize: "13px" }}>
                    {statusMsg.text}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit}>
                  {/* Star selector */}
                  <div className="mb-4 text-center">
                    <label className="fh-form-label d-block text-center mb-2">Select Star Rating</label>
                    <div className="d-flex justify-content-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="btn btn-link p-0 text-decoration-none"
                          style={{ color: star <= (hoverRating || rating) ? "#D9A441" : "#E4E2DC", transition: "color 0.1s" }}
                        >
                          <Star size={36} fill={star <= (hoverRating || rating) ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    <span className="text-muted mt-2 d-block" style={{ fontSize: "12px" }}>
                      Rating: <strong>{rating} Stars</strong> ({rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : "Needs Improvement"})
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="fh-form-label">Review Comment & Feedback</label>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write feedback about delivery speed, communication, code quality, and expertise..."
                      className="form-control fh-input-classic"
                      style={{ fontSize: "13.5px", resize: "none" }}
                      required
                    />
                  </div>

                  <button type="submit" className="w-100 fh-btn-gold justify-content-center py-2.5">
                    <Award size={15} /> Complete Review & Release Funds (₹{(project.contractAmount || project.budget).toLocaleString()})
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Waiting on freelancer to submit (Client View) */}
          {user.role === "client" && project.status === "in-progress" && (
            <div className="fh-card p-5 text-center bg-light">
              <UploadCloud size={40} className="text-muted mx-auto mb-3" />
              <h5 className="fw-semibold mb-2">Awaiting Freelancer Deliverables</h5>
              <p className="text-muted mb-0 mx-auto" style={{ fontSize: "13px", maxWidth: "450px" }}>
                Work on this contract is in progress. Once the freelancer ({project.freelancerName}) uploads their completed files, you will be able to review, download, rate, and release their payments.
              </p>
            </div>
          )}

          {/* Section 4: COMPLETED CONTRACT STATUS & RECEIPT DETAILS (For Client & Freelancer) */}
          {project.status === "completed" && (
            <div className="fh-card p-4 text-center">
              <div className="rounded-circle bg-success-subtle text-success mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "50px", height: "50px" }}>
                <Award size={26} />
              </div>
              <h4 className="fh-title-serif text-success mb-2">Contract Completed Successfully!</h4>
              <p className="text-muted mx-auto mb-4" style={{ fontSize: "13px", maxWidth: "480px" }}>
                Deliverables have been approved, reviews are submitted, and funds have been released to the freelancer.
              </p>

              {/* Review feedback review */}
              {activeReview && (
                <div className="p-3 border rounded bg-light text-start mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Released Rating:</span>
                    <div className="text-warning">
                      {Array.from({ length: activeReview.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted mb-0 small">
                    Client Comment: <strong className="text-dark">"{activeReview.comment}"</strong>
                  </p>
                </div>
              )}

              {/* Dummy Billing Block */}
              <div className="p-3 border rounded text-start" style={{ fontSize: "13px", backgroundColor: "#FDFDFD" }}>
                <h6 className="fw-bold mb-3 border-bottom pb-2" style={{ fontSize: "12px", color: "var(--fh-slate)" }}>TRANSACTION STATEMENT</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Budget:</span>
                  <strong>₹{(project.contractAmount || project.budget).toLocaleString()}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Platform service fee (3%):</span>
                  <span className="text-muted">₹{((project.contractAmount || project.budget) * 0.03).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Amount Disbursed:</span>
                  <strong className="text-success">₹{((project.contractAmount || project.budget) * 0.97).toLocaleString()}</strong>
                </div>
                <div className="d-flex justify-content-between pt-2 border-top">
                  <span className="text-muted">Payment status:</span>
                  <span className="badge bg-success-subtle text-success fw-bold py-1 px-2" style={{ fontSize: "10px" }}>
                    Completed / Transferred
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
