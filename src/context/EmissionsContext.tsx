"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type EmissionValues = {
  scope1: number;
  scope2: number;
  renewableEnergy: number;
  nonRenewableEnergy: number;
  totalEnergy: number;
};

type EmissionsState = {
  electricity: EmissionValues;
  fuel: EmissionValues;
  heating: EmissionValues;
  updateEmissions: (
    source: keyof Omit<EmissionsState, "updateEmissions">,
    data: EmissionValues
  ) => void;
};

const defaultEmission: EmissionValues = {
  scope1: 0,
  scope2: 0,
  renewableEnergy: 0,
  nonRenewableEnergy: 0,
  totalEnergy: 0,
};

const EmissionsContext = createContext<EmissionsState | null>(null);

export function EmissionsProvider({ children }: { children: ReactNode }) {
  const [emissions, setEmissions] = useState({
    electricity: { ...defaultEmission },
    fuel: { ...defaultEmission },
    heating: { ...defaultEmission },
  });

  const updateEmissions = (
    source: keyof Omit<EmissionsState, "updateEmissions">,
    data: EmissionValues
  ) => {
    setEmissions((prev) => ({ ...prev, [source]: data }));
  };

  return (
    <EmissionsContext.Provider value={{ ...emissions, updateEmissions }}>
      {children}
    </EmissionsContext.Provider>
  );
}

export function useEmissions(): EmissionsState {
  const context = useContext(EmissionsContext);
  if (!context) throw new Error("An error has occurred calculating your emissions");
  return context;
}
