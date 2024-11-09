'use client'

import { useFeature, useGrowthBook } from "@growthbook/growthbook-react";
import React from "react";
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
  // console.log("gb from react: " + JSON.stringify(growthbook, null, 2));
  // console.log("is feature on: " + JSON.stringify(growthbook.getFeatures(), null, 2));
  // const test = growthbook.isOn("test-name-a");
  // console.log("test: " + JSON.stringify(test, null, 2));

  const feature = useFeature("test-name-a"); // another feature is "test-feature-b"
  console.log("gb id: " + JSON.stringify(growthbook.getAttributes(), null, 2));
  console.log("feature: " + JSON.stringify(feature, null, 2));

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
              ? `Your experiment version: ${feature.value? "Feature A" : "Feature B"}`
              : "Experiments not active" 
            }
          </div>          
          <div className='mx-6 mb-6'>
            <FeatureImage feature={feature} />
          </div>
        </div>
      </main>
    </div>
  )
}
export default ExperimentPage;


