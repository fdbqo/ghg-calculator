type CalculatorType = "electricity" | "heat" | "fuels";
interface BuildPayloadOptions {
  type: CalculatorType;
  description: string;
  // for electricity
  consumptionGrid?: string | number;
  consumptionOwn?: string | number;
  unitId?: string;
  unitEnumId?: number;
  // for heat
  amount?: string | number;
  emissionFactor?: string | number;
  // for fuels
  fuelTypeId?: string;
  fuelTypeEnumId?: number;
  biogasProportion?: string | number;
}

export function buildPayload(opts: BuildPayloadOptions) {
  switch (opts.type) {
    case "electricity":
      return {
        id: -1,
        calculationId: -1,
        subgroupingId: 1,
        coeficientGroup: "Miljødeklaration",
        fieldValues: [
          { id: 1, value: opts.description },
          { id: 2, value: String(opts.consumptionGrid ?? "") },
          { id: 3, value: String(opts.consumptionOwn ?? "") },
          { id: 1154, value: "" },
          { id: 4, value: opts.unitId ?? "", fieldEnumId: opts.unitEnumId },
          { id: 5, value: "" },
          { id: 6, value: "" },
          { id: 40, value: "" },
          { id: 8, value: "" },
          { id: 9, value: "" },
          { id: 68, value: "fe_id-700", fieldEnumId: 700 },
        ],
        isBasisModule: true,
      };
    case "heat":
      return {
        id: -1,
        calculationId: -1,
        subgroupingId: 3,
        coeficientGroup: "Miljødeklaration",
        fieldValues: [
          { id: 1, value: opts.description },
          { id: 10, value: String(opts.amount ?? "") },
          { id: 4, value: opts.unitId ?? "", fieldEnumId: opts.unitEnumId },
          { id: 39, value: opts.emissionFactor ? String(opts.emissionFactor) : "" },
          { id: 5, value: "" },
          { id: 6, value: "" },
          { id: 40, value: "" },
          { id: 8, value: "" },
          { id: 9, value: "" },
          { id: 70, value: "fe_id-702", fieldEnumId: 702 },
        ],
        isBasisModule: true,
      };
    case "fuels":
      return {
        id: -1,
        calculationId: -1,
        subgroupingId: 4,
        coeficientGroup: "Miljødeklaration",
        fieldValues: [
          { id: 1, value: opts.description },
          { id: 13, value: opts.fuelTypeId ?? "", fieldEnumId: opts.fuelTypeEnumId },
          { id: 12, value: opts.biogasProportion ? String(opts.biogasProportion) : "" }, // only set for natural gas x biogas
          { id: 10, value: String(opts.amount ?? "") },
          { id: 15, value: opts.unitId ?? "", fieldEnumId: opts.unitEnumId },
          { id: 5, value: "" },
          { id: 6, value: "" },
          { id: 40, value: "" },
          { id: 8, value: "" },
          { id: 9, value: "" },
          { id: 71, value: "fe_id-703", fieldEnumId: 703 },
        ],
        isBasisModule: true,
      };
    default:
      throw new Error("Unknown calculator type");
  }
}

