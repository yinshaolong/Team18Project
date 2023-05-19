import { expLongitude, expLatitude } from "./maps"
const APIKEY = "d0b6c9ade1db30fe160940ff847a63cb"
const mapicon = document.getElementsByClassName("google-map-icon");


function getWeatherForLocation() {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${expLatitude}&lon=${expLongitude}&appid=${APIKEY}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  })
  .then(data => {

    const week = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday"
    }

    let dailyWeather = data.daily
    let weekWeather = [];

    console.log(expLatitude, expLongitude)
    for (let index = 0; index < dailyWeather.length; index++) {
        
        let temp = dailyWeather[index].temp["day"];
        let weatherIcon = dailyWeather[index].weather[0]["icon"]; 

        let day = {
            "weekday": week[index],
            "data": [`${(temp - 273.15).toFixed(2)}°C`, dailyWeather[index].weather[0]["main"], weatherIcon]
        }
        weekWeather.push(day)  
    }

    const weekDay = document.getElementById("weatherdisplay");
    
    for (let i = 0; i < weekWeather.length; i++) {
        const dayData = weekWeather[i];
        const dayWeatherIcon = weekWeather[i].data[2]
        
        const dayDiv = document.createElement("div");
        const designedDiv = document.createElement("div");
        designedDiv.className = "daily-weather-div";
        const dayImage = document.createElement("img");
        dayImage.src = `https://openweathermap.org/img/wn/${dayWeatherIcon}.png`;
        const dayContextWeekDay = document.createElement("p");
        const dayContextTemp = document.createElement("p");
        const dayContextWeather = document.createElement("p");
        
        dayContextWeekDay.textContent += `${dayData.weekday}`; 
        dayContextTemp.textContent += `${dayData.data[0]}`; 
        dayContextWeather.textContent += `${dayData.data[1]}`;
        designedDiv.style = "padding-bottom: 5vh; padding-left: 5vh; padding-right: 5vh; height: 15vh"
        
        // Append the paragraph to the dayDiv
        dayDiv.appendChild(designedDiv);
        designedDiv.appendChild(dayContextWeekDay)
        designedDiv.appendChild(dayContextTemp)
        designedDiv.appendChild(dayContextWeather)
        designedDiv.appendChild(dayImage)
        // Append the dayDiv to the weatherdisplay element
        weekDay.appendChild(dayDiv);
      }
    // console.log(weekWeather)  
    // let dayDiv = document.createElement("div");
    // let dayContext = document.createElement("p");
    // dayContext.textContent()
})
  .catch(error => {
    console.error(error);
  });
  };
  

  
  mapicon.addEventListener("click", getWeatherForLocation)
