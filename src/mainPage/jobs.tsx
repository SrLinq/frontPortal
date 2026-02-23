import { useEffect, useState } from "react";
import { get } from "../apiFUnctions/apiFunctions";
import JobPost from "./jobPost";
const jobs = [
  {
    path: "",
    title: "Job 1",
    description: "Description 1",
    price: 100,
  },
  {
    path: "",
    title: "Job 2",
    description: "Description 2",
    price: 200,
  },
  {
    path: "",
    title: "Job 3",
    description: "Description 3",
    price: 300,
  },
];

function Job() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const async = async () => {
      const data = await get<any>("jobs");
      setJobs(data.data);
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
        <input type="text" placeholder="Search jobs..." style={{ flex: 1 }} />
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
      {jobs.map((job: any) => (
        <JobPost
          key={job.title}
          path={job.path}
          title={job.title}
          description={job.description}
          price={job.price}
        />
      ))}
    </div>
  );
}

export default Job;
