import { NextResponse } from 'next/server'
import { InputSchema, UnitMap } from '@/lib/other/zod'

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

  const payload = {
    id: -1,
    calculationId: -1,
    subgroupingId: 1,
    coeficientGroup: 'Miljødeklaration',
    fieldValues: [
      { id: 1,  value: input.description },
      { id: 2,  value: input.consumptionGrid },
      { id: 3,  value: input.consumptionOwn },
      { id: 1154, value: '' },
      {
        id: 4,
        value: UnitMap[input.unit].code,
        fieldEnumId: UnitMap[input.unit].fieldEnumId,
      },
      { id: 5,  value: '' },
      { id: 6,  value: '' },
      { id: 40, value: '' },
      { id: 8,  value: '' },
      { id: 9,  value: '' },
      { id: 68, value: 'fe_id-700', fieldEnumId: 700 },
    ],
    isBasisModule: true,
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
    return NextResponse.json({ error: `Network error: ${err.message}` }, { status: 500 })
  }

  if (!resExternal.ok) {
    const details = await resExternal.text().catch(() => '')
    return NextResponse.json(
      { error: `Upstream ${resExternal.status}`, details },
      { status: 502 }
    )
  }

  const data = await resExternal.json()
  return NextResponse.json(data)
}
