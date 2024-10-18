import myAxios from "@/api/axiosInstance";
import CircularLoading from "@/components/loading/circularLoading";
import { Button } from "@/components/ui/button";
import PostModel from "@/model/postModel";
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
        }); // Substitua pela URL da sua API
        if (response.status !== 200) {
          setError("Erro ao buscar dados"); // Lidar com erros de resposta
        }
        setPosts(response.data.data); // Supondo que os dados estejam sob a chave "chapters"
      } catch (error) {
        setError(error as string); // Captura e armazena o erro
      } finally {
        setLoading(false); // Indica que o carregamento foi concluído
      }
    };

    fetchData(); // Chama a função para buscar os dados
  }, []); // O array vazio significa que o efeito será executado apenas uma vez, quando o componente for montado

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
