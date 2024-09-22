import React, { useState, useEffect, useRef } from 'react';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import ForecastCard from './ForecastCard'; // Import forecast component

export default function Weather() {

    const inputRef = useRef();
    
    const [weatherData, setWeatherData] = useState(false);
    const [forecastData, setForecastData] = useState([]); // State for 5-day forecast
    const [isCelsius, setIsCelsius] = useState(true); // Default Celsius


    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name");
            return;
        }
        try {
            // Fetch current weather
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_ID}`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            if (!weatherResponse.ok) {
                alert(weatherData.message);
                return;
            }

            const icon = allIcons[weatherData.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
                temprature: Math.floor(weatherData.main.temp),
                location: weatherData.name,
                icon: icon
            });

            // Fetch 5-day forecast
            
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_API_ID}`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            if (!forecastResponse.ok) {
                alert(forecastData.message);
                return;
            }

            // Process forecast data for 5 days (every 24 hours interval)
            const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0);
            setForecastData(dailyForecast);

        } catch (error) {
            setWeatherData(false);
            setForecastData([]);
            console.error("Error in fetching weather data");
        }
    }

    useEffect(() => {
        search("New York");
    }, []);


    const convertTemp = (temp) => {
        return isCelsius ? temp : (temp * 9/5) + 32; // Conversion to Fahrenheit
      };
      
      // Function to handle Enter key press
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            search(inputRef.current.value);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-bisque px-4 my-3 ">
            <div className="text-center space-y-6 max-w-md w-full">
                {/* Search bar */}
                <div className="relative w-full flex justify-center items-center border-b border-gray-400 pb-2">
                    <input 
                        type="text" 
                        ref={inputRef}
                        placeholder="Search" 
                        className="px-4 py-2 text-lg rounded-lg border border-gray-300 focus:outline-none w-full pr-10"
                        onKeyDown={handleKeyDown}
                    />
                    
                    <img 
                        src={search_icon} 
                        alt="Search" 
                        onClick={() => search(inputRef.current.value)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointe" 
                    />
                    
                </div>

                {weatherData ? <>


                    {/* Weather Icon and Temperature */}
                    <div className="flex flex-col items-center">
                        <img 
                            src={weatherData.icon} 
                            alt="Clear Weather" 
                            className="w-16 h-16 mb-2" 
                        />



                        {/* <p className="text-3xl font-semibold">{weatherData.temprature}°C</p> */}
                        <p className="text-3xl font-semibold">
                {convertTemp(weatherData.temprature)}°{isCelsius ? "C" : "F"}
              </p>
                        <p className="text-xl font-medium">{weatherData.location}</p>
                    </div>


                    <button 
                        onClick={() => setIsCelsius(!isCelsius)} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
                    </button>



                    {/* Humidity and Wind Speed */}
                    <div className="flex justify-between items-center mt-6 space-x-8">


                        {/* Humidity */}
                        <div className="flex items-center space-x-2">
                            <img src={humidity_icon} alt="Humidity" className="w-8 h-8" />
                            <div>
                                <p className="text-lg font-medium">{weatherData.humidity} %</p>
                                <span className="text-sm text-gray-900">Humidity</span>
                            </div>
                        </div>


                        {/* Wind Speed */}
                        <div className="flex items-center space-x-2">
                            <img src={wind_icon} alt="Wind Speed" className="w-8 h-8" />
                            <div>
                                <p className="text-lg font-medium">{weatherData.windSpeed} km/hr</p>
                                <span className="text-sm text-gray-900">Wind Speed</span>
                            </div>
                        </div>
                    </div>


                    {/* 5-Day Forecast */}
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-4">5-Day Forecast</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {forecastData.map((day, index) => (
                                <ForecastCard 
                                    key={index} 
                                    date={day.dt_txt} 
                                    temp_max={Math.floor(day.main.temp_max)} 
                                    temp_min={Math.floor(day.main.temp_min)} 
                                    icon={allIcons[day.weather[0].icon] || clear_icon} 
                                />
                            ))}
                        </div>
                    </div>

                </> : <></>}
            </div>
        </div>
    );
}
