import { NextRequest, NextResponse } from "next/server"
import prisma from '@/app/lib/prisma'
import RecordService from "@/app/services/RecordService";

/**
 * This endpoint handles finalizing a session length.
 * 
 * It checks that `sessionLength` and `keylog` exist on the blob of the request
 * and that the id exists on params.
 * If not, throw a `400` response for `Bad request`.
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
 * 
 * WARNING: DO NOT CHANGE TO A PUT FUNCTION. FRONTEND SENDBEACON ONLY RECOGNIZES POST.
 */
export async function POST(
  request: NextRequest, 
  { params }: { params: { recordId?: string } }
) {
  /** blob is the only type that gets passed by navigator.sendBeacon for now */
  try {
    const blob = await request.blob();
    const text = await blob.text();
    var data = JSON.parse(text);
  } catch (error: any) {
    console.error("/api/record:recordId POST parse data: " + error);
    return NextResponse.json({ success: false, error: 'Blob data required' }, { status: 400 });
  }  

  const { sessionLength, keylog } = data;
  const { recordId } = params;

  if (sessionLength === undefined) {
    return NextResponse.json({ success: false, error: 'sessionLength missing from data' }, { status: 400 });
  }
  if (typeof sessionLength !== 'number') {
    return NextResponse.json({ success: false, error: 'sessionLength was not a number' }, { status: 400 });
  }
  if (keylog === undefined) {
    return NextResponse.json({ success: false, error: 'keylog missing from data' }, { status: 400 });
  }
  if (typeof keylog !== 'string') {
    return NextResponse.json({ success: false, error: 'keylog was not a string' }, { status: 400 });
  }
  if (!recordId || recordId === undefined) {
    return NextResponse.json({ success: false, error: 'recordId missing from params' }, { status: 400 });
  }    

  try {        
    var existingRecord = await RecordService.getRecordById(recordId);
  } catch (error: any) {
    console.error("/api/record:recordId POST find record error: " + error);
    return NextResponse.json({ success: false, error: 'Unable to find Record' }, { status: 500 });
  }

  if (!existingRecord) {
    console.error("/api/record:recordId POST record not found");
    return NextResponse.json({ success: false, error: 'Record Not Found' }, { status: 404 });
  }

  try {
    var updatedRecord = await RecordService.updateRecord(existingRecord.id, data);
  } catch (error: any) {
    console.error("/api/record:recordId POST update record error: " + error);
    return NextResponse.json({ success: false, error: 'Unable to update Record' }, { status: 500 });
  }

  console.log("/api/record:recordId POST updated Record: " + JSON.stringify(updatedRecord, null, 2));
  return NextResponse.json({ 
    success: true, 
    message: 'Record updated successfully', 
    updatedRecord: updatedRecord 
  }, { status: 200 });
}