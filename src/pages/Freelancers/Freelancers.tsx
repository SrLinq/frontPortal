import { useEffect, useState } from "react";
import JobPost from "../../components/JobPost/JobPost";
import { get } from "../../api/api";

function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState("");
  const searchFreelancers = async (search: string) => {
    const data = await get<any>(`freelancer/search/${search}`);
    setFreelancers(data.data);
  };
  useEffect(() => {
    const async = async () => {
      const data = await get<any>("freelancers");
      setFreelancers(data.data);
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
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchFreelancers(e.target.value);
          }}
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
      {freelancers === undefined ? (
        <p>No freelancers found</p>
      ) : (
        <div>
          {freelancers.map((freelancer: any) => (
            <JobPost
              key={freelancer.title}
              pathTo={`/freelancer/${freelancer.id}`}
              path={freelancer.path}
              title={freelancer.title}
              description={freelancer.description}
              price={freelancer.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Freelancers;
