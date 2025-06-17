"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEmissions } from "@/context/EmissionsContext";
import { unitMap, vehicleTypes } from "@/lib/other/zod";
import type { SourceType } from "@/context/EmissionsContext";

// mapping source keys to labels
const sourceLabels: Record<SourceType, string> = {
  electricity: "Electricity",
  fuel: "Fuel",
  heating: "Heating",
  process: "Greenhouse Gas",
  vehicles: "Vehicles",
};

// api expected enums
const fuelTypes = [
  { label: "Diesel", value: "Diesel", enumId: 625 },
  { label: "Biogas", value: "Biogas", enumId: 40 },
  { label: "Natural gas (X% biogas)", value: "NaturalGasBiogas", enumId: 41 },
];

// greenhouse gas types
const gasTypes = [
  { label: "CO₂", value: "fe_id-60", enumId: 60 },
  { label: "CH₄", value: "fe_id-61", enumId: 61 },
  { label: "N₂O", value: "fe_id-62", enumId: 62 },
  { label: "SF₆", value: "fe_id-65", enumId: 65 },
];

// map of unit options for each source type
const unitOptionsMap: Record<SourceType, { label: string; value: string }[]> = {
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
  vehicles: [
    { label: "L", value: "L" },
    { label: "km", value: "km" },
  ],
  process: [
    { label: "Kg", value: "Kg" },
    { label: "t", value: "t" },
  ],
};

const fuelUnitOptions: Record<string, { label: string; value: string }[]> = {
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
  const [unit, setUnit] = useState(source === "process" ? "Kg" : 
                               source === "fuel" || source === "vehicles" ? "L" : "KWh");
  const [fuelType, setFuelType] = useState(fuelTypes[0].value);
  const [fuelTypeEnumId, setFuelTypeEnumId] = useState(fuelTypes[0].enumId);
  const [vehicleType, setVehicleType] = useState(vehicleTypes[0].value);
  const [vehicleTypeEnumId, setVehicleTypeEnumId] = useState(vehicleTypes[0].enumId);
  const [gasType, setGasType] = useState(gasTypes[0].value);
  const [gasTypeEnumId, setGasTypeEnumId] = useState(gasTypes[0].enumId);
  const [scope1, setScope1] = useState(0);
  const [scope2, setScope2] = useState(0);

  const handleCalculate = async () => {
    let payload: any = {};
    let renewableEnergy = 0;
    let nonRenewableEnergy = 0;
    let totalEnergy = 0;

    if (source === "electricity") {
      const unitInfo = unitMap[unit as keyof typeof unitMap];
      payload = {
        type: "electricity",
        description: "electricity",
        consumptionGrid: input.toString(),
        consumptionOwn: input2.toString(),
        unit,
        unitId: unitInfo.code,
        unitEnumId: unitInfo.fieldEnumId,
      };
      
      renewableEnergy = input2;
      nonRenewableEnergy = input;
      totalEnergy = renewableEnergy + nonRenewableEnergy;
    } 
    else if (source === "heating") {
      const unitInfo = unitMap[unit as keyof typeof unitMap];
      payload = {
        type: "heat",
        description: "heating",
        amount: input.toString(),
        unit,
        unitId: unitInfo.code,
        unitEnumId: unitInfo.fieldEnumId,
        emissionFactor: input2 ? input2.toString() : undefined,
      };
      
      totalEnergy = input;
      nonRenewableEnergy = totalEnergy;
    } 
    else if (source === "fuel") {
      const unitInfo = unitMap[unit as keyof typeof unitMap];
      const apiFuelType = fuelType === "NaturalGasBiogas" 
        ? "Natural gas (X% biogas)" 
        : fuelType;
      
      payload = {
        type: "fuels",
        description: "fuels",
        amount: input.toString(),
        unit,
        unitId: unitInfo.code,
        unitEnumId: unitInfo.fieldEnumId,
        fuelTypeId: apiFuelType,
        fuelTypeEnumId: fuelTypeEnumId,
        biogasProportion: input2 ? input2.toString() : "",
      };
      
      totalEnergy = input;
      nonRenewableEnergy = totalEnergy;
    }
    else if (source === "vehicles") {
      const unitInfo = unit === "L" 
        ? { code: 'fe_id-268', fieldEnumId: 268 }  
        : unitMap[unit as keyof typeof unitMap]; 
      
      payload = {
        type: "vehicles",
        description: "vehicles",
        amount: input.toString(),
        unit: unit,
        unitId: unitInfo.code,
        unitEnumId: unitInfo.fieldEnumId,
        vehicleTypeId: vehicleType,
        vehicleTypeEnumId: vehicleTypeEnumId,
        biogasProportion: input2 ? input2.toString() : "",
      };
      
      totalEnergy = input;
      nonRenewableEnergy = totalEnergy;
    }
    else if (source === "process") {
      const unitInfo = unitMap[unit as keyof typeof unitMap];
      
      payload = {
        type: "process",
        description: "process",
        amount: input.toString(),
        unit,
        unitId: unitInfo.code,
        unitEnumId: unitInfo.fieldEnumId,
        processTypeId: gasType,
        processTypeEnumId: gasTypeEnumId,
      };
      
      totalEnergy = input;
      nonRenewableEnergy = totalEnergy;
    }

    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    const fv = result.data?.fieldValues ?? [];
    let value5 = fv.find((f: any) => f.id === 5)?.value ?? "0";
    let value6 = fv.find((f: any) => f.id === 6)?.value ?? "0";
    
    setScope1(Number(value5));
    setScope2(Number(value6));
    
    updateEmissions(source, {
      scope1: Number(value5), 
      scope2: Number(value6),
      renewableEnergy,
      nonRenewableEnergy,
      totalEnergy
    });
  };

  // unit options based on source and selected type
  const availableUnitOptions = source === "fuel"
    ? fuelUnitOptions[fuelType] || []
    : unitOptionsMap[source] || [];

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-bold text-green-700 capitalize text-center">
          {sourceLabels[source]} Calculator
        </h2>
        
        <div className="grid grid-cols-2 items-center gap-2">
          <Label htmlFor="desc">Description:</Label>
          <Input id="desc" defaultValue={sourceLabels[source]} />

          {/* ELECTRICITY INPUTS */}
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
              <Label htmlFor="input2">Own production (Renewable):</Label>
              <Input
                id="input2"
                type="number"
                value={input2}
                min={0}
                onChange={e => setInput2(Number(e.target.value))}
              />
            </>
          )}

          {/* HEATING INPUTS */}
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

          {/* FUEL INPUTS */}
          {source === "fuel" && (
            <>
              <Label htmlFor="fuelType">Fuel type:</Label>
              <select
                id="fuelType"
                value={fuelType}
                onChange={e => {
                  const idx = fuelTypes.findIndex(f => f.value === e.target.value);
                  setFuelType(e.target.value);
                  setFuelTypeEnumId(fuelTypes[idx]?.enumId ?? 0);
                  const newUnit = fuelUnitOptions[e.target.value]?.[0]?.value || "";
                  setUnit(newUnit);
                }}
                className="border rounded px-2 py-1"
              >
                {fuelTypes.map(f => (
                  <option key={f.value + f.label} value={f.value}>{f.label}</option>
                ))}
              </select>
              
              <Label htmlFor="input">Amount:</Label>
              <Input
                id="input"
                type="number"
                value={input}
                min={0}
                onChange={e => setInput(Number(e.target.value))}
              />
              
              {fuelType === "NaturalGasBiogas" && (
                <>
                  <Label htmlFor="input2">Proportion of biogas (%):</Label>
                  <Input
                    id="input2"
                    type="number"
                    value={input2}
                    min={0}
                    max={100}
                    onChange={e => setInput2(Number(e.target.value))}
                  />
                </>
              )}
            </>
          )}
          
          {/* VEHICLES INPUTS - Distance input removed */}
          {source === "vehicles" && (
            <>
              <Label htmlFor="vehicleType">Vehicle type:</Label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={e => {
                  const idx = vehicleTypes.findIndex(v => v.value === e.target.value);
                  setVehicleType(e.target.value);
                  setVehicleTypeEnumId(vehicleTypes[idx]?.enumId ?? 0);
                }}
                className="border rounded px-2 py-1"
              >
                {vehicleTypes.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
              
              <Label htmlFor="input">Amount:</Label>
              <Input
                id="input"
                type="number"
                value={input}
                min={0}
                onChange={e => setInput(Number(e.target.value))}
              />
            </>
          )}

          {/* PROCESS INPUTS - Just amount and gas type (no process types) */}
          {source === "process" && (
            <>
              <Label htmlFor="gasType">Greenhouse gas:</Label>
              <select
                id="gasType"
                value={gasType}
                onChange={e => {
                  const idx = gasTypes.findIndex(g => g.value === e.target.value);
                  setGasType(e.target.value);
                  setGasTypeEnumId(gasTypes[idx]?.enumId ?? 0);
                }}
                className="border rounded px-2 py-1"
              >
                {gasTypes.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              
              <Label htmlFor="input">Amount:</Label>
              <Input
                id="input"
                type="number"
                value={input}
                min={0}
                onChange={e => setInput(Number(e.target.value))}
              />
            </>
          )}

          {/* UNIT DROPDOWN FOR ALL */}
          <Label htmlFor="unit">Unit:</Label>
          <select
            id="unit"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {availableUnitOptions.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        <Button className="w-full" onClick={handleCalculate}>
          Calculate
        </Button>

        <div className="grid grid-cols-2 gap-2 pt-4">
          <Label>Scope 1 CO₂e (tons):</Label>
          <Input className="text-green-600 font-bold" value={scope1.toFixed(2)} disabled />

          <Label>Scope 2 CO₂e (tons):</Label>
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