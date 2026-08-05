import { useState } from "react";
import { useApp } from "../context";
import { Search, SlidersHorizontal, Tag, DollarSign, Calendar, MessageSquare } from "lucide-react";

export default function Projects() {
  const { projects, bids } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [budgetRange, setBudgetRange] = useState(150000); // Max slider value

  // Categories list derived from unique categories
  const categories = ["All", ...new Set(projects.map(p => p.category))];

  // Filter projects
  const filteredProjects = projects.filter(proj => {
    const matchesSearch = proj.title.toLowerCase().includes(search.toLowerCase()) || 
                          proj.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || proj.category === category;
    const matchesBudget = proj.budget <= budgetRange;
    return matchesSearch && matchesCategory && matchesBudget;
  });

  const getBidsCount = (projId) => {
    return bids.filter(b => b.projectId === projId).length;
  };

  const navigateTo = (hash) => {
    window.location.hash = hash;
  };

  return (
    <div className="container py-5 px-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 pb-3 border-bottom">
        <div>
          <h1 className="fh-title-serif mb-2">Marketplace Projects</h1>
          <p className="fh-subtitle-sans mb-0">Browse active contracts, check budgets, and pitch your proposals.</p>
        </div>
        <span className="badge mt-2 mt-md-0 px-3 py-2 bg-dark text-white fw-medium" style={{ borderRadius: "20px" }}>
          {filteredProjects.length} Available Projects
        </span>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="fh-card mb-4" style={{ position: "sticky", top: "90px" }}>
            <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
              <SlidersHorizontal size={16} /> Filters
            </h5>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="fh-form-label">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-select fh-input-classic"
                style={{ fontSize: "13px" }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Budget Filter */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="fh-form-label mb-0">Max Budget</label>
                <span className="fw-semibold text-muted" style={{ fontSize: "12px" }}>₹{budgetRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="200000" 
                step="5000"
                value={budgetRange}
                onChange={(e) => setBudgetRange(Number(e.target.value))}
                className="form-range" 
              />
              <div className="d-flex justify-content-between" style={{ fontSize: "10px", color: "var(--fh-slate)" }}>
                <span>₹10,000</span>
                <span>₹2,00,000+</span>
              </div>
            </div>

            {/* Reset Button */}
            <button 
              className="w-100 btn btn-sm btn-light border py-2 fw-medium"
              style={{ borderRadius: "8px", fontSize: "12px" }}
              onClick={() => {
                setSearch("");
                setCategory("All");
                setBudgetRange(150000);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Project Lists Grid */}
        <div className="col-lg-9">
          {/* Search bar */}
          <div className="fh-card p-3 mb-4 d-flex align-items-center gap-3">
            <Search size={18} style={{ color: "var(--fh-slate-light)" }} />
            <input 
              type="text" 
              placeholder="Search project titles, descriptions or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 w-100"
              style={{ outline: "none", fontSize: "14px" }}
            />
          </div>

          {/* Project List */}
          {filteredProjects.length === 0 ? (
            <div className="fh-card text-center py-5">
              <div className="mb-3 text-muted">
                <Search size={40} className="mx-auto" />
              </div>
              <h5 className="fw-semibold">No Projects Found</h5>
              <p className="text-muted" style={{ fontSize: "13px" }}>Try adjusting your keywords or budget filter range.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {filteredProjects.map((proj) => (
                <div key={proj.id} className="fh-card">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div>
                      <h4 className="fw-semibold mb-1" style={{ fontSize: "18px", color: "var(--fh-navy)" }}>{proj.title}</h4>
                      <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                        Posted by <strong>{proj.clientName}</strong> • {proj.createdAt}
                      </p>
                    </div>
                    <span className={`fh-badge-status fh-badge-${proj.status}`}>
                      {proj.status.replace("-", " ")}
                    </span>
                  </div>

                  <p className="text-muted mb-4" style={{ fontSize: "13.5px", lineHeight: "1.6" }}>
                    {proj.description.length > 200 ? proj.description.substring(0, 200) + "..." : proj.description}
                  </p>

                  <div className="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top gap-3">
                    <div className="d-flex flex-wrap gap-3 align-items-center" style={{ fontSize: "13px" }}>
                      <span className="d-flex align-items-center gap-1 fw-semibold text-dark">
                        <DollarSign size={14} className="text-muted" /> ₹{proj.budget.toLocaleString()}
                      </span>
                      <span className="d-flex align-items-center gap-1 text-muted">
                        <Calendar size={14} /> {proj.duration}
                      </span>
                      <span className="d-flex align-items-center gap-1 text-muted">
                        <Tag size={14} /> {proj.category}
                      </span>
                      <span className="d-flex align-items-center gap-1 text-muted">
                        <MessageSquare size={14} /> {getBidsCount(proj.id)} Bids
                      </span>
                    </div>

                    <button 
                      onClick={() => navigateTo(`#/projects/${proj.id}`)}
                      className="fh-btn-gold" 
                      style={{ padding: "8px 16px", fontSize: "13px" }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
