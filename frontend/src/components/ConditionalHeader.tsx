import { useLocation } from "react-router-dom";
import { Header } from "./Header";

export const ConditionalHeader: React.FC = () => {
  const location = useLocation();

  // Define admin routes where header should be hidden
  const adminRoutes = ["/dashboard", "/admin"];
  const isAdminRoute = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Define property details routes where header should be hidden
  const propertyDetailsRoutes = ["/properties/"];
  const isPropertyDetailsRoute = propertyDetailsRoutes.some(
    (route) =>
      location.pathname.startsWith(route) && location.pathname !== "/properties"
  );

  // Don't show header on admin routes or property details pages
  if (isAdminRoute || isPropertyDetailsRoute) {
    return null;
  }

  return <Header />;
};
