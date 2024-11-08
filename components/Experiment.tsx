'use client'

import { useFeature } from "@growthbook/growthbook-react";
import React from "react";
import FeatureImage from "@/components/FeatureImage";

const ExperimentPage = () => {
  const feature = useFeature("test-name-a"); // another feature is "test-feature-b"

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


