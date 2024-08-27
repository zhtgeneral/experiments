import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const oldRecord = await prisma.record.findFirst({
      where: {
        id: body.id
      }
    })
    if (oldRecord) 
      return NextResponse.json({ error: 'Record already exists and will be skipped' }, { status: 200 })
    
    const newRecord = await prisma.record.create({
      data: {
        ...body
      },
    })  
    console.log('Record created: ', newRecord)
    return NextResponse.json(newRecord, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

