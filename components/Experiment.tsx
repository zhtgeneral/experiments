'use client'

import { useFeature } from "@growthbook/growthbook-react";
import React, { useEffect, useState } from "react";

const ExperimentPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const featureA = useFeature("test-name-a");
  const featureB = useFeature("test-feature-b");
  const flagA = (featureA.on)? "Feature A is on" : "Feature A is off";
  const flagB = (featureA.on)? `Feature B is ${featureB.value}`: "Feature B is off";
  
  /** Fixes hydration error */
  useEffect(() => {
    if (featureA.source) {
      setIsLoaded(true);
    }
  }, [featureA]);

  if (!isLoaded) {
    return null; 
  }
  return (
    <div className="w-full bg-neutral-100 h-screen flex flex-col">
      <nav className="bg-neutral-200 w-full h-28 items-center flex justify-center">
        <div className="font-bold text-5xl text-gray-950 text-center">
          Experiment Web Page
        </div>
      </nav>
      <main className="flex flex-1 justify-center pt-8">
        <div className="lg:w-[70%] bg-violet-100 rounded-3xl">
          <div className='m-6'>
            Desktop
          </div>
        </div>
      </main>
    </div>
  )
}
export default ExperimentPage;


