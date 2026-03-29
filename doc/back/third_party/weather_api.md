# Weather API Documentation

## 1. What is the Weather API?

Weather API is a service that provides current, historical and forecast weather data. It allows access to meteorological information such as temperature, humidity, wind speed, and weather conditions (e.g., clear, rainy, cloudy) for a specific location.

## 2. Where and How is it Used in the Project?

In this project, the Weather API is used within the **SensorIntegrationMeteorology** service to retrieve current, historical, or forecast weather data based on the user's selected location, in order to analyze these data.

## 3. Weather API Configuration Steps

1. **Create an Account:**  
   - Go to [WeatherAPI](https://www.weatherapi.com) and create a user account.

2. **Obtain API Key:**  
   - After logging in, go to the Dashboard and copy your API Key.

3. **Select Free or Paid Plan:**  
   - Choose a plan according to your needs. The free plan allows a limited number of requests per day.

4. **Project Configuration:**  
   - Add the API Key to your `.env` file as shown below:
     ```env
     WEATHER_API_KEY=your_api_key_here
     ```
   - Define the base URL and parameters for API requests. An example request:
     ```ts
     const baseUrl = "https://api.weatherapi.com/v1/history.json";
     const params = `?key=${API_KEY}&q=mersin&dt=2025-05-10&end_dt=2025-05-12`;
     ```

5. **Security and Rate Limit Notice:**
   - Make sure to follow the API's daily/hourly request limits.

6. **API Response Fields Configuration:**  
   - After logging into the [WeatherAPI Dashboard](https://www.weatherapi.com/my), go to the **API Response Fields** section and select which fields should be returned in the API responses. The required fields are as follows:

     **For Current Weather:**  
     - Select **all fields**.

     **For Forecast / Future / History Weather:**  
     - Select all fields under the `forecastDay`, `Day`, and `Astro` sections.  
     - Do **not** select any fields under the `Hour` section (make sure all are unselected).

     **For Marine Weather:**  
     - Do **not** select any fields under the `tides` and `Hour` sections.