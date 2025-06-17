"use client";

import { useEmissions } from "@/context/EmissionsContext";

export function EmissionsSummary() {
  const { emissions } = useEmissions();

  const sources = ["electricity", "fuel", "heating", "process", "vehicles"] as const;

  const rows = sources.map((source) => ({
    label: source === "process" ? "Gas" : source.charAt(0).toUpperCase() + source.slice(1),
    ...emissions[source],
  }));

  const totalScope1 = rows.reduce((sum, row) => sum + row.scope1, 0);
  const totalScope2 = rows.reduce((sum, row) => sum + row.scope2, 0);
  const totalEmissions = totalScope1 + totalScope2;

  const totalRenewableEnergy = rows.reduce((sum, row) => sum + row.renewableEnergy, 0);
  const totalNonRenewableEnergy = rows.reduce((sum, row) => sum + row.nonRenewableEnergy, 0);
  const totalEnergy = totalRenewableEnergy + totalNonRenewableEnergy;

  return (
    <div className="mt-10 p-6 rounded-lg shadow bg-white">
      <h2 className="text-2xl font-semibold text-center text-green-800 mb-6">
        Emissions & Energy Summary
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="p-2 border">Source</th>
              <th className="p-2 border">Renewable Energy</th>
              <th className="p-2 border">Non-Renewable Energy</th>
              <th className="p-2 border">Total Energy</th>
              <th className="p-2 border">Scope 1 Emissions (Tons CO₂e)</th>
              <th className="p-2 border">Scope 2 Emissions (Tons CO₂e)</th>
              <th className="p-2 border">Total Emissions (Tons CO₂e)</th>
            </tr>
          </thead>
          <tbody className="text-green-700">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="p-2 border font-medium">{row.label}</td>
                <td className="p-2 border">{row.renewableEnergy.toFixed(2)}</td>
                <td className="p-2 border">{row.nonRenewableEnergy.toFixed(2)}</td>
                <td className="p-2 border">{row.totalEnergy.toFixed(2)}</td>
                <td className="p-2 border">{row.scope1.toFixed(2)}</td>
                <td className="p-2 border">{row.scope2.toFixed(2)}</td>
                <td className="p-2 border">
                  {(row.scope1 + row.scope2).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-green-50 font-semibold text-green-950">
              <td className="p-2 border">Total</td>
              <td className="p-2 border">{totalRenewableEnergy.toFixed(2)}</td>
              <td className="p-2 border">{totalNonRenewableEnergy.toFixed(2)}</td>
              <td className="p-2 border">{totalEnergy.toFixed(2)}</td>
              <td className="p-2 border">{totalScope1.toFixed(2)}</td>
              <td className="p-2 border">{totalScope2.toFixed(2)}</td>
              <td className="p-2 border">{totalEmissions.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
