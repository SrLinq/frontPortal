/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../api/api";

function JobPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>([]);

  useEffect(() => {
    const async = async () => {
      const data = await get<any>(`jobs/${jobId}`);
      setJob(data.data);
    };
    async();
  }, []);
  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p>{job.price}</p>
    </div>
  );
}

export default JobPage;
