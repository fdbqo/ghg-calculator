import { CalculatorCard } from "@/components/ui/CalculatorCard";
import { EmissionsSummary } from "@/components/EmissionsSummary";
import { Navbar } from "@/components/ui/Navbar";

export default function VehiclesPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <CalculatorCard source="vehicles" />
      <EmissionsSummary />
    </main>
  );
}
