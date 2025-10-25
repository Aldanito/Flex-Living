import { useLocation } from "react-router-dom";
import { Header } from "./Header";

export const ConditionalHeader: React.FC = () => {
  const location = useLocation();

  const adminRoutes = ["/dashboard", "/admin"];
  const isAdminRoute = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const propertyDetailsRoutes = ["/properties/"];
  const isPropertyDetailsRoute = propertyDetailsRoutes.some(
    (route) =>
      location.pathname.startsWith(route) && location.pathname !== "/properties"
  );

  if (isAdminRoute || isPropertyDetailsRoute) {
    return null;
  }

  return <Header />;
};
