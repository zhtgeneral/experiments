'use client'

import TestComponent from "@/components/TestComponent";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect } from "react";
import * as Bowser from "bowser"

export default function Home() {
  useEffect(() => {
    async function init() {
      // // below saves the exp id in cache
      // let userId = localStorage.getItem('userId');
      // if (!userId) {
      //   userId = Math.random().toString(36).substring(2, 15);
      //   localStorage.setItem('userId', userId);
      // }
      // const userId = Math.random().toString(36).substring(2, 15);

      // below makes a new exp id each refresh
      const userId = Math.random().toString(36).substring(2, 15);

      // below gets the browser name
      const browser = Bowser.getParser(window.navigator.userAgent).getBrowserName().toLowerCase();

      growthbook.setAttributes({
        id: userId,
        browser: browser,
      });
      
      await growthbook.init({
        streaming: true,
      });
    }
    init();
  }, []);
  
  return (
    <GrowthBookProvider growthbook={growthbook}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TestComponent />
      </main>
    </GrowthBookProvider>
  );

}


