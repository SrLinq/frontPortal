import JobPost from "../components/JobPost/JobPost";

function ProjectsDashboard() {
  return (
    <div>
      <h1>ProjectsDashboard</h1>
      <button>Create Project</button>
      <JobPost
        pathTo="/job/1"
        path=""
        title="Job 1"
        description="Description 1"
        price={100}
      />
      <JobPost
        pathTo="/job/2"
        path=""
        title="Job 2"
        description="Description 2"
        price={200}
      />
      <JobPost
        pathTo="/job/3"
        path=""
        title="Job 3"
        description="Description 3"
        price={300}
      />
    </div>
  );
}

export default ProjectsDashboard;
