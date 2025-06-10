import { CalculatorCard } from "@/components/ui/CalculatorCard";
import { EmissionsSummary } from "@/components/EmissionsSummary";
import { Navbar } from "@/components/ui/Navbar";

export default function ElectricityPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar/>
      <CalculatorCard source="electricity" />
      <EmissionsSummary />
    </main>
  );
}