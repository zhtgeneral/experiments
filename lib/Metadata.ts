export default class Metadata {
  private static isTracking = false;
  private static onPage = true;
  private static sessionLength = 0;
  private static recordId = "";
  private static lastVisited = Date.now();
  private static keylog = "";

  public static getIsTracking() {
    return this.isTracking;
  }

  public static setIsTracking(isTracking: boolean) {
    Metadata.isTracking = isTracking;
  }

  public static getOnPage() {
    return Metadata.onPage;
  }

  public static setOnPage(onPage: boolean) {
    Metadata.onPage = onPage;
  }

  public static getSessionLength() {
    return Metadata.sessionLength;
  }

  public static setSessionLength(sessionLength: number) {
    Metadata.sessionLength = sessionLength;
  }

  public static getRecordId() {
    return Metadata.recordId;
  }

  public static setRecordId(recordId: string) {
    Metadata.recordId = recordId;
  }

  public static getLastVisited() {
    return Metadata.lastVisited;
  }

  public static setLastVisited(lastVisited: number) {
    Metadata.lastVisited = lastVisited;
  }

  public static getKeylog() {
    return Metadata.keylog;
  }

  public static incrementKeylog(keylog: string) {
    Metadata.keylog += keylog;
  }


  
  

}