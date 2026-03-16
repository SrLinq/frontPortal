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
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");

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
    const fetchData = async () => {
      const data = await get<any>("freelancers");
      setFreelancers(data || []);
    };
    fetchData();
  }, []);

  const filteredFreelancers = freelancers
    .filter((f: any) => {
      if (!f.user_id) return false;
      if (!filterBy) return true;
      // You can add more specific filtering logic here if the freelancer object has status/availability
      return true;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "name_asc") {
        const nameA = `${a.user_id?.firstName} ${a.user_id?.lastName}`.toLowerCase();
        const nameB = `${b.user_id?.firstName} ${b.user_id?.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "university") {
        return (a.university || "").localeCompare(b.university || "");
      }
      return 0;
    });

  return (
    <div style={{ display: "block", padding: "20px", width: "100%" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1>Freelancers</h1>
        <p>Find talented students for your projects</p>
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
          placeholder="Search freelancers..."
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#1a1a2e", color: "#fff" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchFreelancers(e.target.value);
          }}
        />
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#1a1a2e", color: "#fff" }}
        >
          <option value="">Sort by...</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="university">University</option>
        </select>
        <select 
          value={filterBy} 
          onChange={(e) => setFilterBy(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#1a1a2e", color: "#fff" }}
        >
          <option value="">Filter by...</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
        </select>
      </form>

      {filteredFreelancers.length === 0 ? (
        <p>No freelancers found</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {filteredFreelancers.map((freelancer: any) => (
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
        </div>
      )}
    </div>
  );
}

export default Freelancers;
