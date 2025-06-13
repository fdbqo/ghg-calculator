"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define all valid emission sources
export type SourceType =
  | "electricity"
  | "fuel"
  | "heating"
  | "process"
  | "vehicles";

// Emission data structure for each source
export type EmissionData = {
  scope1: number;
  scope2: number;
  renewableEnergy: number;
  nonRenewableEnergy: number;
  totalEnergy: number;
};

// Context type definition
type EmissionsContextType = {
  emissions: Record<SourceType, EmissionData>;
  updateEmissions: (source: SourceType, data: EmissionData) => void;
};

// Default zeroed emission values
const defaultEmissionData: EmissionData = {
  scope1: 0,
  scope2: 0,
  renewableEnergy: 0,
  nonRenewableEnergy: 0,
  totalEnergy: 0,
};

// Create the context
const EmissionsContext = createContext<EmissionsContextType | undefined>(undefined);

// Provider implementation
export const EmissionsProvider = ({ children }: { children: ReactNode }) => {
  const [emissions, setEmissions] = useState<Record<SourceType, EmissionData>>({
    electricity: { ...defaultEmissionData },
    fuel: { ...defaultEmissionData },
    heating: { ...defaultEmissionData },
    process: { ...defaultEmissionData },
    vehicles: { ...defaultEmissionData },
  });

  const updateEmissions = (source: SourceType, data: EmissionData) => {
    setEmissions((prev) => ({
      ...prev,
      [source]: data,
    }));
  };

  return (
    <EmissionsContext.Provider value={{ emissions, updateEmissions }}>
      {children}
    </EmissionsContext.Provider>
  );
};

// Custom hook to use the emissions context
export const useEmissions = () => {
  const context = useContext(EmissionsContext);
  if (!context) {
    throw new Error("useEmissions must be used within an EmissionsProvider");
  }
  return context;
};
