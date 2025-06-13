"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEmissions } from "@/context/EmissionsContext";
import { UnitMap } from "@/lib/other/zod";

type SourceType = "electricity" | "fuel" | "heating";

// api expected enums
const FUEL_TYPES = [
  { label: "Diesel", value: "Diesel", enumId: 625 },
  { label: "Biogas", value: "Biogas", enumId: 40 },
  { label: "Natural gas (X% biogas)", value: "NaturalGasBiogas", enumId: 41 },
];

// Map of unit options for each source type
const UNIT_OPTIONS_MAP: Record<SourceType, { label: string; value: string }[]> = {
  electricity: [
    { label: "KWh", value: "KWh" },
    { label: "MWh", value: "MWh" },
    { label: "GJ", value: "GJ" },
  ],
  heating: [
    { label: "KWh", value: "KWh" },
    { label: "MWh", value: "MWh" },
    { label: "GJ", value: "GJ" },
  ],
  fuel: [
    { label: "L", value: "L" },
    { label: "m3", value: "m3" },
    { label: "nm3", value: "nm3" },
  ],
};

// only show "L" for Diesel, "m3" etc for gases
const FUEL_UNIT_OPTIONS: Record<string, { label: string; value: string }[]> = {
  Diesel: [
    { label: "L", value: "L" }
  ],
  Biogas: [
    { label: "m3", value: "m3" },
    { label: "nm3", value: "nm3" }
  ],
  NaturalGasBiogas: [
    { label: "m3", value: "m3" },
    { label: "nm3", value: "nm3" }
  ]
};

export function CalculatorCard({ source }: { source: SourceType }) {
  const { updateEmissions } = useEmissions();
  const [input, setInput] = useState(0); 
  const [input2, setInput2] = useState(0); 
  const [unit, setUnit] = useState(source === "fuel" ? "L" : "KWh");
  const [fuelType, setFuelType] = useState(FUEL_TYPES[0].value);
  const [fuelTypeEnumId, setFuelTypeEnumId] = useState(FUEL_TYPES[0].enumId);
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);

  const handleCalculate = async () => {
    let payload: any = {};

    if (source === "electricity") {
      const unitInfo = UnitMap[unit as keyof typeof UnitMap];
      payload = {
        type: "electricity",
        description: "electricity",
        consumptionGrid: input.toString(),
        consumptionOwn: input2.toString(),
        unit,
        unitId: unitInfo.code,
        unitEnumId: unitInfo.fieldEnumId,
      };
    } else if (source === "heating") {
      const unitInfo = UnitMap[unit as keyof typeof UnitMap];
      payload = {
        type: "heat",
        description: "heating",
        amount: input.toString(),
        unit,
        unitId: unitInfo.code,
        unitEnumId: unitInfo.fieldEnumId,
        emissionFactor: input2 ? input2.toString() : undefined,
      };
    } else if (source === "fuel") {
      const unitInfo = UnitMap[unit as keyof typeof UnitMap];
      payload = {
        type: "fuels",
        description: "fuels",
        amount: input.toString(),
        unit,
        unitId: unitInfo.code,
        unitEnumId: unitInfo.fieldEnumId,
        fuelTypeId: fuelType,
        fuelTypeEnumId: fuelTypeEnumId,
        biogasProportion: input2 ? input2.toString() : "",
      };
    }

    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    const fv = result.data?.fieldValues ?? [];
    const value5 = fv.find((f: any) => f.id === 5)?.value ?? "0";
    const value6 = fv.find((f: any) => f.id === 6)?.value ?? "0";
    setScope1(Number(value5));
    setScope2(Number(value6));
    updateEmissions(source, { scope1: Number(value5), scope2: Number(value6) });
  };

  const unitOptions = UNIT_OPTIONS_MAP[source];
  const fuelUnitOptions = source === "fuel"
    ? FUEL_UNIT_OPTIONS[fuelType] || []
    : UNIT_OPTIONS_MAP[source];

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-bold text-green-700 capitalize text-center">{source} Calculator</h2>
        <div className="grid grid-cols-2 items-center gap-2">
          <Label htmlFor="desc">Description:</Label>
          <Input id="desc" value={source} disabled />

          {source === "electricity" && (
            <>
              <Label htmlFor="input">Consumption from grid:</Label>
              <Input
                id="input"
                type="number"
                value={input}
                min={0}
                onChange={e => setInput(Number(e.target.value))}
              />
              <Label htmlFor="input2">Own production:</Label>
              <Input
                id="input2"
                type="number"
                value={input2}
                min={0}
                onChange={e => setInput2(Number(e.target.value))}
              />
            </>
          )}

          {source === "heating" && (
            <>
              <Label htmlFor="input">Amount:</Label>
              <Input
                id="input"
                type="number"
                value={input}
                min={0}
                onChange={e => setInput(Number(e.target.value))}
              />
              <Label htmlFor="input2">Em.fctr., kgCO₂e/unit (optional):</Label>
              <Input
                id="input2"
                type="number"
                value={input2}
                min={0}
                onChange={e => setInput2(Number(e.target.value))}
              />
            </>
          )}

          {source === "fuel" && (
            <>
              <Label htmlFor="input">Amount:</Label>
              <Input
                id="input"
                type="number"
                value={input}
                min={0}
                onChange={e => setInput(Number(e.target.value))}
              />
              <Label htmlFor="fuelType">Fuel type:</Label>
              <select
                id="fuelType"
                value={fuelType}
                onChange={e => {
                  const idx = FUEL_TYPES.findIndex(f => f.value === e.target.value);
                  setFuelType(e.target.value);
                  setFuelTypeEnumId(FUEL_TYPES[idx]?.enumId ?? 0);
                  // reset unit to first valid option for new fuel type
                  const newUnit = FUEL_UNIT_OPTIONS[e.target.value]?.[0]?.value || "";
                  setUnit(newUnit);
                }}
                className="border rounded px-2 py-1"
              >
                {FUEL_TYPES.map(f => (
                  <option key={f.value + f.label} value={f.value}>{f.label}</option>
                ))}
              </select>
              <Label htmlFor="input2">Proportion of biogas (%) (optional):</Label>
              <Input
                id="input2"
                type="number"
                value={input2}
                min={0}
                onChange={e => setInput2(Number(e.target.value))}
              />
            </>
          )}

          <Label htmlFor="unit">Unit:</Label>
          <select
            id="unit"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {fuelUnitOptions.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
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