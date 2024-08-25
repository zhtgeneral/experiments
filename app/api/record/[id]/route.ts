import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prisma'

export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const updatedRecord = await prisma.record.update({
      where: {
        id: params.id
      },
      data: {
        timeSpentOnPage: body.timeSpentOnPage
      }
    })
    console.log('backend update: ', updatedRecord)
    return NextResponse.json(updatedRecord, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}