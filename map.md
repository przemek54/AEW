---
layout: article
title: Map
aside:
  toc: true
header:
  theme: dark
  background: 'linear-gradient(135deg, rgb(34, 139, 87), rgb(139, 34, 139))'
---
<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
<script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
<script type="module">{%- include scripts/map.js -%}</script>

<div id="map" style="width: 100%; height: 500px"></div>
<select id="js-variable-select">
  <option value="progress">Progress</option>
  <option value="locations">Locations</option>
  <option value="metas">Metas</option>
</select>

## About
The goal of the map is to represent every clue on PlonkIt by at least 5 unique locations, with current progress shown on the map above. The vast majority of locations contain enough clues to identify the country. There are a couple that are more ambiguous, so you can expect to use your nogging every now and then.

## Statistics
As of the latest version, An Easy World 

You can use the controls on the map to display the number of locations or PlonkIt metas per country.