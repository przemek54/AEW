---
layout: article
title: Map
header:
  theme: dark
  background: 'linear-gradient(135deg, rgb(34, 139, 87), rgb(139, 34, 139))'
---

<div id="map" style="width: 100%; height: 100vh;"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdn.maptiler.com/maptiler-sdk-js/v3.0.1/maptiler-sdk.umd.min.js"></script>
<script src="https://cdn.maptiler.com/leaflet-maptilersdk/v4.0.2/leaflet-maptilersdk.umd.min.js"></script>
<script>
  const key = '2pKrRlMUVfiXfK8o5mZ1';
  const map = L.map('map').setView([0, 0], 1);
  const mtLayer = L.maptiler.maptilerLayer({
    apiKey: key,
    style: L.maptiler."be8ac94f-1688-4953-8a21-4c4d23b177d5", // Replace with your style ID if needed
  }).addTo(map);
</script>