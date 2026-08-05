import { useState } from "react";
import { Users, ShieldAlert, BadgeCent, TrendingUp, HelpCircle, Check, Slash } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedChartSlice, setSelectedChartSlice] = useState(null);

  // Seeded Admin Users Data
  const [usersList, setUsersList] = useState([
    { id: "u1", name: "Sarah Jenkins", email: "sarah@bakery.com", role: "Client", projects: 3, status: "Verified" },
    { id: "u2", name: "Alex Rivera", email: "alex@developer.com", role: "Freelancer", projects: 4, status: "Verified" },
    { id: "u4", name: "Marta Chen", email: "marta.design@art.com", role: "Freelancer", projects: 12, status: "Verified" },
    { id: "u5", name: "David K.", email: "david@marketing-guru.co", role: "Client", projects: 1, status: "Suspended" }
  ]);

  // Seeded Disputes Data
  const [disputesList, setDisputesList] = useState([
    { id: "d1", project: "E-commerce Site Design", client: "Sarah Jenkins", freelancer: "Alex Rivera", amount: 45000, reason: "Milestone mismatch", status: "Under Review" },
    { id: "d2", project: "React Native Fitness App", client: "Robert D.", freelancer: "Kunal S.", amount: 80000, reason: "Timeline delay", status: "Resolved" }
  ]);

  // Seeded Transactions Data
  const transactionsList = [
    { id: "TX-4091", project: "Sarah's Artisan Bakery Website", sender: "Sarah Jenkins", receiver: "Alex Rivera", amount: 45000, date: "2026-08-04", status: "Completed" },
    { id: "TX-4089", project: "SEO Optimization Sprint", sender: "David K.", receiver: "Marta Chen", amount: 15000, date: "2026-08-02", status: "Pending Release" },
    { id: "TX-4072", project: "Logo Branding pack", sender: "Sarah Jenkins", receiver: "Alex Rivera", amount: 22000, date: "2026-08-01", status: "Completed" }
  ];

  // User Actions handlers
  const toggleUserStatus = (id) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "Verified" ? "Suspended" : "Verified" };
      }
      return u;
    }));
  };

  // Dispute Actions handlers
  const resolveDispute = (id, result) => {
    alert(`Dispute ${id} resolved in favor of the ${result}`);
    setDisputesList(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, status: "Resolved" };
      }
      return d;
    }));
  };

  // Donut chart slices info
  const chartSlices = [
    { label: "Web Development", percentage: 45, color: "#1F7A5C", projectsCount: 28 },
    { label: "Mobile Apps", percentage: 25, color: "#D9A441", projectsCount: 16 },
    { label: "Branding & Design", percentage: 20, color: "#6366F1", projectsCount: 12 },
    { label: "Marketing", percentage: 10, color: "#EF4444", projectsCount: 6 }
  ];

  return (
    <div className="container py-5 px-4">
      {/* Header */}
      <div className="mb-5 pb-3 border-bottom">
        <h1 className="fh-title-serif mb-2">Platform Administration</h1>
        <p className="fh-subtitle-sans mb-0">Monitor transactions, audit users, review dispute escalations, and examine system metrics.</p>
      </div>

      {/* Metrics Cards */}
      <div className="row g-4 mb-5">
        <div className="col-lg-4 col-md-6">
          <div className="fh-card p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-light text-primary rounded">
                <Users size={24} />
              </div>
              <div>
                <small className="text-muted d-block" style={{ fontSize: "11px" }}>REGISTERED USERS</small>
                <h3 className="fw-bold mb-0" style={{ fontSize: "22px" }}>2,842</h3>
              </div>
            </div>
            <span className="text-success d-flex align-items-center gap-1 small fw-semibold">
              <TrendingUp size={14} /> +12%
            </span>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="fh-card p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-light text-danger rounded">
                <ShieldAlert size={24} />
              </div>
              <div>
                <small className="text-muted d-block" style={{ fontSize: "11px" }}>ACTIVE DISPUTES</small>
                <h3 className="fw-bold mb-0" style={{ fontSize: "22px" }}>
                  {disputesList.filter(d => d.status === "Under Review").length}
                </h3>
              </div>
            </div>
            <span className="text-success d-flex align-items-center gap-1 small fw-semibold">
              -2 cases
            </span>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="fh-card p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-light text-success rounded">
                <BadgeCent size={24} />
              </div>
              <div>
                <small className="text-muted d-block" style={{ fontSize: "11px" }}>TRANSACTION VOLUME</small>
                <h3 className="fw-bold mb-0" style={{ fontSize: "22px" }}>₹4.85 Lakh</h3>
              </div>
            </div>
            <span className="text-success d-flex align-items-center gap-1 small fw-semibold">
              <TrendingUp size={14} /> +22%
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-5">
        {/* SVG Donut Chart */}
        <div className="col-md-6">
          <div className="fh-card p-4 d-flex flex-column align-items-center" style={{ height: "100%" }}>
            <h5 className="fw-semibold text-start w-100 mb-4" style={{ fontSize: "15px" }}>Market Project Distribution</h5>
            <div className="d-flex align-items-center gap-4 flex-wrap justify-content-center">
              
              {/* Custom SVG Donut */}
              <div style={{ position: "relative", width: "160px", height: "160px" }}>
                <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut-svg">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                  
                  {/* Category Slices */}
                  {/* Web Dev (45%): start at 100, length 45 */}
                  <circle 
                    cx="21" cy="21" r="15.915" 
                    fill="transparent" stroke="#1F7A5C" strokeWidth="4" 
                    strokeDasharray="45 55" strokeDashoffset="100" 
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
                    onClick={() => setSelectedChartSlice(0)}
                    onMouseEnter={() => setSelectedChartSlice(0)}
                  />
                  {/* Mobile Apps (25%): start at 55, length 25 */}
                  <circle 
                    cx="21" cy="21" r="15.915" 
                    fill="transparent" stroke="#D9A441" strokeWidth="4" 
                    strokeDasharray="25 75" strokeDashoffset="55" 
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
                    onClick={() => setSelectedChartSlice(1)}
                    onMouseEnter={() => setSelectedChartSlice(1)}
                  />
                  {/* Branding (20%): start at 30, length 20 */}
                  <circle 
                    cx="21" cy="21" r="15.915" 
                    fill="transparent" stroke="#6366F1" strokeWidth="4" 
                    strokeDasharray="20 80" strokeDashoffset="30" 
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
                    onClick={() => setSelectedChartSlice(2)}
                    onMouseEnter={() => setSelectedChartSlice(2)}
                  />
                  {/* Marketing (10%): start at 10, length 10 */}
                  <circle 
                    cx="21" cy="21" r="15.915" 
                    fill="transparent" stroke="#EF4444" strokeWidth="4" 
                    strokeDasharray="10 90" strokeDashoffset="10" 
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
                    onClick={() => setSelectedChartSlice(3)}
                    onMouseEnter={() => setSelectedChartSlice(3)}
                  />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <small className="text-muted d-block" style={{ fontSize: "10px" }}>ACTIVE PITCHES</small>
                  <strong className="fw-bold" style={{ fontSize: "18px" }}>62</strong>
                </div>
              </div>

              {/* Legends */}
              <div className="d-flex flex-column gap-2" style={{ fontSize: "12px" }}>
                {chartSlices.map((slice, i) => (
                  <div 
                    key={i} 
                    className="d-flex align-items-center gap-2 p-1 rounded"
                    style={{ 
                      cursor: "pointer", 
                      backgroundColor: selectedChartSlice === i ? "#F1F5F9" : "transparent",
                      fontWeight: selectedChartSlice === i ? "600" : "400"
                    }}
                    onMouseEnter={() => setSelectedChartSlice(i)}
                    onMouseLeave={() => setSelectedChartSlice(null)}
                  >
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: slice.color, display: "inline-block" }} />
                    <span>{slice.label} ({slice.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Live Chart Slice Examiner tooltip */}
            {selectedChartSlice !== null && (
              <div className="mt-3 p-2 rounded bg-light border text-center w-100 animate-fade-in" style={{ fontSize: "12px" }}>
                Active Category: <strong>{chartSlices[selectedChartSlice].label}</strong> • {chartSlices[selectedChartSlice].projectsCount} Live briefs
              </div>
            )}
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="col-md-6">
          <div className="fh-card p-4" style={{ height: "100%" }}>
            <h5 className="fw-semibold mb-4" style={{ fontSize: "15px" }}>Quarterly Platform Revenue (₹)</h5>
            <div style={{ height: "180px", position: "relative" }} className="d-flex align-items-end justify-content-between pt-4 px-2">
              
              {/* Background guidelines */}
              <div style={{ position: "absolute", left: 0, right: 0, top: "20px", borderBottom: "1.5px dashed #E2E8F0" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: "80px", borderBottom: "1.5px dashed #E2E8F0" }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: "140px", borderBottom: "1.5px dashed #E2E8F0" }} />

              {/* Bars */}
              {/* Q3-25 (₹35k) */}
              <div className="d-flex flex-column align-items-center" style={{ width: "20%", zIndex: 1 }}>
                <span className="fw-semibold text-muted mb-1" style={{ fontSize: "10px" }}>35k</span>
                <div style={{ width: "100%", height: "45px", backgroundColor: "var(--fh-navy)", borderRadius: "4px 4px 0 0" }} />
                <span className="text-muted mt-2 fw-medium" style={{ fontSize: "11px" }}>Q3-25</span>
              </div>
              {/* Q4-25 (₹68k) */}
              <div className="d-flex flex-column align-items-center" style={{ width: "20%", zIndex: 1 }}>
                <span className="fw-semibold text-muted mb-1" style={{ fontSize: "10px" }}>68k</span>
                <div style={{ width: "100%", height: "90px", backgroundColor: "var(--fh-navy)", borderRadius: "4px 4px 0 0" }} />
                <span className="text-muted mt-2 fw-medium" style={{ fontSize: "11px" }}>Q4-25</span>
              </div>
              {/* Q1-26 (₹1.2L) */}
              <div className="d-flex flex-column align-items-center" style={{ width: "20%", zIndex: 1 }}>
                <span className="fw-semibold text-muted mb-1" style={{ fontSize: "10px" }}>120k</span>
                <div style={{ width: "100%", height: "140px", backgroundColor: "var(--fh-gold)", borderRadius: "4px 4px 0 0" }} />
                <span className="text-muted mt-2 fw-medium" style={{ fontSize: "11px" }}>Q1-26</span>
              </div>
              {/* Q2-26 (₹95k) */}
              <div className="d-flex flex-column align-items-center" style={{ width: "20%", zIndex: 1 }}>
                <span className="fw-semibold text-muted mb-1" style={{ fontSize: "10px" }}>95k</span>
                <div style={{ width: "100%", height: "110px", backgroundColor: "var(--fh-navy)", borderRadius: "4px 4px 0 0" }} />
                <span className="text-muted mt-2 fw-medium" style={{ fontSize: "11px" }}>Q2-26</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="fh-card p-0 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="bg-light border-bottom d-flex">
          <button 
            className={`btn border-0 py-3 px-4 fw-semibold ${activeTab === "users" ? "bg-white text-dark border-end" : "text-muted"}`}
            style={{ borderRadius: 0, fontSize: "13.5px" }}
            onClick={() => setActiveTab("users")}
          >
            Registered Users ({usersList.length})
          </button>
          <button 
            className={`btn border-0 py-3 px-4 fw-semibold ${activeTab === "disputes" ? "bg-white text-dark border-end" : "text-muted"}`}
            style={{ borderRadius: 0, fontSize: "13.5px" }}
            onClick={() => setActiveTab("disputes")}
          >
            Platform Disputes ({disputesList.length})
          </button>
          <button 
            className={`btn border-0 py-3 px-4 fw-semibold ${activeTab === "transactions" ? "bg-white text-dark border-end" : "text-muted"}`}
            style={{ borderRadius: 0, fontSize: "13.5px" }}
            onClick={() => setActiveTab("transactions")}
          >
            Ledger Transactions ({transactionsList.length})
          </button>
        </div>

        {/* Tab Body panels */}
        <div className="p-4">
          
          {/* Subpanel 1: Users */}
          {activeTab === "users" && (
            <div className="table-responsive">
              <table className="table align-middle" style={{ fontSize: "13px" }}>
                <thead>
                  <tr className="table-light">
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Account Role</th>
                    <th>Projects Run</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id}>
                      <td><strong className="text-dark">{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === "Client" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning-emphasis"} px-2 py-1`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.projects} Contracts</td>
                      <td>
                        <span className={`fw-semibold ${u.status === "Verified" ? "text-success" : "text-danger"}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button 
                          onClick={() => toggleUserStatus(u.id)}
                          className={`btn btn-xs fw-semibold px-2 py-1 ${u.status === "Verified" ? "btn-outline-danger" : "btn-outline-success"}`}
                          style={{ fontSize: "11px", borderRadius: "6px" }}
                        >
                          {u.status === "Verified" ? "Suspend Account" : "Activate Account"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Subpanel 2: Disputes */}
          {activeTab === "disputes" && (
            <div className="table-responsive">
              <table className="table align-middle" style={{ fontSize: "13px" }}>
                <thead>
                  <tr className="table-light">
                    <th>Project Name</th>
                    <th>Client</th>
                    <th>Freelancer</th>
                    <th>Disputed Budget</th>
                    <th>Claim Reason</th>
                    <th>Case Status</th>
                    <th className="text-end">Audit Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {disputesList.map(d => (
                    <tr key={d.id}>
                      <td><strong className="text-dark">{d.project}</strong></td>
                      <td>{d.client}</td>
                      <td>{d.freelancer}</td>
                      <td className="fw-bold">₹{d.amount.toLocaleString()}</td>
                      <td className="text-muted italic">"{d.reason}"</td>
                      <td>
                        <span className={`badge ${d.status === "Resolved" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning-emphasis"} py-1 px-2`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {d.status === "Under Review" ? (
                          <div className="d-flex justify-content-end gap-2">
                            <button 
                              onClick={() => resolveDispute(d.id, "Client")}
                              className="btn btn-xs btn-outline-success px-2 py-1"
                              style={{ fontSize: "11px", borderRadius: "6px" }}
                            >
                              Pay Client
                            </button>
                            <button 
                              onClick={() => resolveDispute(d.id, "Freelancer")}
                              className="btn btn-xs btn-outline-primary px-2 py-1"
                              style={{ fontSize: "11px", borderRadius: "6px" }}
                            >
                              Pay Freelancer
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted small">Case Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Subpanel 3: Transactions */}
          {activeTab === "transactions" && (
            <div className="table-responsive">
              <table className="table align-middle" style={{ fontSize: "13px" }}>
                <thead>
                  <tr className="table-light">
                    <th>Tx ID</th>
                    <th>Project Contract</th>
                    <th>Source (Sender)</th>
                    <th>Destination (Receiver)</th>
                    <th>Gross Amount</th>
                    <th>Escrow Date</th>
                    <th>Ledger Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsList.map(tx => (
                    <tr key={tx.id}>
                      <td><code className="text-dark fw-bold">{tx.id}</code></td>
                      <td>{tx.project}</td>
                      <td>{tx.sender}</td>
                      <td>{tx.receiver}</td>
                      <td className="fw-bold">₹{tx.amount.toLocaleString()}</td>
                      <td>{tx.date}</td>
                      <td>
                        <span className={`badge ${tx.status === "Completed" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning-emphasis"} py-1 px-2`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
