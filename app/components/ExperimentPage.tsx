'use client'

import { useFeature, useFeatureIsOn, useGrowthBook } from "@growthbook/growthbook-react";
import React, { useEffect } from "react";
import FeatureImage from "@/app/components/FeatureImage";

/**
 * This component is the main page for the experiments.
 * 
 * It displays the header.
 * 
 * It displays the body that renders the image depending on the experiment value
 * @requires growthbook needs to be init before this component gets mounted
 */
const ExperimentPage = () => {
  const growthbook = useGrowthBook();
  // growthbook.setAttributes({
  //   id: "asdjfhgasdkjhg"
  // })    
  console.log("child is growthbook ready: " + growthbook.ready);
  console.log("child is on:" + useFeatureIsOn("test-name-a"));
  // console.log("is feature on: " + JSON.stringify(growthbook.evalFeature("test-name-a"), null, 2));

  const feature = useFeature("test-name-a"); 
  // console.log("feature: " + JSON.stringify(feature, null, 2));  

  return (
    <div className="w-full bg-background-light h-screen flex flex-col">
      <nav className="bg-gradient-to-b from-nav-start to-nav-end w-full py-8 items-center flex justify-center">
        <div className="font-bold text-5xl text-black text-center">
          Experiment Web Page
        </div>
      </nav>
      <main className="flex flex-1 justify-center pt-6">
        <div className="w-full mx-6 lg:mx-0 lg:w-[70%] bg-gradient-to-b from-foreground-start to-foreground-end rounded-t-3xl">
          <div className='mx-6 mt-6 mb-4 font-medium text-xl'>
            {feature.on 
              ? `Your experiment version: ${(feature.value)? "Feature A" : "Feature B"}`
              : "Experiments not active" 
            }
          </div>          
          <div className='mx-6 mb-6'>
            <FeatureImage isOn={feature.on} value={feature.value} />
          </div>
        </div>
      </main>
    </div>
  )
}
export default ExperimentPage;


