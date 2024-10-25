import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import myAxios from "@/api/axiosInstance";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    name: z.string().trim(),
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Insira uma senha de pelo menos 8 caracteres.",
    }),
    password_confirmation: z.string(),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
      ctx.addIssue({
        code: "custom",
        path: ["password_confirmation"],
        message: "As senhas não coincidem.",
      });
    }
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let error: string = "";
    // Chamada assíncrona para login
    return new Promise((resolve, reject) => {
      toast.promise(myAxios.post("/register", values), {
        loading: "Carregando...",
        success: (data) => {
          setTimeout(() => {}, 1000);
          localStorage.setItem("token", data.data.token);
          resolve(data);
          return "Conta criada.";
        },
        error: (er) => {
          //Validação para quando e-mail não estiver disponível
          if (
            (er.response.data.message as string).startsWith(
              "The email has already been taken"
            )
          ) {
            form.setError("email", {
              type: "value",
              message: "E-mail já está sendo utilizado.",
            });
            reject(er);
            error = "E-mail indisponível.";
            return error;
          }

          //Validação para quando a confirmação de senha não estiver correta
          if (
            (er.response.data.message as string).startsWith(
              "The password field confirmation does not match"
            )
          ) {
            form.setError("password_confirmation", {
              type: "value",
              message: "As senhas não coincidem.",
            });
            reject(er);
            error = "Senhas não coincidem.";
            return error;
          }
        
          form.setError("email", {
            type: "value",
            message: er.response.data.message,
          });
          form.setError("password", {
            type: "value",
            message: er.response.data.message,
          });
          reject(er);
          error = "Erro ao registrar.";
          return error;
        },
        finally: () => {
          if (error.length === 0) {
            setTimeout(() => navigate("/login"), 500);
          }
        },
      });
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 py-44 px-72"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Insira seu nome" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirme sua Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!form.formState.isSubmitting ? (
            <Button type="submit">Entrar</Button>
          ) : (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando
            </Button>
          )}
        </form>
      </Form>
      <Toaster
        richColors
        duration={3500}
        theme="light"
        position="top-right"
        visibleToasts={5}
      />
    </>
  );
};

export default RegisterPage;
