'use client'

import { useFeature } from "@growthbook/growthbook-react";
import FeatureImage from "@/app/components/feature/FeatureImage";
import growthbook from "@/lib/growthbook";
import FeatureHeader from "@/app/components/feature/FeatureHeader";
import Nav from "@/app/components/Nav";

/**
 * This component is the main page for the experiments.
 * 
 * It displays the header.
 * 
 * It displays the body that renders the image depending on the experiment value
 * @requires growthbook needs to be init before this component gets mounted
 */
const ExperimentPage = () => {
  const feature = useFeature("test-name-a"); 

  return (
    <div className="w-full bg-background-light h-screen flex flex-col">
      <Nav />
      <main className="flex flex-1 justify-center pt-4">
        <div className="w-full mx-4 lg:mx-0 lg:w-[70%] bg-gradient-to-b from-foreground-start to-foreground-end rounded-t-3xl">
          <div className='mx-4 mt-4 mb-4 font-medium text-xl'>
            <FeatureHeader isOn={growthbook.ready} value={feature.value} />
          </div>          
          <div className='mx-4 mb-4'>
            <FeatureImage isOn={growthbook.ready} value={feature.value} />
          </div>
        </div>
      </main>
    </div>
  )
}
export default ExperimentPage;


