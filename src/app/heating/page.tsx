import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { EmissionsSummary } from "@/components/EmissionsSummary";
import { Navbar } from "@/components/nav/Navbar";

export default function HeatingPage() {
  return (
   <main className="min-h-screen bg-gray-100">
      <Navbar />
      <CalculatorCard source="heating" />
      <EmissionsSummary />
    </main>
  );
}
