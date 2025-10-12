---
layout: article
title: Map
header:
  theme: dark
  background: 'linear-gradient(135deg, rgb(34, 139, 87), rgb(139, 34, 139))'
---

<style>
  .stats-select {
    position: absolute;
    bottom: 10px
  }

  .map-container {
    position: relative;
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    margin-left: -150px;
    margin-right: -150px;
    padding: 0 20px;
  }

  #map {
    flex: 1;
  }

  .country-panel {
    width: 300px;
    background-color: #f8f8f8;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 15px;
    height: 500px;
    animation: panel-fade 0.3s ease-out;
    contain: layout;
  }

  .country-panel.hidden {
    display: none;
  }

  .country-header {
    border-top: 4px solid;
    margin: -15px -15px 10px -15px;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .country-stats {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px;
    margin-top: 10px;
  }

  .country-stats-label {
    color: #666;
  }

  @keyframes panel-fade {
    from {
      opacity: 0;
      transform: translateX(20px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>

<link href="https://api.mapbox.com/mapbox-gl-js/v3.9.0/mapbox-gl.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/gh/przemek54/flag-icons@v0.1.5/css/flag-icons.min.css" rel="stylesheet" />
<script src="https://api.mapbox.com/mapbox-gl-js/v3.9.0/mapbox-gl.js"></script>
<script type="module">{%- include scripts/map.js.liquid -%}</script>

<div class="map-container">
  <div id="map" style="width: 100%; height: 500px"></div>
  <div id="country-panel" class="country-panel">
    <div class="country-panel-content">
      <i>Click on a country to see its statistics.</i>
    </div>
    <div class="legend">
      <select id="js-variable-select" class="variable-select">
        <option value="progress">Progress</option>
        <option value="locations">Locations</option>
        <option value="metas">Metas</option>
      </select>
    </div>
  </div>
</div>

## About
The goal of the map is to represent every clue on PlonkIt by at least 5 unique locations, with current progress shown on
the map above. The vast majority of locations contain enough clues to identify the country, but there are a couple that
only contain continent-level hints (such as the sun direction), so you can expect to use your nogging every now and
then. You should try your best to get the location in NMPZ. Certain rounds may be in frustrating proximity to text, such
that you can only make out some letters -- it's by design. Make the best use of what you're given.

## Statistics
As of the latest version, An Easy World's database contains <span id="js-location-count">0</span> locations across 2
continents. You can use the controls on the map to display the number of locations or PlonkIt metas per country.

Let's talk about country distribution. In the development stage, AEW (and each one of its continent-specific variants)
contains every location in the database, which means that the graphic above provides an accurate representation of the
map you can play on GeoGuessr. Once I have covered and updated every country, I am planning to make a few maps with
varying distributions, because I understand that for most players getting Panama with the same frequency as Canada is
not the ideal experience. Likewise, some very small countries have detailed regionguessing sections (such as
Liechtenstein) that freaks like me love, but the majority of the playerbase simply isn't interested in such a deep level
of rather low-yield knowledge. These issues are going to be tackled by assigning weights to all metas and countries, and
then generating a map prioritizing locations with higher weight values. That way it can be constantly updated by
re-rolling it periodically, keeping it fresh. At least that's the plan. But there's a long way until then.

## What is a country?
The mission of this project is to create a map capturing all of PlonkIt's knowledge. Because of that, I decided it makes
the most sense to follow the structure that they use for their guides. So while in the vast majority of cases that
coincides with countries, there are a few exceptions. For example:

* overseas territories are treated as their own countries, but also contain hints for the countries they are part of
(such as French road signs in Saint Pierre and Miquelon);
* Alaska and Hawaii are treated as separate countries due to having separate guides, while also containing hints for the
United States;
* Israel and Palestine are treated as one country due to having a single guide.

Of course, for the gameplay it doesn't matter. But I think it's worth explaining in the context of map statistics and
country distribution. There are also technical reasons for why I had decided that countries are synonymous with guides,
outlined on the [Script](script.md) page.

## Regional maps
Because I know it is very unsatisfying to play a map called "An Easy World" where all the locations are North American, there are also regional maps for each continent. Countries are assigned continents based on [PlonkIt's classification](https://www.plonkit.net/guide). For example, Hawaii is going to be on the "An Easy North America" map.