import prisma from '@/app/lib/prisma'

export default class RecordService {
  /**
   * Assume recordData is properly formatted
   */
  public static async createRecord(recordData: any) {
    return await prisma.record.create({
      data: {
        ...recordData
      },
    })  
  }

  public static async getRecordById(recordId: string) {
    return await prisma.record.findFirst({
      where: {
        id: recordId
      },
      orderBy: [
        {
          createdAt: "desc"
        }
      ]
    });
  }

  /** 
   * Assume that existing recordId exists and data is contains keylog and sessionLength
   */
  public static async updateRecord(recordId: string, data: any) {
    return await prisma.record.update({
      where: {
        id: recordId
      },
      data: {
        ...data
      }
    })
  }
}