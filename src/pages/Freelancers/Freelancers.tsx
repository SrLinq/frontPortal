import { useEffect, useState } from "react";
import { get } from "../../api/api";
import { useAuthStore } from "../../store/authStore";
import Freelancer from "../../components/frelancerPost/freelancer";

function Freelancers() {
  const { isAuthenticated } = useAuthStore();
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  if (!isAuthenticated) {
    window.location.href = "/";
  }

  const fetchFreelancers = async (query: string = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append("sortBy", sortBy);
      if (skillFilter) params.append("skill", skillFilter);

      const url = query 
        ? `freelancers/search/${query}?${params.toString()}` 
        : `freelancers?${params.toString()}`;
      
      const data = await get<any>(url);
      setFreelancers(data || []);
    } catch (error) {
      console.error("Failed to fetch freelancers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFreelancers(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, sortBy, skillFilter]);

  return (
    <div style={{ display: "block", padding: "20px", width: "100%" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>Freelancers</h1>
        <p style={{ opacity: 0.7 }}>Find talented students for your projects</p>
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
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", opacity: 0.7 }}>By Skill</label>
            <input 
              type="text" 
              placeholder="e.g. React, Python" 
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              style={{ width: "100%", padding: "8px", fontSize: "0.9rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", opacity: 0.7 }}>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: "100%", padding: "8px", fontSize: "0.9rem" }}
            >
              <option value="">Sort by...</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="university">University</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setSearch("");
              setSkillFilter("");
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
            placeholder="Search freelancers by name..."
            style={{ 
              width: "100%", 
              padding: "12px 20px", 
              borderRadius: "12px", 
              fontSize: "1rem"
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isLoading ? (
            <>
              {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-card"></div>)}
            </>
          ) : freelancers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px", opacity: 0.5 }}>
              <p style={{ fontSize: "1.2rem" }}>No freelancers found matching your criteria</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {freelancers.map((freelancer: any) => (
                <Freelancer
                  key={freelancer._id}
                  pathTo={`/freelancer/${freelancer._id}`}
                  path={
                    freelancer.avatar ||
                    `https://ui-avatars.com/api/?name=${freelancer.user_id?.firstName}+${freelancer.user_id?.lastName}&background=1b1a3a&color=00f2fe`
                  }
                  title={`${freelancer.user_id?.firstName} ${freelancer.user_id?.lastName}`}
                  description={freelancer.course || "Student"}
                  price={freelancer.university || "Not specified"}
                  course={freelancer.course || "Not specified"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Freelancers;
