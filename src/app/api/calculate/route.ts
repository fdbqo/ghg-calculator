import { NextResponse } from 'next/server'
import { InputSchema } from '@/lib/other/zod'
import { buildPayload } from '@/lib/api/payloadBuilder'

export async function POST(request: Request) {
  let input
  try {
    input = InputSchema.parse(await request.json())
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors.map((e: any) => e.message).join('; ') },
      { status: 400 }
    )
  }

  let payload
  try {
    payload = buildPayload({
      type: input.type,
      description: input.description,
      consumptionGrid: input.consumptionGrid,
      consumptionOwn: input.consumptionOwn,
      unitId: input.unitId,
      unitEnumId: input.unitEnumId,
      amount: input.amount,
      emissionFactor: input.emissionFactor,
      fuelTypeId: input.fuelTypeId,
      fuelTypeEnumId: input.fuelTypeEnumId,
      biogasProportion: input.biogasProportion,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Invalid calculator type or payload' },
      { status: 400 }
    )
  }

  let resExternal: Response
  try {
    resExternal = await fetch(
      'https://klimakompasset.dk/klimakompasset/v1/calculates',
      {
        method: 'POST',
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          'x-frontend-load-timestamp': '1749211135386',
          cookie: 'S9SESSIONID=17BFE7967A568D68F32DFEBB137A5197.node1;',
        },
        body: JSON.stringify(payload),
      }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: `Network error: ${err.message}` },
      { status: 500 }
    )
  }

  if (!resExternal.ok) {
    const details = await resExternal.text().catch(() => '')
    return NextResponse.json(
      { error: `Upstream ${resExternal.status}`, details },
      { status: 502 }
    )
  }

  const data = await resExternal.json()
  return NextResponse.json({ data })
}