import { useEffect } from "react";
import JobPost from "./jobPost";
import { get } from "../apiFUnctions/apiFunctions";
const freelancers = [
  {
    path: "",
    title: "Freelancer 1",
    description: "Description 1",
    price: 100,
  },
  {
    path: "",
    title: "Freelancer 2",
    description: "Description 2",
    price: 200,
  },
  {
    path: "",
    title: "Freelancer 3",
    description: "Description 3",
    price: 300,
  },
];

function Freelancers() {
  useEffect(() => {
    const async = async () => {
      const data = await get("freelancers");
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
          placeholder="Search freelancers..."
          style={{ flex: 1 }}
        />
        <select>
          <option value="">Sort by...</option>
          <option value="rating_desc">Highest Rating</option>
          <option value="rating_asc">Lowest Rating</option>
        </select>
        <select>
          <option value="">Filter by...</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>
      </form>
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
