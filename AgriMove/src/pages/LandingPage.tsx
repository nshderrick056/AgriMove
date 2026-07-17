import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { HowItWorks } from "../components/sections/HowItWorks";
import { UserRoles } from "../components/sections/UserRoles";
import { DashboardPreview } from "../components/sections/DashboardPreview";
import { ForFarmers } from "../components/sections/ForFarmers";
import { ForDrivers } from "../components/sections/ForDrivers";
import { ForBuyers } from "../components/sections/ForBuyers";
import { Pricing } from "../components/sections/Pricing";
import { CTASection } from "../components/sections/CTASection";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ForFarmers />
        <ForDrivers />
        <ForBuyers />
        <UserRoles />
        <DashboardPreview />
        <Pricing />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
