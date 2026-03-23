import { useEffect, useState } from "react";
import JobPost from "../../components/JobPost/JobPost";
import { get } from "../../api/api";
import { useAuthStore } from "../../store/authStore";

function Job() {
  const { role } = useAuthStore();

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [filterType, setFilterType] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const fetchJobs = async (query: string = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append("sortBy", sortBy);
      if (filterType) params.append("type", filterType);
      if (minBudget) params.append("minBudget", minBudget);
      if (maxBudget) params.append("maxBudget", maxBudget);
      if (query) params.append("term", query);

      const url = `job/search?${params.toString()}`;
      
      const data = await get<any>(url);
      setJobs(data || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, sortBy, filterType, minBudget, maxBudget]);

  return (
    <div style={{ display: "block", padding: "20px", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: 0 }}>Jobs</h1>
        {role === "business" && (
          <button
            onClick={() => (window.location.href = "/post-job")}
            className="add-action-btn"
            style={{ borderRadius: '8px', padding: '10px 25px' }}
          >
            + Post a New Job
          </button>
        )}
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "250px 1fr", 
        gap: "30px",
        alignItems: "start" 
      }}>
        {/* Filter Sidebar */}
        <aside style={{ 
          background: "rgba(255, 255, 255, 0.03)", 
          padding: "20px", 
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "1.1rem", color: "#00f2fe" }}>Filters</h3>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", opacity: 0.7 }}>Budget Range</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="number" 
                placeholder="Min" 
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "0.9rem" }}
              />
              <input 
                type="number" 
                placeholder="Max" 
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "0.9rem" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", opacity: 0.7 }}>Job Type</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: "100%", padding: "8px", fontSize: "0.9rem" }}
            >
              <option value="">All Types</option>
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", opacity: 0.7 }}>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: "100%", padding: "8px", fontSize: "0.9rem" }}
            >
              <option value="">Latest</option>
              <option value="price_desc">Highest Price</option>
              <option value="price_asc">Lowest Price</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setSearch("");
              setMinBudget("");
              setMaxBudget("");
              setFilterType("");
              setSortBy("");
            }}
            style={{ 
              background: "transparent", 
              border: "1px solid rgba(255, 255, 255, 0.2)", 
              color: "#fff",
              padding: "8px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem"
            }}
          >
            Clear All
          </button>
        </aside>

        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input
            type="text"
            placeholder="Search jobs by title or description..."
            style={{ 
              width: "100%", 
              padding: "12px 20px", 
              borderRadius: "12px", 
              fontSize: "1rem"
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Trending:</span>
            {['React', 'Node.js', 'Python', 'Design', 'Mobile'].map(skill => (
              <span 
                key={skill}
                onClick={() => setSearch(skill)}
                style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  background: 'rgba(0, 242, 254, 0.1)', 
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#00f2fe'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 242, 254, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 242, 254, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {isLoading ? (
            <>
              {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-card"></div>)}
            </>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px", opacity: 0.5 }}>
              <p style={{ fontSize: "1.2rem" }}>No jobs found matching your criteria</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {jobs.map((job: any) => (
                <JobPost
                  key={job._id}
                  pathTo={`/job/${job._id}`}
                  path={job.path}
                  title={job.title}
                  description={job.description}
                  price={job.budget}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Job;
