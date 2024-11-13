import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import { HttpStatusCode } from "axios";

/**
 * This endpoint handles finalizing a session length.
 * 
 * It checks that `sessionLength` and `keylog` exist on the blob of the request
 * and that the id exists on params.
 * If not, throw a `400` response for `Bad request`.
 * 
 * If prevents extra arguments on the data by throwing a `400` response for `Unexpected arguments`.
 * 
 * If there is no existing tracking record, return a `404` response for `Not Found`.
 * 
 * Otherwise it updates the existing record in the database 
 * and returns a `200` response for `OK`
 * then return the response as an object.
 * 
 * On duplicate exising records, it takes the record most recently created.
 * 
 * If any other error occurs at any point, 
 * return a `500` error for `Internal Server Error`.
 * 
 * @param request contains a body with the type `Record`
 */
export async function POST(
  request: NextRequest, 
  { params }: { params: { recordId: string } }
) {
  try {
    /** blob is the only type that gets passed by navigator.sendBeacon for now */
    const blob = await request.blob();
    const text = await blob.text();
    const data = JSON.parse(text);

    if (Object.keys(data).length > 2)  {
      return new NextResponse("Unexpected arguments", { status: HttpStatusCode.BadRequest });
    }
    if (data.sessionLength === undefined) {
      return new NextResponse("Missing sessionLength", { status: HttpStatusCode.BadRequest });
    }
    if (data.keylog === undefined) {
      return new NextResponse("Missing keylog", { status: HttpStatusCode.BadRequest });
    }
    if (!params.recordId) {
      return new NextResponse("Missing recordId", { status: HttpStatusCode.BadRequest });
    }    
    
    const existingRecord = await prisma.record.findFirst({
      where: {
        id: params.recordId
      },
      orderBy: [
        {
          createdAt: "desc"
        }
      ]
    });
    if (!existingRecord) {
      return new NextResponse("Not Found", { status: HttpStatusCode.NotFound })
    }
    const updatedRecord = await prisma.record.update({
      where: {
        id: existingRecord.id
      },
      data: {
        ...data
      }
    })
    return NextResponse.json(updatedRecord, { status: HttpStatusCode.Ok })
  } catch (error: any) {
    return NextResponse.json(error.message, { status: HttpStatusCode.InternalServerError });
  }
}