const axios = require('axios');

exports.handle = async (entities, memory) => {
  try {
    const city = entities.find(e => e.type === 'location')?.value || 'Minneapolis';
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    const response = await axios.get(url);
    const weather = response.data;

    const reply = `Current weather in ${weather.name}: ${weather.weather[0].description}, temperature ${weather.main.temp}°F, feels like ${weather.main.feels_like}°F, humidity ${weather.main.humidity}%, wind speed ${weather.wind.speed} mph.`;

    return { reply };
  } catch (err) {
    console.error(err);
    return { reply: "Sorry, I couldn't fetch the weather right now." };
  }
};
