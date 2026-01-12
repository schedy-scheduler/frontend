import { Input } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

const formSchema = yup.object({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

export const Login = () => {
  const form = useForm({
    resolver: yupResolver(formSchema),
    values: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async () => {});

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-md border">
        <CardHeader>
          <CardTitle>Faça login com suas credênciais</CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <Input
                name="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
              />
              <Input
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
                type="password"
              />

              <Button>Fazer login</Button>
              <div className="flex items-center gap-2">
                <div className="w-full h-0.5 bg-zinc-200" />
                <span className="text-[10px] font-semibold text-zinc-400">
                  OU
                </span>
                <div className="w-full h-0.5 bg-zinc-200" />
              </div>
              <Link className="w-full" to="/register">
                <Button className="w-full" variant="secondary">
                  Criar minha conta
                </Button>
              </Link>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};
