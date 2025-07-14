import { NextRequest, NextResponse } from "next/server";
import { RecordDataSchema } from '@/app/types/RecordData';
import RecordService from "@/app/services/RecordService";

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
  const { recordData } = await request.json();
  if (!recordData) {
    console.log("/api/record POST body missing recordData");
    return NextResponse.json({ success: false, error: "recordData missing from body" } , { status: 400 });
  }

  const backendValidation = RecordDataSchema.safeParse(recordData);
  if (!backendValidation.success) {
    console.log("/api/record POST body is not of type RecordData");
    return NextResponse.json({ success: false, error: "Data not formatted correctly" } , { status: 400 });
  }

  try {    
    var newRecord = await RecordService.createRecord(recordData); 
  } catch (error: any) {
    console.log("/api/record POST unable to create record: " + error);
    return NextResponse.json({ success: false, error: "Unable to create record" } , { status: 500 });
  }

  console.log("/api/record POST record created successfully: " + JSON.stringify(newRecord, null, 2));
  return NextResponse.json({
    success: true,    
    message: 'Record created successfully',
    newRecord: newRecord
  }, { status: 201 })
}