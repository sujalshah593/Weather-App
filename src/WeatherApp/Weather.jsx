import { useState } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  MapPin,
  Thermometer,
  RefreshCw,
  Droplets,
  Wind,
  Eye,
  Search,
  Loader2,
} from "lucide-react";
import Lottie from "lottie-react";
import WindAnimation from "./WindGust.json";
import ThermometerAnimation from "./Thermometer.json";
import RainyIconAnimation from "./rainyicon.json";
import EyeAnimation from "./eye.json";

import Alert from "../WeatherApp/alerts";
import HourForecast from "../WeatherApp/hourlforecast";
import AllDayForecast from "../WeatherApp/DailyFore";

export default function Weather() {
  const [WData, setWData] = useState({
    name: "Ahmedabad",
    country: "INDIA",
    main: {
      temp: 0,
      feels_like: 0,
      humidity: 0,
      pressure: 0,
      temp_min: 0,
      temp_max: 0,
    },
    weather: [
      {
        main: "",
        description: "",
        icon: "",
      },
    ],
    wind: { speed: 0, deg: 0 },
    visibility: 0,
    sys: { sunrise: 0, sunset: 0 },
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [fData, setFData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [DailyForecast, setDailyForecast] = useState([]);

  const handlePlaceSearch = async () => {
    if (!location.trim()) {
      setError("Please enter a location");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const API_KEY = "789cf423b6df6a4dbad7825b3ccca60e";
      const presentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
      const presentResponse = await fetch(presentWeatherURL);
      if (!presentResponse.ok) {
        throw new Error("Location not found");
      }
      const presentData = await presentResponse.json();
      const fURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`;
      const fResponse = await fetch(fURL);
      const fAPIData = await fResponse.json();

      const visiblity = presentData.visibility
        ? (presentData.visibility / 1000).toFixed(1)
        : "N/A";

      setWData({
        place: presentData.name,
        country: presentData.sys.country,
        main: {
          temp: presentData.main.temp,
          feels_like: presentData.main.feels_like,
          humidity: presentData.main.humidity, // fixed typo
          pressure: presentData.main.pressure,
          temp_min: presentData.main.temp_min,
          temp_max: presentData.main.temp_max,
        },
        weather: presentData.weather,
        wind: presentData.wind,
        visibility: presentData.visibility,
        sys: {
          sunrise: presentData.sys.sunrise,
          sunset: presentData.sys.sunset,
        },
      });

      const hourforecast = fAPIData.list.slice(0, 6).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: "numeric",
        }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        wind: Math.round(item.wind.speed),
        humidity: item.main.humidity,
      }));

      setFData(hourforecast);
      const dailyFMap = new Map();

      fAPIData.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();

        if (!dailyFMap.has(dayKey)) {
          dailyFMap.set(dayKey, {
            day: date.toLocaleDateString("en-US", { weekday: "long" }),
            date: date,
            temps: [],
            conditions: [],
            precipitation: 0,
            humidity: [],
            wind: [],
          });
        }

        const dayData = dailyFMap.get(dayKey);
        dayData.temps.push(item.main.temp);
        dayData.conditions.push(item.weather[0]);
        dayData.humidity.push(item.main.humidity);
        dayData.wind.push(item.wind.speed);

        if (item.rain && item.rain["3h"]) {
          dayData.precipitation = Math.max(dayData.precipitation, 80);
        } else if (item.weather[0].main.includes("Rain")) {
          dayData.precipitation = Math.max(dayData.precipitation, 60);
        } else if (item.weather[0].main.includes("Cloud")) {
          dayData.precipitation = Math.max(dayData.precipitation, 20);
        }
      });

      const dailyForecast = Array.from(dailyFMap.values())
        .slice(0, 7)
        .map((day, index) => {
          const maxTemp = Math.round(Math.max(...day.temps));
          const minTemp = Math.round(Math.min(...day.temps));

          const conditioncounts = day.conditions.reduce((acc, condition) => {
            acc[condition.main] = (acc[condition.main] || 0) + 1;
            return acc;
          }, {});

          const Commonconditions = Object.keys(conditioncounts).reduce((a, b) =>
            conditioncounts[a] > conditioncounts[b] ? a : b
          );
          const averageHumidity = Math.round(
            day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length
          );
          const averageWind = Math.round(
            day.wind.reduce((a, b) => a + b, 0) / day.wind.length
          );

          return {
            day:
              index === 0
                ? "Today"
                : index === 1
                ? "Tomorrow"
                : day.date.toLocaleDateString([], { weekday: "long" }),
            date: day.date,
            high: maxTemp,
            low: minTemp,
            condition: Commonconditions,
            description: day.conditions[0].description,
            precipitation: day.precipitation,
            humidity: averageHumidity,
            wind: averageWind,
          };
        });

      setDailyForecast(dailyForecast);

      const Alerts = [];
      if (presentData.wind.speed > 10) {
        Alerts.push({
          type: "warning",
          title: "High Wind Warning",
          description: `Strong winds of ${Math.round(
            presentData.wind.speed
          )} m/s expected`,
          icon: "Wind",
          color: "text-orange-600 bg-orange-50 border-orange-200",
        });
      }

      if (presentData.main.humidity > 80) {
        Alerts.push({
          type: "info",
          title: "High Humidity Alert",
          description: `Humidity levels at ${presentData.main.humidity}% - expect muggy conditions`,
          icon: "Droplets",
          color: "text-blue-600 bg-blue-50 border-blue-200",
        });
      }

      if (presentData.visibility < 5000) {
        Alerts.push({
          type: "warning",
          title: "Low Visibility",
          description: `Visibilitiy reduced to ${visiblity} km`,
          icon: "Eye",
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        });
      }

      setAlerts(Alerts);
      setLastUpdate(new Date());
      setLocation("");
    } catch (error) {
      setError(error.message || "Error in Fetching Data");
    } finally {
      setLoading(false);
    }
  };
  const getWeatherGradient = (main, description) => {
    const mainLower = (main || "").toLowerCase();
    const descLower = (description || "").toLowerCase();

    switch (mainLower) {
      case "clear":
        if (descLower.includes("few clouds")) {
          // light blue with a bit of white for scattered clouds
          return "from-sky-200 via-sky-300 to-sky-500";
        }
        // pure clear sunny blue sky
        return "from-sky-300 via-sky-400 to-sky-600";

      case "clouds":
        if (descLower.includes("few")) {
          return "from-slate-300 via-slate-400 to-slate-500";
        }
        if (descLower.includes("scattered")) {
          return "from-red-400 via-slate-500 to-slate-600";
        }
        if (descLower.includes("broken")) {
          return "from-gray-500 via-slate-600 to-gray-700";
        }
        if (descLower.includes("overcast")) {
          return "from-gray-600 via-gray-700 to-gray-800";
        }
        return "from-slate-400 via-slate-500 to-slate-600";

      case "rain":
        if (descLower.includes("light")) {
          return "from-blue-900 via-gray-500 to-blue-500";
        }
        if (descLower.includes("moderate")) {
          return "from-blue-500 via-blue-600 to-indigo-700";
        }
        if (descLower.includes("heavy")) {
          return "from-indigo-700 via-indigo-800 to-blue-900";
        }
        return "from-blue-500 via-blue-600 to-indigo-700";

      case "drizzle":
        return "from-cyan-300 via-cyan-400 to-blue-500";

      case "thunderstorm":
        if (descLower.includes("light")) {
          return "from-purple-600 via-indigo-700 to-gray-800";
        }
        return "from-gray-700 via-purple-800 to-black";

      case "snow":
        if (descLower.includes("light")) {
          return "from-blue-100 via-blue-200 to-blue-300";
        }
        if (descLower.includes("heavy")) {
          return "from-blue-200 via-blue-300 to-blue-400";
        }
        return "from-blue-200 via-blue-300 to-blue-400";

      case "mist":
      case "fog":
        return "from-gray-300 via-gray-400 to-gray-500";

      case "smoke":
        return "from-gray-400 via-gray-500 to-gray-600";

      case "haze":
        return "from-yellow-200 via-yellow-300 to-yellow-400";

      case "dust":
      case "sand":
        return "from-amber-300 via-yellow-400 to-orange-500";

      case "ash":
        return "from-gray-500 via-gray-600 to-gray-700";

      case "squall":
        return "from-indigo-500 via-indigo-600 to-indigo-800";

      case "tornado":
        return "from-gray-800 via-gray-900 to-black";

      default:
        return "from-purple-500 via-pink-500 to-red-500";
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return (
          <Sun className="h-20 w-20 text-yellow-300 drop-shadow-lg animate-pulse" />
        );
      case "clouds":
        return <Cloud className="h-20 w-20 text-white drop-shadow-lg" />;
      case "rain":
        return <CloudRain className="h-20 w-20 text-blue-200 drop-shadow-lg" />;
      default:
        return (
          <Sun className="h-20 w-20 text-yellow-300 drop-shadow-lg animate-pulse" />
        );
    }
  };

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-br ${getWeatherGradient(
          WData.weather[0].main,
          WData.weather[0].description
        )} relative overflow-hidden`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-spin delay-500"></div>
        </div>
        <div className="relative z-10 p-4 max-w-7xl mx-auto">
          <div className="text-center py-6 mb-6">
            <h1 className="text-6xl font-bold extra text-white mb-4 drop-shadow-2xl">
              Weather <span className="text-emerald-400">App</span>
            </h1>
            <p className="text-xl extra text-white">
              Get Weather of any place Easily
            </p>
          </div>

          <div className=" mb-7 p-5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white shadow-2xl">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white h-5 w-5" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePlaceSearch()}
                  placeholder="Search City for get Weather Information...."
                  className="w-full extra pl-12 h-14 text-lg rounded-xl bg-white/20 border border-white/30 text-white/70 placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 outline-none transition-all"
                />
              </div>
              <button
                onClick={handlePlaceSearch}
                disabled={loading || location.trim()}
                className="h-14 px-6 rounded-xl extra bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold transition-all hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 extra  animate-spin" />
                ) : (
                  <Search className="h-5 w-5 extra" />
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-400 rounded-xl">
                <p className="text-white font-medium extra">{error}</p>
              </div>
            )}
          </div>
          <div className="mb-8 p-8 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-white/70" />
                <h2 className="text-3xl font-bold extra text-white">
                  {WData.place}, {WData.country}
                </h2>
              </div>
              <div className="flex extra items-center gap-2 extra text-white/60 text-sm">
                <RefreshCw className="h-4 w-4" /> Updated{" "}
                {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="text-center">
                <div className="mb-6 extra">
                  {getWeatherIcon(WData.weather[0].main)}
                </div>
                <div className="mb-4">
                  <span className="text-8xl extra font-bold text-white">
                    {Math.round(WData.main.temp)}°
                  </span>
                </div>
                <p className="text-2x extra text-white/80 capitalize">
                  {WData.weather[0].description}
                </p>
                <div>
                  <span className="extra">
                    H: {Math.round(WData.main.temp_max)}°
                  </span>
                  <span className="extra">
                    {" "}
                    L: {Math.round(WData.main.temp_min)}°
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: (
                      <div className="w-6 h-6">
                        <Lottie
                          animationData={ThermometerAnimation}
                          loop={true}
                          autoplay={true}
                          style={{ width: "30px", height: "34px" }}
                        />
                      </div>
                    ),
                    label: (
                      <span className="text-sm  extra font-semibold ">
                        Feels Like
                      </span>
                    ),
                    value: (
                      <span className="text-xl extra ">
                        {Math.round(WData.main.feels_like)}°
                      </span>
                    ),
                  },
                  {
                    icon: (
                      <div className="w-6 h-6">
                        <Lottie
                          animationData={RainyIconAnimation}
                          loop={true}
                          autoplay={true}
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                    ),
                    label: (
                      <span className="text-sm  extra font-semibold ">
                        Humidity
                      </span>
                    ),
                    value: (
                      <span className="text-xl extra">
                        {WData.main.humidity}%
                      </span>
                    ),
                  },
                  {
                    icon: (
                      <div className="w-6 h-6">
                        <Lottie
                          animationData={WindAnimation}
                          loop={true}
                          autoplay={true}
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                    ),
                    label: (
                      <span className="text-sm  extra font-semibold ">
                        Wind
                      </span>
                    ),
                    value: (
                      <span className="text-xl extra">
                        {WData.wind.speed} m/s
                      </span>
                    ),
                  },
                  {
                    icon: (
                      <div className="w-6 h-6">
                        <Lottie
                          animationData={EyeAnimation}
                          loop={true}
                          autoplay={true}
                          style={{ width: "30px", height: "34px" }}
                        />
                      </div>
                    ),
                    label: (
                      <span className="text-sm  extra font-semibold ">
                        Visibility
                      </span>
                    ),
                    value: (
                      <span className="text-xl extra">
                        {WData.visibility} km
                      </span>
                    ),
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-105"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {stat.icon}
                      <span className="text-white/70 font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="mb-8">
                <alerts alerts={alerts} />
              </div>
            )}
          </div>

          {/* Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-1 bg-white/20 p-6 rounded-2xl backdrop-blur-xl border border-white/30">
              <h3 className="text-xl text-white font-bold mb-4 extra">Hourly</h3>
              <HourForecast data={fData} />
            </div>
            <div className="col-span-1 bg-white/20 p-6 rounded-2xl backdrop-blur-xl border border-white/30">
              <h3 className="text-xl text-white font-bold mb-4 extra">7-Day</h3>
              <AllDayForecast data={DailyForecast} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
