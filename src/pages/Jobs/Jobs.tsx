import { useEffect, useState } from "react";
import JobPost from "../../components/JobPost/JobPost";
import { get } from "../../api/api";
import { useAuthStore } from "../../store/authStore";

function Job() {
  const { role } = useAuthStore();

  if (role === "business") {
    window.location.href = "/";
  }

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);

  const searchJobs = async (search: string) => {
    const data = await get<any>(`job/search/${search}`);
    setJobs(data || []);
  };
  useEffect(() => {
    const async = async () => {
      const data = await get<any>("job");
      setJobs(data || []);
    };
    async();
  }, []);
  return (
    <div>
      <form
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          gridColumn: "1 / -1",
          alignItems: "center",
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search jobs..."
          style={{ flex: 1 }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchJobs(e.target.value);
          }}
        />

        <select>
          <option value="">Sort by...</option>
          <option value="price_desc">Highest Price</option>
          <option value="price_asc">Lowest Price</option>
        </select>
        <select>
          <option value="">Filter by...</option>
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
        </select>
      </form>
      <h1>Jobs</h1>
      {jobs === undefined ? (
        <p>No jobs found</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
export default Job;
