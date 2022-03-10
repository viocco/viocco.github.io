var incomeData = {}
d3.csv("/data/income.csv", function(data) { 
    incomeData[data.geoid] = data
})



// stationName : string -> income : number
function getIncomeForStation(stationName){

}

// returns the census code given latitude and longitude
function getCensusCodeForLatLong(latitude, longitude){
    var censusCode = 0
    console.log(incomeData)
    if (event.key === "Enter"){
        document.getElementById("geoOutput").innerHTML += geocode.value
        fetch(`https://geo.fcc.gov/api/census/area?lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                let fips = data.results[0].block_fips;
                censusCode = "14000US" + fips.substring(0,fips.length-4)
                console.log(censusCode)
                getIncomeFromCensusCode(censusCode)
                return censusCode;
            })
    }
}

// gets average income from census code
function getIncomeFromCensusCode(censusCode){
    var income = incomeData[censusCode]["AVERAGEINCOME"].trim()
    console.log("income: ", income)
    return income
}

// date : string -> weather : string
function convertToDate(date){
    var first = date.indexOf("/")
    var second = date.indexOf("/", first+1)
    var month = date.substring(0,first)
    var day = date.substring(first+1, second)
    var year = date.substring(second+1)
    return new Date(year, month, day)
}