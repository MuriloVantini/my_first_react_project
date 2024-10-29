import myAxios from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { z } from "zod";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z.string().email("E-mail inválido."),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let error: string = "";
    return new Promise((resolve, reject) => {
      toast.promise(myAxios.post("/forgot-password", values), {
        loading: "Carregando...",
        success: (data) => {
          resolve(data);
          return "E-mail enviado.";
        },
        error: (er) => {
          if (
            (er.response.data.message as string).startsWith("We can't find")
          ) {
            form.setError("email", {
              type: "value",
              message: "E-mail não encontrado.",
            });
          }
          reject(er);
          error = "Não foi possível enviar o e-mail.";
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
    <div className="flex min-h-screen justify-center items-center my-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 items-center w-[40%]"
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
    </div>
  );
};

export default ForgotPassword;
