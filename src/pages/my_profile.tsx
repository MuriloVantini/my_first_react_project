import myAxios from "@/api/axiosInstance";
import CircularLoading from "@/components/loading/circularLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserModel from "@/models/userModel";
import { CornerDownRight, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const MyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserModel | null>(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await myAxios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUser(response.data.data[0]);
          console.log(response.data.data[0]);
        }
        if (response.status !== 200) {
          throw new Error("Erro ao buscar usuário");
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return <CircularLoading url={myAxios.defaults.baseURL + "/profile"} />;
  if (error) return <div>Erro: {error}</div>;
  return (
    <div className="px-4 space-y-6 sm:px-6 pt-16 mb-16">
      <div className="mx-8 my-8">
        <h1 className="text-2xl font-bold">{user?.name}</h1>
      </div>
      <div className="space-y-8">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder={user?.name}
                defaultValue={user?.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={user?.email}
                placeholder={user?.email}
              />
            </div>
          </CardContent>
          <Button className="mx-6 mb-6" type="submit">
            Atualizar
          </Button>
        </Card>
        <Card>
          <CardHeader>
            <div>Atualizar senha</div>
            <div>Para sua segurança, não compartilhe sua senha com outros.</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input type="password" id="current-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input type="password" id="new-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirme a Senha</Label>
              <Input type="password" id="confirm-password" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>Seus comentários</div>
            {user && user.comments && user.comments.length > 0 ? (
              user.comments.map((comment) => (
                <ContextMenu key={comment.id}>
                  <ContextMenuTrigger>
                    <div className="flex items-center w-full flex-row gap-2 hover:bg-gray-100 hover:cursor-pointer rounded-md p-2">
                      <CornerDownRight strokeWidth={0.8} />
                      <h5 className="break-words w-[90%]">
                        {comment.description}
                      </h5>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem className="flex gap-2 justify-start"><Trash2/> Excluir</ContextMenuItem>
                    <ContextMenuItem className="flex gap-2 justify-start"><Pencil/> Editar</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <h5>Você não possui comentários</h5>
            )}
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default MyProfile;
