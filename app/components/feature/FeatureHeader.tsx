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
function FeatureHeader({
  isOn,
  value
}: FeatureHeaderProps) {
  if (!isOn) 
    return "Experiments not active";

  return value
  ? "Your experiment version: Feature A" 
  : "Your experiment version: Feature B";
};

export default FeatureHeader;