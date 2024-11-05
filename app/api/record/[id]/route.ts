import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prisma'

/**
 * This endpoint handles updated tracking records.
 * 
 * It checks that `sessionLength` exists on the body of the request
 * and that the id exists on params.
 * If not, throw a `400` response for `Bad request`.
 * 
 * Otherwise it updates the existing record in the database 
 * and returns a `201` response for `OK`
 * then return the response as an object.
 * 
 * If any other error occurs at any point, 
 * return a `500` error for `Internal Server Error`.
 * 
 * @param request contains a body with the type `Record`
 */
export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    if (!body.sessionLength || !params.id) {
      return new NextResponse("Bad Request", { status: 400 });
    }    
    const updatedRecord = await prisma.record.update({
      where: {
        id: params.id
      },
      data: {
        sessionLength: body.sessionLength
      }
    })
    return NextResponse.json(updatedRecord, { status: 200 })
  } catch (error: any) {
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}