# KentuckyTransportationWarehousingUtilites
Workforce percentage in the Transportation, Warehousing, and Utility industries in Kentucky
## Sources
1. Workforce data from 2020 Census API.  Variable DP03_0038 PE 	Percent!!INDUSTRY!!Civilian employed population 16 years and over!!Transportation and warehousing, and utilities.  https://api.census.gov/data/2020/acs/acs5/profile/variables.html
2. Kentucky Major Highway Centerlines from KYTC website. https://transportation.ky.gov/Planning/Pages/Centerlines.aspx
## Methods
1. QGIS.  2020 ACS County boundary geojson file and API table were filtered to the commonwealth of Kentucky and exported into one clean geojson.  The State roads layer column was "TYPE_OD" was filtered by D to get major highways that appeared to have some sort of limited access for simplicity.
2. Mapshaper Optimization.  Mapshaper optimization was run on both geojsons but they were already pretty optimized
3. Vite and Maplibre.  Vite and maplibre template was then inserted into directory.