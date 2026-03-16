import { Link } from "react-router-dom";
import "../JobPost/JobPost.css";

type jobPost = {
  path: string;
  title: string;
  description: string;
  price: number;
  pathTo: string;
  course: string;
};

function Freelancer({
  pathTo,
  path,
  title,
  description,
  price,
  course,
}: jobPost) {
  return (
    <div className="post-card">
      <Link 
        to={pathTo}
        style={{ 
          textDecoration: 'none', 
          color: 'inherit', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%' 
        }}
      >
        <img src={path || "https://ui-avatars.com/api/?name=Freelancer&background=1b1a3a&color=00f2fe"} alt="" />
        <h1>{title}</h1>
        <p>{description}</p>
        <p>{price}</p>
        <p>{course}</p>
      </Link>
    </div>
  );
}

export default Freelancer;
