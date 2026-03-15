import { useEffect, useState } from "react";
import { get } from "../../api/api";
import { useAuthStore } from "../../store/authStore";
import Freelancer from "../../components/frelancerPost/freelancer";

function Freelancers() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    window.location.href = "/";
  }

  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const searchFreelancers = async (search: string) => {
    if (!search) {
      const data = await get<any>("freelancers");
      setFreelancers(data || []);
      return;
    }
    const data = await get<any>(`freelancers/search/${search}`);
    setFreelancers(data || []);
  };

  useEffect(() => {
    const async = async () => {
      const data = await get<any>("freelancers");
      setFreelancers(data || []);
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
      {freelancers.length === 0 ? (
        <p>No freelancers found</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Freelancers;
