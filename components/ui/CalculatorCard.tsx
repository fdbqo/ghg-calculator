"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEmissions } from "@/context/EmissionsContext";

type SourceType = "electricity" | "fuel" | "heating";

const EMISSION_FACTORS = {
  electricity: { scope1: 0, scope2: 0.0000925, unit: "kWh" },
  fuel: { scope1: 0.00268, scope2: 0, unit: "litres" }, // diesel
  heating: { scope1: 0, scope2: 0.00017, unit: "kWh" },
};

export function CalculatorCard({ source }: { source: SourceType }) {
  const { updateEmissions } = useEmissions();
  const [input, setInput] = useState(0);
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);

  const handleCalculate = () => {
    const factor = EMISSION_FACTORS[source];
    const s1 = +(input * factor.scope1).toFixed(2);
    const s2 = +(input * factor.scope2).toFixed(2);
    setScope1(s1);
    setScope2(s2);
    updateEmissions(source, { scope1: s1, scope2: s2 });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-bold text-green-700 capitalize text-center">{source} Calculator</h2>

        <div className="grid grid-cols-2 items-center gap-2">
          <Label htmlFor="desc">Emission Source:</Label>
          <Input id="desc" value={source} disabled />

          <Label htmlFor="input">Amount:</Label>
          <Input
            id="input"
            type="number"
            value={input}
            onChange={(e) => setInput(parseFloat(e.target.value))}
          />

          <Label htmlFor="unit">Unit:</Label>
          <Input id="unit" value={EMISSION_FACTORS[source].unit} disabled />
        </div>

        <Button className="w-full" onClick={handleCalculate}>
          Calculate
        </Button>

        <div className="grid grid-cols-2 gap-2 pt-4">
          <Label>Scope 1 CO2e (tons):</Label>
          <Input className="text-green-600 font-bold" value={scope1.toFixed(2)} disabled />

          <Label>Scope 2 CO2e (tons):</Label>
          <Input className="text-green-600 font-bold" value={scope2.toFixed(2)} disabled />

          <Label>Total Emissions (tons):</Label>
          <Input
            className="text-green-600 font-bold"
            value={(scope1 + scope2).toFixed(2)}
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
}
