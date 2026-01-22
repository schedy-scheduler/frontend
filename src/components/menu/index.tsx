import { LogOut, Store, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { menu } from "./data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

export const Menu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center gap-2">
        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-800">
          <Store size={18} color="white" />
        </div>
        <div className="flex flex-col">
          <strong className="text-xs">
            {user?.store?.name || "Meu Estabelecimento"}
          </strong>
          <span className="text-[10px] text-zinc-500">Plano grátis</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menu.map((item) => (
          <SidebarGroup key={item.label}>
            <SidebarGroupLabel className="text-zinc-400">
              {item?.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item?.items.map((menuItem) => (
                  <SidebarMenuItem key={menuItem.label}>
                    <SidebarMenuButton
                      asChild
                      className={`text-sm border border-transparent ${
                        location?.pathname === menuItem?.path
                          ? `bg-zinc-100 border-zinc-300 text-zinc-600`
                          : ""
                      }`}
                    >
                      <Link to={menuItem.path}>
                        <menuItem.icon />
                        <span>{menuItem.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="flex-row items-center gap-2">
        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-800">
          <User size={18} color="white" />
        </div>
        <div className="flex flex-col">
          <strong className="text-xs">{user?.name || "Usuário"}</strong>
          <span className="text-[10px] text-zinc-500">{user?.email}</span>
        </div>

        <button
          onClick={handleLogout}
          className="ml-auto hover:bg-zinc-100 p-2 rounded transition"
        >
          <LogOut size={16} className="text-zinc-500" />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};
