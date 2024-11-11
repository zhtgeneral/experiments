import growthbook from "@/lib/growthbook"

interface Attributes {
  [x: string]: any
}

/**
 * This helper function adds an attribute without overwriting others for growthbook
 */
export default function addAttribute(attributes: Attributes) {
  const existingAttributes = growthbook.getAttributes();
  growthbook.setAttributes({
    ...existingAttributes,
    ...attributes
  });
}