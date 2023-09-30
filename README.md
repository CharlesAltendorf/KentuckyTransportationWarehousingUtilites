# KentuckyTransportationWarehousingUtilites
Workforce percentage in the Transportation, Warehousing, and Utility industries in Kentucky
## Sources
1. Workforce data from 2020 Census API.  Variable DP03_0038 E 	Percent!!INDUSTRY!!Civilian employed population 16 years and over!!Transportation and warehousing, and utilities.  https://api.census.gov/data/2020/acs/acs5/profile/variables.html
2. Kentucky Major Highway Centerlines from KYTC website. https://transportation.ky.gov/Planning/Pages/Centerlines.aspx
## Methods
1. QGIS.  2020 ACS County boundary geojson file and API table were filtered to the commonwealth of Kentucky and exported into one clean geojson land area and water area fields were converted to sq mi.  The State roads layer column was "TYPE_OD" was filtered by D to get major highways that appeared to have some sort of limited access for simplicity.
2. Mapshaper Optimization.  Mapshaper optimization was run on both geojsons but they were already pretty optimized
3. Vite and Maplibre.  Vite and maplibre template were then inserted into directory.  3D modeling was created on the census data for more interactive user experenience.  Styling was added via tailwind css.  Geolocator was also added.
4. Adding in turf area.  Used turf.area to calculate square mile area in popup.  took turf.area measurement and divided by square mile conversion factor.  seemed to be slightly off compared what's officially listed.  Couldn't really figure out why.