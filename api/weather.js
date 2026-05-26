import { API_KEY } from './secret';

const encode = value => encodeURIComponent(value || "");

const FORECAST_ENDPOINT = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encode(params.cityName)}&days=${params.days}&aqi=${params.includeAqi}&alerts=${params.includeAlerts}`;
const CURRENT_ENDPOINT = params => `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encode(params.cityName)}&aqi=${params.includeAqi}`;
const LOCATIONS_ENDPOINT = params => `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encode(params.cityName)}`;
const SPORTS_ENDPOINT = params => `https://api.weatherapi.com/v1/sports.json?key=${API_KEY}&q=${encode(params.cityName)}`;
//const FUTURE_ENDPOINT = params => `https://api.weatherapi.com/v1/future.json?key=${API_KEY}&q=${encode(params.cityName)}&dt=${encode(params.date)}`;
const ALERTS_ENDPOINT = params => `https://api.weatherapi.com/v1/alerts.json?key=${API_KEY}&q=${encode(params.cityName)}`;

const callAPI = async (endpoint) => {
    try {
        const response = await fetch(endpoint, { method: 'GET' });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Weather API error: ${response.status} ${response.statusText} - ${message}`);
        }
        return await response.json();
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

//export const getFuture = async (params) => {
//    let futureURL = FUTURE_ENDPOINT(params);
//    return await callAPI(futureURL);
//}

export const getAlerts = async (params) => {
    let alertsURL = ALERTS_ENDPOINT(params);
    return await callAPI(alertsURL);
}