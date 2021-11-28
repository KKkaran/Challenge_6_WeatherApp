var apiId = "19881ccddec89e1f1d5f5979ebc7fa0a"
var city;
var listCity = []
var uvindex;
var f;
var citybtn;
var cityClicked
var imageWeather = ""
 //res.current.weather[0].icon
//make api call from lat,lon to get the result
function getWeather(lat,lon){
   fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" +lat + "&lon=" + lon + "&units=imperial&APPID=" + apiId)
   .then(function(response){
       return response.json()
   }).then(function(res){
       console.log(res.current.weather[0].icon)
       imageWeather = res.current.weather[0].icon
       console.log(imageWeather)
       var image_link = `https://openweathermap.org/img/wn/${imageWeather}@2x.png`
       console.log(image_link)
       //console.log(res.current.weather[0].description)
       updateCurrentDayEl(res)
   })
}
//this will create dynamic current day specssssss
function updateCurrentDayEl(res){
    //console.log("city btn is : " + citybtn)
    uvindex = res.current.uvi
    $(".currentDay").addClass("")
    var img = $("<img>").attr({"src":`https://openweathermap.org/img/wn/${imageWeather}@2x.png`,
                                "alt" : "icon of the weather",
                                "width" :"50","height": "50"})
    
    $(".currentDayHeading h2").html(`${citybtn.toUpperCase()} (${moment().format("DD/MM/YYYY")})`)
    $(".currentDayHeading h2").append(img)
    $(".currentDay").css({"background": "linear-gradient(rgb(245, 224, 224), white)"},{"padding":"7px"})

    //padding: 7px;
  //background: linear-gradient(rgb(245, 224, 224), white);
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
    addCityNames(citybtn.toUpperCase());
    updateForecastMenu(res);
}
//forcast menu
function updateForecastMenu(res){
    updatingDates(res);
}
function updatingDates(res){
    f = res
    console.log(res)
    $(".forecastHeading").addClass("h1").html("5-Day Forecast:")
    var datesContainer = $("<div>")
                        .addClass("row justify-content-start")
    
    for(var t=1;t<6;t++){
        var dtObj = new Date(res.daily[t].dt * 1000)
        imageWeather = res.daily[t].weather[0].icon
        var month = dtObj.getMonth() + 1
        var day = dtObj.getDate()
        var year = dtObj.getFullYear()

        var date = $("<div>")
                    .addClass("col-8 col-md-5 col-xl-2 m-2 justify-content-between dates")
        var dateHeading = $("<h3>")
                    .addClass("")
                    .html(`${month}/${day}/${year}`)
        var pTemp = $("<p>")
                .addClass("")
                .html(`Temp : ${res.daily[t].temp.day} °F `)
        var img = $("<img>").attr({"src":`https://openweathermap.org/img/wn/${imageWeather}@2x.png`,
                "alt" : "icon of the weather",
                "width" :"50","height": "50"})        
        var pWind = $("<p>")
                .addClass("")
                .html(`Wind : ${res.daily[t].wind_speed} MPH`)
        var pHumidity = $("<p>")
                .addClass("")
                .html(`Humidity : ${res.daily[t].humidity} %`)


        date.append(dateHeading,pTemp,img,pWind,pHumidity)
        datesContainer.append(date)
        //console.log(month,day,year)
    }
    $(".forecaseDays div").replaceWith(datesContainer)
}
//every time a city is searched it is put into the local storage
function saveLocalStorage(){
    console.log("saved locally...")
    localStorage.setItem("weather",JSON.stringify(listCity))
}
//every time the site is refreshed the cities are extracted from the local storage
function loadLocalStorage(){

    var cityies = localStorage.getItem("weather")
    if(!cityies){
        return
    }
    listCity = JSON.parse(cityies)
    //console.log("loading from local db, " + listCity)
    addCityNames(citybtn)
    citybtn = listCity[listCity.length-1]
    getLatLon(listCity[listCity.length-1])
}
//adding city names to the list beneath the search Menu
function addCityNames(cityname){

    var color;
    var div = $("<div>")
              .css("border-top","3px solid grey")   
              .addClass("cityList mt-4")

    for(var i=listCity.length-1;i>=0;i--){
        if(listCity[i] === cityname){
            color = "green"
        }else{
            color = "grey"
        }
        var cityNames = $("<p>")
                        .addClass("h3 mx-auto d-block cityname")
                        .css("background",`linear-gradient(${color}, lightgrey)`)
                        .html(listCity[i])
        div.append(cityNames)
        $(".cityList").replaceWith(div)
    }
}
//make an api call to get lat, lon from the city name
function getLatLon(city){
    console.log(listCity)
   // console.log(city)
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiId)
    .then(function(response){
        if(response.ok){
            response.json().then(function(res){
                getWeather(res.coord.lat,res.coord.lon)
                if(listCity.includes(city.toUpperCase())){
                    return
                }
                listCity.push(city.toUpperCase())
                if(listCity.length === 7){
                    listCity.shift()//take the least recent out of the list
                }
                saveLocalStorage();
                
            })
        }else{
            //console.log("No city found by the name: " + city)
            showNoCityFound()
            return;
        }
    })
}
//No city found modal display..
function showNoCityFound(){
    console.log("no city found")
    alert("No city found by that name. Try again!!")
    $("#city").val("")
    //$('#exampleModal').css("display","block");
}
//when user types in the city and hits the search button 
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
//clicking on the already seen cities displays the weather of the city clicked
$(".searchMenu").on("click", "p", function(){
    citybtn = $(this).html()
    getLatLon($(this).html())
})
$("#submitCity").val("Search")

loadLocalStorage()//runs on page reload..
