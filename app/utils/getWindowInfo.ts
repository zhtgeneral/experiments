/**
 * This helper function returns the browser, browserVersion, os, engine, and platformType of a user
 * as strings all in lowercase
 * 
 */
export default function getWindowInfo(parser: Bowser.Parser.Parser) {
  const browser = parser.getBrowserName().toLowerCase();
  const browserVersion = parser.getBrowserVersion();
  const os = parser.getOSName().toLowerCase();
  const engine = parser.getEngineName().toLowerCase();
  const platformType = parser.getPlatformType().toLowerCase();
  return {
    browser,
    browserVersion,
    os,
    engine,
    platformType
  }
}