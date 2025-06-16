import { CalculatorCard } from "@/app/CalculatorCard";
import { EmissionsSummary } from "@/components/EmissionsSummary";
import { Navbar } from "@/components/Navbar";

export default function GasPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <CalculatorCard source="process" />
      <EmissionsSummary />
    </main>
  );
}
