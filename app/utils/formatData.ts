import Tracker from '@/app/src/Tracker';
import { RecordData } from '@/app/types/RecordData';
import destructureDate from '@/app/utils/destructureDate';
import getLocation from '@/app/utils/getLocation';
import Bowser from 'bowser';
import getWindowInfo from '@/app/utils/getWindowInfo';

export default function formatData(experimentKey: string, resultKey: string): RecordData {
  const date = new Date();
  const destructuredDate = destructureDate(date);

  const location = getLocation();

  const parser = Bowser.getParser(window.navigator.userAgent);
  const windowInfo = getWindowInfo(parser);

  const bandwidth = Tracker.getDeviceBandwidth();
  const data: RecordData = {
    experimentId: experimentKey,
    variationId: resultKey,
    weekday: destructuredDate.weekday,
    day: destructuredDate.day,
    month: destructuredDate.month,
    year: destructuredDate.year,
    time: destructuredDate.time,
    createdAt: date,
    timeRegion: destructuredDate.timeRegion,
    browser: windowInfo.browser,
    browserVersion: windowInfo.browserVersion,
    os: windowInfo.os,
    engine: windowInfo.engine,
    platformType: windowInfo.platformType,
    bandwidth: bandwidth,
    location: location,
  }
  return data;
}