import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import myAxios from "@/api/axiosInstance";
import PostModel from "@/model/postModel";
import CircularLoading from "@/components/loading/circularLoading";

const ShowPost = () => {
  //Captura id da rota /post/:id
  const { id } = useParams();
  const [post, setPost] = useState<PostModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await myAxios.get(`/post/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status !== 200) {
          throw new Error("Erro ao buscar post");
        }
        console.log(response.data.data);
        setPost(response.data.data);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <CircularLoading />;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="my-40 mx-40 p-5 border border-gray-300 rounded-md">
      <h1 className="uppercase">{post?.title}</h1>
      <h4>{post?.description}</h4>
      <br />
      {post?.chapters.length == 0 ? (
        <div>Não possui capítulos</div>
      ) : (
        post?.chapters.map((chapter) => (
          <div key={chapter.id}>
            <h5>{chapter.title}</h5>
            <p>{chapter.content}</p>
          </div>
        ))
      )}
      {post?.comments.length == 0 ? (
        <div>Não possui comentários</div>
      ) : (
        <div>
          <br />
          Comentários
          {post?.comments.map((comment) => (
            <div key={comment.id}>
              <h5>{comment.description}</h5>
            </div>
          ))}
        </div>
      )}
      <br />
      {post?.like_posts_count} curtidas
    </div>
  );
};

export default ShowPost;
