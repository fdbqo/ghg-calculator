"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useEmissions } from "@/context/EmissionsContext";

const fuelFactors = {
  petrol: 2.31, // kg CO₂e/litre
  diesel: 2.68,
};

const unitConversion = {
  kWh: 1,
  GJ: 277.78,
  MWh: 1000,
};

const electricityFactor = 0.0925; // kg CO₂e per kWh

const heatingFactor = {
  scope1: 0.05,
  scope2: 0.04,
};

type SourceType = "electricity" | "fuel" | "heating";

export function CalculatorCard({ source }: { source: SourceType }) {
  const { updateEmissions } = useEmissions();
  const [amount, setAmount] = useState("");
  const [renewable, setRenewable] = useState("");
  const [unit, setUnit] = useState(source === "fuel" ? "petrol" : "kWh");

  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);

  const handleCalculate = () => {
    const inputAmount = parseFloat(amount) || 0;
    const renewableAmount = parseFloat(renewable) || 0;

    let s1 = 0;
    let s2 = 0;

    const conversion = unitConversion[unit as keyof typeof unitConversion] || 1;
    const converted = inputAmount * conversion;

    let renewableEnergy = 0;
    let nonRenewableEnergy = 0;
    let totalEnergy = converted;

    if (source === "fuel") {
      const factor = fuelFactors[unit as keyof typeof fuelFactors] || 0;
      s1 = (inputAmount * factor) / 1000;
      renewableEnergy = 0;
      nonRenewableEnergy = totalEnergy;
    }

    if (source === "electricity") {
      const netUsage = inputAmount - renewableAmount;
      s2 = ((netUsage > 0 ? netUsage : 0) * conversion * electricityFactor) / 1000;

      renewableEnergy = renewableAmount * conversion;
      nonRenewableEnergy = netUsage > 0 ? netUsage * conversion : 0;
      totalEnergy = renewableEnergy + nonRenewableEnergy;
    }

    if (source === "heating") {
      s1 = (converted * heatingFactor.scope1) / 1000;
      s2 = (converted * heatingFactor.scope2) / 1000;
      renewableEnergy = 0;
      nonRenewableEnergy = totalEnergy;
    }

    setScope1(s1);
    setScope2(s2);

    updateEmissions(source, {
      scope1: s1,
      scope2: s2,
      renewableEnergy,
      nonRenewableEnergy,
      totalEnergy,
    });
  };

  const unitOptions =
    source === "fuel"
      ? [
          { label: "Petrol", value: "petrol" },
          { label: "Diesel", value: "diesel" },
        ]
      : [
          { label: "kWh", value: "kWh" },
          { label: "GJ", value: "GJ" },
          { label: "MWh", value: "MWh" },
        ];

  return (
    <Card className="max-w-xl mx-auto bg-white shadow">
      <CardContent className="p-6 space-y-5">
        <h2 className="text-lg font-semibold capitalize text-center text-green-700">
          {source} Calculator
        </h2>

        <div className="grid grid-cols-2 items-center gap-2">
          <Label>Emission Source:</Label>
          <Input value={source} disabled />

          <Label>Amount:</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {source === "electricity" && (
            <>
              <Label>Consumption from Own Production (Renewable):</Label>
              <Input
                type="number"
                value={renewable}
                onChange={(e) => setRenewable(e.target.value)}
              />
            </>
          )}

          <Label>Unit:</Label>
          <Combobox
            options={unitOptions}
            value={unit}
            onChange={setUnit}
            placeholder="Select Unit"
          />
        </div>

        <Button className="w-full" onClick={handleCalculate}>
          Calculate
        </Button>

        <div className="grid grid-cols-2 gap-2 pt-4 text-green-700">
          <Label>Scope 1 CO₂e:</Label>
          <Input value={scope1.toFixed(2)} disabled className="font-bold" />

          <Label>Scope 2 CO₂e:</Label>
          <Input value={scope2.toFixed(2)} disabled className="font-bold" />

          <Label>Total CO₂e (tons):</Label>
          <Input
            value={(scope1 + scope2).toFixed(2)}
            disabled
            className="font-bold"
          />
        </div>
      </CardContent>
    </Card>
  );
}
