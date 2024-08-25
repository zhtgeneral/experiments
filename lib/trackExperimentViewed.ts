import growthbook from "@/lib/growthbook";

function trackExperimentViewed(timeSpentOnPage: number) {
  growthbook.setAttributes({ 
    timeSpentOnPage: timeSpentOnPage
  });
  growthbook.triggerExperiment(growthbook.getExperiments()[0].key);
};
export default trackExperimentViewed;
