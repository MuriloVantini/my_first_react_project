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
import { userContext } from "@/store/userContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerDownRight, Pencil, Trash2 } from "lucide-react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const userFormSchema = z.object({
  name: z.string().trim(),
  email: z.string(),
});

const passwordFormSchema = z
  .object({
    password_current: z.string().min(8, {
      message: "Insira uma senha de pelo menos 8 caracteres.",
    }),
    new_password: z.string().min(8, {
      message: "Insira uma senha de pelo menos 8 caracteres.",
    }),
    new_password_confirmation: z.string().min(8, {
      message: "Insira uma senha de pelo menos 8 caracteres.",
    }),
  })
  .superRefine(({ new_password, new_password_confirmation }, ctx) => {
    if (new_password !== new_password_confirmation) {
      ctx.addIssue({
        code: "custom",
        path: ["new_password_confirmation"],
        message: "As senhas não coincidem.",
      });
    }
  });

const MyProfile = () => {
  const token = localStorage.getItem("token");
  const { user } = useContext(userContext);

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password_current: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const updateUser = async (values: z.infer<typeof userFormSchema>) => {
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
            userForm.setError("email", {
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

  const updatePassword = async (values: z.infer<typeof passwordFormSchema>) => {
    return new Promise((resolve, reject) => {
      toast.promise(
        myAxios.put("/newpassword", values, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          loading: "Atualizando senha...",
          success: (data) => {
            setTimeout(() => {}, 1000);
            resolve(data);
            return "Senha atualizada!";
          },
          error: (ex) => {
            reject(ex);
            return (ex.response.data.message as string);
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
            <Form {...userForm}>
              <form
                onSubmit={userForm.handleSubmit(updateUser)}
                className="space-y-6 pt-6"
              >
                <FormField
                  control={userForm.control}
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
                  control={userForm.control}
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
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(updatePassword)}
                className="space-y-6 pt-6"
              >
                <FormField
                  control={passwordForm.control}
                  name="password_current"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha atual</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={"Insira sua senha atual..."}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={"Insira sua nova senha..."}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="new_password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme a Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={"Confirme sua nova senha..."}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mb-6" type="submit">
                  Atualizar Senha
                </Button>
              </form>
            </Form>
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
