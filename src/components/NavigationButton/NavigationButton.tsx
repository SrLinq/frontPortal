import { useNavigate } from "react-router-dom";

function Navigate({ button, path }: { button: string; path: string }) {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate(path)}>{button}</button>
    </div>
  );
}

export default Navigate;
