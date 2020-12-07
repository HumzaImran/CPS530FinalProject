var fetchWeather = "/weather";

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

const weatherIcon = document.querySelector('.weatherIcon i');
const weatherCondition = document.querySelector('.weatherCondition');
const tempElement = document.querySelector('.temperature span');
const locationElement = document.querySelector('.place');
const dateElement = document.querySelector('.date');

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

dateElement.textContent = monthNames[new Date().getMonth()] + ", " + new Date().getDate() 

weatherForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    locationElement.textContent = "";
    tempElement.textContent = "";
    weatherCondition.textContent = "Loading Weather..."; 
    const locationApi = fetchWeather + "?address=" + search.value;
    fetch(locationApi).then(response => {
        
        response.json().then(data => {
            if (data.error){
                locationElement.textContent = data.error;
                tempElement.textContent ="";
                weatherCondition.textContent =""
            }else{
                if(data.description === "clear sky"){
                    weatherIcon.className = "wi wi-day-sunny"
                }else if (data.description === "light rain" || data.description === "moderate rain" || data.description === "mist" || data.description === "shower rain" || data.description === "thunderstorm" || data.description === "LIGHT INTENSITY SHOWER RAIN"){
                    weatherIcon.className = "wi wi-day-rain"
                }else if(data.description === "broken clouds" || data.description === "scattered clouds" || data.description === "few clouds" || data.description ==="overcast clouds"){
                    weatherIcon.className = "wi wi-day-cloudy"
                }else if (data.description === "haze" || data.description === "fog" || data.description === "smoke"){
                    weatherIcon.className = "wi wi-day-fog"
                }else if(data.description === "snow"|| data.description === "light snow"){
                    weatherIcon.className = "wi wi-day-snow"
                }else{
                    weatherIcon.className = "wi wi-day-cloudy"
                }
                locationElement.textContent = data.cityName;
                tempElement.textContent = (data.temperature -273.5).toFixed(1) + String.fromCharCode(176);
                weatherCondition.textContent = data.description.toUpperCase();
                console.log(weatherCondition.textContent = data.description.toUpperCase())
            }
    })
    })

})