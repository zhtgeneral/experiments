'use client'

import { useFeature } from "@growthbook/growthbook-react";
import React, { useEffect, useState } from "react";

const TestComponent = () => {
  const [loaded, setLoaded] = useState(false);

  const featureA = useFeature("test-name-a");
  const featureB = useFeature("test-feature-b");
  const flagA = (featureA.on) ? "Feature A is on" : "Feature A is off";
  const flagB = `Feature B is ${featureB.value}`;
  
  // prevents filckering values on front end
  useEffect(() => {
    if (featureA.source) setLoaded(true)
  }, [featureA]);

  if (!loaded) return null; 
  return (
    <div>
      test
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
export default TestComponent


