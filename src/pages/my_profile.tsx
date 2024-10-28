import myAxios from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userContext } from "@/store/userContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerDownRight, Pencil, Trash2 } from "lucide-react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .trim(),
  email: z
    .string(),
});

const MyProfile = () => {
  const token = localStorage.getItem("token");
  const { user } = useContext(userContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const updateUser = async (values: z.infer<typeof formSchema>) => {
    let body = {};
    if (values.email === "") {
      body = { name: values.name };
    } else if (values.name === "") {
      body = { email: values.email };
    } else {
      body = values;
    }
    return new Promise((resolve, reject) => {
      toast.promise(
        myAxios.put("/user", body, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          loading: "Atualizando usuário...",
          success: (data) => {
            setTimeout(() => {}, 1000);
            resolve(data);
            const body = data.data.data;
            console.log(body);
            user.id = body.id;
            user.name = body.name;
            user.email = body.email;
            // setComments((prevComments) => [...prevComments, newComment]);
            return "Usuário atualizado!";
          },
          error: (ex) => {
            console.log(ex);
            form.setError("email", {
              type: "value",
              message: "E-mail já está sendo utilizado.",
            });
            reject(ex);
            return "Erro ao atualizar usuário :(";
          },
          finally: () => {},
        }
      );
    });
  };

  return (
    <div className="px-4 space-y-6 sm:px-6 pt-16 mb-16">
      <div className="mx-8 my-8">
        <h1 className="text-2xl font-bold">{user.name}</h1>
      </div>
      <div className="space-y-8">
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(updateUser)}
                className="space-y-6 pt-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder={user.name} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={user.email}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mb-6" type="submit">
                  Atualizar
                </Button>
              </form>
            </Form>
          </CardContent>
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
                    <ContextMenuItem className="flex gap-2 justify-start">
                      <Trash2 /> Excluir
                    </ContextMenuItem>
                    <ContextMenuItem className="flex gap-2 justify-start">
                      <Pencil /> Editar
                    </ContextMenuItem>
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
