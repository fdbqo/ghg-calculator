"use client";

import { useEmissions } from "@/context/EmissionsContext";

export function EmissionsSummary() {
  const { electricity, fuel, heating } = useEmissions();

  const totalScope1 = electricity.scope1 + fuel.scope1 + heating.scope1;
  const totalScope2 = electricity.scope2 + fuel.scope2 + heating.scope2;
  const total = totalScope1 + totalScope2;

  return (
    <div className="mt-8 text-center bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Total Emissions Summary</h2>
      <p className="text-green-600 font-medium">Scope 1 Total: {totalScope1.toFixed(2)} Tons CO2e</p>
      <p className="text-green-600 font-medium">Scope 2 Total: {totalScope2.toFixed(2)} Tons CO2e</p>
      <p className="text-green-700 font-bold text-lg">Grand Total: {total.toFixed(2)} Tons CO2e</p>
    </div>
  );
}
