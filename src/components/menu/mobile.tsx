import {
  Calendar,
  User,
  Wrench,
  Users,
  MoreHorizontal,
  X,
  ChartLine,
  Store,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

interface TabItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const mainTabs: TabItem[] = [
  {
    label: "Agendamentos",
    path: "/admin",
    icon: Calendar,
  },
  {
    label: "Clientes",
    path: "/admin/customers",
    icon: User,
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
];

const moreTabs: TabItem[] = [
  {
    label: "Relatórios",
    path: "/admin/reports",
    icon: ChartLine,
  },
  {
    label: "Meu estabelecimento",
    path: "/admin/store",
    icon: Store,
  },
];

export const MobileMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/");
  };

  const isMoreActive = moreTabs.some((tab) => location.pathname === tab.path);

  return (
    <>
      {/* Overlay do menu "Mais" */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* Menu "Mais" expandido */}
      {isMoreOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-zinc-200 z-50 rounded-t-2xl shadow-lg animate-in slide-in-from-bottom-4 duration-200">
          <div className="p-4">
            {/* Header do menu "Mais" */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  className="h-10 w-10 rounded-lg object-cover border border-zinc-200"
                  src={user?.store?.image_url || ""}
                  alt="Store"
                />
                <div className="flex flex-col">
                  <strong className="text-sm">
                    {user?.store?.name || "Meu Estabelecimento"}
                  </strong>
                  <span className="text-xs text-zinc-500">Teste grátis</span>
                </div>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 hover:bg-zinc-100 rounded-lg transition"
              >
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            {/* Itens do menu "Mais" */}
            <div className="space-y-1">
              {moreTabs.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMoreOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    location.pathname === item.path
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Separador */}
            <div className="h-px bg-zinc-200 my-4" />

            {/* Informações do usuário e logout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-zinc-800">
                  <User size={18} color="white" />
                </div>
                <div className="flex flex-col">
                  <strong className="text-sm">{user?.name || "Usuário"}</strong>
                  <span className="text-xs text-zinc-500">{user?.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Bar fixo na parte inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {mainTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition ${
                  isActive ? "text-zinc-900" : "text-zinc-400"
                }`}
              >
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span
                  className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* Botão "Mais" */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition ${
              isMoreActive || isMoreOpen ? "text-zinc-900" : "text-zinc-400"
            }`}
          >
            <MoreHorizontal
              size={22}
              strokeWidth={isMoreActive || isMoreOpen ? 2.5 : 2}
            />
            <span
              className={`text-[10px] ${isMoreActive || isMoreOpen ? "font-semibold" : "font-medium"}`}
            >
              Mais
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
