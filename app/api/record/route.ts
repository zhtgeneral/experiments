import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'

/**
 * This endpoint handles creating tracking records.
 * 
 * It checks that `id` exists on the body of the request.
 * If not, throw a `400` response for `Bad request`.
 * 
 * Otherwise it checks the database for an existing record.
 * If there is an existing record, return a `100` response for `Continue`
 * 
 * Otherwise it creates a new record in the database 
 * and returns a `201` response for `Created`
 * then return the response as an object.
 * 
 * If any other error occurs at any point, 
 * return a `500` error for `Internal Server Error`.
 * 
 * @param request contains a body with the type `Record`
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return new NextResponse("Bad request", { status: 400 });
    }
    const oldRecord = await prisma.record.findFirst({
      where: {
        id: body.id
      }
    })
    if (oldRecord) {
      return NextResponse.json({ error: 'Record already exists and will be skipped' }, { status: 100 })
    }
    
    const newRecord = await prisma.record.create({
      data: {
        ...body
      },
    })  
    return NextResponse.json(newRecord, { status: 201 })
  } catch (error: any) {
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}

