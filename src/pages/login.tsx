import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import myAxios from "@/api/axiosInstance";

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await myAxios.post("/login", values);

      if (result.data.token !== "") {
        // Navega para a dashboard se o login for bem-sucedido
        localStorage.setItem("token", result.data.token);
        navigate("/");
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      // Configura o erro no formulário
      form.setError("email", {
        type: "value",
        message: error.response.data.message,
      });
      form.setError("password", {
        type: "value",
        message: error.response.data.message,
      });
    }
  }
  return (
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
                <Input type="email" placeholder="email@email.com" {...field} />
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
        <Button type="submit">Entrar</Button>
      </form>
    </Form>
  );
};

export default LoginPage;
