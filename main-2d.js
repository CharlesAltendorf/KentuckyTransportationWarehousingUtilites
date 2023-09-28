import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import maplibregl from "maplibre-gl";
import chroma from "chroma-js";

let hoveredStateId = null;

const breaks = [50, 100, 500, 2000, 4000, 8000, 75000];

const colorScale = chroma.scale("Blues").domain([0, 6]);
console.log(colorScale(6).hex()); // returns #08519c

const map = new maplibregl.Map({
    container: "map",
    center: [-90, 38],
    zoom: 4,
    style:
      "https://api.maptiler.com/maps/streets/style.json?key=lGyZIDbsdOlBcyjI2Xtm",
  });

  map.on("load", function () {
    map.addSource("counties", {
      type: "geojson",
      data: "./us-counties-optimized.json",
      promoteId: "geoid",
    });
    map.addSource("states", {
      type: "geojson",
      data: "./us-states-optimized.json",
    });
    map.addLayer({
        id: "counties",
        type: "fill",
        source: "counties",
        paint: {
            "fill-color": [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "density"]],
                0,
                "#fff",
                breaks[0],
                colorScale(0).hex(),
                breaks[1],
                colorScale(1).hex(),
                breaks[2],
                colorScale(2).hex(),
                breaks[3],
                colorScale(3).hex(),
                breaks[4],
                colorScale(4).hex(),
                breaks[5],
                colorScale(5).hex(),
                breaks[6],
                colorScale(6).hex(),
            ],
            "fill-opacity": 1,
        },
      });
    map.addLayer({
        id: "county-lines",
        type: "line",
        source: "counties",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "yellow",
            "#bbb",
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            3,
            0.1,
          ],
        },
      });
    map.addLayer({
        id: "states",
        type: "line",
        source: "states",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 0.4,
        },
      });
  });

// Add a popup to the map
const popup = new maplibregl.Popup({
    closeButton: false, // Set to true if you want a close button on the popup
    closeOnClick: true, // Set to false if you don't want the popup to close when the map is clicked
    className: "font-sans text-lg antialiased", // Tailwind class names for styling the popup content
  });

  // Add cursor pointer style to the polygon layer
map.on("mousemove", "counties", (e) => {
    map.getCanvas().style.cursor = "pointer";
  });
  
  // Reset cursor style when the mouse leaves the polygon layer
map.on("mouseleave", "counties", (e) => {
    map.getCanvas().style.cursor = "";
  });

// Add an event listener for 'click' event on the polygon layer
map.on("click", "counties", (e) => {
    // Query the features in the map at the clicked point
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["counties"],
    });
    if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState(
            { source: "counties", id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
          { source: "counties", id: hoveredStateId },
          { hover: true }
        );
      }
    // If the query found something, build a popup
    if (features.length > 0) {
      const feature = features[0];
  
      // Extract the properties you want to display in the popup
      const { name, pop, density } = feature.properties;
  
      // Build the popup content
      const popupContent = `
        <h3 class="font-bold">${name}</h3>
        <div class="leading-snug">
          <p>Population: ${Number(pop).toLocaleString()}</p>
          <p>Density: ${Number(
            density
          ).toLocaleString()} people mi<sup>2</sup></p>
        </div>
      `;
  
      // Set the popup coordinates
      const coordinates = e.lngLat;
  
      // Set the popup content, coordinates, and add it to the map
      popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
  
      // Select the popup container created dynamically
      const popupContainer = document.querySelector(".maplibregl-popup-content");
  
      // Add just one class to the popup container
      // popupContainer.classList.add("rounded-lg");
  
      // Add multiple classes to the popup container, note first space is required
      popupContainer.className += " rounded-lg shadow-lg";
    }
  });
