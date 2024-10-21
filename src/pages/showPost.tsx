import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import myAxios from "@/api/axiosInstance";
import PostModel from "@/models/postModel";
import CircularLoading from "@/components/loading/circularLoading";
import { ArrowDown, Eye, Heart, UserCircle } from "lucide-react";

const ShowPost = () => {
  //Captura id da rota /post/:id
  const { id } = useParams();
  const [post, setPost] = useState<PostModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentVisibility, setCommentVisibility] = useState(false);
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
        setPost(response.data.data);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading)
    return <CircularLoading url={myAxios.defaults.baseURL + `/post/${id}`} />;
  if (error) return <div>Erro: {error}</div>;

  return (
    <>
      <div className="my-40 mx-40 p-5 border border-gray-300 rounded-md">
        <h1 className="uppercase">{post?.title}</h1>
        <h4>{post?.description}</h4>
        {post?.image != null ? <img src={post?.image} /> : null}
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
            <div
              className="flex flex-row gap-2 mb-2 p-2 w-32 cursor-pointer hover:bg-gray-300 rounded-md"
              onClick={() => setCommentVisibility(!commentVisibility)}
            >
              <span>Comentários</span> <ArrowDown />
            </div>

            {commentVisibility
              ? post?.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex flex-row gap-2 items-center mb-2 border border-gray-300 p-2 rounded-md"
                  >
                    <UserCircle /> <h5>{comment.description}</h5>
                  </div>
                ))
              : null}
          </div>
        )}
        <br />
        <div className="flex flex-col items-end">
          <div className="flex flex-row items-end justify-end">
            <a className="pr-1">
              <Heart strokeWidth={1.5} />
            </a>
            {post?.like_posts_count}
          </div>
          <div className="flex flex-row items-end justify-end">
            <a className="pr-1">
              <Eye strokeWidth={1.5} />
            </a>
            {post?.access_count}
          </div>
        </div>
        <br />
      </div>
    </>
  );
};

export default ShowPost;
