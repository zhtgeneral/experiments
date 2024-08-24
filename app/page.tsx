'use client'

import TestComponent from "@/components/TestComponent";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    async function init() {
      let userId = localStorage.getItem('userId');
      // // below saves the exp id in cache
      // if (!userId) {
      //   userId = Math.random().toString(36).substring(2, 15);
      //   localStorage.setItem('userId', userId);
      // }
      // below makes a new exp id each refresh
      userId = Math.random().toString(36).substring(2, 15);

      growthbook.setAttributes({
        id: userId,
      });
      await growthbook.init({
        streaming: true,
      });
      // console.log("init", res);
      // console.log("exp", growthbook.getExperiments());
      console.log("feats", growthbook.getFeatures());
      // console.log("api key", growthbook.getApiInfo()); // working
    }
    init();
    
    // // below works as well
    // async function wait() {
    //   const output = await axios.get('https://cdn.growthbook.io/api/features/sdk-fZaqCZwgoL08szNx')
    //   console.log("output", output);
    // }
    // wait()
  }, []);
  
  return (
    <GrowthBookProvider growthbook={growthbook}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TestComponent />
      </main>
    </GrowthBookProvider>
  );

}


