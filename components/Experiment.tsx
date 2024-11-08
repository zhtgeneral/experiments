'use client'

import { useFeature } from "@growthbook/growthbook-react";
import React, { useEffect, useState } from "react";
import Image from 'next/image'

const ExperimentPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const feature = useFeature("test-name-a");
  const isFeatureActive = feature.source;
  const displayFeature = feature.on? "Feature A" : "Feature B";
  // const featureB = useFeature("test-feature-b");

  let testPicture = null;
  if (isFeatureActive) {
    if (feature.on) {
      testPicture = <Image 
        src="/mountains.webp" 
        alt="Picture A" 
        width={1960}
        height={1080}
        priority
        className="object-cover w-full rounded-xl"
      />
    } else {
      testPicture =  <Image 
        src="/sunset.webp" 
        alt="Picture B" 
        width={1960}
        height={1080}
        priority
        className="object-cover w-full rounded-xl"
      />
    }
  }
  
  /** Fixes hydration error */
  useEffect(() => {
    if (feature.source) {
      setIsLoaded(true);
    }
  }, [feature]);

  if (!isLoaded) {
    return null; 
  }
  return (
    <div className="w-full bg-background-light h-screen flex flex-col">
      <nav className="bg-gradient-to-b from-nav-start to-nav-end w-full py-8 items-center flex justify-center">
        <div className="font-bold text-5xl text-black text-center">
          Experiment Web Page
        </div>
      </nav>
      <main className="flex flex-1 justify-center pt-6">
        <div className="lg:w-[70%] bg-gradient-to-b from-foreground-start to-foreground-end rounded-t-3xl">
          <div className='mx-8 my-6 font-medium text-xl'>
          {isFeatureActive 
            ? `Your experiment version: ${displayFeature}`
            : "Experiments not active" 
          }
          </div>
          <div className='mx-8 aspect-h-9 aspect-w-16'>
            {isFeatureActive 
              ? testPicture
              : null
            }
          </div>
        </div>
      </main>
    </div>
  )
}
export default ExperimentPage;


