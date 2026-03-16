import { useEffect, useState } from "react";
import JobPost from "../../components/JobPost/JobPost";
import { get } from "../../api/api";
import { useAuthStore } from "../../store/authStore";

function Job() {
  const { role } = useAuthStore();

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");

  const searchJobs = async (search: string) => {
    const data = await get<any>(`job/search/${search}`);
    setJobs(data || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await get<any>("job");
      setJobs(data || []);
    };
    fetchData();
  }, []);

  const filteredJobs = jobs
    .filter((job: any) => {
      if (!filterBy) return true;
      if (filterBy === "fixed") return job.type === "fixed";
      if (filterBy === "hourly") return job.type === "hourly";
      return true;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "price_desc") return b.budget - a.budget;
      if (sortBy === "price_asc") return a.budget - b.budget;
      return 0;
    });

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
        <h1>Jobs</h1>
        {role === "business" && (
          <button
            onClick={() => (window.location.href = "/post-job")}
            style={{
              padding: "10px 20px",
              background: "#00f2fe",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + Post a New Job
          </button>
        )}
      </div>
      <form
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search jobs..."
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#1a1a2e", color: "#fff" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchJobs(e.target.value);
          }}
        />

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#1a1a2e", color: "#fff" }}
        >
          <option value="">Sort by...</option>
          <option value="price_desc">Highest Price</option>
          <option value="price_asc">Lowest Price</option>
        </select>
        <select 
          value={filterBy} 
          onChange={(e) => setFilterBy(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#1a1a2e", color: "#fff" }}
        >
          <option value="">Filter by Type...</option>
          <option value="fixed">Fixed Price</option>
          <option value="hourly">Hourly Rate</option>
        </select>
      </form>
      {filteredJobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {filteredJobs.map((job: any) => (
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
  );
}

export default Job;
