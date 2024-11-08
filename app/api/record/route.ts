import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'
import { HttpStatusCode } from "axios";

/**
 * This endpoint handles creating tracking records.
 * 
 * It creates a new record in the database 
 * and returns a `201` response for `Created`
 * then return the response as an object.
 * 
 * If any other error occurs at any point, 
 * return a `500` error for `Internal Server Error`.
 * 
 * @param request contains a body with the type `RecordData`
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecord = await prisma.record.create({
      data: {
        ...body
      },
    })  
    return NextResponse.json(newRecord, { status: HttpStatusCode.Created })
  } catch (error: any) {
    return NextResponse.json(error.message, { status: HttpStatusCode.InternalServerError });
  }
}

