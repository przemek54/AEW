export function whatFill(layer) {
  if (layer === "centroids") {
    return "circle-color";
  } else {
    return "fill-color";
  };
};

export function getColorForNormalizedLocation(startColor, endColor, value) {
  // Interpolate between the start and end colors
  const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * value);
  const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * value);
  const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * value);

  // Return the color as a hex string
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}