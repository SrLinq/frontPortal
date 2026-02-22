import "./dashboardCards.css";

type jobPost = {
  path: string;
  title: string;
  description: string;
  price: number;
};

function jobPost({ path, title, description, price }: jobPost) {
  return (
    <div>
      <img src={path} alt="" />
      <h1>{title}</h1>
      <p>{description}</p>
      <p>{price}</p>
    </div>
  );
}

export default jobPost;
