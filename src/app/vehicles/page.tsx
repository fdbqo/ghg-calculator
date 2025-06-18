import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { EmissionsSummary } from "@/components/emissions/EmissionsSummary";
import { Navbar } from "@/components/nav/Navbar";

export default function VehiclesPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <CalculatorCard source="vehicles" />
      <EmissionsSummary />
    </main>
  );
}
