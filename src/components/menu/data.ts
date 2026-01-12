import { ChartLine, Home, Store, User, Users, Wrench } from "lucide-react";

export const menu = [
  {
    label: "Operação",
    items: [
      {
        label: "Agendamentos",
        path: "/admin",
        icon: Home,
      },
      {
        label: "Clientes",
        path: "/admin/customers",
        icon: User,
      },
      {
        label: "Relatórios",
        path: "/admin/reports",
        icon: ChartLine,
      },
    ],
  },
  {
    label: "Configurações",
    items: [
      {
        label: "Meu estabelecimento",
        path: "/admin/store",
        icon: Store,
      },
      {
        label: "Serviços",
        path: "/admin/services",
        icon: Wrench,
      },
      {
        label: "Profissionais",
        path: "/admin/employees",
        icon: Users,
      },
    ],
  },
];
