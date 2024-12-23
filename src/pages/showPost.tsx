import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import myAxios from "@/api/axiosInstance";
import PostModel from "@/models/postModel";
import { useForm } from "react-hook-form";
import CircularLoading from "@/components/loading/circularLoading";
import {
  ArrowDown,
  ArrowUp,
  CornerDownRight,
  Eye,
  Heart,
  Plus,
  SendIcon,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CommentModel from "@/models/commentModel";
import { toast } from "sonner";
import { userContext } from "@/store/userContext";

const formSchema = z.object({
  post_id: z.string(),
  description: z.string().min(4, {
    message: "Comentário deve possuir entre 4 a 200 caracteres.",
  }),
});
const ShowPost = () => {
  //Captura id da rota /post/:id
  const { id } = useParams();
  const [post, setPost] = useState<PostModel | null>(null);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentVisibility, setCommentVisibility] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const { user } = useContext(userContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post_id: id,
      description: "ahahahahhahaha",
    },
  });

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
        setComments(response.data.data.comments);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const createComment = async (values: z.infer<typeof formSchema>) => {
    return new Promise((resolve, reject) => {
      toast.promise(
        myAxios.post("/comment", values, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          loading: "Carregando...",
          success: (data) => {
            setTimeout(() => {}, 1000);
            const getCurrentDate = () => new Date().toISOString();
            const currentDate = getCurrentDate();
            const tempId = -(comments.length + 1);
            const newComment: CommentModel = {
              id: tempId,
              description: values.description,
              post_id: post?.id,
              user_id: -1,
              created_at: currentDate,
              updated_at: currentDate,
              like_comments_count: 0,
              user: { email: "email@example.com", id: -2, name: "Você" },
            };
            setComments((prevComments) => [...prevComments, newComment]);
            const updatedComments = [...(user.comments ?? []), newComment];
            user.comments = updatedComments;

            resolve(data);
            return "Comentário criado com sucesso";
          },
          error: (ex) => {
            setIsCommenting(false);
            reject(ex);
            return "Erro no servidor. Tente novamente mais tarde.";
          },
          finally: () => {
            setIsCommenting(false);
          },
        }
      );
    });
  };

  const onLikeComment = async (newComment: CommentModel) => {
    try {
      const result = await myAxios.post(
        "/like_comment",
        { comment_id: newComment.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (result.status === 200) {
        const updatedComment = newComment;
        updatedComment.like_comments_count++;
        setComments((prevComments) =>
          prevComments.map((oldComment) =>
            oldComment.id === newComment.id ? updatedComment : oldComment
          )
        );
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
    }
  };

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
            <Button
              variant="outline"
              onClick={() => setCommentVisibility(!commentVisibility)}
            >
              <span>Comentários</span>
              {commentVisibility ? <ArrowUp /> : <ArrowDown />}
            </Button>
            {commentVisibility
              ? comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex flex-row items-center gap-2 justify-between mt-2 border border-gray-300 p-2 rounded-md"
                  >
                    <div className="w-[90%]">
                      <div className="flex flex-col justify-start gap-2">
                        {/* Usuário que comentou */}
                        <div className="flex flex-row items-center gap-2">
                          <UserCircle />
                          <p> {comment.user?.name}</p>
                        </div>

                        {/* Descrição do comentário */}
                        <div className="flex items-center w-full flex-row gap-2">
                          <CornerDownRight strokeWidth={0.8} />
                          <h5 className="break-words w-[90%]">
                            {comment.description}{" "}
                          </h5>
                        </div>
                      </div>
                    </div>

                    {/* LikeButton */}
                    <div className="flex flex-row justify-end gap-2">
                      <Heart
                        className="hover:fill-red-600 hover:stroke-none transition-all hover:cursor-pointer"
                        onClick={() => onLikeComment(comment)}
                        strokeWidth={0.5}
                      />
                      <p>{comment.like_comments_count}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
        )}
        {isCommenting ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createComment)}
              className="space-y-8 pt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Insira seu comentário..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCommenting(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="outline">
                  Comentar
                  <SendIcon />
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
        <br />
        {!isCommenting ? (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsCommenting(true)}>
              Comentar <Plus />
            </Button>
          </div>
        ) : null}

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
