import { Menu } from "@/components/menu";
import { MobileMenu } from "@/components/menu/mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-2 w-full min-h-screen">
      {isMobile ? (
        <>
          <div className="flex-1 p-3 pb-20 w-full overflow-x-hidden">
            <Outlet />
          </div>
          <MobileMenu />
        </>
      ) : (
        <SidebarProvider>
          <Menu />
          <div className="flex-1 p-3 md:p-5 w-full overflow-x-hidden">
            <Outlet />
          </div>
        </SidebarProvider>
      )}
    </div>
  );
};
