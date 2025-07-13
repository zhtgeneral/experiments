import { z } from 'zod';

export const RecordDataSchema = z.object({
  experimentId: z.string(),
  variationId: z.string(),
  weekday: z.string(),
  day: z.string(),
  month: z.string(),
  year: z.string(),
  time: z.string(),
  createdAt: z.coerce.date(),
  timeRegion: z.string(),
  browser: z.string(),
  browserVersion: z.string(),
  os: z.string(),
  engine: z.string(),
  platformType: z.string(),
  bandwidth: z.string(),
  location: z.string(),
  sessionLength: z.number().optional(),
  keylog: z.string().optional()
});

export type RecordData = z.infer<typeof RecordDataSchema>;