import JobPost from "./jobPost";

function Freelancers() {
  return (
    <div>
      <h1>Freelancers</h1>
      <JobPost
        path=""
        title="Freelancer 1"
        description="Description 1"
        price={100}
      />
      <JobPost
        path=""
        title="Freelancer 2"
        description="Description 2"
        price={200}
      />
      <JobPost
        path=""
        title="Freelancer 3"
        description="Description 3"
        price={300}
      />
    </div>
  );
}

export default Freelancers;
