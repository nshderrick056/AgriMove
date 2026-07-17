import { AppProvider, useApp } from "../context/AppContext";
import { LandingPage }    from "../pages/LandingPage";
import { LoginPage }      from "../pages/LoginPage";
import { FarmerDashboard } from "../pages/FarmerDashboard";
import { DriverDashboard } from "../pages/DriverDashboard";
import { BuyerDashboard }  from "../pages/BuyerDashboard";
import { AdminDashboard }  from "../pages/AdminDashboard";

function AppRouter() {
  const { page } = useApp();

  switch (page) {
    case "landing": return <LandingPage />;
    case "login":   return <LoginPage />;
    case "farmer":  return <FarmerDashboard />;
    case "driver":  return <DriverDashboard />;
    case "buyer":   return <BuyerDashboard />;
    case "admin":   return <AdminDashboard />;
    default:        return <LandingPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
