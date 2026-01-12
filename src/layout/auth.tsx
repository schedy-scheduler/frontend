import { Menu } from "@/components/menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex gap-2 w-screen">
      <SidebarProvider>
        <Menu />
        <div className="p-5 max-w-292.5 w-screen mx-auto">
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
};
