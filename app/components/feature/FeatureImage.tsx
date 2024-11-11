import React from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { FeatureResult } from '@growthbook/growthbook';

interface FeatureImageProps {
  isOn: boolean,
  value: boolean
}

/**
 * This component renders the image depending on the value of the feature flag.
 * 
 * If the feature can't be loaded, it returns a skeleton with a hovering effect. 
 * @requires feature.value is a boolean
 */
const FeatureImage: React.FC<FeatureImageProps> = ({
  isOn,
  value
}) => {
  let featureImage = <Skeleton className="h-60 w-full lg:h-[540px] rounded-xl" />;
  if (isOn) {
    if (value) {
      featureImage = <Image 
        src="/mountain_lake.jpeg" 
        alt="Picture A" 
        width={3000}
        height={2000}
        priority
        className="object-cover w-full rounded-lg lg:rounded-xl"
      />
    } else {
      featureImage =  <Image 
        src="/underwater_city.jpeg" 
        alt="Picture B" 
        width={3000}
        height={2000}
        priority
        className="object-cover w-full rounded-lg lg:rounded-xl"
      />
    }
  } 

  return featureImage;
};

export default FeatureImage;