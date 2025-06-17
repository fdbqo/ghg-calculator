type CalculatorType = "electricity" | "heat" | "fuels" | "vehicles" | "process";
interface BuildPayloadOptions {
  type: CalculatorType;
  description: string;
  // for electricity
  consumptionGrid?: string | number;
  consumptionOwn?: string | number;
  // for heat
  amount?: string | number;
  emissionFactor?: string | number;
  // for fuels
  fuelTypeId?: string;
  fuelTypeEnumId?: number;
  biogasProportion?: string | number;
  // for vehicles
  vehicleTypeId?: string;
  vehicleTypeEnumId?: number;
  distance?: string | number;
  // for process
  processTypeId?: string;
  processTypeEnumId?: number;
  // common fields
  unitId?: string;
  unitEnumId?: number;
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
          { id: 12, value: opts.biogasProportion ? String(opts.biogasProportion) : "" },
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
    case "vehicles":
      return {
        id: -1,
        calculationId: -1,
        subgroupingId: 39,
        coeficientGroup: "Miljødeklaration",
        fieldValues: [
          { id: 1, value: opts.description },
          { id: 61, value: opts.vehicleTypeId ?? "", fieldEnumId: opts.vehicleTypeEnumId },
          { id: 10, value: String(opts.amount ?? "") },
          { id: 51, value: opts.unitId ?? "", fieldEnumId: opts.unitEnumId },
          { id: 50, value: String(opts.distance ?? "") },
          { id: 1154, value: "" },
          { id: 5, value: "" },
          { id: 6, value: "" },
          { id: 7, value: "" },
          { id: 8, value: "" },
          { id: 9, value: "" },
          { id: 98, value: "fe_id-750", fieldEnumId: 750 },
        ],
        isBasisModule: true,
      };
    case "process":
      return {
        id: -1,
        calculationId: -1,
        subgroupingId: 6,
        coeficientGroup: "Miljødeklaration",
        fieldValues: [
          { id: 1, value: opts.description },
          { id: 14, value: opts.processTypeId ?? "", fieldEnumId: opts.processTypeEnumId },
          { id: 10, value: String(opts.amount ?? "") },
          { id: 24, value: opts.unitId ?? "", fieldEnumId: opts.unitEnumId },
          { id: 5, value: "" },
          { id: 6, value: "" },
          { id: 7, value: "" },
          { id: 8, value: "" },
          { id: 9, value: "" },
          { id: 73, value: "fe_id-843", fieldEnumId: 843 },
        ],
        isBasisModule: true,
      };
    default:
      throw new Error(`Unknown calculator type: ${opts.type}`);
  }
}

