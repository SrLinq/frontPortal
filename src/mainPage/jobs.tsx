import JobPost from "./jobPost";

function Job() {
  return (
    <div>
      <h1>Jobs</h1>
      <JobPost path="" title="Job 1" description="Description 1" price={100} />
      <JobPost path="" title="Job 2" description="Description 2" price={200} />
      <JobPost path="" title="Job 3" description="Description 3" price={300} />
    </div>
  );
}

export default Job;
