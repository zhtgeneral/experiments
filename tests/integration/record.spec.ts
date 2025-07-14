import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as postCreateRecord } from '@/app/api/record/route';
import { POST as postUpdateRecord } from '@/app/api/record/[recordId]/route'
import '@testing-library/jest-dom';
import RecordService from '@/app/services/RecordService';

function createMockRequest(url: string, method: string, body: any = null) {
  url = url.startsWith('/')? url.slice(1) : url;
  return new NextRequest(`http://localhost:3000/${url}`, {
    method: method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

const mockRecordData = {
  experimentId: 'exp-version',
  variationId: 'a',
  weekday: 'Sun',
  day: '1',
  month: 'Jul',
  year: '2025',
  time: 'some-time',
  createdAt: new Date().toISOString(),
  timeRegion: 'UTC',
  browser: 'test-browser',
  browserVersion: 'test-browser-version', 
  os: 'test-os',
  engine: 'test-engine',
  platformType: 'test-platform',
  bandwidth: 'not set',
  location: 'test-location',
  sessionLength: 0,
  keylog: 'empty-keylogs',
};

const mockData = {
  id: 'test',
  ...mockRecordData
}

describe('/api/record POST', () => {
  it('should return 400 for missing recordData', async () => {
    const mockRequest = createMockRequest('/api/record', 'POST', {
      someOtherField: 1
    });

    const response = await postCreateRecord(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'recordData missing from body');
  })

  /** Get highest line coverage for least amount of test lines */
  it('should return 400 for improper recordData', async () => {
    const mockRequest = createMockRequest('/api/record', 'POST', {
      recordData: {
        ...mockRecordData,
        location: 1234
      }
    });

    const response = await postCreateRecord(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'Data not formatted correctly');
  })

  it('should return 500 for RecordService fail', async () => {
    vi.spyOn(RecordService, 'createRecord').mockRejectedValue(new Error('Some error related to Prisma'))

    const mockRequest = createMockRequest('/api/record', 'POST', {
      recordData: mockRecordData
    });

    const response = await postCreateRecord(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'Unable to create record');
  })

  it('should return 201 for successful record', async () => {
    vi.spyOn(RecordService, 'createRecord').mockResolvedValue(mockData)

    const mockRequest = createMockRequest('/api/record', 'POST', {
      recordData: mockRecordData,
    });

    const response = await postCreateRecord(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toHaveProperty('success', true);
    expect(json).toHaveProperty('message', 'Record created successfully');
    expect(json).toHaveProperty('newRecord', mockData);
  });
});

describe('/api/record/:recordId POST', () => {
  it('should return 400 for non-blob data', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      keylog: "test-keylog",
      sessionLength: 10
    });

    vi.spyOn(mockRequest, 'blob').mockRejectedValue(new Error('Invalid blob data'));

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test-id'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'Blob data required');    
  })

  it('should return 400 for missing sessionLength', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      keylog: "test-keylog",
    });

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test-id'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'sessionLength missing from data');    
  })

  it('should return 400 for non-numerical sessionLength', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      sessionLength: 'non number session',
      keylog: "test-keylog",
    });

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test-id'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'sessionLength was not a number');    
  })

  it('should return 400 for missing keylog', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      sessionLength: 30,
    });

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test-id'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'keylog missing from data');    
  })

  it('should return 400 for non-string keylog', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      sessionLength: 30,
      keylog: 123
    });

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test-id'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'keylog was not a string');    
  })

  it('should return 400 for missing recordId on param', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      sessionLength: 30,
      keylog: 'test keylog'
    });

    const response = await postUpdateRecord(mockRequest, {
      params: {}
    });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'recordId missing from params');    
  })

  it('should return 500 for RecordService.getRecordById fail', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      sessionLength: 30,
      keylog: 'test keylog'
    });

    vi.spyOn(RecordService, 'getRecordById').mockRejectedValue(new Error("Some error related to Prisma"));

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'Unable to find Record');    
  })

  it('should return 404 for non-existing record', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      sessionLength: 30,
      keylog: 'test keylog'
    });

    vi.spyOn(RecordService, 'getRecordById').mockResolvedValue(null);

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'Record Not Found');    
  })

  it('should return 500 for RecordService.updateRecord fail', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      sessionLength: 30,
      keylog: 'test keylog'
    });

    vi.spyOn(RecordService, 'getRecordById').mockResolvedValue(mockData);
    vi.spyOn(RecordService, 'updateRecord').mockRejectedValue(new Error("Some error related to updating Record"));

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toHaveProperty('success', false);
    expect(json).toHaveProperty('error', 'Unable to update Record');    
  })

  it('should return 200 for successful record update', async () => {
    const mockRequest = createMockRequest('/api/record/test', 'POST', {
      sessionLength: 30,
      keylog: 'test keylog'
    });
    const updatedRecord = {
      ...mockData,
      sessionLength: 30,
      keylog: 'test-keylog'
    }
    

    vi.spyOn(RecordService, 'getRecordById').mockResolvedValue(mockData);
    vi.spyOn(RecordService, 'updateRecord').mockResolvedValue(updatedRecord);

    const response = await postUpdateRecord(mockRequest, {
      params: {
        recordId: 'test'
      }
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveProperty('success', true);
    expect(json).toHaveProperty('message', 'Record updated successfully');
    expect(json).toHaveProperty('updatedRecord', updatedRecord);    
  })
})
