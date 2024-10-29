import PostModel from "@/models/postModel";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostCard = (post: PostModel) => {
  const navigate = useNavigate();

  const onNavigate = (id: number) => {
    navigate(`/post/${id}`); // Navega para a rota de detalhes do post
  };
  return (
    <div onClick={() => onNavigate(post.id)} 
      key={post.id}
      className="max-w-sm rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4"
    >
      <a href="#">
        <img className="rounded-t-lg" src={post.image} alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {post.title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {post.description}
        </p>
        <Button onClick={() => onNavigate(post.id)} variant="outline">
          <Eye /> Ver post
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
