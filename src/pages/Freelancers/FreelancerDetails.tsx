import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../api/api";

function FreelancersPage() {
  const { freelancerId } = useParams();
  const [freelancer, setFreelancer] = useState<any>([]);

  useEffect(() => {
    const async = async () => {
      const data = await get<any>(`freelancers/${freelancerId}`);
      console.log(data);
      setFreelancer(data);
    };
    async();
  }, [freelancerId]);

  return (
    <div>
      <h1>
        {freelancer?.user_id?.firstName} {freelancer?.user_id?.lastName}
      </h1>
      <p>{freelancer?.description}</p>
      <p>{freelancer?.university}</p>
      <p>{freelancer?.course}</p>
      <p>{freelancer?.skills}</p>
    </div>
  );
}

export default FreelancersPage;
