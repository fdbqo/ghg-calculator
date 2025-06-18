import { z } from 'zod'

export const inputSchema = z.object({
  type: z.enum(['electricity', 'heat', 'fuels', 'vehicles', 'process']),
  description: z.string().min(1, 'Description is required'),
  // common fields
  amount: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number').optional(),
  unit: z.enum(['KWh', 'MWh', 'GJ', 'L', 'm3', 'nm3', 'km', 'Kg', 't']).optional(),
  unitId: z.string().optional(),
  unitEnumId: z.number().optional(),
  // for electricity
  consumptionGrid: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number').optional(),
  consumptionOwn: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number').optional(),
  // for heat
  emissionFactor: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number').optional(),
  // for fuels
  fuelTypeId: z.string().optional(),
  fuelTypeEnumId: z.number().optional(),
  biogasProportion: z.string().regex(/^\d*(\.\d+)?$/, 'Must be a number').optional(),
  // For vehicles
  vehicleTypeId: z.string().optional(),
  vehicleTypeEnumId: z.number().optional(),
  // For process
  processTypeId: z.string().optional(),
  processTypeEnumId: z.number().optional(),
  gasTypeId: z.string().optional(),
  gasTypeEnumId: z.number().optional(),
})

// correct enum IDs for both vehicle units
export const unitMap: Record<
  string,
  { code: string; fieldEnumId: number }
> = {
  KWh: { code: 'fe_id-1', fieldEnumId: 1 },
  MWh: { code: 'fe_id-2', fieldEnumId: 2 },
  GJ: { code: 'fe_id-3', fieldEnumId: 3 },
  L: { code: 'fe_id-5', fieldEnumId: 5 },
  m3: { code: 'fe_id-1864', fieldEnumId: 1864 },
  nm3: { code: 'fe_id-4', fieldEnumId: 4 },
  km: { code: 'fe_id-267', fieldEnumId: 267 },
  "L-vehicle": { code: 'fe_id-268', fieldEnumId: 268 },
  Kg: { code: 'fe_id-68', fieldEnumId: 68 },
};

export const vehicleTypes = [
  { label: "Car (petrol)", value: "fe_id-305", enumId: 305 },
  { label: "Car (diesel)", value: "fe_id-306", enumId: 306 },
  { label: "Car (electric)", value: "fe_id-300", enumId: 300 },
];

export const gasTypes = [
  { label: "CO₂", value: "fe_id-43", enumId: 43 },
  { label: "CH₄", value: "fe_id-44", enumId: 44 },
  { label: "N₂O", value: "fe_id-45", enumId: 45 },
  { label: "SF₆", value: "fe_id-46", enumId: 46 },
];