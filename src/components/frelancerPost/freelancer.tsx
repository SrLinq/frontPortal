import { Link } from "react-router-dom";
import "../jobPost/JobPost.css";

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
      <Link to={pathTo}>
        <img src={path} alt="" />
        <h1>{title}</h1>
        <p>{description}</p>
        <p>{price}</p>
        <p>{course}</p>
      </Link>
    </div>
  );
}

export default Freelancer;
