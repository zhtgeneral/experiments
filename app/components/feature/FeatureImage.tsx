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
        src="/city.jpg" 
        alt="Picture A" 
        width={1960}
        height={1080}
        priority
        className="object-cover w-full rounded-xl"
      />
    } else {
      featureImage =  <Image 
        src="/trees.jpg" 
        alt="Picture B" 
        width={1960}
        height={1080}
        priority
        className="object-cover w-full rounded-xl"
      />
    }
  } 

  return featureImage;
};

export default FeatureImage;