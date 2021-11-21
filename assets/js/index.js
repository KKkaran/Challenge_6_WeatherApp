//API-KEY  -------->>> 19881ccddec89e1f1d5f5979ebc7fa0a
//this will make api call and get the result
var apiId = "19881ccddec89e1f1d5f5979ebc7fa0a"

//make api call from lat,lon to get the result
function getWeather(lat,lon){
   fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" +lat + "&lon=" + lon + "&APPID=" + apiId)
   .then(function(response){
       return response.json()
   }).then(function(res){
       console.log(res)
   })
}
//make an api call to get lat, lon from the city name
function getLatLon(city){

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiId)
    .then(function(response){
        if(response.ok){
            console.log("another")
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
    var city = $("#city")
    e.preventDefault()
    getLatLon(city.val())
    city.val("")
})

console.log("refreshed")