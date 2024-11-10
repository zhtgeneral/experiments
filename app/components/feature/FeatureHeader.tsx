import React from 'react';

interface FeatureHeaderProps {
  isOn: boolean,
  value: boolean
}

/**
 * This component renders the header depending on the value of the feature flag.
 * 
 * If the feature can't be loaded, it returns a message indicating that experiments aren't active.
 * Otherwise it displays the version of the experiment depending on the feature value.
 * @requires value is a boolean
 */
const FeatureHeader: React.FC<FeatureHeaderProps> = ({
  isOn,
  value
}) => {
  if (isOn) {
    if (value) {
      return "Your experiment version: Feature A"
    } else {
      return "Your experiment version: Feature B"
    }
  } else {
    return "Experiments not active" 
  }
};

export default FeatureHeader;