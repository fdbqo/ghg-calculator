import { z } from 'zod'

export const InputSchema = z.object({
  type:             z.enum(['electricity', 'heat', 'fuels']),
  description:      z.string().min(1, 'Description is required'),
  consumptionGrid:  z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number').optional(),
  consumptionOwn:   z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number').optional(),
  amount:           z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number').optional(),
  emissionFactor:   z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number').optional(),
  fuelTypeId:       z.string().optional(),
  fuelTypeEnumId:   z.number().optional(),
  biogasProportion: z.string().regex(/^\d*(\.\d+)?$/, 'Must be a number').optional(),
  unit:             z.enum(['KWh','MWh','GJ','L','m3']).optional(),
  unitId:           z.string().optional(),
  unitEnumId:       z.number().optional(),
})

export const UnitMap: Record<
  NonNullable<z.infer<typeof InputSchema>['unit']>,
  { code: string; fieldEnumId: number }
> = {
  KWh: { code: 'fe_id-1', fieldEnumId: 1 },
  MWh: { code: 'fe_id-2', fieldEnumId: 2 },
  GJ:  { code: 'fe_id-3', fieldEnumId: 3 },
  L:   { code: 'fe_id-5', fieldEnumId: 5 },
  m3:  { code: 'fe_id-1864', fieldEnumId: 1864 },
}