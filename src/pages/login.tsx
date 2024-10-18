import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(2, {
        message: "Insira uma senha de pelo menos 2 caracteres."
    })

})

const LoginPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: 'murilo32@gmail.com',
            password: ''
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-44 px-72">
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
                                <Input placeholder="*******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Entrar</Button>
            </form>
        </Form>
    )
}

export default LoginPage
