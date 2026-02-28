import { Link } from "react-router-dom";
import "./JobPost.css";

type jobPost = {
  path: string;
  title: string;
  description: string;
  price: number;
  pathTo: string;
};

function jobPost({ pathTo, path, title, description, price }: jobPost) {
  return (
    <div>
      <Link to={pathTo}>
        <img src={path} alt="" />
        <h1>{title}</h1>
        <p>{description}</p>
        <p>{price}</p>
      </Link>
    </div>
  );
}

export default jobPost;
