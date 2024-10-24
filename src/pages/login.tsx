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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, {
    message: "Insira uma senha de pelo menos 2 caracteres.",
  }),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "murilo32@gmail.com",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let error: string = "";
    // Chamada assíncrona para login
    return new Promise((resolve, reject) => {
      toast.promise(myAxios.post("/login", values), {
        loading: "Carregando...",
        success: (data) => {
          setTimeout(() => {}, 1000);
          localStorage.setItem("token", data.data.token);
          resolve(data);
          return "Credenciais corretas.";
        },
        error: (er) => {
          form.setError("email", {
            type: "value",
            message: er.response.data.message,
          });
          form.setError("password", {
            type: "value",
            message: er.response.data.message,
          });
          reject(er);
          error = "Erro ao efetuar login.";
          return error;
        },
        finally: () => {
          if (error.length === 0) {
            setTimeout(() => navigate("/"), 500);
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

export default LoginPage;
