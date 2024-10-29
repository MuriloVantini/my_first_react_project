import myAxios from "@/api/axiosInstance";
import PostCard from "@/components/postCard";
import SkeletonPostCard from "@/components/skeleton_postCard";
import PostModel from "@/models/postModel";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]); // Estado para armazenar os dados
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento
  const [error, setError] = useState(""); // Estado para erros
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await myAxios.get("/post", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status !== 200) {
          setError("Erro ao buscar dados");
        }
        setPosts(response.data.data);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);
  if (loading)
    return (
      <div className="py-40">
        <div className="flex flex-wrap justify-center gap-4">
          <SkeletonPostCard/>
          <SkeletonPostCard/>
          <SkeletonPostCard/>
          <SkeletonPostCard/>
          <SkeletonPostCard/>
          <SkeletonPostCard/>
          <SkeletonPostCard/>
          <SkeletonPostCard/>
        </div>
      </div>
    );
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="py-40">
      <div className="flex flex-wrap justify-center gap-4">
        {posts.map((item) => (
          <PostCard {...item} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
