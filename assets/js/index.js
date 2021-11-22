var apiId = "19881ccddec89e1f1d5f5979ebc7fa0a"
var city;
var listCity = []
var uvindex;
var f;
var citybtn;
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
    console.log("city btn is : " + citybtn)
    uvindex = res.current.uvi
    $(".currentDay").addClass("border border-dark")
    $(".currentDayHeading h2").html(`${citybtn.toUpperCase()} (${moment().format("DD/MM/YYYY")})`)
    var specs = {
        "Temp" : res.current.temp + "°F", 
        "Wind" : res.current.wind_speed + " MPH", 
        "Humidity" : res.current.humidity + " %",
        "UV index" : uvindex
    }
    var liELCoantainer = $("<ul>")
                        .addClass("specsUl p-0")
    for(let v=0;v<4;v++){
        var li = $("<li>")
                 .addClass("liItems h3")
                 .html( `${Object.keys(specs)[v]} : <span> ${Object.values(specs)[v]} </span>`)
        liELCoantainer.append(li)
    }
    //specsContainer.append(liELCoantainer)
    $(".currentDaySpecs ul").replaceWith(liELCoantainer)
    $(".specsUl").find("li").eq(3).addClass("UVstyle")
    var color;
    if(uvindex <= 2){
        color = "green"
    }else if(uvindex <= 4){
        color = "yellow"
        $(".UVstyle span").css("color", "black")
    }else if(uvindex <= 6){
        color = "orange"
    }else{
        color = "red"
    }
    //dynamically changing the color of uv index depending on the value
    $(".UVstyle span").css("background", color)
    $("#city").val("")
    addCityNames();
    updateForecastMenu(res);
}
//forcast menu
function updateForecastMenu(res){

    

    updatingDates(res);
    
}
function updatingDates(res){
    f = res
    $(".forecastHeading").addClass("h1").html("5-Day Forecast:")
    var datesContainer = $("<div>")
                        .addClass("row justify-content-start")
    
    for(var t=1;t<6;t++){
        var dtObj = new Date(res.daily[t].dt * 1000)
        var month = dtObj.getMonth() + 1
        var day = dtObj.getDate()
        var year = dtObj.getFullYear()

        var date = $("<div>")
                    .addClass("col-8 col-md-5 col-xl-2 m-2 bg-dark text-light justify-content-between")
        var dateHeading = $("<h3>")
                    .addClass("")
                    .html(`${month}/${day}/${year}`)
        var pTemp = $("<p>")
                .addClass("")
                .html(`Temp : ${res.daily[t].temp.day} °F `)
        var pWind = $("<p>")
                .addClass("")
                .html(`Wind : ${res.daily[t].wind_speed} MPH`)
        var pHumidity = $("<p>")
                .addClass("")
                .html(`Humidity : ${res.daily[t].humidity} %`)


        date.append(dateHeading,pTemp,pWind,pHumidity)
        datesContainer.append(date)
        console.log(month,day,year)
    }
    $(".forecaseDays div").replaceWith(datesContainer)
}

//adding city names to the list beneath the search Menu
function addCityNames(){


    var div = $("<div>")
              .addClass("cityList mt-4 border-top")

    listCity.forEach((el) => {
        var cityNames = $("<p>")
                        .addClass("h3 mx-auto d-block cityname")
                        //.attr("href","https://google.com")
                        .html(el)
    
        div.append(cityNames)
        $(".cityList").replaceWith(div)
    })
    

}
//make an api call to get lat, lon from the city name
function getLatLon(city){
    console.log(listCity)
    console.log(city)
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiId)
    .then(function(response){
        if(response.ok){
            response.json().then(function(res){
                getWeather(res.coord.lat,res.coord.lon)
                if(listCity.includes(city.toUpperCase())){
                    return
                }
                listCity.push(city.toUpperCase())
            })
        }else{
            alert("No city found by the name: " + city)
            return;
        }
    })
}
$("#submitCity").on("click", function(e){
    e.preventDefault()
    citybtn = $("#city").val().trim()
    console.log(citybtn)
    if(!citybtn){
        console.log("empty city name")
        return;
    }
    getLatLon(citybtn)
    
})
$(".searchMenu").on("click", "p", function(){
    citybtn = $(this).html()
    getLatLon($(this).html())
})
$("#submitCity").val("Search")

