'use client'

import { useFeature } from "@growthbook/growthbook-react";
import React, { useEffect, useState } from "react";

const ExperimentPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const featureA = useFeature("test-name-a");
  const featureB = useFeature("test-feature-b");
  const flagA = (featureA.on) ? "Feature A is on" : "Feature A is off";
  const flagB = `Feature B is ${featureB.value}`;
  
  // prevents filckering values on front end
  useEffect(() => {
    if (featureA.source) {
      setIsLoaded(true);
    }
  }, [featureA]);

  if (!isLoaded) {
    return null; 
  }
  return (
    <div>
      Test Web page
      <div>
        {featureA.experiment?.name}
      </div>
      <div>
        {flagA}
      </div>
      <div>
        {flagB}
      </div>
    </div>
  )
}
export default ExperimentPage;


