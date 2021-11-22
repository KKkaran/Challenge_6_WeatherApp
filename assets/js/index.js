//API-KEY  -------->>> 19881ccddec89e1f1d5f5979ebc7fa0a
//this will make api call and get the result
var apiId = "19881ccddec89e1f1d5f5979ebc7fa0a"
var city;
var listCity = []
//make api call from lat,lon to get the result
function getWeather(lat,lon){
   fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" +lat + "&lon=" + lon + "&units=imperial&APPID=" + apiId)
   .then(function(response){
       return response.json()
   }).then(function(res){
        updateCurrentDayEl(res)
   })
}
//this will create dynamic current day specs
function updateCurrentDayEl(res){

    $(".currentDayHeading h2").html(`${city.val()} (${moment().format("DD/MM/YYYY")})`)
    console.log(`Temp: ${res.current.temp}` )
    console.log(`Wind: ${res.current.wind_speed}` )
    console.log(`Humidity: ${res.current.humidity}` )
    console.log(`UV index: ${res.current.uvi}` )
    var specs = {
        "Temp" : res.current.temp, 
        "Wind" : res.current.wind_speed, 
        "Humidity" : res.current.humidity,
        "UV index" : res.current.uvi
    }
    
    var specsContainer = $("<div>")
                        .addClass("currentDaySpecs")
    
    var liELCoantainer = $("<ul>")
                        .addClass("specsUl p-0")

    for(let v=0;v<4;v++){
        var li = $("<li>")
                 .addClass("liEl liItems h3")
                 .html( `${Object.keys(specs)[v]} : ${Object.values(specs)[v]}`)
        liELCoantainer.append(li)
    }

    //specsContainer.append(liELCoantainer)
    $(".currentDay ul").replaceWith(liELCoantainer)
    city.val("")
    addCityNames();
}
//adding city names to the list beneath the search Menu
function addCityNames(){


    var div = $("<div>")
              .addClass("cityList mt-4 border-top")

    listCity.forEach((el) => {
        var cityNames = $("<a>")
                        .addClass("h3 mx-auto d-block")
                        .attr("href","https://google.com")
                        .html(el)
    
        div.append(cityNames)
        $(".cityList").replaceWith(div)
    })
    

}

//make an api call to get lat, lon from the city name
function getLatLon(city){

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiId)
    .then(function(response){
        if(response.ok){
            response.json().then(function(res){
                getWeather(res.coord.lat,res.coord.lon)
            })
        }else{
            alert("No city found by the name: " + city)
            return;
        }
    })
}

$("#submitCity").on("click", function(e){
    e.preventDefault()
    city = $("#city")
    
    if(!city.val()){
        console.log("empty city name")
        return;
    }
    getLatLon(city.val())
    listCity.push(city.val())
})






$("#submitCity").val("Search")