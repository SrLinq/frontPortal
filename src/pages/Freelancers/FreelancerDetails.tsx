/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../api/api";

function FreelancersPage() {
  const { freelancerId } = useParams();
  const [freelancer, setFreelancer] = useState<any>([]);

  useEffect(() => {
    const async = async () => {
      const data = await get<any>(`freelancers/${freelancerId}`);
      setFreelancer(data.data);
    };
    async();
  }, []);
  return (
    <div>
      <h1>{freelancer.name}</h1>
      <p>{freelancer.description}</p>
      <p>{freelancer.price}</p>
    </div>
  );
}

export default FreelancersPage;
