# CS333_Project

## High-level Structure  
1. **Domain task**
    - See if there is correlation between ridership change during COVID19 and socioeconomic status 
    - See what other factors (e.g. weather, season) influence change in ridership
    - See how other factors compare to ridership change resulting from COVID19, as well as whether all of the above mentioned factors have any correlation with socioeconomic status 

3. **Abstract task** 
    - Find ridership and geographic data for each station; find city of chicago public announcements; find socioeconomic and geographic data for neighborhoods around stations 
    - Find weather data 
    - Estimate correlation between variables   

5. **Encodings/Interactions**
    - TBD. 
  
7. **Algorithm / Implementation**
    - ... 

---

## some explanations on what each file does 

To read `.RDS` files, simply read it by calling `CTA_stations <- readRDS("CTA_stations.RDS")`. 

`get_socioecon_data.R`
- this gets the median household income data from American Community Survey using the `tidycensus` package. 
- data is stored in `.RDS` format; this allows for easy parsing with Rstudio. 

`get_CTA_stations.R` 
- this file gets data related to CTA stations from [Chicago Data Portal](https://data.cityofchicago.org/Transportation/CTA-System-Information-List-of-L-Stops/8pix-ypme). 
- saves data in `.RDS` format. Contains longitude and latitude information that would be useful for finding neighborhoods (though the geo-info is not in the right format). 
