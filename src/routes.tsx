import { Route, Routes as RoutesComponent } from "react-router-dom";
import {
  Customers,
  Home,
  Login,
  Register,
  Services,
  Store,
  Employees,
} from "./pages";
import { AuthLayout } from "./layout/auth";
import { Reports } from "./pages/admin/reports";

export const Routes: React.FC = () => {
  return (
    <RoutesComponent>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<AuthLayout />}>
        <Route index element={<Home />} />
        <Route path="reports" element={<Reports />} />
        <Route path="customers" element={<Customers />} />
        <Route path="store" element={<Store />} />
        <Route path="services" element={<Services />} />
        <Route path="employees" element={<Employees />} />
      </Route>
    </RoutesComponent>
  );
};
