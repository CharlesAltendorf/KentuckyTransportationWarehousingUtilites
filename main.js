import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";
import maplibregl from "maplibre-gl";
import chroma from "chroma-js";
import turfArea from "@turf/area";

let hoveredStateId = null;

const openUI = () => {
  offCanvas.classList.remove("translate-x-[-100%]");
  overlay.classList.remove("opacity-0");
  offCanvas.classList.add(
    "translate-x-0",
    "transition-transform",
    "duration-300",
    "ease-in-out"
  );
  overlay.classList.add("opacity-100", "pointer-events-auto");
};

const closeUI = () => {
  offCanvas.classList.remove("translate-x-0");
  overlay.classList.remove("opacity-100", "pointer-events-auto");
  offCanvas.classList.add("translate-x-[-100%]");
  overlay.classList.add("opacity-0");
};

openButton.addEventListener("click", openUI);
overlay.addEventListener("click", closeUI);
closeButton.addEventListener("click", closeUI);

const breaks = [1.22, 2.69, 4.4, 7.08, 16.29, 33.45, 84.28];

const colorScale = chroma.scale("Blues").domain([0, 6]);
console.log(colorScale(6).hex()); // returns #08519c

const map = new maplibregl.Map({
    container: "map",
    center: [-85.4669, 37.80923],
    zoom: 6.5,
    style:
      "https://api.maptiler.com/maps/streets/style.json?key=lGyZIDbsdOlBcyjI2Xtm",
  });

// Create geolocate control to the map.
const geolocate = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  fitBoundsOptions: {
    maxZoom: 12,
  },
  trackUserLocation: true,
});

// Create a navigation control.
const nav = new maplibregl.NavigationControl();

// Create a scale control.
const scale = new maplibregl.ScaleControl({
  maxWidth: 80,
  unit: "imperial",
});

// Add controls to the map.
map.addControl(scale);
map.addControl(nav);
map.addControl(geolocate)

  map.on("load", function () {
    map.addSource("counties", {
      type: "geojson",
      data: "./KentuckyTransportationWarehousingUtilities.geojson",
      promoteId: "geoid",
    });
    map.addSource("states", {
      type: "geojson",
      data: "./KentuckyMajorHighways.geojson",
    });
    map.addLayer({
      id: "counties-extrusion",
      type: "fill-extrusion", // new type
      source: "counties",
      layout: {},
      paint: {
        "fill-extrusion-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "yellow",
          [
            "interpolate",
            ["linear"],
            ["to-number", ["get", "pop"]],
            0,
            colorScale(0).hex(),
            100,
            colorScale(2).hex(),
            1000,
            colorScale(4).hex(),
            10000,
            colorScale(6).hex(),
          ],
        ],
        "fill-extrusion-height": ["*", ["to-number", ["get", "density"]], 100],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          1,
          7,
          1,
          12,
          0.5,
          13,
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
          "line-color": "#FFFFFF",
          "line-width": 1,
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
map.on("mousemove", "counties-extrusion", (e) => {
    map.getCanvas().style.cursor = "pointer";
  });
  
  // Reset cursor style when the mouse leaves the polygon layer
map.on("mouseleave", "counties-extrusion", (e) => {
    map.getCanvas().style.cursor = "";
  });

// Add an event listener for 'click' event on the polygon layer
map.on("click", "counties-extrusion", (e) => {
    // Query the features in the map at the clicked point
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["counties-extrusion"],
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
          <p>Total Workers: ${Number(pop).toLocaleString()}</p>
          <p>Density: ${Number(
            density
          ).toLocaleString()} workers mi<sup>2</sup></p>
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
  