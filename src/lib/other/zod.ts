import { z } from 'zod'

export const InputSchema = z.object({
  description:     z.string().min(1, 'Description is required'),
  consumptionGrid: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number'),
  consumptionOwn:  z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number'),
  unit:            z.enum(['KWh','MWh','GJ']),
})

export const UnitMap: Record<
  z.infer<typeof InputSchema>['unit'],
  { code: string; fieldEnumId: number }
> = {
  KWh: { code: 'fe_id-1', fieldEnumId: 1 },
  MWh: { code: 'fe_id-2', fieldEnumId: 2 },
  GJ:  { code: 'fe_id-3', fieldEnumId: 3 },
}
