import myAxios from "@/api/axiosInstance";
import CircularLoading from "@/components/loading/circularLoading";
import { Button } from "@/components/ui/button";
import PostModel from "@/models/postModel";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
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

  if (loading) return <CircularLoading />;
  if (error) return <div>Erro: {error}</div>;

  const onNavigate = (id: number) => {
    navigate(`/post/${id}`); // Navega para a rota de detalhes do post
  };

  return (
    <div className="py-40">
      <div className="flex flex-wrap justify-center gap-4">
        {posts.map((item) => (
          <div
            key={item.id}
            className="max-w-sm rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4"
          >
            <a href="#">
              <img className="rounded-t-lg" src={item.image} alt="" />
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {item.title}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {item.description}
              </p>
              <Button onClick={() => onNavigate(item.id)} variant="outline">
                <Eye /> Ver post
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
