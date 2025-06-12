"use client";

import { useEmissions } from "@/context/EmissionsContext";

export function EmissionsSummary() {
  const { electricity, fuel, heating } = useEmissions();

  const totalScope1 = electricity.scope1 + fuel.scope1 + heating.scope1;
  const totalScope2 = electricity.scope2 + fuel.scope2 + heating.scope2;
  const totalEmissions = totalScope1 + totalScope2;

  const totalRenewableEnergy =
    electricity.renewableEnergy +
    fuel.renewableEnergy +
    heating.renewableEnergy;

  const totalNonRenewableEnergy =
    electricity.nonRenewableEnergy +
    fuel.nonRenewableEnergy +
    heating.nonRenewableEnergy;

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
            <tr>
              <td className="p-2 border font-medium">Electricity</td>
              <td className="p-2 border">{electricity.renewableEnergy.toFixed(2)}</td>
              <td className="p-2 border">{electricity.nonRenewableEnergy.toFixed(2)}</td>
              <td className="p-2 border">{electricity.totalEnergy.toFixed(2)}</td>
              <td className="p-2 border">{electricity.scope1.toFixed(2)}</td>
              <td className="p-2 border">{electricity.scope2.toFixed(2)}</td>
              <td className="p-2 border">
                {(electricity.scope1 + electricity.scope2).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium">Fuel</td>
              <td className="p-2 border">{fuel.renewableEnergy.toFixed(2)}</td>
              <td className="p-2 border">{fuel.nonRenewableEnergy.toFixed(2)}</td>
              <td className="p-2 border">{fuel.totalEnergy.toFixed(2)}</td>
              <td className="p-2 border">{fuel.scope1.toFixed(2)}</td>
              <td className="p-2 border">{fuel.scope2.toFixed(2)}</td>
              <td className="p-2 border">
                {(fuel.scope1 + fuel.scope2).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium">Heating</td>
              <td className="p-2 border">{heating.renewableEnergy.toFixed(2)}</td>
              <td className="p-2 border">{heating.nonRenewableEnergy.toFixed(2)}</td>
              <td className="p-2 border">{heating.totalEnergy.toFixed(2)}</td>
              <td className="p-2 border">{heating.scope1.toFixed(2)}</td>
              <td className="p-2 border">{heating.scope2.toFixed(2)}</td>
              <td className="p-2 border">
                {(heating.scope1 + heating.scope2).toFixed(2)}
              </td>
            </tr>
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
