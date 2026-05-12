import axios from 'axios';
import { API_KEY } from './secret';

const FORECAST_ENDPOINT = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}&aqi=${params.includeAqi}&alerts=${params.includeAlerts}`;
const CURRENT_ENDPOINT = params => `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${params.cityName}&aqi=${params.includeAqi}`;
const LOCATIONS_ENDPOINT = params => `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;
const SPORTS_ENDPOINT = params => `https://api.weatherapi.com/v1/sports.json?key=${API_KEY}&q=${params.cityName}`;
const FUTURE_ENDPOINT = params => `https://api.weatherapi.com/v1/future.json?key=${API_KEY}&q=${params.cityName}&dt=${params.date}`;

const callAPI = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

export const getForecast = async (params) => {
    let forecastURL = FORECAST_ENDPOINT(params);
    return await callAPI(forecastURL);
}

export const getCurrent = async (params) => {
    let currentURL = CURRENT_ENDPOINT(params);
    return await callAPI(currentURL);
}

export const getLocations = async (params) => {
    let locationsURL = LOCATIONS_ENDPOINT(params);
    return await callAPI(locationsURL);
}

export const getSports = async (params) => {
    let sportsURL = SPORTS_ENDPOINT(params);
    return await callAPI(sportsURL);
}

export const getFuture = async (params) => {
    let futureURL = FUTURE_ENDPOINT(params);
    return await callAPI(futureURL);
}