import { Link } from "react-router-dom";
import "./JobPost.css";

type jobPost = {
  path: string;
  title: string;
  description: string;
  price: number;
  pathTo: string;
};

function JobPost({ pathTo, path, title, description, price }: jobPost) {
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
        <img src={path || "https://via.placeholder.com/70"} alt="" />
        <h1>{title}</h1>
        <p>{description || "No description provided."}</p>
        <p>{price ? `$${price}` : "Price not specified"}</p>
      </Link>
    </div>
  );
}

export default JobPost;
