"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type EmissionValues = {
  scope1: number;
  scope2: number;
};

type EmissionsState = {
  electricity: EmissionValues;
  fuel: EmissionValues;
  heating: EmissionValues;
  updateEmissions: (source: keyof Omit<EmissionsState, "updateEmissions">, data: EmissionValues) => void;
};

const EmissionsContext = createContext<EmissionsState | null>(null);

export function EmissionsProvider({ children }: { children: ReactNode }) {
  const [emissions, setEmissions] = useState({
    electricity: { scope1: 0, scope2: 0 },
    fuel: { scope1: 0, scope2: 0 },
    heating: { scope1: 0, scope2: 0 },
  });

  const updateEmissions = (source: keyof Omit<EmissionsState, "updateEmissions">, data: EmissionValues) => {
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
  if (!context) throw new Error("useEmissions must be used within an EmissionsProvider");
  return context;
}