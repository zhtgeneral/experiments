import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newRecord = await prisma.record.create({
      data: {
        ...body
      },
    })
    console.log('backend post: ', newRecord)
    return NextResponse.json(newRecord, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

